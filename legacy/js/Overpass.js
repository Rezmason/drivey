"use strict";

class Overpass extends Level {
  build(meshes, transparentMeshes, skyMeshes) {
    this.tint = new THREE.Color(0.5, 0.8, 0.2);
    this.ground = 0.1;
    this.skyLow = 0.8;
    this.skyHigh = 0;
    this.roadPath.scale(0.5, 0.5);
    this.cruiseSpeed = 4;
    this.laneWidth = 4;

    const tarmacPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, tarmacPath, 0, 9, RoadLineStyle.SOLID(2), 0, 1);
    const tarmacMesh = makeMesh(tarmacPath, 0.5, 100, 0.05);
    tarmacMesh.position.z = -0.5;
    meshes.push(tarmacMesh);

    const shoulderPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, shoulderPath, -5.5, 2, RoadLineStyle.SOLID(2), 0, 1);
    this.drawRoadLine(this.roadPath, shoulderPath, 5.5, 2, RoadLineStyle.SOLID(2), 0, 1);
    const shoulderMesh = makeMesh(shoulderPath, 0.5, 100, 0.25);
    shoulderMesh.position.z = -0.55;
    meshes.push(shoulderMesh);

    const underneathPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, underneathPath, 0, 5.25, RoadLineStyle.SOLID(10), 0, 1);
    const underneathMesh = makeMesh(underneathPath, 2, 1, 0.07);
    underneathMesh.position.z = -2.5;
    meshes.push(underneathMesh);

    const roadLinesPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, roadLinesPath, -4, 0.1, RoadLineStyle.DASH(30, 1, 2), 0, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath,  4, 0.1, RoadLineStyle.DASH(30, 1, 2), 0, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath,  0, 0.15, RoadLineStyle.DASH(5, 5, 0), 0, 1);
    const roadLinesMesh = makeMesh(roadLinesPath, 0, 1, 0.7);
    roadLinesMesh.position.z = 0.1;
    meshes.push(roadLinesMesh);

    const railsPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, railsPath, -6.0, 0.175, RoadLineStyle.SOLID(3), 0, 1);
    this.drawRoadLine(this.roadPath, railsPath,  6.0, 0.175, RoadLineStyle.SOLID(3), 0, 1);
    const railsMesh = makeMesh(railsPath, 0.1, 1, 0.3);
    railsMesh.position.z = 0.25;
    meshes.push(railsMesh);

    const railsTopPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, railsTopPath, -6.0, 0.1, RoadLineStyle.SOLID(3), 0, 1);
    this.drawRoadLine(this.roadPath, railsTopPath,  6.0, 0.1, RoadLineStyle.SOLID(3), 0, 1);
    const railsTopMesh = makeMesh(railsTopPath, 0.125, 1, 0.35);
    railsTopMesh.position.z = 0.25;
    meshes.push(railsTopMesh);

    const railStakesPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, railStakesPath, -6.0, 0.15, RoadLineStyle.DASH(0.2, 2, 0), 0, 1);
    this.drawRoadLine(this.roadPath, railStakesPath,  6.0, 0.15, RoadLineStyle.DASH(0.2, 2, 0), 0, 1);
    const railStakesMesh = makeMesh(railStakesPath, 0.55, 1, 0.3);
    railStakesMesh.position.z = -0.25;
    meshes.push(railStakesMesh);

    const supportsPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, supportsPath, 0, 5, RoadLineStyle.DOT(50), 0, 1);
    const supportsMesh = makeMesh(supportsPath, 2, 100, 0.07);
    supportsMesh.position.z = -3.5;
    meshes.push(supportsMesh);

    const columnsPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, columnsPath, 0, 5, RoadLineStyle.DOT(50), 0, 1);
    const columnsMesh = makeMesh(columnsPath, 2, 100, 0.07);
    columnsMesh.position.z = -5.5;
    meshes.push(columnsMesh);

    const river = this.makeRoadPath(0.3);
    river.scale(6, 6);

    const riverPath = new THREE.ShapePath();
    this.drawRoadLine(river, riverPath, 0, 70, RoadLineStyle.SOLID(10), 0, 1);
    const riverMesh = makeMesh(riverPath, 0, 100, 0.5, 1, -1);
    riverMesh.position.z = -5.5;
    meshes.push(riverMesh);
  }
}
