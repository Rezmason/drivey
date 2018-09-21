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
    this.carT = 0;
    this.screen = new Screen();
    this.init(levelName);
    this.screen.addRenderListener(this.update.bind(this));
    this.update();
  }

  init(levelName) {
    this.level = new (this.levelsByName.get(levelName) || DeepDarkNight)();
    this.dashboard = new Dashboard();
    this.sky = this.makeSky();
    this.playerCar = new THREE.Group();
    this.playerCar.rotation.order = "ZYX";
    this.player = new THREE.Group();
    this.playerCar.add(this.player);
    this.playerCar.add(this.sky);
    this.player.add(this.screen.camera);
    this.player.add(this.dashboard.object);
    this.screen.backgroundColor = this.level.tint.clone().multiplyScalar(this.level.ground * 2);
    this.screen.scene.add(this.playerCar);
    this.screen.birdseye.position.set(0, 0, 1000000);
    this.screen.birdseye.up = new THREE.Vector3(0, 0, 1);
    this.screen.birdseye.zoom = 0.02;
    this.screen.birdseye.updateProjectionMatrix();
    this.screen.scene.add(this.level.world);
    silhouette.uniforms.tint = { value : this.level.tint};
    this.dashboard.object.scale.set(0.0018, 0.0018, 0.001);
  }

  makeSky() {
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
    mesh.rotation.z = Math.PI * 0.5;
    return mesh;
  }

  makeHeadlightPath() {
    const pts = [new THREE.Vector2(0, 0), new THREE.Vector2(-6, 13), new THREE.Vector2(4, 15), new THREE.Vector2(0, 0)];
    return makeSplinePath(pts, true);
  }

  update() {
    const step = 0.0001;
    let simSpeed = 1.0;
    if (this.screen.isKeyDown("ShiftLeft") || this.screen.isKeyDown("ShiftRight")) {
      simSpeed = 0.125;
    } else if (this.screen.isKeyDown("ControlLeft") || this.screen.isKeyDown("ControlRight")) {
      simSpeed = 4;
    }
    const carSpeed = 6000;
    const roadMidOffset = -1.5;
    const carHeight = 1;
    this.carT = (this.carT + step * simSpeed * carSpeed / this.level.roadPath.length) % 1;
    const carPosition = getExtrudedPointAt(this.level.roadPath.curve, this.carT, roadMidOffset);
    const nextPosition = getExtrudedPointAt(this.level.roadPath.curve,(this.carT + 0.001) % 1, roadMidOffset);
    const angle = Math.atan2(nextPosition.y - carPosition.y, nextPosition.x - carPosition.x) - Math.PI / 2;
    const tilt = diffAngle(angle, this.playerCar.rotation.z);
    this.dashboard.wheelRotation = lerpAngle(this.dashboard.wheelRotation, Math.PI - tilt * 4, 0.1 * simSpeed);
    this.playerCar.position.set(carPosition.x, carPosition.y, carHeight);
    this.playerCar.rotation.set(Math.PI * 0.5, 0, lerpAngle(this.playerCar.rotation.z, angle, 0.05 * simSpeed));
    this.player.rotation.x = Math.PI * -0.0625;
    this.screen.camera.rotation.z = lerpAngle(this.screen.camera.rotation.z, tilt, 0.1 * simSpeed);
    this.dashboard.needle1Rotation = this.dashboard.needle1Rotation + step * simSpeed * 100;
    this.dashboard.needle2Rotation = this.dashboard.needle2Rotation + step * simSpeed * 100;
    if (this.screen.isKeyHit("KeyC")) {
      if (this.dashboard.object.parent != null) {
        this.player.remove(this.dashboard.object);
      } else {
        this.player.add(this.dashboard.object);
      }
    }
    if (this.screen.isKeyHit("Digit0")) {
      this.screen.useBirdseye = !this.screen.useBirdseye;
    }
    if (this.screen.isKeyHit("Digit2")) {
      this.screen.wireframe = !this.screen.wireframe;
    }
    if (this.screen.isKeyDown("Digit4")) {
      this.screen.camera.rotation.y = Math.PI;
    } else {
      this.screen.camera.rotation.y = 0;
    }
  }
}
