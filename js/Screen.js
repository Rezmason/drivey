/*

Screen is responsible for initializing the three.js renderer, scene, cameras,
as well as establishing an animation loop and handling window resizing events.

*/

import { Scene, PerspectiveCamera, WebGLRenderer } from "./../lib/three/three.module.js";
import { EffectComposer } from "./../lib/three/postprocessing/EffectComposer.js";
import { RenderPass } from "./../lib/three/postprocessing/RenderPass.js";
import { ShaderPass } from "./../lib/three/postprocessing/ShaderPass.js";
import { SMAAPass } from "./../lib/three/postprocessing/SMAAPass.js";
import { SobelOperatorShader } from "./../lib/three/shaders/SobelOperatorShader.js";

import { silhouetteMaterial, transparentMaterial } from "./materials.js";

export default class Screen {
  constructor(animate = true) {
    this.time = 0;
    this.updateListeners = [];
    this.element = document.createElement("div");
    document.body.appendChild(this.element);
    this.resolution = 1;
    this.active = true;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(90, 1, 0.05, 100000);
    this.camera.rotation.order = "YZX";
    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.element.appendChild(this.renderer.domElement);
    this.renderer.domElement.id = "renderer";
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);
    // this.renderPass.renderToScreen = true;

    this.sobelPass = new ShaderPass(SobelOperatorShader);
    this.composer.addPass(this.sobelPass);
    this.sobelPass.enabled = false;

    this.blueprintPass = new ShaderPass({
      uniforms: {
        tDiffuse: { type: "t", value: null },
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

        #define prussianBlue vec3(0.1, 0.15, 0.7)

        uniform sampler2D tDiffuse;
        varying vec2 vUV;

        void main() {
          float edge = texture2D(tDiffuse, vUV).r * 20.;
          if (edge < 0.4) {
            edge = 0.;
          }
          vec3 color = mix(prussianBlue, vec3(0.9, 0.9, 1.0), edge);
          gl_FragColor = vec4(color, 1.);
        }
      `,
    });
    this.composer.addPass(this.blueprintPass);
    this.blueprintPass.enabled = false;

    this.colorCyclePass = new ShaderPass({
      uniforms: {
        tDiffuse: { type: "t", value: null },
        time: { type: "f", value: 0 },
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
      `,
    });
    this.composer.addPass(this.colorCyclePass);
    this.colorCyclePass.enabled = false;

    this.aaPass = new SMAAPass(1, 1);
    this.aaPass.renderToScreen = true;
    this.composer.addPass(this.aaPass);
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    this.onWindowResize();
    if (animate) {
      this.update();
      this.render();
    }

    this.frameRate = 1;
    this.startFrameTime = Date.now();
    this.lastFrameTime = this.startFrameTime;
  }

  onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.setResolution(this.resolution);
  }

  setResolution(amount) {
    this.resolution = amount;
    const width = Math.ceil(window.innerWidth * this.resolution);
    const height = Math.ceil(window.innerHeight * this.resolution);
    this.renderer.setSize(width, height);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";

    this.sobelPass.uniforms.resolution.value.x = width;
    this.sobelPass.uniforms.resolution.value.y = height;

    this.composer.setSize(width, height);
    silhouetteMaterial.uniforms.resolution.value.set(width, height);
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
    silhouetteMaterial.uniforms.scramble.value = this.time;
    transparentMaterial.uniforms.scramble.value = this.time;
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
