import { Vector2 } from "./../lib/three/three.module.js";

import { fract, closestPointIndex } from "./math.js";
import { makeSplinePath } from "./paths.js";

export default class Road {
  constructor(points) {
    this.points = points;
    this.curve = makeSplinePath(points, true);
  }

  clone() {
    return new Road(this.points);
  }

  scale(x, y) {
    this.points = this.points.map(point => new Vector2(point.x * x, point.y * y));
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
