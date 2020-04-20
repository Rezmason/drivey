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
    this.npcControlScheme = new Input();
    this.controlScheme = this.controlSchemes.get(isMobile ? "touch" : "arrows");
    this.screen = new Screen();
    this.buttons = new Buttons();
    this.buttons.addListener(this.onButtonClick.bind(this));
    this.init();
    this.screen.addUpdateListener(this.update.bind(this));
    this.update();
  }

  init() {

    this.cruiseSpeeds = new Map([
      [0, 0.0],
      [1, 0.5],
      [2, 1.0],
      [3, 4.0],
    ]);

    this.camerasByName = new Map([
      ["driver", this.screen.driverCamera],
      ["rear", this.screen.driverCamera],
      ["chase", this.screen.chaseCamera],
      ["aerial", this.screen.aerialCamera],
      ["satellite", this.screen.satelliteCamera],
    ]);

    this.drivingSidesByName = new Map([
      ["left", 1],
      ["right", -1],
    ]);

    this.screenResolutions = new Map([
      ["low", 1 / 4],
      ["medium", 1 / 2],
      ["high", 1 / 1],
    ]);

    this.laneSpacing = 4;
    this.laneOffset = 2.5;
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
          <aerialCamera>
          myCarInterior
            myCarMesh
            driver
              <driverCamera>
                dashboard
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
    this.myCarExterior.add(this.screen.aerialCamera);

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
    this.myCar.remove();
    this.myCar.place(
      this.level.roadPath,
      this.autoSteerApproximation,
      0,
      this.laneOffset * this.drivingSide,
      1,
      this.cruiseSpeed * this.level.cruiseSpeed
    );
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

  onButtonClick(button, value) {
    switch (button) {
      case "cruise":
        this.cruiseSpeed = this.cruiseSpeeds.get(parseInt(value));
        break;
      case "controls":
        this.controlScheme = this.controlSchemes.get(value);
        break;
      case "dashboard":
        this.showDashboard = value === "true";
        break;
      case "npcCars":
        this.setNumOtherCars(parseInt(value) * 8);
        break;
      case "camera":
        this.rearView = value === "rear";
        this.screen.camera = this.camerasByName.get(value);
        this.updateBackgroundColor();
        break;
      case "drivingSide":
        this.drivingSide = this.drivingSidesByName.get(value);
        this.dashboard.drivingSide = this.drivingSide;
        break;
      case "quality":
        this.screen.setResolution(this.screenResolutions.get(value));
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
    const simDelta = simSpeed * delta;

    // Drive all the cars and update their positions/rotations
    for (let i = 0; i < this.numOtherCars; i++) {
      this.otherCars[i].drive(simDelta, this.level.cruiseSpeed, this.npcControlScheme, this.laneSpacing, this.laneOffset, this.drivingSide);
      this.updateCarExterior(this.otherCars[i], this.otherCarExteriors[i]);
    }

    const myCruiseSpeed = Math.max(this.controlScheme.minCruiseSpeed, this.cruiseSpeed) * this.level.cruiseSpeed;
    this.myCar.drive(simDelta, myCruiseSpeed, this.controlScheme, this.laneSpacing, this.laneOffset, this.drivingSide);
    this.updateCarExterior(this.myCar, this.myCarExterior);
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
        this.otherCars[i].place(
          this.level.roadPath,
          this.autoSteerApproximation,
          Math.random(),
          this.laneOffset * this.drivingSide,
          Math.random() < 0.5 ? 1 : -1,
          this.level.cruiseSpeed
        );
      } else {
        if (this.otherCarExteriors[i].parent != null) {
          this.screen.scene.remove(this.otherCarExteriors[i]);
        }
        this.otherCars[i].remove();
      }
    }
  }

  updateCarExterior(car, exterior) {
    exterior.position.x = car.pos.x;
    exterior.position.y = car.pos.y;
    exterior.rotation.z = car.angle - Math.PI * 0.5;
  }
}
