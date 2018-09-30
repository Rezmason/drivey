"use strict";

class DeepDarkNight extends Level {
  build(meshes, transparentMeshes) {
    this.name = "The Deep Dark Night";
    this.tint = new THREE.Color(0.7, 0.7, 0.7);
    // this.tint = new THREE.Color(0, 0.6, 1);
    const roadLineColor = 0.75;
    this.roadPath.scale(2, 2);
    const linePath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, linePath, 0, 0.2, RoadLineStyle.DASH(4, 10, 0), 0, 1);
    this.drawRoadLine(this.roadPath, linePath,-3, 0.15, RoadLineStyle.DASH(30, 2, 5), 0, 1);
    this.drawRoadLine(this.roadPath, linePath, 3, 0.15, RoadLineStyle.DASH(30, 2, 5), 0, 1);
    meshes.push(makeMesh(linePath, 0, 1, roadLineColor));
    const postPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, postPath,-6, 0.2, RoadLineStyle.DASH(0.2, 50, 0), 0, 1);
    this.drawRoadLine(this.roadPath, postPath, 6, 0.2, RoadLineStyle.DASH(0.2, 50, 0), 0, 1);
    meshes.push(makeMesh(postPath, 0.6, 1, roadLineColor));
  }
}
