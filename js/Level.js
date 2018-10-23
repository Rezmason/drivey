"use strict";

class Level {
  constructor() {
    this.tint = new THREE.Color(0.7, 0.7, 0.7);
    this.skyGradient = 0;
    this.skyHigh = 0;
    this.skyLow = 0;
    this.ground = 0;
    this.roadPath = this.makeRoadPath();
    this.cruiseSpeed = (60 * 1000) / 3600; // 50 kph

    const meshes = [];
    const transparentMeshes = [];
    const skyMeshes = [];
    this.build(meshes, transparentMeshes, skyMeshes);
    this.finish(meshes, transparentMeshes, skyMeshes);
  }

  dispose() {
    if (this.world.parent != null) {
      this.world.parent.remove(this.world);
    }
    this.world.children.forEach(child => child.geometry.dispose());
    this.world = null;
  }

  build(meshes, transparentMeshes, skyMeshes) {}

  drawRoadLine(roadPath, shapePath, xPos, width, style, start, end) {
    if (start == end) {
      return shapePath;
    }
    switch (style.type) {
      case RoadLineStyle.type.SOLID:
        {
          const [pointSpacing] = [style.pointSpacing];
          width = Math.abs(width);
          const outsideOffset = xPos - width / 2;
          const insideOffset = xPos + width / 2;
          const outsidePoints = [];
          const insidePoints = [];
          outsidePoints.push(getExtrudedPointAt(roadPath.curve, start, outsideOffset));
          insidePoints.push(getExtrudedPointAt(roadPath.curve, start, insideOffset));
          if (pointSpacing > 0) {
            const psFraction = pointSpacing / roadPath.length;
            let i = Math.ceil(start / psFraction) * psFraction;
            if (i == start) i += psFraction;
            while (i < end) {
              outsidePoints.push(getExtrudedPointAt(roadPath.curve, i, outsideOffset));
              insidePoints.push(getExtrudedPointAt(roadPath.curve, i, insideOffset));
              i += psFraction;
            }
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
        }
        break;
      case RoadLineStyle.type.DASH:
        {
          const [off, on, pointSpacing] = [style.off, style.on, style.pointSpacing];
          let dashStart = start;
          const dashSpan = (on + off) / roadPath.length;
          const dashLength = (dashSpan * on) / (on + off);
          while (dashStart < end) {
            this.drawRoadLine(roadPath, shapePath, xPos, width, RoadLineStyle.SOLID(pointSpacing), dashStart, Math.min(end, dashStart + dashLength));
            dashStart += dashSpan;
          }
        }
        break;
      case RoadLineStyle.type.DOT:
        {
          const [spacing] = [style.spacing];
          let dotStart = start;
          const dotSpan = spacing / roadPath.length;
          while (dotStart < end) {
            const pos = getExtrudedPointAt(roadPath.curve, dotStart, xPos);
            addPath(shapePath, makeCirclePath(pos.x, pos.y, width));
            dotStart += dotSpan;
          }
        }
        break;
    }
    return shapePath;
  }

  finish(meshes, transparentMeshes, skyMeshes) {
    this.world = new THREE.Group();
    meshes.forEach(flattenMesh);
    const combinedMesh = mergeMeshes(meshes);
    combinedMesh.geometry.computeBoundingSphere();
    this.worldRadius = combinedMesh.geometry.boundingSphere.radius;
    if (meshes.length > 0) this.world.add(combinedMesh);
    meshes.forEach(mesh => mesh.geometry.dispose());
    meshes.length = 0;

    transparentMeshes.forEach(flattenMesh);
    if (transparentMeshes.length > 0) this.world.add(mergeMeshes(transparentMeshes));
    transparentMeshes.forEach(mesh => mesh.geometry.dispose());
    transparentMeshes.length = 0;

    skyMeshes.forEach(flattenMesh);
    this.sky = new THREE.Group();
    if (skyMeshes.length > 0) this.sky.add(mergeMeshes(skyMeshes));
    skyMeshes.forEach(mesh => mesh.geometry.dispose());
    skyMeshes.length = 0;
  }

  makeRoadPath() {
    const points = [];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    const n = 16;
    for (let i = 0; i < n; i++) {
      const theta = (i * Math.PI * 2) / n;
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
      point.x *= 80; // 400
      point.y *= 80; // 400
    }
    return new RoadPath(points);
  }
}
