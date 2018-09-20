"use strict";

class TestLevel extends Level {
  build() {
    const DIVISIONS = 2000; // ?!
    this.name = "Test";
    const roadStripesPath = new THREE.ShapePath();
    mergeShapePaths(roadStripesPath, this.drawRoadLine(this.roadPath, new THREE.ShapePath(), 3, 0.15, RoadLineStyle.SOLID(), 0, 1.0, DIVISIONS));
    mergeShapePaths(roadStripesPath, this.drawRoadLine(this.roadPath, new THREE.ShapePath(),-3, 0.15, RoadLineStyle.SOLID(), 0, 1.0, DIVISIONS));
    this.meshes.push(makeMesh(roadStripesPath, 0, 1000, 0.58));
    const dashedLinePath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, dashedLinePath, 0.0625, 0.0625, RoadLineStyle.DASH(30, 30), 0, 1, DIVISIONS);
    this.drawRoadLine(this.roadPath, dashedLinePath,-0.0625, 0.0625, RoadLineStyle.DASH(30, 30), 0, 1, DIVISIONS);
    this.meshes.push(makeMesh(dashedLinePath, 0, 1000, 0.58));
    const hoopTopsPath = new THREE.ShapePath();
    const hoopSidesPath = new THREE.ShapePath();
    const hoopStyle = RoadLineStyle.DASH(1, 200);
    this.drawRoadLine(this.roadPath, hoopTopsPath, 0, 8, hoopStyle, 0, 1, DIVISIONS);
    this.drawRoadLine(this.roadPath, hoopSidesPath,-4, 1, hoopStyle, 0, 1, DIVISIONS);
    this.drawRoadLine(this.roadPath, hoopSidesPath, 4, 1, hoopStyle, 0, 1, DIVISIONS);
    const hoopTopsMesh = makeMesh(hoopTopsPath, 1, 20);
    hoopTopsMesh.position.z = 4;
    this.meshes.push(hoopTopsMesh);
    const hoopSidesMesh = makeMesh(hoopSidesPath, 5, 20);
    this.meshes.push(hoopSidesMesh);
  }
}
