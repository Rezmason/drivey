"use strict";

/*

Screen is responsible for initializing the three.js renderer, scene, cameras,
as well as establishing an animation loop and handling window resizing events.

*/

class Screen {
  constructor(animate = true) {
    this.time = 0;
    this.updateListeners = [];
    this.element = document.createElement("div");
    document.body.appendChild(this.element);
    this.resolution = 1;
    this.active = true;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, 1, 0.001, 100000);
    this.camera.rotation.order = "YZX";
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.element.appendChild(this.renderer.domElement);
    this.renderer.domElement.id = "renderer";
    this.composer = new THREE.EffectComposer(this.renderer);
    this.renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);
    // this.renderPass.renderToScreen = true;

    this.sobelPass = new THREE.ShaderPass(THREE.SobelOperatorShader);
    this.composer.addPass(this.sobelPass);
    this.sobelPass.enabled = false;

    this.blueprintPass = new THREE.ShaderPass({
      uniforms: {
        tDiffuse: { type: "t", value: null }
      },
      vertexShader: `
        varying vec2 vUV;
        void main() {
          vUV = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform sampler2D tDiffuse;
        varying vec2 vUV;

        void main() {
          vec3 color = vec3(0.1, 0.15, 0.7);
          float line = texture2D(tDiffuse, vUV).r;
          if (line > 0.02) {
            color = clamp(line * 10., 0., 1.) * vec3(0.9, 0.9, 1.);
          }
          gl_FragColor = vec4(color, 1.);
        }
      `
    });
    this.composer.addPass(this.blueprintPass);
    this.blueprintPass.enabled = false;

    this.colorCyclePass = new THREE.ShaderPass({
      uniforms: {
        tDiffuse: { type: "t", value: null },
        time: { type: "f", value: 0 }
      },
      vertexShader: `
        varying vec2 vUV;
        void main() {
          vUV = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform sampler2D tDiffuse;
        uniform float time;
        varying vec2 vUV;

        vec3 hueShift( const in vec3 color, const in float amount ) {
          vec3 p = vec3(0.55735) * dot(vec3(0.55735), color);
          vec3 u = color - p;
          vec3 v = cross(vec3(0.55735), u);
          return u * cos(amount * 6.2832) + v * sin(amount * 6.2832) + p;
        }

        void main() {
          gl_FragColor = vec4(hueShift(texture2D(tDiffuse, vUV).rgb, time), 1.0);
        }
      `
    });
    this.composer.addPass(this.colorCyclePass);
    this.colorCyclePass.enabled = false;

    this.aaPass = new THREE.SMAAPass(1, 1);
    this.aaPass.renderToScreen = true;
    this.composer.addPass(this.aaPass);
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    this.onWindowResize();
    if (animate) {
      this.update();
      this.render();
    }
    // window.addEventListener("focus", this.onWindowFocus.bind(this), false);
    // window.addEventListener("blur", this.onWindowBlur.bind(this), false);
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
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.setResolution(this.resolution);
  }

  setResolution(amount) {
    this.resolution = amount;
    const width  =  Math.ceil(window.innerWidth  * this.resolution);
    const height =  Math.ceil(window.innerHeight * this.resolution);
    this.renderer.setSize(width, height);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";

    this.sobelPass.uniforms.resolution.value.x = width;
    this.sobelPass.uniforms.resolution.value.y = height;

    this.composer.setSize(width, height);
    silhouette.uniforms.resolution.value.set(width, height);
  }

  setWireframe(enabled) {
    this.sobelPass.enabled = enabled;
    this.blueprintPass.enabled = enabled;
  }

  setCycleColors(enabled) {
    this.colorCyclePass.enabled = enabled;
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

    this.time += 0.05;
    silhouette.uniforms.scramble.value = this.time;
    transparent.uniforms.scramble.value = this.time;
    this.colorCyclePass.uniforms.time.value = this.time * 0.02;

    if (this.camera != null) {
      this.renderPass.camera = this.camera;
      this.composer.render();
      // this.renderer.render( this.scene, this.camera );
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
