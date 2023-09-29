import { Path, CatmullRomCurve3, Vector3, Vector2 } from "./../lib/three/three.module.js";
import { fract, modDiffAngle, TWO_PI, origin, unitVector } from "./math.js";

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

const circleCache = new Map();

const makeCirclePath = (x, y, radius, aClockwise = true) => {
  if (!circleCache.has(radius)) {
    const numPoints = Math.max(10, Math.ceil(5 * radius ** 0.5));
    const wedges = Array(numPoints)
      .fill()
      .map((_, index) => {
        return unitVector
          .clone()
          .rotateAround(origin, (index / numPoints) * TWO_PI)
          .multiplyScalar(radius);
      });
    circleCache.set(radius, wedges);
  }
  const pos = new Vector2(x, y);
  const points = circleCache.get(radius).map((point) => point.clone().add(pos));
  if (aClockwise) {
    points.reverse();
  }
  return makePolygonPath(points);
};

const makeSquarePath = (x, y, width) =>
  makePolygonPath([
    new Vector2(x - width / 2, y - width / 2),
    new Vector2(x + width / 2, y - width / 2),
    new Vector2(x + width / 2, y + width / 2),
    new Vector2(x - width / 2, y + width / 2),
  ]);

const makePolygonPath = (points) => new Path(points);

const getOffsetSample = (source, t, offset) => {
  const fractT = fract(t);
  const tangent = source.getTangent(fractT);
  return {
    t,
    pos: new Vector2(-tangent.y, tangent.x).multiplyScalar(offset).add(source.getPoint(fractT)),
    angle: Math.atan2(tangent.y, tangent.x),
  };
};

const maxAllowedDistanceSquared = 50;
const maxAllowedDifferenceAngle = TWO_PI / 360;
const maxIterations = 10;

const getOffsetPoints = (source, offset, start = 0, end = 1, spacing = 0) => {
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

export { makeCirclePath, makePolygonPath, makeSquarePath, makeSplinePath, getOffsetPoints };
