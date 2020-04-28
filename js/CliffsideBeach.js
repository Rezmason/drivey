import { Color, ShapePath } from "./../lib/three/three.module.js";

import Level from "./Level.js";
import RoadLineStyle from "./RoadLineStyle.js";

export default class CliffsideBeach extends Level {
  build(meshes, transparentMeshes, skyMeshes) {
    this.tint = new Color(0, 0.7, 0.7);
    this.skyLow = 0.8;
    this.skyHigh = 1.8;
    this.ground = 0.4;
    this.laneWidth = 3;
    this.numLanes = 2;

    const beach = 0.9;
    const tarmac = 0;
    const cliffs = 0.3;
    const waves = 1;

    const beachPath = new ShapePath();
    this.drawRoadLine(this.roadPath, beachPath, 0, 25, RoadLineStyle.SOLID(50), 0, 1);
    this.drawRoadLine(this.roadPath, beachPath, 0, 28, RoadLineStyle.DASH(10, 10, 0), 0, 1);
    this.drawRoadLine(this.roadPath, beachPath, -20, 20, RoadLineStyle.SOLID(50), 0, 1);
    const beachMesh = this.makeMesh(beachPath, 0.1, 1, beach);
    beachMesh.position.z = -0.3;
    meshes.push(beachMesh);

    const wavesPath = new ShapePath();
    this.drawRoadLine(this.roadPath, wavesPath, 25, 10, RoadLineStyle.DASH(10, 100, 0), 0, 1);
    this.drawRoadLine(this.roadPath, wavesPath, 35, 5, RoadLineStyle.DASH(10, 50, 0), 0, 1);
    this.drawRoadLine(this.roadPath, wavesPath, 45, 5, RoadLineStyle.DASH(20, 70, 0), 0, 1);
    const wavesMesh = this.makeMesh(wavesPath, 0, 1, waves);
    wavesMesh.position.z = 0.5;
    meshes.push(wavesMesh);

    const cliffsPath1 = new ShapePath();
    this.drawRoadLine(this.roadPath, cliffsPath1, -25, 20, RoadLineStyle.DASH(6, 6, 0), 0, 1);
    this.drawRoadLine(this.roadPath, cliffsPath1, -27, 20, RoadLineStyle.SOLID(50), 0, 1);
    const cliffsMesh1 = this.makeMesh(cliffsPath1, 10, 3, cliffs + 0.0);
    meshes.push(cliffsMesh1);

    const cliffsPath2 = new ShapePath();
    this.drawRoadLine(this.roadPath, cliffsPath2, -30, 20, RoadLineStyle.DASH(6, 12, 0), 0, 1);
    const cliffsMesh2 = this.makeMesh(cliffsPath2, 18, 3, cliffs + 0.05);
    meshes.push(cliffsMesh2);

    const tarmacPath = new ShapePath();
    this.drawRoadLine(this.roadPath, tarmacPath, 0, 14, RoadLineStyle.SOLID(4), 0, 1);
    const tarmacMesh = this.makeMesh(tarmacPath, 0, 100, tarmac);
    meshes.push(tarmacMesh);

    const roadLinesPath = new ShapePath();
    this.drawRoadLine(this.roadPath, roadLinesPath, 0, 0.1, RoadLineStyle.SOLID(5), 0, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath, 0.2, 0.1, RoadLineStyle.SOLID(5), 0, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath, -6, 0.15, RoadLineStyle.DASH(30, 1, 5), 0, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath, 6, 0.15, RoadLineStyle.DASH(30, 1, 5), 0, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath, -3, 0.15, RoadLineStyle.DASH(3, 12, 0), 0, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath, 3, 0.15, RoadLineStyle.DASH(3, 12, 0), 0, 1);
    const roadLinesMesh = this.makeMesh(roadLinesPath, 0, 1, 1);
    roadLinesMesh.position.z = 0.1;
    meshes.push(roadLinesMesh);
  }
}
