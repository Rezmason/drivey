class Car {

  constructor() {
    this.lastPos = new THREE.Vector2(0, 0);
    this.pos = new THREE.Vector2(0, 0);
    this.vel = new THREE.Vector2(0, 0);
    this.lastVel = new THREE.Vector2(0, 0);

    this.accelerate = 0;
    this.brake = 0;

    this.angle = 0;

    this.tilt = 0;
    this.pitch = 0;

    this.tiltV = 0;
    this.pitchV = 0;

    this.roadPos = 0;
    this.stepVel = 0;
    this.roadDir = -1;

    this.steer = 0;
    this.steerPos = 0;
    this.steerTo = 0;
    this.steerV = 0;

    this.sliding = false;
    this.spin = 0;
    this.cruise = 120 * 1000 / 3600; // 50 kph
  }

  autoSteer(roadPath) {

    const dir = (this.vel.length() > 0 )
      ? this.vel.clone().normalize()
      : rotate(new THREE.Vector2(0, 1), -this.angle);

    // get position on road for 1 second ahead of now

    const lookAhead = 20; // basic direction stuff
    let futurePos = this.pos.clone().add(dir.clone().multiplyScalar(lookAhead));
    let t = roadPath.getNearest(futurePos);

    let targetDir = roadPath.getPoint(t).sub(this.pos);
    let tangent = roadPath.getTangent(t);//.normalize();

    if (this.roadDir < 0) tangent.multiplyScalar(-1);

    let normal = rotateY(tangent, Math.PI * 0.5);
    targetDir.add(normal.multiplyScalar(this.laneSpacing * this.roadPos + this.laneOffset));

    if (targetDir.length() > 0) tangent.lerp(targetDir, 0.05);

    let newAngle = Math.atan2(tangent.y, tangent.x) - Math.PI * 0.5;
    newAngle = -newAngle;
    newAngle -= this.angle;
    while (newAngle > Math.PI) newAngle -= Math.PI * 2;
    while (newAngle < -Math.PI) newAngle += Math.PI * 2;

    if (Math.abs(newAngle) > 1) newAngle /= Math.abs(newAngle);
    this.steerTo = newAngle / (Math.min(targetDir.length() * 0.5, 50) + 1);
    if (Math.abs(this.steerTo) > 0.02) this.steerTo *= 0.02 / Math.abs(this.steerTo);

    if (this.vel.length() < this.cruise) this.accelerate = 1;
    else this.accelerate = this.cruise / this.vel.length();
  }

  dir() {
    return rotate(new THREE.Vector2(1,0), this.angle);
  }

  advance(t) {

    if (t <= 0) {
      return;
    }

    var dir = this.dir();

    var acc = dir
      .clone()
      .multiplyScalar(this.accelerate)
      .multiplyScalar(10)
      .add(this.vel
        .clone()
        .multiplyScalar(-0.1)
      );
    var newVel = dir
      .clone()
      .multiplyScalar(this.vel
        .clone()
        .add(acc
          .clone()
          .multiplyScalar(t)
        )
        .dot(dir)
      );
    if (this.brake >= 0.9) newVel.set(0,0,0);

    if (!this.sliding && newVel.clone().sub(this.vel).length() / t > 750) { // maximum acceleration allowable?
      this.sliding = true;
    } else if (this.sliding && newVel.clone().sub(this.vel).length() / t < 50) {
      this.sliding = false;
    }

    if (this.sliding) {
      var friction = newVel.clone().sub(this.vel).clone().normalize().clone().multiplyScalar(20);
      this.vel = this.vel.clone().add(friction.clone().multiplyScalar(t));
    }

    if (!this.sliding) {
      this.vel = newVel;
    }

    this.spin = this.vel.clone().dot(dir) * this.steerPos * (this.sliding ? 0.5 : 1.0);
    this.angle += this.spin * t;
    this.pos = this.pos.clone().add(this.vel.clone().multiplyScalar(t));
    var velDiff = this.vel.clone().sub(this.lastVel);
    this.tiltV = this.tiltV + (this.tiltV * -0.2 + velDiff.clone().dot(rotateY(dir,Math.PI * -0.5)) * 0.001 / t - this.tilt) * t * 20;
    this.tilt += this.tiltV * t;
    this.pitchV += (this.pitchV * -0.2 + velDiff.clone().dot(dir) * 0.001 / t - this.pitch) * t * 20;
    this.pitch += this.pitchV * t;
    var diff = this.steerTo - this.steerPos;
    if ((diff < 0 ? -diff : diff) > t * 0.05) {
      diff *= t * 0.05 / (diff < 0 ? -diff : diff);
    }
    this.steerPos += diff;

    this.lastVel = this.vel;
    this.lastPos = this.pos;
  }
}
