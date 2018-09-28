"use strict";

class Drivey {

  constructor(levelName) {
    this.levelsByName = new Map([
      ["empty", Level],
      ["test", TestLevel],
      ["night", DeepDarkNight],
      ["tunnel", Tunnel],
      ["city", City],
      ["industrial", IndustrialZone],
      ["warp", WarpGate],
      ["spectre", Spectre],
      ["beach", CliffsideBeach],
    ]);
    this.screen = new Screen();
    this.init(levelName);
    this.screen.addRenderListener(this.update.bind(this));
    this.update();
  }

  init(levelName) {

    this.laneSpacing = 4; // ???
    this.laneOffset = -2.5;

    this.showDashboard = true;
    this.rearView = false;
    this.autoSteer = true;
    this.wireframe = false;

    this.lastTime = NaN;
    this.lastDelta = 0;
    this.defaultTilt = Math.PI * (0.5 - 0.0625);

    this.level = new (this.levelsByName.get(levelName) || DeepDarkNight)();
    this.autoSteerApproximation = this.level.roadPath.approximate(10000);
    this.dashboard = new Dashboard();
    this.sky = this.makeCylinderSky(); // makeSphereSky()

    this.driver = new THREE.Group();
    this.driver.name = "Ace"; // Everyone, this is my buddy, Ace.
    this.screen.camera.rotation.x = this.defaultTilt;
    this.screen.camera.position.z = 1;
    this.driver.add(this.screen.camera);
    this.screen.birdseye.position.set(0, 0, 20);
    this.driver.add(this.screen.birdseye);

    this.myCar = new Car();
    this.myCarExterior = this.makeCarExterior();
    this.screen.scene.add(this.myCarExterior);

    this.otherCars = [];
    this.otherCarExteriors = [];
    this.numOtherCars = 0;

    this.sky = this.makeCylinderSky(); // makeSphereSky()
    this.myCarExterior.add(this.sky);

    this.myCarInterior = new THREE.Group();
    this.myCarExterior.add(this.myCarInterior);
    // Hop in, Ace
    this.myCarInterior.add(this.driver);

    this.dashboard = new Dashboard();
    this.dashboard.object.scale.set(0.0018, 0.0018, 0.001);
    this.screen.camera.add(this.dashboard.object);

    this.screen.backgroundColor = this.level.tint.clone().multiplyScalar(this.level.ground * 2);

    this.screen.scene.add(this.level.world);
    silhouette.uniforms.tint = { value : this.level.tint};

    this.placeCar(this.myCar, this.level.roadPath, 0);
  }

  makeCylinderSky() {
    const geometry = new THREE.CylinderBufferGeometry( 1, 1, -100, 100, 1, true, 0, Math.PI);
    const positions = geometry.getAttribute('position');
    const numVertices = positions.count;
    const monochromeValues = [];
    for (let i = 0; i < numVertices; i++) {
      const y = positions.array[i * 3 + 0];
      monochromeValues.push(this.level.skyLow * (1 - y) + this.level.skyHigh * y);
      monochromeValues.push(1);
    }
    geometry.addAttribute("monochromeValue", new THREE.Float32BufferAttribute(monochromeValues, 2));
    const mesh = new THREE.Mesh(geometry, silhouette);
    mesh.scale.multiplyScalar(100000);
    mesh.rotation.x = Math.PI * 0.5;
    mesh.rotation.z = Math.PI * 0.5;
    return mesh;
  }

  placeCar(car, roadPath, along, oppositeDirection = false) {
    car.roadPos = 0;

    const direction = oppositeDirection ? -1 : 1;
    car.roadDir = direction;

    const pos = roadPath.getPoint(along).add(roadPath.getNormal(along).multiplyScalar(this.laneOffset * direction));
    car.pos.copy(pos);
    car.lastPos.copy(pos);

    const tangent = roadPath.getTangent(along).multiplyScalar(direction);
    car.angle = getAngle(tangent);

    const vel = tangent.multiplyScalar(car.cruise);
    car.vel.copy(vel);
    car.lastVel.copy(vel);
  }

  updateOptions() {
    if (this.screen.isKeyHit('Digit5')) {
      this.autoSteer = !this.autoSteer;
      this.screen.showMessage(this.autoSteer ? 'automatic steering' : 'manual steering', true);
    }
    if (this.screen.isKeyHit('Digit4')) {
      this.showDashboard = !this.showDashboard;
      this.screen.showMessage('dashboard ' + (this.showDashboard ? 'on' : 'off' ), true);
    }
    if (this.screen.isKeyHit('KeyC')) {
      this.changeNumOtherCars((this.numOtherCars + 8) % 32);
      this.screen.showMessage(this.numOtherCars + ' cars on the road', true);
    }
    if (this.screen.isKeyHit('Digit0')) {
      this.screen.useBirdseye = !this.screen.useBirdseye;
      if (this.screen.useBirdseye) {
        this.screen.backgroundColor = this.level.tint.clone().multiplyScalar(this.level.skyLow).addScalar(0.5);
      } else {
        this.screen.backgroundColor = this.level.tint.clone().multiplyScalar(this.level.ground * 2);
      }
      this.screen.showMessage('bird\'s eye view: ' + (this.screen.useBirdseye ? 'on' : 'off' ), true);
    }
    if (this.screen.isKeyHit('Digit2')) {
      this.wireframe = !this.wireframe;
      // TODO: wireframe
      this.screen.showMessage('wireframe ' + (this.wireframe ? 'on' : 'off'), true);
    }
    if (this.screen.isKeyHit('Digit4')) {
      this.rearView = !this.rearView;
      this.driver.rotation.z = this.rearView ? Math.PI : 0;
      this.screen.showMessage('rear view ' + (this.rearView ? 'on' : 'off'), true);
    }

    if (this.showDashboard && !this.rearView) {
      if (this.dashboard.object.parent == null) this.screen.camera.add(this.dashboard.object);
    } else {
      if (this.dashboard.object.parent != null) this.screen.camera.remove(this.dashboard.object);
    }
  }

  update() {
    this.updateOptions();

    // now let's get the time delta
    const now = Date.now();
    let delta = Math.min(0.1, isNaN(this.lastTime) ? 0 : ((now - this.lastTime)) / 1000); // maximum frame delta is 0.1 seconds
    delta = lerp(this.lastDelta, delta, 0.5); // soften it to deal with coarse timing issues
    this.lastTime = now;
    this.lastDelta = delta;

    const simSpeed =
      (this.screen.isKeyDown('ShiftLeft') || this.screen.isKeyDown('ShiftRight')) ? 0.125 :
      (this.screen.isKeyDown('ControlLeft') || this.screen.isKeyDown('ControlRight')) ? 4 :
      1;

    this.drive(this.myCar, delta, simSpeed, true);
    this.myCarExterior.position.x = this.myCar.pos.x;
    this.myCarExterior.position.y = this.myCar.pos.y;
    this.myCarExterior.rotation.z = this.myCar.angle - Math.PI * 0.5;
    this.myCarInterior.rotation.x = this.myCar.pitch * Math.PI;
    this.screen.camera.rotation.x = this.myCar.tilt * Math.PI + this.defaultTilt;

    for (let i = 0; i < this.numOtherCars; i++) {
      const car = this.otherCars[i];
      const otherCarExterior = this.otherCarExteriors[i];
      this.drive(car, delta, simSpeed, true);
      otherCarExterior.position.x = car.pos.x;
      otherCarExterior.position.y = car.pos.y;
      otherCarExterior.rotation.z = car.angle - Math.PI * 0.5;
    }

    this.dashboard.wheelRotation = lerp(this.dashboard.wheelRotation, Math.PI + this.myCar.steerPos * 50, 0.3);

    const speed1 = lerp(Math.PI * (1 + 0.8), Math.PI * (1 - 0.8), Math.min(this.myCar.vel.length() * 0.009, 1));
    this.dashboard.needle1Rotation = lerp(this.dashboard.needle1Rotation, speed1, 0.05);

    const speed2 = lerp(Math.PI * (1 + 0.8), Math.PI * (1 - 0.8), Math.min(this.screen.frameRate / 80, 1));
    this.dashboard.needle2Rotation = lerp(this.dashboard.needle2Rotation, speed2, 0.005);
  }

  changeNumOtherCars(num) {
    this.numOtherCars = num;

    while (this.otherCars.length < this.numOtherCars) {
      this.otherCars.push(new Car());
      const otherCarExterior = this.makeCarExterior();
      this.otherCarExteriors.push(otherCarExterior);
    }

    for (let i = 0; i < this.otherCars.length; i++) {
      if (i < this.numOtherCars) {
        if (this.otherCarExteriors[i].parent == null) {
          this.screen.scene.add(this.otherCarExteriors[i]);
          this.placeCar(this.otherCars[i], this.level.roadPath, Math.random(), true);
        }
      } else {
        if (this.otherCarExteriors[i].parent != null) {
          this.screen.scene.remove(this.otherCarExteriors[i]);
        }
      }
    }
  }

  makeCarExterior() {
    return new THREE.Mesh(
      new THREE.SphereGeometry(2, 10, 10),
      new THREE.MeshBasicMaterial({color: Math.floor(0xFFFFFF * Math.random())})
    );
  }

  drive(car, delta, simSpeed, interactive) {
    let acc = 0;
    let manualSteerAmount = 0;

    if (interactive) {
      if (this.screen.isKeyDown('ArrowUp')) acc += 1;
      if (this.screen.isKeyDown('ArrowDown')) acc -= 2;

      if (this.screen.isKeyDown('ArrowLeft')) {
        if (this.autoSteer) car.roadPos += 3 * delta * simSpeed;
        else manualSteerAmount += 1;
      }

      if (this.screen.isKeyDown('ArrowRight')) {
        if (this.autoSteer) car.roadPos += -3 * delta * simSpeed;
        else manualSteerAmount -= 1;
      }
    }

    if (this.autoSteer || !interactive) {
      if (car.roadPos > 0.1) car.roadPos -= delta * simSpeed;
      else if (car.roadPos < -0.1) car.roadPos += delta * simSpeed;
    }

    car.brake = this.screen.isKeyDown('Space') ? 1 : 0;
    car.accelerate = 0;

    const TIME_SLICE = 0.05;

    let totalTime = delta * simSpeed;
    while (totalTime > 0) {
      const step = Math.min(totalTime, TIME_SLICE);

      if (this.autoSteer || !interactive) {
        car.autoSteer(this.level.roadPath, this.autoSteerApproximation, this.laneSpacing, this.laneOffset);
      } else {
        const diff = -sign(car.steerTo) * 0.0002 * car.vel.length() * step;
        if (Math.abs(diff) >= Math.abs(car.steerTo)) car.steerTo = 0;
        else car.steerTo += diff;
        car.steerTo = car.steerTo + manualSteerAmount * 0.025 * step;
      }

      car.accelerate += acc;
      car.advance(step);
      totalTime -= TIME_SLICE;
    }
  }
}
