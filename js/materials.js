import { RawShaderMaterial, Vector2, Color } from "./../lib/three/three.module.js";

const blendColors = ({ dark, full, light }, shade) => (shade < 0.5 ? dark.clone().lerp(full, shade * 2.0) : full.clone().lerp(light, shade * 2.0 - 1.0));

const silhouetteMaterial = new RawShaderMaterial({
  uniforms: {
    resolution: { type: "v2", value: new Vector2(1, 1) },
  },
  vertexShader: `
    attribute vec3 idColor;
    attribute vec3 monochromeValue;
    attribute float bulgeDirection;
    attribute vec3 position;
    uniform bool isWireframe;
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    uniform vec2 resolution;
    varying float vShade;
    varying float vOpacity;
    varying vec4 vIdColor;
    void main() {
      float shade = monochromeValue.r;
      float fade = monochromeValue.b;
      vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
      float screenZ = (projectionMatrix * worldPosition).z;

      shade = clamp(shade - fade * screenZ / resolution.y, 0., 1.);
      vShade = shade;
      vOpacity = monochromeValue.g;
      vIdColor = vec4(idColor, 1.0);

      float bulgeAmount = isWireframe ? 1.5 : 0.9;
      worldPosition.y += bulgeDirection * screenZ * bulgeAmount / resolution.y;
      gl_Position = projectionMatrix * worldPosition;
    }
  `,

  fragmentShader: `
    precision mediump float;
    #define PI 3.14159265359

    uniform vec3 fullTint;
    uniform vec3 darkTint;
    uniform vec3 lightTint;
    uniform float scramble;
    uniform float ditherMagnitude;
    uniform bool isWireframe;
    varying float vShade;
    varying float vOpacity;
    varying vec4 vIdColor;

    highp float rand( const in vec2 uv, const in float t ) {
      const highp float a = 12.9898, b = 78.233, c = 43758.5453;
      highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );

      return fract(sin(sn) * c + t);
    }

    void main() {
      if (isWireframe) {
        if (vOpacity < 1.0) {
          discard;
        }

        gl_FragColor = vIdColor;
      } else {
        float shade = clamp(vShade + (rand( gl_FragCoord.xy, scramble ) - 0.5) * ditherMagnitude, 0., 1.);

        vec3 color = shade < 0.5
          ? mix(darkTint, fullTint, shade * 2.0)
          : mix(fullTint, lightTint, shade * 2.0 - 1.0);

        gl_FragColor = vec4(color, vOpacity);
      }
    }
  `,
});
silhouetteMaterial.uniforms.ditherMagnitude = { value: 0.02 };
silhouetteMaterial.uniforms.isWireframe = { value: false };
silhouetteMaterial.uniforms.scramble = { value: 0 };
silhouetteMaterial.uniforms.fullTint = { value: new Color() };
silhouetteMaterial.uniforms.darkTint = { value: new Color(0, 0, 0) };
silhouetteMaterial.uniforms.lightTint = { value: new Color(1, 1, 1) };

const transparentMaterial = new RawShaderMaterial({
  vertexShader: silhouetteMaterial.vertexShader,
  fragmentShader: silhouetteMaterial.fragmentShader,
  transparent: true,
});
transparentMaterial.uniforms.ditherMagnitude = { value: 0.02 };
transparentMaterial.uniforms.isWireframe = { value: false };
transparentMaterial.uniforms.scramble = { value: 0 };
transparentMaterial.uniforms.fullTint = { value: new Color() };
transparentMaterial.uniforms.darkTint = { value: new Color(0, 0, 0) };
transparentMaterial.uniforms.lightTint = { value: new Color(1, 1, 1) };

export { silhouetteMaterial, transparentMaterial, blendColors };
