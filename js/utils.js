"use strict";

const sign = input => input < 0 ? -1 : 1;

const mod = (a, b) => (a % b + b) % b

const getAngle = v2 => Math.atan2(v2.y, v2.x);

const rotate = (v2, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new THREE.Vector2(
    v2.x * cos - v2.y * sin,
    v2.x * sin + v2.y * cos
  );
}

const rotateY = (v3, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new THREE.Vector3(
    v3.x * cos - v3.z * sin,
    v3.y,
    v3.x * sin + v3.z * cos
  );
}

const rotateZ = (v3, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new THREE.Vector3(
    v3.x * cos - v3.y * sin,
    v3.x * sin + v3.y * cos,
    v3.z
  );
}

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
    precision lowp float;
    varying vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `
});

const transparent = new THREE.RawShaderMaterial({
  vertexShader : silhouette.vertexShader,
  fragmentShader : silhouette.fragmentShader,
  transparent: true
});

const makeSplinePath = (pts, closed) => {
  const spline = new THREE.Path();
  spline.curves.push(
    new THREE.CatmullRomCurve3(pts.map(({x, y}) => new THREE.Vector3(x, y)), closed)
  );
  return spline;
};

const makeCirclePath = (x, y, radius, aClockwise = true) => {
  const circle = new THREE.Path();
  circle.absarc(x, y, radius, 0, Math.PI * 2, aClockwise);
  return circle;
};

const makeRectanglePath = (x, y, width, height) => {
  return makePolygonPath([
    new THREE.Vector2(x, y),
    new THREE.Vector2(x + width, y),
    new THREE.Vector2(x + width, y + height),
    new THREE.Vector2(x, y + height)
  ]);
};

const makePolygonPath = (points) => {
  return new THREE.Shape(points);
};

const expandPath = (source, thickness, divisions) => {
  return new THREE.Path(
    Array(divisions).fill().map((_, i) =>
      getExtrudedPointAt(source, i / divisions, thickness / 2))
  );
};

const expandShapePath = (shapePath, thickness, divisions) => {
  const expansion = new THREE.ShapePath();
  shapePath.subPaths.forEach(subPath =>
    expansion.subPaths.push(expandPath(subPath, thickness, divisions))
  );
  return expansion;
};

const getExtrudedPointAt = (source, t, offset) => {
  t = mod(t, 1);
  // These are Vector3, but we need a Vector2
  const tangent = source.getTangent(t);
  const pos = source.getPoint(t);

  return new THREE.Vector2(
    pos.x - tangent.y * offset,
    pos.y + tangent.x * offset
  );
};

const makeMesh = (shapePath, depth, curveSegments, value = 0, alpha = 1) => {
  const geom = new THREE.ExtrudeBufferGeometry(
    shapePath.toShapes(false, false),
    { depth, curveSegments, bevelEnabled : false }
  );
  shadeGeometry(geom, value, alpha);
  return new THREE.Mesh(geom, alpha == 1 ? silhouette : transparent);
};

const shadeGeometry = (geometry, value, alpha = 1) => {
  const numVertices = geometry.getAttribute('position').count;
  const monochromeValues = [];
  for (let i = 0; i < numVertices; i++) {
    monochromeValues.push(value);
    monochromeValues.push(alpha);
  }
  geometry.addAttribute("monochromeValue", new THREE.Float32BufferAttribute(monochromeValues, 2));
  return geometry;
}

const flattenMesh = (mesh) => {
  const geom = mesh.geometry;
  mesh.updateMatrix();
  geom.applyMatrix(mesh.matrix);
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.set(1, 1, 1);
  mesh.updateMatrix();
};

const mergeMeshes = (meshes) => {
  const geom = mergeGeometries(meshes.map(mesh => mesh.geometry));
  return new THREE.Mesh(geom, meshes[0].material);
};

const mergeGeometries = (geometries) => {
  const numIndexed = geometries.filter(geometry => geometry.index != null).length;
  if (numIndexed > 0 && numIndexed < geometries.length) {
    throw new Error("You can't merge indexed and non-indexed buffer geometries.");
  }
  return THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
};

const minDistSquaredIndex = (points, toPoint) => {
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

const diffAngle = (a, b) => {
  a %= Math.PI * 2;
  b %= Math.PI * 2;
  if (a - b > Math.PI) {
    b += Math.PI * 2;
  } else if (b - a > Math.PI) {
    a += Math.PI * 2;
  }
  return b - a;
};

const lerp = (from, to, amount) => {
  return from * (1 - amount) + to * amount;
}

const lerpAngle = (from, to, amount) => {
  return from + diffAngle(from, to) * amount;
};

const mergeShapePaths = (shapePath, other) => {
  other.subPaths.forEach(path => shapePath.subPaths.push(path.clone()))
};

const addPath = (shapePath, path) => {
  shapePath.subPaths.push(path.clone());
};

const distance = (v1, v2) => {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  return Math.sqrt(dx * dx + dy * dy);
};
