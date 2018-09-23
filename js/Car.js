class Car {

  constructor() {
    this.lastPos = new THREE.Vector3(0, 1, 0);
    this.pos = new THREE.Vector3(0, 1, 0);
    this.vel = new THREE.Vector3(0, 0, 0);
    this.lastVel = new THREE.Vector3(0, 0, 0);

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

  dir() {
    return rotateY(new THREE.Vector3(0,0,1), -this.angle);
  }

  advance(t) {

    if (t <= 0) {
      return;
    }

    var dir = rotateY(new THREE.Vector3(0,0,1), -this.angle);
    var acc = dir
      .clone().multiplyScalar(this.accelerate)
      .clone().multiplyScalar(10)
      .clone().add(
        this.vel.clone().multiplyScalar(-0.1)
    );
    var oldSpin = this.spin;
    var newVel = dir.clone().multiplyScalar(this.vel.clone().add(acc.clone().multiplyScalar(t)).clone().dot(dir));
    if (this.brake >= 0.9) newVel.set(0,0,0);
    var tmp;

    if (!this.sliding) {
      tmp = newVel.clone().sub(this.vel).length() / t > 750;
    } else {
      tmp = false;
    }

    if (tmp) {
      this.sliding = true;
    } else {
      var tmp1;
      if (this.sliding) {
        tmp1 = newVel.clone().sub(this.vel).length() / t < 50;
      } else {
        tmp1 = false;
      }
      if (tmp1) {
        this.sliding = false;
      }
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
    var grav = -10;
    this.pos.y = this.lastPos.y + this.lastVel.y * t + 0.5 * grav * t * t;
    this.vel.y = this.lastVel.y + grav * t;
    if (this.pos.y < 1.5) {
      this.pos.y = 1.5;
      this.vel.y = 0;
    }
    this.lastVel = this.vel;
    this.lastPos = this.pos;
  }
}
