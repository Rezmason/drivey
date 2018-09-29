"use strict";

class Level {
  constructor() {
    this.tint = new THREE.Color(0.7, 0.7, 0.7);
    this.skyGradient = 0;
    this.skyHigh = 0;
    this.skyLow = 0;
    this.ground = 0;
    this.roadPath = this.makeRoadPath();

    const meshes = [];
    const transparentMeshes = [];
    this.build(meshes, transparentMeshes);
    this.finish(meshes, transparentMeshes);
  }

  build(meshes, transparentMeshes) {

  }

  drawRoadLine(roadPath, shapePath, xPos, width, style, start, end, divisions) {
    if (start == end) {
      return shapePath;
    }
    switch(style.type) {
      case RoadLineStyle.type.SOLID:
        width = Math.abs(width);
        const outsideOffset = xPos - width / 2;
        const insideOffset = xPos + width / 2;
        const outsidePoints = [];
        const insidePoints = [];
        const coverage = end - start;
        const diff = 1 / divisions;
        let i = start;
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
        const [off, on] = [style.off, style.on];
        let dashStart = start;
        const dashSpan = (on + off) / roadPath.length;
        const dashLength = dashSpan * on / (on + off);
        while (dashStart < end) {
          this.drawRoadLine(roadPath, shapePath, xPos, width, RoadLineStyle.SOLID(), dashStart, Math.min(end, dashStart + dashLength), divisions);
          dashStart += dashSpan;
        }
        break;
      case RoadLineStyle.type.DOT:
        const [spacing] = [style.spacing];
        let dotStart = start;
        const dotSpan = spacing / roadPath.length;
        while (dotStart < end) {
          const pos = getExtrudedPointAt(roadPath.curve, dotStart, xPos);
          addPath(shapePath, makeCirclePath(pos.x, pos.y, width));
          dotStart += dotSpan;
        }
        break;
    }
    return shapePath;
  }

  finish(meshes, transparentMeshes) {
    this.world = new THREE.Group();
    meshes.forEach(flattenMesh);
    if (meshes.length > 0) this.world.add(mergeMeshes(meshes));
    meshes.forEach(mesh => mesh.geometry.dispose());
    meshes.length = 0;

    transparentMeshes.forEach(flattenMesh);
    if (transparentMeshes.length > 0) this.world.add(mergeMeshes(transparentMeshes));
    transparentMeshes.forEach(mesh => mesh.geometry.dispose());
    transparentMeshes.length = 0;
  }

  makeRoadPath() {
    const points = [];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    const n = 16;
    for (let i = 0; i < n; i++) {
      const theta = i * Math.PI * 2 / n;
      const radius = Math.random() + 5;
      const point = new THREE.Vector2(Math.cos(theta) * -radius, Math.sin(theta) * radius);
      points.push(point);
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
    const centerX = (maxX + minX) * 0.5;
    const centerY = (maxY + minY) * 0.5;
    const width = maxX - minX;
    const height = maxY - minY;
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
