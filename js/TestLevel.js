"use strict";

class TestLevel extends Level {
  build(meshes, transparentMeshes, skyMeshes) {
    this.name = "Test";
    this.tint = new THREE.Color(0.2, 0.8, 1);
    this.skyLow = 0.0;
    this.skyHigh = 0.5;
    this.ground = 0.125;

    const roadStripesPath = new THREE.ShapePath();
    mergeShapePaths(roadStripesPath, this.drawRoadLine(this.roadPath, new THREE.ShapePath(), 3, 0.15, RoadLineStyle.SOLID(5), 0, 1));
    mergeShapePaths(roadStripesPath, this.drawRoadLine(this.roadPath, new THREE.ShapePath(), -3, 0.15, RoadLineStyle.SOLID(5), 0, 1));
    meshes.push(makeMesh(roadStripesPath, 0, 1000, 0.58));

    const dashedLinePath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, dashedLinePath, 0.0625, 0.0625, RoadLineStyle.DASH(30, 30, 5), 0, 1);
    this.drawRoadLine(this.roadPath, dashedLinePath, -0.0625, 0.0625, RoadLineStyle.DASH(30, 30, 5), 0, 1);
    meshes.push(makeMesh(dashedLinePath, 0, 1000, 0.58));

    // croquet hoops
    const hoopTopsPath = new THREE.ShapePath();
    const hoopSidesPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, hoopTopsPath, 0, 10, RoadLineStyle.DASH(1, 20, 0), 0, 1);
    this.drawRoadLine(this.roadPath, hoopSidesPath, -5, 1, RoadLineStyle.DASH(1, 20, 0), 0, 1);
    this.drawRoadLine(this.roadPath, hoopSidesPath, 5, 1, RoadLineStyle.DASH(1, 20, 0), 0, 1);
    const hoopTopsMesh = makeMesh(hoopTopsPath, 1, 20, 0.5);
    hoopTopsMesh.position.z = 5;
    meshes.push(hoopTopsMesh);
    const hoopSidesMesh = makeMesh(hoopSidesPath, 6, 20, 0.5);
    meshes.push(hoopSidesMesh);
  }
}
