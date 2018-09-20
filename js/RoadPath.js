"use strict";

class RoadPath {
  constructor(points) {
    this.points = points;
    this.curve = makeSplinePath(points, true);
  }

  clone() {
    return new RoadPath(this.points);
  }

  scale(x, y) {
    this.points = this.points.map(point => new THREE.Vector2(point.x * x, point.y * y));
    this.approximation = null;
    this.curve = makeSplinePath(this.points, true);
  }

  getPoint(t) {
    var point = this.curve.getPoint(t % 1);
    return new THREE.Vector2(point.x, point.y);
  }

  getNormal(t) {
    const EPSILON = 0.00001;
    var point = this.getPoint(t + EPSILON).sub(this.getPoint(t + 1 - EPSILON));
    return point.normalize();
  }

  getTangent(t) {
    var normal = this.getNormal(t);
    return new THREE.Vector2(-normal.y, normal.x);
  }

  getNearest(to) {
    if (this.approximation == null) {
      this.approximation = [];
      for (let i = 0; i < 1000; i++) {
        this.approximation.push(this.getPoint(i / 1000));
      }
    }
    return minDistSquaredIndex(this.approximation, to) / 1000;
  }

  getNearestPoint(to) {
    return this.getPoint(this.getNearest(to));
  }

  get length() {
    return this.curve.getLength();
  }
};
