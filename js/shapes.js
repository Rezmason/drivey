import { mod } from "./math.js";

const makeSplinePath = (pts, closed) => {
  const spline = new THREE.Path();
  spline.curves.push(
    new THREE.CatmullRomCurve3(
      pts.map(({ x, y }) => new THREE.Vector3(x, y)),
      closed
    )
  );

  return spline;
};

const makeCirclePath = (x, y, radius, aClockwise = true) => {
  const circle = new THREE.Path();
  circle.absarc(x, y, radius, 0, Math.PI * 2, aClockwise);
  return circle;
};

const makeRectanglePath = (x, y, width, height) => makePolygonPath([new THREE.Vector2(x, y), new THREE.Vector2(x + width, y), new THREE.Vector2(x + width, y + height), new THREE.Vector2(x, y + height)]);

const makePolygonPath = points => new THREE.Shape(points);

const expandPath = (source, thickness, divisions) =>
  new THREE.Path(
    Array(divisions)
      .fill()
      .map((_, i) => getExtrudedPointAt(source, i / divisions, thickness / 2))
  );

const expandShapePath = (shapePath, thickness, divisions) => {
  const expansion = new THREE.ShapePath();
  shapePath.subPaths.forEach(subPath => expansion.subPaths.push(expandPath(subPath, thickness, divisions)));
  return expansion;
};

const getExtrudedPointAt = (source, t, offset) => {
  t = mod(t, 1);
  // These are Vector3, but we need a Vector2
  const tangent = source.getTangent(t);
  const pos = source.getPoint(t);
  return new THREE.Vector2(pos.x - tangent.y * offset, pos.y + tangent.x * offset);
};

const makeGeometry = (shapePath, depth, curveSegments) =>
  new THREE.ExtrudeBufferGeometry(shapePath.toShapes(false, false), {
    depth: Math.max(Math.abs(depth), 0.0000001),
    curveSegments,
    bevelEnabled: false
  });

const mergeGeometries = geometries => {
  if (geometries.length == 0) {
    throw new Error("You can't merge zero geometries.");
  }

  const numIndexed = geometries.filter(geometry => geometry.index != null).length;
  if (numIndexed > 0 && numIndexed < geometries.length) {
    throw new Error("You can't merge indexed and non-indexed buffer geometries.");
  }

  return THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
};

const mergeShapePaths = (shapePath, other) => {
  other.subPaths.forEach(path => shapePath.subPaths.push(path.clone()));
};

const addPath = (shapePath, path) => {
  shapePath.subPaths.push(path.clone());
};

export { addPath, makeGeometry, makeCirclePath, getExtrudedPointAt, mergeGeometries, makePolygonPath, makeRectanglePath, makeSplinePath, expandShapePath };
