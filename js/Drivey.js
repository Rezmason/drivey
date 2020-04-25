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
    this.currentEffect = "ombré";
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

    this.drivingSidesByName = new Map([
      ["left", 1],
      ["right", -1],
    ]);

    this.screenResolutions = new Map([
      ["low", 1 / 4],
      ["medium", 1 / 2],
      ["high", 1 / 1],
    ]);

    this.drivingSide = -1;
    this.defaultTilt = -0.0625;

    this.cruiseSpeed = 1;

    // Used to determine time delta between frames
    this.lastTime = NaN;
    this.lastDelta = 0;

    /*
      The organization of the scene is as follows:

      scene
        <satelliteCameraMount>
        myCarExterior
          sky
          <chaseCameraMount>
          <aerialCameraMount>
          myCarInterior
            myCarMesh
            driver
              <rearCameraMount>
              <driverCameraMount>
                dashboard
        level world
        level sky
        [otherCarExteriors]
    */

    this.satelliteCameraMount = new THREE.Group();
    this.screen.scene.add(this.satelliteCameraMount);

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

    this.chaseCameraMount = new THREE.Group();
    this.chaseCameraMount.rotation.x = Math.PI * 0.5;
    this.chaseCameraMount.position.y = -5;
    this.chaseCameraMount.position.z = 2;
    this.myCarExterior.add(this.chaseCameraMount);

    this.hoodCameraMount = new THREE.Group();
    this.hoodCameraMount.rotation.x = Math.PI * 0.5;
    this.hoodCameraMount.position.y = 3;
    this.hoodCameraMount.position.z = 0.5;
    this.myCarExterior.add(this.hoodCameraMount);

    this.driver = new THREE.Group();
    this.driver.name = "Ace";
    this.myCarInterior.add(this.driver);

    this.driverCameraMount = new THREE.Group();
    this.driverCameraMount.rotation.x = Math.PI * (0.5 + this.defaultTilt);
    this.driverCameraMount.position.z = 1;
    this.driver.add(this.driverCameraMount);

    this.rearCameraMount = new THREE.Group();
    this.rearCameraMount.rotation.x = Math.PI * (0.5 - this.defaultTilt);
    this.rearCameraMount.rotation.y = Math.PI;
    this.rearCameraMount.position.z = 1;
    this.driver.add(this.rearCameraMount);

    this.aerialCameraMount = new THREE.Group();
    this.aerialCameraMount.position.set(0, 0, 60);
    this.myCarExterior.add(this.aerialCameraMount);

    this.dashboard = new Dashboard();
    this.dashboard.object.scale.set(0.0018, 0.0018, 0.001);
    this.driverCameraMount.add(this.dashboard.object);

    this.cameraMountsByName = new Map([
      ["driver", { mount: this.driverCameraMount, drawBrighterGround: false } ],
      ["hood", { mount: this.hoodCameraMount, drawBrighterGround: false } ],
      ["rear", { mount: this.rearCameraMount, drawBrighterGround: false } ],
      ["chase", { mount: this.chaseCameraMount, drawBrighterGround: false } ],
      ["aerial", { mount: this.aerialCameraMount, drawBrighterGround: true } ],
      ["satellite", { mount: this.satelliteCameraMount, drawBrighterGround: true } ],
    ]);

    this.cameraMount = this.driverCameraMount;
    this.drawBrighterGround = false;
    this.cameraMount.add(this.screen.camera);

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
    this.updateButtonTint();
    silhouette.uniforms.tint.value = this.level.tint;
    transparent.uniforms.tint.value = this.level.tint;

    // Build the level scene graph
    this.screen.scene.add(this.level.world);
    this.myCar.remove();
    this.myCar.place(
      this.level.roadPath,
      this.autoSteerApproximation,
      0,
      this.level.laneWidth,
      this.level.numLanes,
      this.drivingSide,
      1,
      this.cruiseSpeed * this.level.cruiseSpeed
    );
    this.setNumOtherCars(this.numOtherCars);

    // The height of the world camera depends on the size of the level
    this.satelliteCameraMount.position.set(0, 0, this.level.worldRadius);
  }

  updateBackgroundColor() {
    let backgroundColor = this.level.tint.clone();
    if (this.drawBrighterGround) {
      backgroundColor.multiplyScalar(this.level.skyLow);
    } else {
      backgroundColor.multiplyScalar(this.level.ground * 2);
    }
    this.screen.backgroundColor = backgroundColor;
  }

  updateButtonTint() {
    switch (this.currentEffect) {
      case "ombré":
        this.buttons.setTint(this.level.tint);
        break;
      case "wireframe":
        this.buttons.setColors(
          new THREE.Color(0.1, 0.15, 0.7),
          new THREE.Color(1, 1, 1),
          new THREE.Color(1, 1, 1)
        );
        break;
      case "technicolor":
        this.buttons.setColors(
          new THREE.Color(0, 0, 0),
          new THREE.Color(0.1, 0.1, 0.1),
          new THREE.Color(1, 1, 1)
        );
        break;
    }
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
      case "npcCars":
        this.setNumOtherCars(parseInt(value) * 8);
        break;
      case "camera":
        this.cameraMount = this.cameraMountsByName.get(value).mount;
        this.drawBrighterGround = this.cameraMountsByName.get(value).drawBrighterGround;
        this.cameraMount.add(this.screen.camera);
        this.updateBackgroundColor();
        break;
      case "effect":
        this.currentEffect = value;
        const isWireframe = this.currentEffect === "wireframe";
        this.sky.visible = !isWireframe;
        this.screen.setWireframe(isWireframe);
        silhouette.uniforms.isWireframe.value = isWireframe;
        transparent.uniforms.isWireframe.value = isWireframe;

        this.screen.setCycleColors(this.currentEffect === "technicolor");
        this.updateButtonTint();
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

    // The dashboard only appears if the camera is in the driver's seat
    if (this.cameraMount == this.driverCameraMount) {
      if (this.dashboard.object.parent == null) this.driverCameraMount.add(this.dashboard.object);
    } else {
      if (this.dashboard.object.parent != null) this.driverCameraMount.remove(this.dashboard.object);
    }

    // Only show the sky if the camera is the driver camera
    if (
      this.cameraMount == this.driverCameraMount ||
      this.cameraMount == this.chaseCameraMount
    ) {
      if (this.level.sky.parent == null) this.screen.scene.add(this.level.sky);
    } else {
      if (this.level.sky.parent != null) this.screen.scene.remove(this.level.sky);
    }

    // Only show my car if the camera is not the driver camera
    if (this.cameraMount == this.driverCameraMount || this.cameraMount == this.rearCameraMount) {
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
      this.otherCars[i].drive(simDelta, this.level.cruiseSpeed, this.npcControlScheme, this.drivingSide);
      this.updateCarExterior(this.otherCars[i], this.otherCarExteriors[i]);
    }

    const myCruiseSpeed = Math.max(this.controlScheme.minCruiseSpeed, this.cruiseSpeed) * this.level.cruiseSpeed;
    this.myCar.drive(simDelta, myCruiseSpeed, this.controlScheme, this.drivingSide);
    this.updateCarExterior(this.myCar, this.myCarExterior);
    this.myCarInterior.rotation.x = this.myCar.pitch * Math.PI;
    this.driver.rotation.y = this.myCar.tilt * Math.PI;
    this.hoodCameraMount.rotation.z = -this.myCar.tilt * Math.PI;
    this.hoodCameraMount.rotation.x = (this.myCar.pitch + 0.5) * Math.PI;

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
          this.level.laneWidth,
          this.level.numLanes,
          this.drivingSide,
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
