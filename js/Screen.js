"use strict";

/*

Screen is responsible for initializing the three.js renderer, scene, cameras,
as well as establishing an animation loop and handling window resizing events.

*/

class Screen {
  constructor(animate = true) {
    this.renderListeners = [];
    this.element = document.createElement("div");
    document.body.appendChild(this.element);
    this.resolution = 1;
    this.scene = new THREE.Scene();
    this.driverCamera = new THREE.PerspectiveCamera(90, 1, 0.001, 100000);
    this.driverCamera.rotation.order = "YZX";
    this.scene.add(this.driverCamera);
    this.overheadCamera = new THREE.PerspectiveCamera(90, 1, 0.001, 100000);
    this.scene.add(this.overheadCamera);
    this.worldCamera = new THREE.PerspectiveCamera(90, 1, 0.001, 100000);
    this.scene.add(this.worldCamera);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    this.onWindowResize();
    this.element.appendChild(this.renderer.domElement);
    this.renderer.domElement.id = "renderer";
    if (animate) this.animate();
    window.renderer = this.renderer;
    this.camera = this.driverCamera;
    this.frameRate = 1;
    this.startFrameTime = Date.now();
    this.lastFrameTime = this.startFrameTime;
  }

  onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    this.driverCamera.aspect = aspect;
    this.driverCamera.updateProjectionMatrix();
    this.overheadCamera.aspect = aspect;
    this.overheadCamera.updateProjectionMatrix();
    this.worldCamera.aspect = aspect;
    this.worldCamera.updateProjectionMatrix();
    this.setResolution(this.resolution);
  }

  setResolution(amount) {
    this.resolution = amount;
    this.renderer.setSize(window.innerWidth * this.resolution, window.innerHeight * this.resolution);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    for (const listener of this.renderListeners) {
      listener();
    }
    this.render();

    const frameTime = Date.now() - this.startFrameTime;
    const frameDuration = frameTime - this.lastFrameTime;
    this.frameRate = 1000 / frameDuration;
    this.lastFrameTime = frameTime;
  }

  render() {
    if (this.camera != null) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  addRenderListener(func) {
    if (!this.renderListeners.includes(func)) {
      this.renderListeners.push(func);
    }
  }

  get width() {
    return window.innerWidth;
  }

  get height() {
    return window.innerHeight;
  }

  get backgroundColor() {
    return this.scene.background;
  }

  set backgroundColor(color) {
    this.scene.background = color;
    return color;
  }
}
