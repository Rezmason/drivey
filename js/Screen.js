"use strict";

/*

Screen is responsible for initializing the three.js renderer, scene, cameras,
as well as establishing an animation loop and handling window resizing events.

*/

class Screen {
  constructor(animate = true) {
    this.updateListeners = [];
    this.element = document.createElement("div");
    document.body.appendChild(this.element);
    this.resolution = 1;
    this.active = true;
    this.scene = new THREE.Scene();
    this.cameras = [];
    this.driverCamera = new THREE.PerspectiveCamera(90, 1, 0.001, 100000);
    this.driverCamera.rotation.order = "YZX";
    this.cameras.push(this.driverCamera);
    this.chaseCamera = new THREE.PerspectiveCamera(100, 1, 0.001, 100000);
    this.cameras.push(this.chaseCamera);
    this.aerialCamera = new THREE.PerspectiveCamera(90, 1, 0.001, 100000);
    this.cameras.push(this.aerialCamera);
    this.satelliteCamera = new THREE.PerspectiveCamera(90, 1, 0.001, 100000);
    this.cameras.push(this.satelliteCamera);
    for (const camera of this.cameras) {
      this.scene.add(camera);
    }
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.element.appendChild(this.renderer.domElement);
    this.renderer.domElement.id = "renderer";
    // this.composer = new THREE.EffectComposer(this.renderer);
    // this.renderPass = new THREE.RenderPass(this.scene, this.camera);
    // this.composer.addPass(this.renderPass);
    // this.renderPass.renderToScreen = true;
    // this.aaPass = new THREE.SMAAPass(1, 1);
    // this.aaPass.renderToScreen = true;
    // this.composer.addPass(this.aaPass);
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    this.onWindowResize();
    if (animate) {
      this.update();
      this.render();
    }
    // window.addEventListener("focus", this.onWindowFocus.bind(this), false);
    // window.addEventListener("blur", this.onWindowBlur.bind(this), false);
    this.camera = this.driverCamera;
    this.frameRate = 1;
    this.startFrameTime = Date.now();
    this.lastFrameTime = this.startFrameTime;
  }

  onWindowFocus() {
    this.active = true;
  }

  onWindowBlur() {
    this.active = false;
  }

  onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    for (const camera of this.cameras) {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }
    this.setResolution(this.resolution);
  }

  setResolution(amount) {
    this.resolution = amount;
    const width  =  Math.ceil(window.innerWidth  * this.resolution);
    const height =  Math.ceil(window.innerHeight * this.resolution);
    this.renderer.setSize(width, height);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    // this.composer.setSize(width, height);
    silhouette.uniforms.resolution.value.set(width, height);
  }

  update() {
    if (this.active) {
      for (const listener of this.updateListeners) {
        listener();
      }
    }
    setTimeout(this.update.bind(this), 1000 / 60);
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    if (!this.active) return;
    if (this.camera != null) {
      // this.renderPass.camera = this.camera;
      // this.composer.render();
      this.renderer.render( this.scene, this.camera );
    }

    const frameTime = Date.now() - this.startFrameTime;
    const frameDuration = frameTime - this.lastFrameTime;
    this.frameRate = 1000 / frameDuration;
    this.lastFrameTime = frameTime;
  }

  addUpdateListener(func) {
    if (!this.updateListeners.includes(func)) {
      this.updateListeners.push(func);
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
