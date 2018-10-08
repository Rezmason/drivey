"use strict";

class Drivey {
  constructor() {
    this.levelsByName = new Map([
      ["empty", Level],
      ["test", TestLevel],
      ["night", DeepDarkNight],
      ["tunnel", Tunnel],
      ["city", City],
      ["industrial", IndustrialZone],
      ["warp", WarpGate],
      ["spectre", Spectre],
      ["beach", CliffsideBeach]
    ]);
    this.screen = new Screen();
    this.buttons = new Buttons();
    this.buttons.addListener(this.onButtonClick.bind(this));
    this.init();
    this.screen.addRenderListener(this.update.bind(this));
    this.update();
  }

  init() {
    this.laneSpacing = 4; // ???
    this.laneOffset = -2.5;

    this.showDashboard = true;
    this.rearView = false;
    this.autoSteer = true;

    this.lastTime = NaN;
    this.lastDelta = 0;
    this.defaultTilt = Math.PI * (0.5 - 0.0625);

    this.dashboard = new Dashboard();
    this.sky = this.makeCylinderSky(); // makeSphereSky()

    this.driver = new THREE.Group();
    this.driver.name = "Ace"; // Everyone, this is my buddy, Ace.
    this.screen.driverCamera.rotation.x = this.defaultTilt;
    this.screen.driverCamera.position.z = 1;
    this.driver.add(this.screen.driverCamera);
    this.screen.overheadCamera.position.set(0, 0, 20);
    this.driver.add(this.screen.overheadCamera);

    this.myCar = new Car();
    this.myCarExterior = new THREE.Group();
    this.myCarMesh = CarMeshMaker.generate();
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
    this.screen.driverCamera.add(this.dashboard.object);

    this.setLevel("industrial");
  }

  setLevel(levelName) {
    if (this.level != null) {
      this.screen.scene.remove(this.level.world);
      // TODO: properly dispose of level
    }

    this.level = new (this.levelsByName.get(levelName) || DeepDarkNight)();
    this.autoSteerApproximation = this.level.roadPath.approximate(10000);

    const geometry = this.sky.geometry;
    const positions = geometry.getAttribute("position");
    const numVertices = positions.count;
    const monochromeAttribute = geometry.getAttribute("monochromeValue");
    const monochromeValues = monochromeAttribute.array;
    for (let i = 0; i < numVertices; i++) {
      const y = positions.array[i * 3 + 0];
      monochromeValues[i * 2 + 0] = this.level.skyLow * (1 - y) + this.level.skyHigh * y;
      monochromeValues[i * 2 + 1] = 1;
    }
    monochromeAttribute.needsUpdate = true;
    this.updateBackgroundColor();
    this.buttons.setTint(this.level.tint);
    this.screen.scene.add(this.level.world);
    silhouette.uniforms.tint = { value: this.level.tint };
    this.placeCar(this.myCar, this.level.roadPath, 0, false, this.autoSteer);
    this.setNumOtherCars(this.numOtherCars);

    this.screen.worldCamera.position.set(0, 0, this.level.worldRadius);
  }

  updateBackgroundColor() {
    let backgroundColor = this.level.tint.clone();
    if (this.screen.camera == this.screen.driverCamera) {
      backgroundColor.multiplyScalar(this.level.ground * 2);
    } else {
      backgroundColor.multiplyScalar(this.level.skyLow).addScalar(0.5);
    }
    this.screen.backgroundColor = backgroundColor;
  }

  makeCylinderSky() {
    const geometry = new THREE.CylinderBufferGeometry(1, 1, -100, 100, 1, true, 0, Math.PI);
    shadeGeometry(geometry, 0);
    const mesh = new THREE.Mesh(geometry, silhouette);
    mesh.scale.multiplyScalar(100000);
    mesh.rotation.x = Math.PI * 0.5;
    mesh.rotation.z = Math.PI * 0.5;
    return mesh;
  }

  placeCar(car, roadPath, along, oppositeDirection = false, go = false) {
    car.reset();

    const direction = oppositeDirection ? -1 : 1;
    car.roadDir = direction;

    const pos = roadPath.getPoint(along).add(roadPath.getNormal(along).multiplyScalar(this.laneOffset * direction));
    car.pos.copy(pos);
    car.lastPos.copy(pos);

    const tangent = roadPath.getTangent(along).multiplyScalar(direction);
    car.angle = getAngle(tangent);

    if (go) {
      const vel = tangent.multiplyScalar(car.cruiseSpeed);
      car.vel.copy(vel);
      car.lastVel.copy(vel);
    }
  }

  onButtonClick(button, value) {
    switch (button) {
      case "cruise":
        const cruise = parseInt(value);
        this.autoSteer = cruise !== 0;
        switch (cruise) {
          case 0:
            this.myCar.cruiseSpeed = 0;
            break;
          case 1:
            this.myCar.cruiseSpeed = this.myCar.defaultCruiseSpeed * 0.1;
            break;
          case 2:
            this.myCar.cruiseSpeed = this.myCar.defaultCruiseSpeed * 0.5;
            break;
          case 3:
            this.myCar.cruiseSpeed = this.myCar.defaultCruiseSpeed * 1.0;
            break;
        }
        break;
      case "dashboard":
        this.showDashboard = value === "true";
        break;
      case "npcCars":
        this.setNumOtherCars(parseInt(value));
        break;
      case "camera":
        switch (value) {
          case "driver":
            this.screen.camera = this.screen.driverCamera;
            break;
          case "overhead":
            this.screen.camera = this.screen.overheadCamera;
            break;
          case "world":
            this.screen.camera = this.screen.worldCamera;
            break;
        }
        this.updateBackgroundColor();
        break;
      case "rearView":
        this.rearView = value === "true";
        break;
      case "drivingSide":
        switch (value) {
          case "left":
            this.laneOffset = Math.abs(this.laneOffset);
            break;
          case "right":
            this.laneOffset = -Math.abs(this.laneOffset);
            break;
        }
        break;
      case "music":
        window.open("https://open.spotify.com/user/rezmason/playlist/4ukrs3cTKjTbLoFcxqssXi?si=0y3WoBw1TMyUzK8F9WMbLw", "_blank");
        break;
      case "level":
        this.setLevel(value);
        break;
    }
  }

  update() {
    this.buttons.update();

    this.driver.rotation.z = lerp(this.driver.rotation.z, this.rearView ? Math.PI : 0, 0.2);
    this.sky.rotation.y = this.driver.rotation.z;

    if (this.showDashboard && !this.rearView && this.screen.camera == this.screen.driverCamera) {
      if (this.dashboard.object.parent == null) this.screen.driverCamera.add(this.dashboard.object);
    } else {
      if (this.dashboard.object.parent != null) this.screen.driverCamera.remove(this.dashboard.object);
    }

    if (this.screen.camera == this.screen.driverCamera) {
      if (this.myCarMesh.parent != null) this.myCarExterior.remove(this.myCarMesh);
    } else {
      if (this.myCarMesh.parent == null) this.myCarExterior.add(this.myCarMesh);
    }
    this.dashboard.driversSide = this.laneOffset < 0 ? 1 : -1;

    // now let's get the time delta
    const now = Date.now();
    let delta = Math.min(0.1, isNaN(this.lastTime) ? 0 : (now - this.lastTime) / 1000); // maximum frame delta is 0.1 seconds
    delta = lerp(this.lastDelta, delta, 0.5); // soften it to deal with coarse timing issues
    this.lastTime = now;
    this.lastDelta = delta;

    const simSpeed =
      this.screen.isKeyDown("ShiftLeft") || this.screen.isKeyDown("ShiftRight")
        ? 0.125
        : this.screen.isKeyDown("ControlLeft") || this.screen.isKeyDown("ControlRight")
          ? 4
          : 1;

    this.drive(this.myCar, delta, simSpeed, true);
    this.myCarExterior.position.x = this.myCar.pos.x;
    this.myCarExterior.position.y = this.myCar.pos.y;
    this.myCarExterior.rotation.z = this.myCar.angle - Math.PI * 0.5;
    this.myCarInterior.rotation.x = this.myCar.pitch * Math.PI;

    this.driver.rotation.y = this.myCar.tilt * Math.PI;
    this.dashboard.object.rotation.z = this.driver.rotation.y;

    for (let i = 0; i < this.numOtherCars; i++) {
      const car = this.otherCars[i];
      const otherCarExterior = this.otherCarExteriors[i];
      this.drive(car, delta, simSpeed);
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

  setNumOtherCars(num) {
    this.numOtherCars = num;

    while (this.otherCars.length < this.numOtherCars) {
      this.otherCars.push(new Car());
      const otherCarExterior = CarMeshMaker.generate();
      this.otherCarExteriors.push(otherCarExterior);
    }

    for (let i = 0; i < this.otherCars.length; i++) {
      if (i < this.numOtherCars) {
        if (this.otherCarExteriors[i].parent == null) {
          this.screen.scene.add(this.otherCarExteriors[i]);
        }
        this.placeCar(this.otherCars[i], this.level.roadPath, Math.random(), Math.random() < 0.5, true);
      } else {
        if (this.otherCarExteriors[i].parent != null) {
          this.screen.scene.remove(this.otherCarExteriors[i]);
        }
      }
    }
  }

  drive(car, delta, simSpeed, interactive) {
    let acc = 0;
    let manualSteerAmount = 0;

    if (interactive) {
      if (this.screen.isKeyDown("ArrowUp")) acc += 1;
      if (this.screen.isKeyDown("ArrowDown")) acc -= 2;

      if (this.screen.isKeyDown("ArrowLeft")) {
        if (this.autoSteer) car.roadPos += 3 * delta * simSpeed;
        else manualSteerAmount += 1;
      }

      if (this.screen.isKeyDown("ArrowRight")) {
        if (this.autoSteer) car.roadPos += -3 * delta * simSpeed;
        else manualSteerAmount -= 1;
      }
    }

    if (this.autoSteer || !interactive) {
      if (car.roadPos > 0.1) car.roadPos -= delta * simSpeed;
      else if (car.roadPos < -0.1) car.roadPos += delta * simSpeed;
    }

    car.brake = interactive && this.screen.isKeyDown("Space") ? 1 : 0;
    car.accelerate = 0;

    if (this.autoSteer || !interactive) {
      car.autoSteer(delta * simSpeed, this.level.roadPath, this.autoSteerApproximation, this.laneSpacing, this.laneOffset);
    } else {
      const diff = -sign(car.steerTo) * 0.0002 * car.vel.length() * delta * simSpeed;
      if (Math.abs(diff) >= Math.abs(car.steerTo)) car.steerTo = 0;
      else car.steerTo += diff;
      car.steerTo = car.steerTo + manualSteerAmount * 0.025 * delta * simSpeed;
    }

    car.accelerate += acc;
    car.advance(delta * simSpeed);
  }
}
