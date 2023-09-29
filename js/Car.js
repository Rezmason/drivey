import { Vector2 } from "./../lib/three/three.module.js";
import { getAngle, lerp, rotate, rotateY, sign } from "./math.js";

export default class Car {
  constructor() {
    this.lastPos = new Vector2();
    this.pos = new Vector2();
    this.vel = new Vector2();
    this.lastVel = new Vector2();
  }

  place(road, approximation, along, laneWidth, numLanes, drivingSide, roadDir, initialSpeed) {
    this.laneOffset = laneWidth * (0.5 + Math.floor(Math.random() * numLanes));
    this.weaving = (Math.random() - 0.5) * 0.5 * laneWidth;

    const pos = road.getPoint(along).add(road.getNormal(along).multiplyScalar((this.laneOffset + this.weaving) * roadDir * drivingSide));
    const tangent = road.getTangent(along).multiplyScalar(roadDir);
    const angle = getAngle(tangent);
    const vel = tangent.multiplyScalar(initialSpeed * 2);

    this.road = road;
    this.approximation = approximation;

    this.pos.copy(pos);
    this.lastPos.copy(pos);
    this.vel.copy(vel);
    this.lastVel.copy(vel);

    this.accelerate = 0;
    this.handbrake = 0;

    this.angle = angle;

    this.tilt = 0;
    this.pitch = 0;

    this.tiltV = 0;
    this.pitchV = 0;

    this.roadPos = 0;
    this.roadDir = roadDir;

    this.steer = 0;
    this.steerPos = 0;
    this.steerTo = 0;
    this.steerV = 0;

    this.sliding = false;
    this.spin = 0;
  }

  remove() {
    this.road = null;
    this.approximation = null;
  }

  drive(step, cruiseSpeed, controlScheme, drivingSide) {
    if (cruiseSpeed > 0) {
      this.roadPos += 3 * step * controlScheme.steer * controlScheme.autoSteerSensitivity;
      if (this.roadPos > 0.1) this.roadPos -= step;
      else if (this.roadPos < -0.1) this.roadPos += step;
      if (controlScheme.handbrake < 0.9) {
        this.weaving += (Math.random() - 0.5) * 0.025;
        this.weaving *= 0.999;
      }
      this.autoSteer(step, (this.laneOffset + this.weaving + controlScheme.laneShift) * drivingSide);
      this.matchSpeed(cruiseSpeed * controlScheme.cruiseSpeedMultiplier);
    } else {
      const diff = -sign(this.steerTo) * 0.0002 * this.vel.length() * step;
      if (Math.abs(diff) >= Math.abs(this.steerTo)) this.steerTo = 0;
      else this.steerTo += diff;
      this.steerTo = this.steerTo + controlScheme.steer * controlScheme.manualSteerSensitivity * step;
      this.accelerate = 0;
    }

    this.handbrake = controlScheme.handbrake;
    this.accelerate += controlScheme.brakePedal * -2 + controlScheme.gasPedal;
    this.advance(step);
  }

  autoSteer(step, offset) {
    // get goal position, based on position on road 1 second in the future
    const dir = this.vel.length() > 0 ? this.vel.clone().normalize() : this.dir();
    const lookAhead = 20;
    dir.multiplyScalar(lookAhead);
    const futurePos = this.pos.clone().add(dir);
    const along = this.approximation.getNearest(futurePos);
    const targetDir = this.road
      .getPoint(along)
      .sub(this.pos)
      .add(this.road.getNormal(along).multiplyScalar(4 * this.roadPos + this.roadDir * offset));

    // mix it with the slope of the road at that point
    let tangent = this.road.getTangent(along);
    tangent.multiplyScalar(this.roadDir);
    if (targetDir.length() > 0) tangent.lerp(targetDir, 0.1);

    // measure the difference in angle to that point and car's current angle
    let newAngle = Math.atan2(tangent.y, tangent.x) - this.angle;
    // represent it as an angle between -π and π
    while (newAngle > Math.PI) newAngle -= Math.PI * 2;
    while (newAngle < -Math.PI) newAngle += Math.PI * 2;
    // "normalize" it, so it is no larger than 1 radian
    if (Math.abs(newAngle) > 1) newAngle /= Math.abs(newAngle);
    // Generate a steerTo value (these are pretty small)
    let steerTo = newAngle / (Math.min(targetDir.length() * 0.5, 50) + 1);
    if (Math.abs(steerTo) > 0.02) steerTo *= 0.02 / Math.abs(steerTo);
    this.steerTo = lerp(this.steerTo, steerTo, Math.min(1, step * 10));
  }

  matchSpeed(speed) {
    if (this.vel.length() < speed) this.accelerate = 1;
    else this.accelerate = speed / this.vel.length();
  }

  dir() {
    return rotate(new Vector2(1, 0), this.angle);
  }

  advance(t) {
    if (t <= 0) {
      return;
    }

    let dir = this.dir();

    const acc = dir.clone().multiplyScalar(this.accelerate).multiplyScalar(10).add(this.vel.clone().multiplyScalar(-0.1));
    const newVel = dir.clone().multiplyScalar(this.vel.clone().add(acc.clone().multiplyScalar(t)).dot(dir));

    if (this.handbrake >= 0.9) newVel.set(0, 0, 0);

    if (!this.sliding && newVel.clone().sub(this.vel).length() / t > 750) {
      // maximum acceleration allowable?
      this.sliding = true;
    } else if (this.sliding && newVel.clone().sub(this.vel).length() / t < 50) {
      this.sliding = false;
    }

    if (this.sliding) {
      const friction = newVel.clone().sub(this.vel).clone().normalize().clone().multiplyScalar(20);
      this.vel = this.vel.clone().add(friction.clone().multiplyScalar(t));
    }

    if (!this.sliding) {
      this.vel = newVel;
    }

    this.spin = this.vel.clone().dot(dir) * this.steerPos * (this.sliding ? 0.5 : 1.0);
    this.angle += this.spin * t;
    this.pos = this.pos.clone().add(this.vel.clone().multiplyScalar(t));
    const velDiff = this.vel.clone().sub(this.lastVel);
    this.tiltV = this.tiltV + (this.tiltV * -0.2 + (velDiff.clone().dot(rotateY(dir, Math.PI * -0.5)) * 0.001) / t - this.tilt) * t * 20;
    this.tilt += this.tiltV * t;
    this.pitchV = this.pitchV + (this.pitchV * -0.2 + (velDiff.clone().dot(dir) * 0.001) / t - this.pitch) * t * 20;
    this.pitch += this.pitchV * t;

    this.steerTo = Math.max((-Math.PI * 2) / 50, Math.min((Math.PI * 2) / 50, this.steerTo));

    this.steerPos = this.steerTo;
    this.lastVel = this.vel;
    this.lastPos = this.pos;
  }
}
