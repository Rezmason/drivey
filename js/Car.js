class Car {

  constructor() {
    this.object = new THREE.Group();
    // TODO: make car model, with headlights

    this.object.add(new THREE.Mesh(
      new THREE.CubeGeometry(),
      new THREE.MeshBasicMaterial({
        color: 0xFF
      })
    ));

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

  collideWithCar(other) {
    return 0; // TODO
  }

  collideWithObject(other) {
    return 0; // TODO
  }
}
