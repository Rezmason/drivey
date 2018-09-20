"use strict";

class Tunnel extends Level {
  build() {
    this.name = "The Tunnel";
    this.tint = new THREE.Color(0.2, 0.7, 0.1);
    var tarmac = 0.1;
    var whiteLinesColor = 0.8;
    var lightColor = 1;
    var wallColor = 0;
    var tarmacPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, tarmacPath, 0, 7, RoadLineStyle.SOLID(), 0, 1, 1);
    var tarmacMesh = makeMesh(tarmacPath, 0, 1000, tarmac);
    this.meshes.push(tarmacMesh);
    var roadLinesPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, roadLinesPath,-3.5, 0.2, RoadLineStyle.DASH(30, 2), 0, 1, 5);
    this.drawRoadLine(this.roadPath, roadLinesPath, 3.5, 0.2, RoadLineStyle.DASH(30, 2), 0, 1, 5);
    this.drawRoadLine(this.roadPath, roadLinesPath,-0.15, 0.15, RoadLineStyle.DASH(4, 8), 0, 1, 1);
    var roadLinesMesh = makeMesh(roadLinesPath, 0, 1000, whiteLinesColor);
    roadLinesMesh.position.z = 0.01;
    this.meshes.push(roadLinesMesh);
    var crossingPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, crossingPath, 0, 1, RoadLineStyle.DASH(2, 200), 0, 1, 1);
    var crossingMesh = makeMesh(crossingPath, 0, 1000, tarmac);
    crossingMesh.position.z = 0.001;
    this.meshes.push(crossingMesh);
    var crossingLinesPath = new THREE.ShapePath();
    for (let i = 0; i < 6; i++) {
      const width = 6.0 / 6 * 0.5;
      this.drawRoadLine(this.roadPath, crossingLinesPath, i * 2 * width - 3 + width, width, RoadLineStyle.DASH(2, 200), 0, 1, 1);
    }
    var crossingLinesMesh = makeMesh(crossingLinesPath, 0, 1000, whiteLinesColor);
    crossingLinesMesh.position.z = 0.01;
    this.meshes.push(crossingLinesMesh);
    var lightsPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, lightsPath,-4, 0.1, RoadLineStyle.DASH(4, 6), 0, 1, 1);
    this.drawRoadLine(this.roadPath, lightsPath, 4, 0.1, RoadLineStyle.DASH(4, 6), 0, 1, 1);
    var lightsMesh = makeMesh(lightsPath, 0.1, 1000, lightColor);
    this.meshes.push(lightsMesh);
    lightsMesh.position.z = 4;
    var wallPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, wallPath,-5, 0.4, RoadLineStyle.SOLID(), 0, 1, 800);
    this.drawRoadLine(this.roadPath, wallPath, 5, 0.4, RoadLineStyle.SOLID(), 0, 1, 800);
    var wallMesh = makeMesh(wallPath, 4, 1000, wallColor);
    this.meshes.push(wallMesh);
  }
}
