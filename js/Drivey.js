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

    this.level = new (this.levelsByName.get(levelName) || DeepDarkNight)();
    this.dashboard = new Dashboard();
    this.sky = this.makeCylinderSky(); // makeSphereSky()

    this.driver = new THREE.Group();
    this.driver.name = "Ace"; // Everyone, this is my buddy, Ace.
    this.screen.camera.rotation.x = Math.PI * (0.5 - 0.0625);
    this.screen.camera.position.z = 1;
    this.driver.add(this.screen.camera);
    this.screen.birdseye.position.set(0, 0, 20);
    this.driver.add(this.screen.birdseye);

    this.car = new Car();
    this.myCarExterior = new THREE.Group();
    this.screen.scene.add(this.myCarExterior);

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

    this.placeCar(this.car, this.level.roadPath, 0);
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

  placeCar(car, roadPath, roadPos) {
    this.car.roadPos = roadPos;

    const pos = roadPath.getPoint(this.car.roadPos, this.laneOffset);
    car.pos.copy(pos);
    car.lastPos.copy(pos);

    const normal = roadPath.getNormal(this.car.roadPos, this.laneOffset);
    const tangent = roadPath.getTangent(this.car.roadPos, this.laneOffset);

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
    if (this.screen.isKeyHit('KeyC')) {
      this.showDashboard = !this.showDashboard;
      this.screen.showMessage('dashboard ' + (this.showDashboard ? 'on' : 'off' ), true);
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

    this.driving(delta, simSpeed);
    // this.oldDriving(delta, simSpeed);
    // this.fakeDriving(delta, simSpeed);
    // this.fakeWalk(delta, simSpeed);

    this.myCarExterior.position.x = this.car.pos.x;
    this.myCarExterior.position.y = this.car.pos.y;
    this.myCarExterior.rotation.z = this.car.angle - Math.PI * 0.5;
    this.myCarInterior.rotation.x = this.car.pitch * Math.PI;
    this.screen.camera.rotation.y = this.car.tilt * Math.PI;

    this.dashboard.wheelRotation = lerp(this.dashboard.wheelRotation, Math.PI + this.car.steerPos * 50, 0.3);

    const speed1 = lerp(Math.PI * (1 + 0.8), Math.PI * (1 - 0.8), Math.min(this.car.vel.length() * 0.009, 1));
    this.dashboard.needle1Rotation = lerp(this.dashboard.needle1Rotation, speed1, 0.05);

    const speed2 = lerp(Math.PI * (1 + 0.8), Math.PI * (1 - 0.8), Math.min(this.screen.frameRate / 80, 1));
    this.dashboard.needle2Rotation = lerp(this.dashboard.needle2Rotation, speed2, 0.005);
  }

  driving(delta, simSpeed) {

  }

  oldDriving(delta, simSpeed) {
    let acc = 0;
    let manualSteerAmount = 0;

    if (this.screen.isKeyDown('ArrowUp')) acc += 1;
    if (this.screen.isKeyDown('ArrowDown')) acc -= 2;

    if (this.screen.isKeyDown('ArrowLeft')) {
      if (this.autoSteer) this.car.roadPos += 3 * delta * simSpeed;
      else manualSteerAmount += 1;
    }

    if (this.screen.isKeyDown('ArrowRight')) {
      if (this.autoSteer) this.car.roadPos += -3 * delta * simSpeed;
      else manualSteerAmount -= 1;
    }

    if (this.autoSteer) {
      if (this.car.roadPos > 0.1) this.car.roadPos -= delta * simSpeed;
      else if (this.car.roadPos < -0.1) this.car.roadPos += delta * simSpeed;
    }

    this.car.brake = this.screen.isKeyDown('Space') ? 1 : 0;
    this.car.accelerate = 0;

    const TIME_SLICE = 0.05;

    let totalTime = delta * simSpeed;
    while (totalTime > 0) {
      const step = Math.min(totalTime, TIME_SLICE);

      if (this.autoSteer) {
        this.car.autoSteer(this.level.roadPath);
      } else {
        const diff = -sign(this.car.steerTo) * 0.0002 * this.car.vel.length() * step;
        if (Math.abs(diff) >= Math.abs(this.car.steerTo)) this.car.steerTo = 0;
        else this.car.steerTo += diff;
        this.car.steerTo = this.car.steerTo + manualSteerAmount * 0.025 * step;
      }

      this.car.accelerate += acc;
      this.car.advance(step);
      totalTime -= TIME_SLICE;
    }
  }

  fakeDriving(delta, simSpeed) {
    this.car.roadPos = (this.car.roadPos + delta * simSpeed * this.car.cruise / this.level.roadPath.length) % 1;
    this.car.pos.copy(this.level.roadPath.getPoint(this.car.roadPos, this.laneOffset));
    const nextPosition = this.level.roadPath.getPoint((this.car.roadPos + 0.001) % 1, this.laneOffset);
    const angle = Math.atan2(nextPosition.y - this.car.pos.y, nextPosition.x - this.car.pos.x);
    const tilt = diffAngle(angle, this.car.angle);
    this.car.tilt = lerpAngle(this.screen.camera.rotation.y, tilt, 0.1 * simSpeed)
    this.car.angle = lerpAngle(this.car.angle, angle, 0.05 * simSpeed);
  }

  fakeWalk(delta, simSpeed) {
    if (this.screen.isKeyDown('ArrowUp')) {
      // this.car.pos.y += 10;
      this.car.pos.add(rotate(new THREE.Vector2(simSpeed, 0), this.car.angle));
    }
    if (this.screen.isKeyDown('ArrowDown')) {
      // this.car.pos.y -= 10;
      this.car.pos.add(rotate(new THREE.Vector2(-simSpeed, 0), this.car.angle));
    }
    if (this.screen.isKeyDown('ArrowLeft')) {
      // this.car.pos.x -= 10;
      this.car.angle += 0.05;
    }
    if (this.screen.isKeyDown('ArrowRight')) {
      // this.car.pos.x += 10;
      this.car.angle -= 0.05;
    }
  }
}
