"use strict";

class Screen {

  constructor(animate = true) {
    this.messageOpacities = new Map();
    this.renderListeners = [];
    this.keysHit = new Set();
    this.keysDown = new Set();
    this.wireframe = false;
    this.downscale = 1;
    this.useBirdseye = false;
    this.element = document.createElement("div");
    document.body.appendChild(this.element);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, 1, 0.001, 100000);
    this.camera.rotation.order = "YZX";
    this.scene.add(this.camera);
    this.birdseye = new THREE.PerspectiveCamera(90, 1, 0.001, 100000);
    this.scene.add(this.birdseye);
    this.renderer = new THREE.WebGLRenderer({ antialias : true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    this.onWindowResize();
    this.element.appendChild(this.renderer.domElement);
    this.renderer.domElement.id = "renderer";
    this.messageBox = document.createElement("div");
    this.messageBox.id = "messageBox";
    document.body.appendChild(this.messageBox);
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
    if (animate) this.animate();
    window.renderer = this.renderer;
    this.frameRate = 1;

    this.startFrameTime = Date.now();
    this.lastFrameTime = this.startFrameTime;
  }

  onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.birdseye.aspect = aspect;
    this.birdseye.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth / this.downscale, window.innerHeight / this.downscale);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    for (const listener of this.renderListeners) {
      listener();
    }
    this.render();

    for (const message of this.messageOpacities.keys()) {
      this.messageOpacities.set(message, this.messageOpacities.get(message) * 0.975);
      if (this.messageOpacities.get(message) < 0.005) {
        this.messageOpacities.delete(message);
        message.remove();
      } else {
        message.style.opacity = String(this.messageOpacities[message]);
      }
    }

    this.keysHit.clear();

    const frameTime = Date.now() - this.startFrameTime;
    const frameDuration = frameTime - this.lastFrameTime;
    this.frameRate = 1000 / frameDuration;
    this.lastFrameTime = frameTime;
  }

  render() {
    this.renderer.render(this.scene, this.useBirdseye ? this.birdseye : this.camera);
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

  showMessage(msg, clear, seconds = 2) {
    if (clear) {
      while (this.messageBox.firstChild != null) {
        this.messageOpacities.delete(this.messageBox.firstChild);
        this.messageBox.firstChild.remove();
      }
    }

    const message = document.createElement("div");
    message.classList.add("message");
    message.innerHTML = msg.replace(/[\n\r]/g,"<br>");
    setTimeout(1000 * seconds, function() {
      this.messageOpacities.set(message, 1);
    }.bind(this));
    this.messageBox.appendChild(message);
  }

  get backgroundColor() {
      return this.scene.background;
  }

  set backgroundColor(color) {
      this.scene.background = color;
      return color;
  }
}
