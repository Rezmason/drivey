"use strict";

class Screen {

  constructor(animate = true) {
    this.renderListeners = [];
    this.keysHit = new Set();
    this.keysDown = new Set();
    this.element = document.createElement("div");
    document.body.appendChild(this.element);
    this.scene = new THREE.Scene();
    this.firstPerson = new THREE.PerspectiveCamera(90, 1, 0.001, 100000);
    this.firstPerson.rotation.order = "YZX";
    this.scene.add(this.firstPerson);
    this.birdseye = new THREE.PerspectiveCamera(90, 1, 0.001, 100000);
    this.scene.add(this.birdseye);
    this.renderer = new THREE.WebGLRenderer({ antialias : true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    this.onWindowResize();
    this.element.appendChild(this.renderer.domElement);
    this.renderer.domElement.id = "renderer";
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
    if (animate) this.animate();
    window.renderer = this.renderer;
    this.camera = this.firstPerson;
    this.frameRate = 1;

    this.startFrameTime = Date.now();
    this.lastFrameTime = this.startFrameTime;
  }

  onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    this.firstPerson.aspect = aspect;
    this.firstPerson.updateProjectionMatrix();
    this.birdseye.aspect = aspect;
    this.birdseye.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    for (const listener of this.renderListeners) {
      listener();
    }
    this.render();


    this.keysHit.clear();

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

  onKeyDown(event) {
    const code = event.code;
    // console.log(code);
    if (!this.isKeyDown(code)) {
      this.keysHit.add(code);
    }
    this.keysDown.add(code);
  }

  onKeyUp(event) {
    this.keysDown.delete(event.code);
  }

  isKeyDown(code) {
    return this.keysDown.has(code);
  }

  isKeyHit(code) {
    return this.keysHit.has(code);
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
