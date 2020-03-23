"use strict";

/*

  Drivey.js

  This is a 2018 ECMAScript port of the [graphics demo **Drivey** from 2007](http://drivey.com).

  Original project Copyright © 2007 Mark Pursey.
  ported by rezmason, 2018.

  Free to use and modify for non-profit purposes only.
  A GPLv3 license is being actively considered.

  This code is provided AS IS. You are encouraged to make (and contribute)
  modifications, if you're feeling inspired.

  Subscribe to the repo at https://github.com/Rezmason/drivey to learn of any major changes.

*/

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
      ["beach", CliffsideBeach],
      ["nullarbor", TrainTracks],
      ["marshland", Overpass],
    ]);
    this.controlSchemes = new Map([
      ["touch", new TouchInput()],
      ["arrows", new KeyboardInput()],
      ["1 switch", new OneSwitchInput()],
      ["eye gaze", new EyeGazeInput()],
    ]);
    this.controlScheme = this.controlSchemes.get(isMobile ? "touch" : "arrows");
    this.screen = new Screen();
    this.buttons = new Buttons();
    this.buttons.addListener(this.onButtonClick.bind(this));
    this.init();
    this.screen.addUpdateListener(this.update.bind(this));
    this.update();
  }

  init() {
    this.laneSpacing = 4;
    this.laneOffset = 2.5;
    this.laneChange = 0;
    this.drivingSide = -1;
    this.defaultTilt = Math.PI * (0.5 - 0.0625);

    this.showDashboard = true;
    this.rearView = false;
    this.cruiseSpeed = 1;

    // Used to determine time delta between frames
    this.lastTime = NaN;
    this.lastDelta = 0;

    /*
      The organization of the scene is as follows:

      scene
        <satelliteCamera>
        myCarExterior
          sky
          <chaseCamera>
          myCarInterior
            myCarMesh
            driver
              <driverCamera>
                dashboard
              <aerialCamera>
        level world
        level sky
        [otherCarExteriors]
    */

    this.myCar = new Car();
    this.myCarMesh = CarMeshMaker.generate();
    this.otherCars = [];
    this.otherCarExteriors = [];
    this.numOtherCars = 0;

    this.myCarExterior = new THREE.Group();
    this.screen.scene.add(this.myCarExterior);

    this.myCarInterior = new THREE.Group();
    this.myCarExterior.add(this.myCarInterior);

    this.sky = this.makeSky();
    this.myCarExterior.add(this.sky);

    this.screen.chaseCamera.rotation.x = Math.PI * 0.5;
    this.screen.chaseCamera.position.y = -5;
    this.screen.chaseCamera.position.z = 2;
    this.myCarExterior.add(this.screen.chaseCamera);

    this.driver = new THREE.Group();
    this.driver.name = "Ace";
    this.myCarInterior.add(this.driver);

    this.screen.driverCamera.rotation.x = this.defaultTilt;
    this.screen.driverCamera.position.z = 1;
    this.driver.add(this.screen.driverCamera);

    this.screen.aerialCamera.position.set(0, 0, 60);
    this.driver.add(this.screen.aerialCamera);

    this.dashboard = new Dashboard();
    this.dashboard.object.scale.set(0.0018, 0.0018, 0.001);
    this.screen.driverCamera.add(this.dashboard.object);

    // Initial level is Industrial Zone
    this.setLevel("industrial");
  }

  setLevel(levelName) {
    if (this.level != null) {
      this.screen.scene.remove(this.level.world);
      this.screen.scene.remove(this.level.sky);
      this.level.dispose();
    }

    this.level = new (this.levelsByName.get(levelName) || DeepDarkNight)();
    this.autoSteerApproximation = this.level.roadPath.approximate(10000); // Used by car steering logic

    // Retint the sky
    const skyGeometry = this.sky.geometry;
    const positions = skyGeometry.getAttribute("position");
    const numVertices = positions.count;
    const monochromeAttribute = skyGeometry.getAttribute("monochromeValue");
    const monochromeValues = monochromeAttribute.array;
    for (let i = 0; i < numVertices; i++) {
      const y = positions.array[i * 3 + 0];
      monochromeValues[i * 3 + 0] = this.level.skyLow * (1 - y) + this.level.skyHigh * y;
      monochromeValues[i * 3 + 1] = 1;
    }
    monochromeAttribute.needsUpdate = true;

    // Retint the background, UI and materials
    this.updateBackgroundColor();
    this.buttons.setTint(this.level.tint);
    silhouette.uniforms.tint = { value: this.level.tint };
    transparent.uniforms.tint = { value: this.level.tint };

    // Build the level scene graph
    this.screen.scene.add(this.level.world);
    this.placeCar(this.myCar, this.level.roadPath, 0, (this.laneOffset + this.laneChange) * this.drivingSide, false, this.cruiseSpeed * this.level.cruiseSpeed);
    this.setNumOtherCars(this.numOtherCars);

    // The height of the world camera depends on the size of the level
    this.screen.satelliteCamera.position.set(0, 0, this.level.worldRadius);
  }

  updateBackgroundColor() {
    let backgroundColor = this.level.tint.clone();
    if (
      this.screen.camera == this.screen.driverCamera ||
      this.screen.camera == this.screen.chaseCamera
    ) {
      backgroundColor.multiplyScalar(this.level.ground * 2);
    } else {
      backgroundColor.multiplyScalar(this.level.skyLow).addScalar(0.5);
    }
    this.screen.backgroundColor = backgroundColor;
  }

  makeSky() {
    /*

    The sky is half a cylindrical shell with a gradient
    based on the y position of its vertices

        :::::::---------------::        skyHigh
      :::     :::               ::        .
     ::         ::               ::       .
    ::           ::               ::      .
    ::           ::_______________::    skyLow

    It needs to be wide enough to reach the edges
    of the driver camera frustum most of the time

    */

    const geometry = new THREE.CylinderBufferGeometry(1, 1, -100, 100, 1, true, 0, Math.PI);
    shadeGeometry(geometry, 0);
    const mesh = new THREE.Mesh(geometry, silhouette);
    mesh.scale.multiplyScalar(100000);
    mesh.rotation.x = Math.PI * 0.5;
    mesh.rotation.z = Math.PI * 0.5;
    return mesh;
  }

  placeCar(car, roadPath, along, laneOffset, oppositeDirection = false, goSpeed = 0) {
    car.reset();

    // Cars on the opposite side of the road get some of their initial values inverted
    const direction = oppositeDirection ? -1 : 1;
    car.roadDir = direction;

    const pos = roadPath.getPoint(along).add(roadPath.getNormal(along).multiplyScalar(laneOffset * direction));
    car.pos.copy(pos);
    car.lastPos.copy(pos);

    const tangent = roadPath.getTangent(along).multiplyScalar(direction);
    car.angle = getAngle(tangent);

    const vel = tangent.multiplyScalar(goSpeed * 2);
    car.vel.copy(vel);
    car.lastVel.copy(vel);
    car.matchSpeed(goSpeed * 2);
  }

  onButtonClick(button, value) {
    switch (button) {
      case "cruise":
        const cruise = parseInt(value);
        switch (cruise) {
          case 0:
            this.cruiseSpeed = 0;
            break;
          case 1:
            this.cruiseSpeed = 0.5;
            break;
          case 2:
            this.cruiseSpeed = 1.0;
            break;
          case 3:
            this.cruiseSpeed = 4.0;
            break;
        }
        this.drivingSide *= -1;
        break;
      case "controls":
        this.controlScheme = this.controlSchemes.get(value);
        this.drivingSide *= -1;
        break;
      case "dashboard":
        this.showDashboard = value === "true";
        break;
      case "npcCars":
        this.setNumOtherCars(parseInt(value) * 8);
        break;
      case "camera":
        this.rearView = false;
        switch (value) {
          case "driver":
            this.screen.camera = this.screen.driverCamera;
            break;
          case "rear":
            this.screen.camera = this.screen.driverCamera;
            this.rearView = true;
            break;
          case "chase":
            this.screen.camera = this.screen.chaseCamera;
            break;
          case "aerial":
            this.screen.camera = this.screen.aerialCamera;
            break;
          case "satellite":
            this.screen.camera = this.screen.satelliteCamera;
            break;
        }
        this.updateBackgroundColor();
        break;
      case "drivingSide":
        switch (value) {
          case "left":
            this.drivingSide = 1;
            break;
          case "right":
            this.drivingSide = -1;
            break;
        }
        this.dashboard.drivingSide = this.drivingSide;
        break;
      case "quality":
        switch (value) {
          case "low":
          this.screen.setResolution(1 / 4);
          break;
          case "medium":
          this.screen.setResolution(1 / 2);
          break;
          case "high":
          this.screen.setResolution(1 / 1);
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
    this.dashboard.update();
    this.controlScheme.update();

    // The direction the driver is looking - forwards, or backwards
    this.driver.rotation.z = lerp(this.driver.rotation.z, this.rearView ? Math.PI : 0, 0.2);
    if (this.screen.camera == this.screen.driverCamera) {
      this.sky.rotation.y = this.driver.rotation.z;
    } else {
      this.sky.rotation.y = 0;
    }

    // The dashboard only appears if the driver is facing forward and the camera is the driver camera
    if (this.showDashboard && !this.rearView && this.screen.camera == this.screen.driverCamera) {
      if (this.dashboard.object.parent == null) this.screen.driverCamera.add(this.dashboard.object);
    } else {
      if (this.dashboard.object.parent != null) this.screen.driverCamera.remove(this.dashboard.object);
    }

    // Only show the sky if the camera is the driver camera
    if (
      this.screen.camera == this.screen.driverCamera ||
      this.screen.camera == this.screen.chaseCamera
    ) {
      if (this.level.sky.parent == null) this.screen.scene.add(this.level.sky);
    } else {
      if (this.level.sky.parent != null) this.screen.scene.remove(this.level.sky);
    }

    // Only show my car if the camera is not the driver camera
    if (this.screen.camera == this.screen.driverCamera) {
      if (this.myCarMesh.parent != null) this.myCarExterior.remove(this.myCarMesh);
    } else {
      if (this.myCarMesh.parent == null) this.myCarExterior.add(this.myCarMesh);
    }

    // now let's get the time delta here
    const now = Date.now();
    let delta = Math.min(0.1, isNaN(this.lastTime) ? 0 : (now - this.lastTime) / 1000); // maximum delta is 0.1 seconds
    delta = lerp(this.lastDelta, delta, 0.5); // soften it to deal with coarse timing issues
    this.lastTime = now;
    this.lastDelta = delta;

    const simSpeed = this.controlScheme.slow ? 0.125 : this.controlScheme.fast ? 4 : 1;

    // Drive all the cars and update their positions/rotations
    for (let i = 0; i < this.numOtherCars; i++) {
      this.drive(this.otherCars[i], this.otherCarExteriors[i], 1, delta, simSpeed);
    }
    this.drive(this.myCar, this.myCarExterior, this.cruiseSpeed, delta, simSpeed, true);
    this.myCarInterior.rotation.x = this.myCar.pitch * Math.PI;
    this.driver.rotation.y = this.myCar.tilt * Math.PI;

    // Update the dashboard
    this.dashboard.object.rotation.z = this.driver.rotation.y;
    this.dashboard.wheelRotation = lerp(this.dashboard.wheelRotation, Math.PI + this.myCar.steerPos * 50, 0.3);
    const speed1 = lerp(Math.PI * (1 + 0.8), Math.PI * (1 - 0.8), Math.min(this.myCar.vel.length() * 0.009, 1));
    this.dashboard.needle1Rotation = lerp(this.dashboard.needle1Rotation, speed1, 0.05);
    const speed2 = lerp(Math.PI * (1 + 0.8), Math.PI * (1 - 0.8), Math.min(this.screen.frameRate / 80, 1));
    this.dashboard.needle2Rotation = lerp(this.dashboard.needle2Rotation, speed2, 0.005);
  }

  setNumOtherCars(num) {
    this.numOtherCars = num;

    // Other cars are procedurally generated as needed
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
        this.placeCar(this.otherCars[i], this.level.roadPath, Math.random(), this.laneOffset, Math.random() < 0.5, this.level.cruiseSpeed);
      } else {
        if (this.otherCarExteriors[i].parent != null) {
          this.screen.scene.remove(this.otherCarExteriors[i]);
        }
      }
    }
  }

  drive(car, object, cruiseSpeed, delta, simSpeed, interactive) {
    const autoSteer = cruiseSpeed > 0;
    let acc = interactive ? this.controlScheme.brake * -2 + this.controlScheme.gas : 0;
    let steer = interactive ? this.controlScheme.steer : 0;
    if (interactive && autoSteer && this.controlScheme.laneChange !== 0) {
      steer = 0;
      this.laneChange += (interactive && autoSteer) ? this.controlScheme.laneChange : 0;
    } else {
      this.laneChange = 0;
    }
    car.handbrake = interactive && this.controlScheme.handbrake;
    car.accelerate = 0;

    if (autoSteer || !interactive) {
      car.roadPos += 3 * delta * simSpeed * steer * this.controlScheme.autoSteerSensitivity;
      if (car.roadPos > 0.1) car.roadPos -= delta * simSpeed;
      else if (car.roadPos < -0.1) car.roadPos += delta * simSpeed;
      car.autoSteer(delta * simSpeed, this.level.roadPath, this.autoSteerApproximation, this.laneSpacing, (this.laneOffset + this.laneChange) * this.drivingSide);
    } else {
      const diff = -sign(car.steerTo) * 0.0002 * car.vel.length() * delta * simSpeed;
      if (Math.abs(diff) >= Math.abs(car.steerTo)) car.steerTo = 0;
      else car.steerTo += diff;
      car.steerTo = car.steerTo + steer * this.controlScheme.manualSteerSensitivity * delta * simSpeed;
    }

    if (autoSteer || this.controlScheme.forceCruise) {
      car.matchSpeed(cruiseSpeed * this.level.cruiseSpeed * (interactive ? this.controlScheme.cruiseSpeedMultiplier : 1));
    }

    car.accelerate += acc;
    car.advance(delta * simSpeed);

    object.position.x = car.pos.x;
    object.position.y = car.pos.y;
    object.rotation.z = car.angle - Math.PI * 0.5;
  }
}
