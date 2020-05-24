import { RawShaderMaterial, Vector2, Color, Float32BufferAttribute, Mesh, BufferGeometry, ExtrudeBufferGeometry } from "./../lib/three/three.module.js";
import { BufferGeometryUtils } from "./../lib/three/utils/BufferGeometryUtils.js";

const blendColors = ({ dark, full, light }, shade) => (shade < 0.5 ? dark.clone().lerp(full, shade * 2.0) : full.clone().lerp(light, shade * 2.0 - 1.0));

const silhouette = new RawShaderMaterial({
  uniforms: {
    resolution: { type: "v2", value: new Vector2(1, 1) }
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
  `
});
silhouette.uniforms.ditherMagnitude = { value: 0.02 };
silhouette.uniforms.isWireframe = { value: false };
silhouette.uniforms.scramble = { value: 0 };
silhouette.uniforms.fullTint = { value: new Color() };
silhouette.uniforms.darkTint = { value: new Color(0, 0, 0) };
silhouette.uniforms.lightTint = { value: new Color(1, 1, 1) };

const transparent = new RawShaderMaterial({
  vertexShader: silhouette.vertexShader,
  fragmentShader: silhouette.fragmentShader,
  transparent: true
});
transparent.uniforms.ditherMagnitude = { value: 0.02 };
transparent.uniforms.isWireframe = { value: false };
transparent.uniforms.scramble = { value: 0 };
transparent.uniforms.fullTint = { value: new Color() };
transparent.uniforms.darkTint = { value: new Color(0, 0, 0) };
transparent.uniforms.lightTint = { value: new Color(1, 1, 1) };

const bulgeGeometry = geometry => {
  const positions = geometry.getAttribute("position");
  const numVertices = positions.count;
  const bulgeDirections = [];
  for (let i = 0; i < numVertices; i++) {
    const z = positions.array[i * 3 + 2];
    bulgeDirections.push(z <= 0 ? -1 : 1);
  }

  geometry.setAttribute("bulgeDirection", new Float32BufferAttribute(bulgeDirections, 1));
  return geometry;
};

const shadeGeometry = (geometry, shade, alpha = 1, fade = 0) => {
  const numVertices = geometry.getAttribute("position").count;
  const monochromeValues = [];
  for (let i = 0; i < numVertices; i++) {
    monochromeValues.push(shade);
    monochromeValues.push(alpha);
    monochromeValues.push(fade);
  }

  geometry.setAttribute("monochromeValue", new Float32BufferAttribute(monochromeValues, 3));
  return geometry;
};

let [idRed, idGreen, idBlue] = [0, 0, 0];

const idGeometry = geometry => {
  const numVertices = geometry.getAttribute("position").count;
  idRed = (idRed + 0x23) % 0xff;
  idGreen = (idGreen + 0x67) % 0xff;
  idBlue = (idBlue + 0xac) % 0xff;
  const idValues = [];
  for (let i = 0; i < numVertices; i++) {
    idValues.push(idRed / 0xff);
    idValues.push(idGreen / 0xff);
    idValues.push(idBlue / 0xff);
  }

  geometry.setAttribute("idColor", new Float32BufferAttribute(idValues, 3));
  return geometry;
};

const makeGeometry = (source, height, shade = 0, alpha = 1, fade = 0) => {
  const geom = new ExtrudeBufferGeometry(source.toShapes(false, false), {
    depth: Math.max(Math.abs(height), 0.0000001),
    curveSegments: 10,
    bevelEnabled: false
  });
  shadeGeometry(geom, shade, alpha, fade);
  idGeometry(geom);
  bulgeGeometry(geom);
  return geom;
};

const mergeGeometries = (geometries, dispose = true) => {
  if (geometries.length == 0) {
    return new BufferGeometry();
  }

  const numIndexed = geometries.filter(geometry => geometry.index != null).length;
  if (numIndexed > 0 && numIndexed < geometries.length) {
    throw new Error("You can't merge indexed and non-indexed buffer geometries.");
  }

  const merged = BufferGeometryUtils.mergeBufferGeometries(geometries);
  if (dispose) geometries.forEach(geom => geom.dispose());
  return merged;
};

const makeMesh = (geom, isTransparent = false) => new Mesh(geom, isTransparent ? transparent : silhouette);

export { shadeGeometry, bulgeGeometry, idGeometry, silhouette, transparent, blendColors, makeGeometry, mergeGeometries, makeMesh };
