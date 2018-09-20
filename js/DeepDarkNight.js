"use strict";

class DeepDarkNight extends Level {
  build() {
    this.name = "The Deep Dark Night";
    this.tint = new THREE.Color(0.7, 0.7, 0.7);
    var roadLineColor = 0.75;
    this.roadPath.scale(2, 2);
    var nightLinePath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, nightLinePath, 0, 0.2, RoadLineStyle.DASH(4, 10), 0, 1, 1);
    this.drawRoadLine(this.roadPath, nightLinePath,-3, 0.15, RoadLineStyle.DASH(30, 2), 0, 1, 10);
    this.drawRoadLine(this.roadPath, nightLinePath, 3, 0.15, RoadLineStyle.DASH(30, 2), 0, 1, 10);
    this.meshes.push(makeMesh(nightLinePath, 0, 1, roadLineColor));
    var nightPostPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, nightPostPath,-6, 0.2, RoadLineStyle.DASH(0.2, 50), 0, 1, 1);
    this.drawRoadLine(this.roadPath, nightPostPath, 6, 0.2, RoadLineStyle.DASH(0.2, 50), 0, 1, 1);
    this.meshes.push(makeMesh(nightPostPath, 0.6, 1, roadLineColor));
  }
}
