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
    var _g = [];
    var _g1 = 0;
    var _g2 = this.points;
    while (_g1 < _g2.length) {
      var point = _g2[_g1];
      ++_g1;
      _g.push(new THREE.Vector2(point.x * x, point.y * y));
    }
    this.points = _g;
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
      var _g = [];
      var _g1 = 0;
      while (_g1 < 1000) {
        var i = _g1++;
        _g.push(this.getPoint(i / 1000));
      }
      this.approximation = _g;
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
