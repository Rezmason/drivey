"use strict";

class Screen {

  constructor() {
    this.messageOpacities = new Map();
    this.renderListeners = [];
    this.keysHit = new Set();
    this.keysDown = new Set();
    this.wireframe = false;
    this.downscale = 1;
    this.useOrtho = false;
    this.element = document.createElement("div");
    document.body.appendChild(this.element);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, 1, 0.001, 100000);
    this.camera.rotation.order = "YZX";
    this.scene.add(this.camera);
    this.orthoCamera = new THREE.OrthographicCamera(0, 0, 0, 0, 1, 100000000);
    this.scene.add(this.orthoCamera);
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
    var win = window;
    this.animate();
  }

  onWindowResize() {
    var b = window.innerHeight;
    var tmp = window.innerWidth / b;
    this.camera.aspect = tmp;
    this.camera.updateProjectionMatrix();
    var b1 = window.innerHeight;
    var aspect = window.innerWidth / b1;
    this.orthoCamera.left = -100 * aspect / 2;
    this.orthoCamera.right = 100 * aspect / 2;
    this.orthoCamera.top = 50.;
    this.orthoCamera.bottom = -50.;
    this.orthoCamera.updateProjectionMatrix();
    var tmp1 = this.renderer;
    var b2 = this.downscale;
    var tmp2 = window.innerWidth / b2;
    var b3 = this.downscale;
    tmp1.setSize(tmp2, window.innerHeight / b3);
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
  }

  render() {
    this.renderer.render(this.scene, this.useOrtho ? this.orthoCamera : this.camera);
  }

  onKeyDown(event) {
    var code = event.code;
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
        this.messageOpacities.remove(this.messageBox.firstChild);
        this.messageBox.firstChild.remove();
      }
    }

    var message = document.createElement("div");
    message.classList.add("message");
    message.innerHTML = msg.replace(/[\n\r]/g,"<br>");
    setTimeout(1000 * seconds, function() {
      this.messageOpacities.set(message, 1);
    }.bind(this));
    this.messageBox.appendChild(message);
  }

  set wireframe(val) {
    return val;
  }
}
