"use strict";

class Level {
  constructor() {
    this.tint = new THREE.Color(0.7, 0.7, 0.7);
    this.skyGradient = 0;
    this.skyHigh = 0;
    this.skyLow = 0;
    this.ground = 0;
    this.meshes = [];
    this.roadPath = this.makeRoadPath();
    this.build();
    this.finish();
  }

  build() {

  }

  drawRoadLine(roadPath, shapePath, xPos, width, style, start, end, divisions) {
    if (start == end) {
      return shapePath;
    }
    switch(style.type) {
      case RoadLineStyle.type.SOLID:
        width = Math.abs(width);
        var outsideOffset = xPos - width / 2;
        var insideOffset = xPos + width / 2;
        var outsidePoints = [];
        var insidePoints = [];
        var coverage = end - start;
        var coveredDivisions = Math.ceil(divisions * coverage / roadPath.length) | 0;
        var diff = 1 / divisions;
        var i = start;
        while (i < end) {
          outsidePoints.push(getExtrudedPointAt(roadPath.curve, i, outsideOffset));
          insidePoints.push(getExtrudedPointAt(roadPath.curve, i, insideOffset));
          i += diff;
        }
        outsidePoints.push(getExtrudedPointAt(roadPath.curve, end, outsideOffset));
        insidePoints.push(getExtrudedPointAt(roadPath.curve, end, insideOffset));
        outsidePoints.reverse();
        if (start == 0 && end == 1) {
          addPath(shapePath, makePolygonPath(outsidePoints));
          addPath(shapePath, makePolygonPath(insidePoints));
        } else {
          addPath(shapePath, makePolygonPath(outsidePoints.concat(insidePoints)));
        }
        break;
      case RoadLineStyle.type.DASH:
        var [off, on] = [style.off, style.on];
        var dashStart = start;
        var dashSpan = (on + off) / roadPath.length;
        var dashLength = dashSpan * on / (on + off);
        while (dashStart < end) {
          this.drawRoadLine(roadPath, shapePath, xPos, width, RoadLineStyle.SOLID(), dashStart, Math.min(end, dashStart + dashLength), divisions);
          dashStart += dashSpan;
        }
        break;
      case RoadLineStyle.type.DOT:
        var [spacing] = [style.spacing];
        var dotStart = start;
        var dotSpan = spacing / roadPath.length;
        while (dotStart < end) {
          var pos = getExtrudedPointAt(roadPath.curve, dotStart, xPos);
          addPath(shapePath, makeCirclePath(pos.x, pos.y, width));
          dotStart += dotSpan;
        }
        break;
    }
    return shapePath;
  }

  finish() {
    this.world = new THREE.Group();
    for (const mesh of this.meshes) {
      mesh.matrix.identity();
      // console.log(mesh.matrix);
      this.world.add(mesh);
    }
  }

  makeRoadPath() {
    var points = [];
    var minX = Infinity;
    var maxX = -Infinity;
    var minY = Infinity;
    var maxY = -Infinity;

    var n = 16;
    for (let i = 0; i < n; i++) {
      var theta = i * Math.PI * 2 / n;
      var radius = Math.random() + 5;
      var point = new THREE.Vector2(Math.cos(theta) * -radius, Math.sin(theta) * radius);
      points.push(point);
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
    var centerX = (maxX + minX) * 0.5;
    var centerY = (maxY + minY) * 0.5;
    var width = maxX - minX;
    var height = maxY - minY;
    for (const point of points) {
      point.x -= centerX;
      point.y -= centerY;
      point.y *= width / height;
      point.x *= 400;
      point.y *= 400;
    }
    return new RoadPath(points);
  }
};
