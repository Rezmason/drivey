"use strict";

class Car {
  constructor() {
    this.lastPos = new THREE.Vector2();
    this.pos = new THREE.Vector2();
    this.vel = new THREE.Vector2();
    this.lastVel = new THREE.Vector2();

    this.defaultCruiseSpeed = (60 * 1000) / 3600; // 50 kph

    this.reset();
  }

  reset() {
    this.lastPos.set(0, 0);
    this.pos.set(0, 0);
    this.vel.set(0, 0);
    this.lastVel.set(0, 0);

    this.accelerate = 0;
    this.brake = 0;

    this.angle = 0;

    this.tilt = 0;
    this.pitch = 0;

    this.tiltV = 0;
    this.pitchV = 0;

    this.roadPos = 0;
    this.stepVel = 0;
    this.roadDir = 1;

    this.steer = 0;
    this.steerPos = 0;
    this.steerTo = 0;
    this.steerV = 0;

    this.sliding = false;
    this.spin = 0;
    this.cruiseSpeed = this.defaultCruiseSpeed;
  }

  autoSteer(step, roadPath, approximation, laneSpacing, laneOffset) {
    // get goal position, based on position on road 1 second in the future
    const dir = this.vel.length() > 0 ? this.vel.clone().normalize() : this.dir();
    const lookAhead = 20;
    const futurePos = this.pos.clone().add(dir.clone().multiplyScalar(lookAhead));
    const along = approximation.getNearest(futurePos);
    const targetDir = roadPath
      .getPoint(along)
      .sub(this.pos)
      .add(roadPath.getNormal(along).multiplyScalar(laneSpacing * this.roadPos + this.roadDir * laneOffset));

    // mix it with the slope of the road at that point
    let tangent = roadPath.getTangent(along);
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

    // Unrelatedly, step on the gas until the car's speed is at cruising speed
    if (this.vel.length() < this.cruiseSpeed) this.accelerate = 1;
    else this.accelerate = this.cruiseSpeed / this.vel.length();
  }

  dir() {
    return rotate(new THREE.Vector2(1, 0), this.angle);
  }

  advance(t) {
    if (t <= 0) {
      return;
    }

    let dir = this.dir();

    const acc = dir
      .clone()
      .multiplyScalar(this.accelerate)
      .multiplyScalar(10)
      .add(this.vel.clone().multiplyScalar(-0.1));
    const newVel = dir.clone().multiplyScalar(
      this.vel
        .clone()
        .add(acc.clone().multiplyScalar(t))
        .dot(dir)
    );
    if (this.brake >= 0.9) newVel.set(0, 0, 0);

    if (
      !this.sliding &&
      newVel
        .clone()
        .sub(this.vel)
        .length() /
        t >
        750
    ) {
      // maximum acceleration allowable?
      this.sliding = true;
    } else if (
      this.sliding &&
      newVel
        .clone()
        .sub(this.vel)
        .length() /
        t <
        50
    ) {
      this.sliding = false;
    }

    if (this.sliding) {
      const friction = newVel
        .clone()
        .sub(this.vel)
        .clone()
        .normalize()
        .clone()
        .multiplyScalar(20);
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

    this.steerPos = this.steerTo;
    this.lastVel = this.vel;
    this.lastPos = this.pos;
  }
}
