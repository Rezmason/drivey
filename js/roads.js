import { Vector2 } from "./../lib/three/three.module.js";
import { fract, lerp, closestPointIndex, lcg, intMax, TWO_PI } from "./math.js";
import { makeSplinePath } from "./paths.js";

class Road {
  constructor(points) {
    this.points = points;
    this.curve = makeSplinePath(points, true);
  }

  clone() {
    return new Road(this.points);
  }

  scale(x, y) {
    this.points = this.points.map((point) => new Vector2(point.x * x, point.y * y));
    this.curve = makeSplinePath(this.points, true);
  }

  getPoint(t) {
    const pos = this.curve.getPoint(fract(t));
    return new Vector2(pos.x, pos.y);
  }

  getTangent(t) {
    const EPSILON = 0.00001;
    const point = this.getPoint(t + EPSILON).sub(this.getPoint(t - EPSILON));
    return point.normalize();
  }

  getNormal(t) {
    const normal = this.getTangent(t);
    return new Vector2(-normal.y, normal.x);
  }

  approximate(resolution = 1000) {
    return new Approximation(this, resolution);
  }

  get length() {
    return this.curve.getLength();
  }
}

class Approximation {
  constructor(road, resolution) {
    this.road = road;
    this.resolution = resolution;
    this.points = [];
    for (let i = 0; i < resolution; i++) {
      this.points.push(road.getPoint(i / resolution));
    }
  }

  getNearest(to) {
    return closestPointIndex(this.points, to) / this.resolution;
  }

  getNearestPoint(to) {
    return this.road.getPoint(this.getNearest(to));
  }
}

const numControlPoints = 16;

const roadWedges = Array(numControlPoints)
  .fill()
  .map((_, index) => (index / numControlPoints) * TWO_PI)
  .map((theta) => new Vector2(-Math.cos(theta), Math.sin(theta)));

const makeRandomControlPoints = (seed, windiness, scale) => {
  const randomValues = [];
  let value = lcg(isNaN(seed) ? Date.now() : seed);
  for (let i = 0; i < numControlPoints; i++) {
    randomValues.push(value / intMax);
    value = lcg(value);
  }
  const controlPoints = roadWedges.map((point, i) => point.clone().multiplyScalar(lerp(1, randomValues[i], windiness)));

  const minX = Math.min(...controlPoints.map(({ x }) => x));
  const maxX = Math.max(...controlPoints.map(({ x }) => x));
  const minY = Math.min(...controlPoints.map(({ y }) => y));
  const maxY = Math.max(...controlPoints.map(({ y }) => y));

  const center = new Vector2(maxX + minX, maxY + minY).multiplyScalar(0.5);
  const aspect = new Vector2(1, (maxY - minY) / (maxX - minX));

  controlPoints.forEach((point) => {
    point.sub(center);
    point.multiply(aspect);
    point.multiply(scale);
  });

  return controlPoints;
};

const makeControlPoints = (splinePoints) =>
  splinePoints.length < 6
    ? null
    : Array(splinePoints.length / 2)
        .fill()
        .map((_, index) => new Vector2(splinePoints[index * 2], splinePoints[index * 2 + 1]));

const makeRoad = ({ windiness, scale, seed, splinePoints, length }, basis) => {
  if (basis != null) {
    const road = basis.clone();
    road.scale(scale.x, scale.y);
    return road;
  }

  const controlPoints = makeControlPoints(splinePoints) ?? makeRandomControlPoints(seed, windiness, scale);
  const road = new Road(controlPoints);
  const scalarMultiply = length / road.length;
  road.scale(scalarMultiply, scalarMultiply);
  return road;
};

export { Road, makeRoad };
