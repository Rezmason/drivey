"use strict";

const silhouette = new THREE.RawShaderMaterial({
  vertexShader : `
    uniform vec3 tint;
    attribute vec2 monochromeValue;
    attribute vec3 position;
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    varying vec4 vColor;
    void main() {
      float value = monochromeValue.r;
      vec3 color = value < 0.5
        ? mix(vec3(0.0), tint, value * 2.0)
        : mix(tint, vec3(1.0), value * 2.0 - 1.0);
      vColor = vec4(color, monochromeValue.g);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader : `
    precision highp float;
    varying vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `,
  transparent : true
});

const makeSplinePath = function(pts, closed) {
  const spline = new THREE.Path();
  spline.curves.push(
    new THREE.CatmullRomCurve3(pts.map(({x, y}) => new THREE.Vector3(x, y)), closed)
  );
  return spline;
};

const makeCirclePath = function(x, y, radius, aClockwise = true) {
  const circle = new THREE.Path();
  circle.absarc(x, y, radius, 0, Math.PI * 2, aClockwise);
  return circle;
};

const makeRectanglePath = function(x, y, width, height) {
  return makePolygonPath([
    new THREE.Vector2(x, y),
    new THREE.Vector2(x + width, y),
    new THREE.Vector2(x + width, y + height),
    new THREE.Vector2(x, y + height)
  ]);
};

const makePolygonPath = function(points) {
  return new THREE.Shape(points);
};

const expandPath = function(source, thickness, divisions) {
  return new THREE.Path(
    Array(divisions).fill().map((_, i) =>
      getExtrudedPointAt(source, i / divisions, thickness / 2))
  );
};

const expandShapePath = function(shapePath, thickness, divisions) {
  const expansion = new THREE.ShapePath();
  shapePath.subPaths.forEach(subPath =>
    expansion.subPaths.push(expandPath(subPath, thickness, divisions))
  );
  return expansion;
};

const getExtrudedPointAt = function(source, t, offset) {
  while (t < 0) ++t;
  while (t > 1) --t;
  const tangent = source.getTangent(t);
  return source.getPoint(t).add(new THREE.Vector2(-tangent.y * offset, tangent.x * offset));
};

const makeMesh = function(shapePath, amount, curveSegments, value = 0, alpha = 1) {
  const geom = amount == 0
    ? new THREE.ShapeBufferGeometry(shapePath.toShapes(false, false), curveSegments)
    : new THREE.ExtrudeBufferGeometry(shapePath.toShapes(false, false), { amount, curveSegments, bevelEnabled : false });
  const numVertices = geom.getAttribute('position').count;
  const monochromeValues = [];
  for (let i = 0; i < numVertices; i++) {
    monochromeValues.push(value);
    monochromeValues.push(alpha);
  }
  geom.addAttribute("monochromeValue", new THREE.Float32BufferAttribute(monochromeValues, 2));
  return new THREE.Mesh(geom, silhouette);
};

const flattenMesh = function(mesh) {
  const geom = mesh.geometry;
  geom.applyMatrix(mesh.matrix);
  mesh.matrix.identity();
};

const minDistSquaredIndex = function(points, toPoint) {
  let minimum = Infinity;
  let minimumPoint = -1;

  points.forEach((point, i) => {
    const dx = toPoint.x - point.x;
    const dy = toPoint.y - point.y;
    const distSquared = dx * dx + dy * dy;
    if (minimum > distSquared) {
      minimum = distSquared;
      minimumPoint = i;
    }
  });

  return minimumPoint;
};

const diffAngle = function(a, b) {
  a %= Math.PI * 2;
  b %= Math.PI * 2;
  if (a - b > Math.PI) {
    b += Math.PI * 2;
  } else if (b - a > Math.PI) {
    a += Math.PI * 2;
  }
  return b - a;
};

const lerpAngle = function(from, to, amount) {
  return from + diffAngle(from, to) * amount;
};

const mergeShapePaths = function(shapePath, other) {
  other.subPaths.forEach(path => shapePath.subPaths.push(path.clone()))
};

const addPath = function(shapePath, path) {
  shapePath.subPaths.push(path.clone());
};

const distance = function(v1, v2) {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  return Math.sqrt(dx * dx + dy * dy);
};
