import { Path, CatmullRomCurve3, Vector3, Vector2, Shape, ShapePath, BufferGeometry, ExtrudeBufferGeometry } from "./../lib/three/three.module.js";
import { BufferGeometryUtils } from "./../lib/three/utils/BufferGeometryUtils.js";

import { fract, modDiffAngle, PI, TWO_PI } from "./math.js";

const makeSplinePath = (pts, closed) => {
  const path = new Path();
  path.curves.push(
    new CatmullRomCurve3(
      pts.map(({ x, y }) => new Vector3(x, y)),
      closed
    )
  );

  return path;
};

const zero = new Vector2();

const makeCirclePath = (x, y, radius, aClockwise = true) => {
  const numPoints = Math.max(10, Math.ceil(TWO_PI * radius * 0.1));
  const ray = new Vector2(radius, 0);
  const pos = new Vector2(x, y);
  const points = Array(numPoints)
    .fill()
    .map((_, index) => {
      return ray
        .clone()
        .rotateAround(zero, (index / numPoints) * TWO_PI)
        .add(pos);
    });
  if (aClockwise) {
    points.reverse();
  }
  return new Shape(points);
};

const makeRectanglePath = (x, y, width, height) =>
  makePolygonPath([new Vector2(x, y), new Vector2(x + width, y), new Vector2(x + width, y + height), new Vector2(x, y + height)]);

const makePolygonPath = points => new Shape(points);

const expandShapePath = (source, offset) => {
  const expansion = new ShapePath();
  source.subPaths.forEach(subPath => expansion.subPaths.push(new Path(getOffsetPoints(subPath, offset, 0, 1))));
  return expansion;
};

const getOffsetSample = (source, t, offset) => {
  const fractT = fract(t);
  const tangent = source.getTangent(fractT);
  const pos = new Vector2(-tangent.y, tangent.x).multiplyScalar(offset).add(source.getPoint(fractT));
  const angle = Math.atan2(-tangent.y, -tangent.x) + PI;
  return { t, pos, angle };
};

const maxAllowedDistanceSquared = 50;
const maxAllowedDifferenceAngle = TWO_PI / 360;
const maxIterations = 10;

const getOffsetPoints = (source, offset, start, end, spacing = 0) => {
  start = fract(start);
  end = fract(end);
  if (end <= start) {
    end++;
  }

  const startSample = getOffsetSample(source, start, offset);
  const endSample = getOffsetSample(source, end, offset);

  if (spacing > 0) {
    const numPoints = Math.ceil((end - start) / spacing);
    const points = Array(numPoints - 1)
      .fill()
      .map((_, index) => getOffsetSample(source, start + (index + 1) * spacing, offset).pos);
    return [startSample.pos, ...points, endSample.pos];
  }

  const middleSample = getOffsetSample(source, (start + end) / 2, offset);
  startSample.next = middleSample;
  middleSample.next = endSample;
  let numSamples = 3;
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let numAddedSamples = 0;
    let sample = startSample;
    for (let i = 1; i < numSamples; i++) {
      const nextSample = sample.next;
      if (fract(sample.t) !== fract(nextSample.t)) {
        const tooFarApart = sample.pos.distanceToSquared(nextSample.pos) > maxAllowedDistanceSquared;
        const tooPointy = modDiffAngle(sample.angle, nextSample.angle) > maxAllowedDifferenceAngle;
        if (tooFarApart || tooPointy) {
          const halfwaySample = getOffsetSample(source, (sample.t + nextSample.t) / 2, offset);
          halfwaySample.next = nextSample;
          sample.next = halfwaySample;
          numAddedSamples++;
        }
      }
      sample = nextSample;
    }
    numSamples += numAddedSamples;
    if (numAddedSamples === 0) {
      break;
    }
  }

  const points = [];
  let sample = startSample;
  for (let i = 0; i < numSamples; i++) {
    points.push(sample.pos);
    sample = sample.next;
  }

  return points;
};

const makeGeometry = (source, height) =>
  new ExtrudeBufferGeometry(source.toShapes(false, false), {
    depth: Math.max(Math.abs(height), 0.0000001),
    curveSegments: 10,
    bevelEnabled: false
  });

const mergeGeometries = geometries => {
  if (geometries.length == 0) {
    return new BufferGeometry();
  }

  const numIndexed = geometries.filter(geometry => geometry.index != null).length;
  if (numIndexed > 0 && numIndexed < geometries.length) {
    throw new Error("You can't merge indexed and non-indexed buffer geometries.");
  }

  return BufferGeometryUtils.mergeBufferGeometries(geometries);
};

const mergeShapePaths = (source, other) => {
  other.subPaths.forEach(path => source.subPaths.push(path.clone()));
};

const addPath = (source, path) => {
  source.subPaths.push(path.clone());
};

export { addPath, makeGeometry, makeCirclePath, getOffsetPoints, mergeGeometries, makePolygonPath, makeRectanglePath, makeSplinePath, expandShapePath };
