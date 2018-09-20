"use strict";

class Tunnel extends Level {
  build() {
    this.name = "The Tunnel";
    this.tint = new THREE.Color(0.2, 0.7, 0.1);
    const tarmac = 0.1;
    const whiteLinesColor = 0.8;
    const lightColor = 1;
    const wallColor = 0;
    const tarmacPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, tarmacPath, 0, 7, RoadLineStyle.SOLID(), 0, 1, 1);
    const tarmacMesh = makeMesh(tarmacPath, 0, 1000, tarmac);
    this.meshes.push(tarmacMesh);
    const roadLinesPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, roadLinesPath,-3.5, 0.2, RoadLineStyle.DASH(30, 2), 0, 1, 5);
    this.drawRoadLine(this.roadPath, roadLinesPath, 3.5, 0.2, RoadLineStyle.DASH(30, 2), 0, 1, 5);
    this.drawRoadLine(this.roadPath, roadLinesPath,-0.15, 0.15, RoadLineStyle.DASH(4, 8), 0, 1, 1);
    const roadLinesMesh = makeMesh(roadLinesPath, 0, 1000, whiteLinesColor);
    roadLinesMesh.position.z = 0.01;
    this.meshes.push(roadLinesMesh);
    const crossingPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, crossingPath, 0, 1, RoadLineStyle.DASH(2, 200), 0, 1, 1);
    const crossingMesh = makeMesh(crossingPath, 0, 1000, tarmac);
    crossingMesh.position.z = 0.001;
    this.meshes.push(crossingMesh);
    const crossingLinesPath = new THREE.ShapePath();
    for (let i = 0; i < 6; i++) {
      const width = 6.0 / 6 * 0.5;
      this.drawRoadLine(this.roadPath, crossingLinesPath, i * 2 * width - 3 + width, width, RoadLineStyle.DASH(2, 200), 0, 1, 1);
    }
    const crossingLinesMesh = makeMesh(crossingLinesPath, 0, 1000, whiteLinesColor);
    crossingLinesMesh.position.z = 0.01;
    this.meshes.push(crossingLinesMesh);
    const lightsPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, lightsPath,-4, 0.1, RoadLineStyle.DASH(4, 6), 0, 1, 1);
    this.drawRoadLine(this.roadPath, lightsPath, 4, 0.1, RoadLineStyle.DASH(4, 6), 0, 1, 1);
    const lightsMesh = makeMesh(lightsPath, 0.1, 1000, lightColor);
    this.meshes.push(lightsMesh);
    lightsMesh.position.z = 4;
    const wallPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, wallPath,-5, 0.4, RoadLineStyle.SOLID(), 0, 1, 800);
    this.drawRoadLine(this.roadPath, wallPath, 5, 0.4, RoadLineStyle.SOLID(), 0, 1, 800);
    const wallMesh = makeMesh(wallPath, 4, 1000, wallColor);
    this.meshes.push(wallMesh);
  }
}
