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

import { Group, Color, CylinderBufferGeometry, Mesh } from "./../lib/three/three.module.js";

import buildLevel from "./buildLevel.js";
import renderLevel from "./renderLevel.js";
import { lerp } from "./math.js";
import { shadeGeometry, silhouette, transparent, blendColors } from "./rendering.js";
import isTouchDevice from "./isTouchDevice.js";
import { Input, controlSchemesByName } from "./input.js";

import Screen from "./Screen.js";
import Buttons from "./Buttons.js";
import Car from "./Car.js";
import buildCar from "./buildCar.js";
import Dashboard from "./Dashboard.js";

const levelURLsByName = new Map([
  ["test", "TestLevel"],
  ["night", "DeepDarkNight"],
  ["tunnel", "Tunnel"],
  ["city", "City"],
  ["industrial", "IndustrialZone"],
  ["warp", "WarpGate"],
  ["spectre", "Spectre"],
  ["beach", "CliffsideBeach"],
  ["nullarbor", "TrainTracks"],
  ["marshland", "Overpass"]
]);

const cruiseSpeeds = new Map([
  [0, 0.0],
  [1, 0.5],
  [2, 1.0],
  [3, 4.0]
]);

const drivingSidesByName = new Map([
  ["left", 1],
  ["right", -1]
]);

const screenResolutions = new Map([
  ["low", 1 / 4],
  ["medium", 1 / 2],
  ["high", 1 / 1]
]);

export default class Drivey {
  constructor() {
    this.cachedLevels = new Map();
    this.currentEffect = "ombré";
    this.npcControlScheme = new Input();
    this.controlScheme = controlSchemesByName.get(isTouchDevice ? "touch" : "arrows");
    this.screen = new Screen();
    this.buttons = new Buttons();
    this.buttons.addListener(this.onButtonClick.bind(this));
    this.theme = new Theme();
    this.theme.install(document.body);
    this.theme.onLoad = this.onThemeLoaded.bind(this);
    this.init();
  }

  async init() {
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

    this.screen.scene.visible = false;

    this.satelliteCameraMount = new Group();
    this.screen.scene.add(this.satelliteCameraMount);

    this.myCar = new Car();
    this.otherCars = [];
    this.otherCarExteriors = [];
    this.numOtherCars = 0;

    this.myCarExterior = new Group();
    this.screen.scene.add(this.myCarExterior);

    this.myCarInterior = new Group();
    this.myCarExterior.add(this.myCarInterior);

    this.sky = this.makeSky();
    this.myCarExterior.add(this.sky);

    this.chaseCameraMount = new Group();
    this.chaseCameraMount.rotation.x = Math.PI * 0.5;
    this.chaseCameraMount.position.y = -5;
    this.chaseCameraMount.position.z = 2;
    this.myCarExterior.add(this.chaseCameraMount);

    this.hoodCameraMount = new Group();
    this.hoodCameraMount.rotation.x = Math.PI * 0.5;
    this.hoodCameraMount.position.y = 3;
    this.hoodCameraMount.position.z = 0.5;
    this.myCarExterior.add(this.hoodCameraMount);

    this.myCarMesh = buildCar();
    this.myCarExterior.add(this.myCarMesh);
    this.myCarMesh.visible = false;

    this.driver = new Group();
    this.driver.name = "Ace";
    this.myCarInterior.add(this.driver);

    this.driverCameraMount = new Group();
    this.driverCameraMount.rotation.x = Math.PI * (0.5 + this.defaultTilt);
    this.driverCameraMount.position.z = 1;
    this.driver.add(this.driverCameraMount);

    this.rearCameraMount = new Group();
    this.rearCameraMount.rotation.x = Math.PI * (0.5 - this.defaultTilt);
    this.rearCameraMount.rotation.y = Math.PI;
    this.rearCameraMount.position.z = 1;
    this.driver.add(this.rearCameraMount);

    this.aerialCameraMount = new Group();
    this.aerialCameraMount.position.set(0, 0, 60);
    this.myCarExterior.add(this.aerialCameraMount);

    this.dashboard = new Dashboard();
    this.dashboard.object.scale.set(0.0018, 0.0018, 0.001);
    this.dashboard.object.position.y = -0.02;
    this.driverCameraMount.add(this.dashboard.object);

    this.cameraMountsByName = new Map([
      ["driver", { mount: this.driverCameraMount, drawBrighterGround: false }],
      ["hood", { mount: this.hoodCameraMount, drawBrighterGround: false }],
      ["rear", { mount: this.rearCameraMount, drawBrighterGround: false }],
      ["chase", { mount: this.chaseCameraMount, drawBrighterGround: false }],
      ["aerial", { mount: this.aerialCameraMount, drawBrighterGround: true }],
      ["satellite", { mount: this.satelliteCameraMount, drawBrighterGround: true }]
    ]);

    this.setCameraMount("driver");

    // Initial level is Industrial Zone
    await this.setLevel("industrial");

    if (localStorage.getItem("theme") != null) {
      this.theme.start();
    }

    this.screen.addUpdateListener(this.update.bind(this));
    this.update();
    this.screen.scene.visible = true;
  }

  async setLevel(levelName) {
    levelName = "marshland"; // TODO: REMOVE test, night, beach, marshland |||| tunnel, city, industrial, warp, spectre, nullarbor

    this.loadingLevelName = levelName;

    if (!this.cachedLevels.has(levelName)) {
      const file = await fetch(`./../levels/${levelURLsByName.get(levelName)}.html`);
      const htmlText = await file.text();
      const parser = new DOMParser();
      const levelDOM = parser.parseFromString(htmlText, "text/html").documentElement;
      if (levelDOM != null) {
        this.cachedLevels.set(levelName, levelDOM);
      }
    }

    if (this.loadingLevelName !== levelName) {
      return;
    }

    if (this.level != null) {
      this.screen.scene.remove(this.level.world);
      this.screen.scene.remove(this.level.sky);
      this.level.dispose();
    }

    const level = renderLevel(buildLevel(this.cachedLevels.get(levelName)));
    this.level = level;
    this.autoSteerApproximation = level.mainRoad.approximate(10000); // Used by car steering logic

    // Retint the sky
    const skyGeometry = this.sky.geometry;
    const positions = skyGeometry.getAttribute("position");
    const numVertices = positions.count;
    const monochromeAttribute = skyGeometry.getAttribute("monochromeValue");
    const monochromeValues = monochromeAttribute.array;
    for (let i = 0; i < numVertices; i++) {
      const y = positions.array[i * 3 + 0];
      monochromeValues[i * 3 + 0] = level.skyLow * (1 - y) + level.skyHigh * y;
      monochromeValues[i * 3 + 1] = 1;
    }

    monochromeAttribute.needsUpdate = true;

    // Retint the background, UI and materials
    this.updateTints();

    // Build the level scene graph
    this.screen.scene.add(level.world);
    this.screen.scene.add(this.level.sky);
    this.myCar.remove();
    this.myCar.place(
      level.mainRoad,
      this.autoSteerApproximation,
      0,
      level.laneWidth,
      level.numLanes,
      this.drivingSide,
      1,
      this.cruiseSpeed * level.cruiseSpeed
    );
    this.setNumOtherCars(this.numOtherCars);

    // The height of the world camera depends on the size of the level
    this.satelliteCameraMount.position.set(0, 0, level.worldRadius);
  }

  updateBackgroundColor() {
    this.screen.backgroundColor = blendColors(this.themeColors, this.drawBrighterGround ? this.level.skyLow : this.level.ground);
  }

  updateButtonTint() {
    switch (this.currentEffect) {
      case "ombré":
        if (this.level != null) {
          const tint = this.level.tint;
          this.buttons.setColors(tint.clone().multiplyScalar(0.0), tint.clone().multiplyScalar(0.4), tint.clone().lerp(new Color(1, 1, 1), 0.25));
        }

        break;
      case "wireframe":
        this.buttons.setColors(new Color(0.1, 0.15, 0.7), new Color(0.8, 0.8, 1), new Color(1, 1, 1));
        break;
      case "technicolor":
        this.buttons.setColors(new Color(0, 0, 0), new Color(0.1, 0.1, 0.1), new Color(1, 1, 1));
        break;
      case "merveilles":
        this.buttons.setColors(this.themeColors.dark, this.themeColors.full, this.themeColors.light);
        break;
    }
  }

  onThemeLoaded() {
    this.buttons.setButton("effect", "merveilles");
    this.updateTints();
  }

  updateTints() {
    let full, light, dark;

    switch (this.currentEffect) {
      case "merveilles":
        const active = this.theme.active;
        if (active.background == null) {
          return;
        }

        const hsl = Array.from(new Set([active.f_high, active.f_med, active.f_low, active.b_high, active.b_med, active.background]))
          .map(hex => new Color(parseInt(hex.substring(1), 16)))
          .map(color => color.getHSL({ color }));
        const minLightness = Math.min(...hsl.map(o => o.l));
        const darkHSL = hsl.find(o => o.l === minLightness);
        const maxLightness = Math.max(...hsl.map(o => o.l));
        const lightHSL = hsl.find(o => o.l === maxLightness);
        const remainingHSL = hsl.filter(o => o != darkHSL && o != lightHSL);
        const maxSaturation = Math.max(...remainingHSL.map(o => o.s));
        const fullHSL = remainingHSL.find(o => o.s === maxSaturation);
        [dark, light, full] = [darkHSL.color, lightHSL.color, fullHSL.color];
        // console.log(dark.getHexString(), full.getHexString(), light.getHexString());
        break;
      default:
        if (this.level == null) {
          return;
        }

        full = this.level.tint;
        dark = new Color(0, 0, 0);
        light = new Color(1, 1, 1);
        break;
    }

    this.themeColors = { dark, full, light };

    silhouette.uniforms.fullTint.value = full;
    silhouette.uniforms.darkTint.value = dark;
    silhouette.uniforms.lightTint.value = light;

    transparent.uniforms.fullTint.value = full;
    transparent.uniforms.darkTint.value = dark;
    transparent.uniforms.lightTint.value = light;

    this.updateBackgroundColor();
    this.updateButtonTint();
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

    const geometry = new CylinderBufferGeometry(1, 1, -100, 100, 1, true, 0, Math.PI);
    shadeGeometry(geometry, 0);
    const mesh = new Mesh(geometry, silhouette);
    mesh.scale.multiplyScalar(100000);
    mesh.rotation.x = Math.PI * 0.5;
    mesh.rotation.z = Math.PI * 0.5;
    return mesh;
  }

  onButtonClick(button, value) {
    switch (button) {
      case "cruise":
        this.cruiseSpeed = cruiseSpeeds.get(parseInt(value));
        break;
      case "controls":
        this.controlScheme = controlSchemesByName.get(value);
        break;
      case "npcCars":
        this.setNumOtherCars(parseInt(value) * 8);
        break;
      case "camera":
        this.setCameraMount(value);
        break;
      case "effect":
        this.currentEffect = value;
        const isWireframe = this.currentEffect === "wireframe";
        this.sky.visible = !isWireframe;
        this.screen.setWireframe(isWireframe);
        silhouette.uniforms.isWireframe.value = isWireframe;
        transparent.uniforms.isWireframe.value = isWireframe;
        this.screen.setCycleColors(this.currentEffect === "technicolor");
        if (this.currentEffect === "merveilles") {
          if (this.theme.active.background == null) {
            this.theme.start();
          }
        } else {
          localStorage.removeItem("theme");
        }

        this.updateTints();
        break;
      case "drivingSide":
        this.drivingSide = drivingSidesByName.get(value);
        this.dashboard.drivingSide = this.drivingSide;
        break;
      case "quality":
        this.screen.setResolution(screenResolutions.get(value));
        break;
      case "music":
        window.open("https://open.spotify.com/user/rezmason/playlist/4ukrs3cTKjTbLoFcxqssXi?si=0y3WoBw1TMyUzK8F9WMbLw", "_blank");
        break;
      case "level":
        this.setLevel(value);
        break;
    }
  }

  setCameraMount(name) {
    const mount = this.cameraMountsByName.get(name);
    this.cameraMount = mount.mount;
    this.drawBrighterGround = mount.drawBrighterGround;
    this.cameraMount.add(this.screen.camera);

    // The dashboard only appears if the camera is in the driver's seat
    this.dashboard.object.visible = this.cameraMount == this.driverCameraMount;

    // Only show the level's sky if the camera is the driver camera
    if (this.level != null) {
      this.level.sky.visible = this.cameraMount != this.aerialCameraMount && this.cameraMount != this.satelliteCameraMount;
    }

    // Only show my car if the camera is not the driver camera
    this.myCarMesh.visible = this.cameraMount != this.driverCameraMount && this.cameraMount != this.rearCameraMount;
    this.myCarMesh.needsUpdate = true;

    if (this.level != null) {
      this.updateBackgroundColor();
    }
  }

  update() {
    this.dashboard.update();
    this.controlScheme.update();

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
      const otherCarExterior = buildCar();
      this.otherCarExteriors.push(otherCarExterior);
    }

    for (let i = 0; i < this.otherCars.length; i++) {
      if (i < this.numOtherCars) {
        if (this.otherCarExteriors[i].parent == null) {
          this.screen.scene.add(this.otherCarExteriors[i]);
        }

        this.otherCars[i].place(
          this.level.mainRoad,
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
