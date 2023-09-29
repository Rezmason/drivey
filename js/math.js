import { Vector2, Vector3 } from "./../lib/three/three.module.js";

const [PI, TWO_PI] = [Math.PI, Math.PI * 2];

const sign = (input) => (input < 0 ? -1 : 1);

const fract = (n) => ((n % 1) + 1) % 1;

const getAngle = (v2) => Math.atan2(v2.y, v2.x);

const lerp = (from, to, amount) => from * (1 - amount) + to * amount;

const distanceSquared = (v1, v2) => (v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2;

const distance = (v1, v2) => Math.sqrt(distanceSquared(v1, v2));

const modAngle = (angle) => (angle % TWO_PI) * sign(angle);

const origin = new Vector2();

const unitVector = new Vector2(1, 0);

const intMax = Math.pow(2, 32);

const lcg = (seed) => (seed * 1664525 + 1013904223) % intMax;

const rotate = (v2, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new Vector2(v2.x * cos - v2.y * sin, v2.x * sin + v2.y * cos);
};

const rotateY = (v3, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new Vector3(v3.x * cos - v3.z * sin, v3.y, v3.x * sin + v3.z * cos);
};

const closestPointIndex = (points, toPoint) => {
  // const distancesSquared = points.map(point => distanceSquared(point, toPoint));
  // const minimum = Math.min(...distancesSquared);
  // return distancesSquared.indexOf(minimum);

  let minimum = Infinity;
  let minimumPoint = -1;
  const numPoints = points.length;
  for (let i = 0; i < numPoints; i++) {
    const point = points[i];
    const distSquared = (toPoint.x - point.x) ** 2 + (toPoint.y - point.y) ** 2;
    if (minimum > distSquared) {
      minimum = distSquared;
      minimumPoint = i;
    }
  }
  return minimumPoint;
};

const modDiffAngle = (angle1, angle2) => {
  let diffAngle = modAngle(angle1) - modAngle(angle2);
  if (diffAngle > PI) diffAngle -= TWO_PI;
  if (diffAngle < -PI) diffAngle += TWO_PI;
  return diffAngle;
};

const sanitize = (value, defaultValue) => (isNaN(value) ? defaultValue : value);

export {
  PI,
  TWO_PI,
  sign,
  fract,
  getAngle,
  lerp,
  distanceSquared,
  distance,
  modAngle,
  rotate,
  rotateY,
  closestPointIndex,
  modDiffAngle,
  origin,
  unitVector,
  lcg,
  intMax,
  sanitize,
};
