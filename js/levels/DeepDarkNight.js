import { Color, ShapePath } from "./../../lib/three/three.module.js";

import Level from "./../Level.js";
import RoadLineStyle from "./../RoadLineStyle.js";

export default class DeepDarkNight extends Level {
  build(meshes, transparentMeshes, skyMeshes) {
    this.name = "The Deep Dark Night";
    this.tint = new Color(0.7, 0.7, 0.7);
    // this.tint = new Color(0, 0.6, 1);
    this.laneWidth = 3;
    const roadLineColor = 0.75;
    this.roadPath.scale(2, 2);
    const linePath = new ShapePath();
    this.drawRoadLine(this.roadPath, linePath, 0, 0.2, RoadLineStyle.DASH(4, 10, 0), 0, 1);
    this.drawRoadLine(this.roadPath, linePath, -3, 0.15, RoadLineStyle.DASH(30, 2, 5), 0, 1);
    this.drawRoadLine(this.roadPath, linePath, 3, 0.15, RoadLineStyle.DASH(30, 2, 5), 0, 1);
    meshes.push(this.makeMesh(linePath, 0, 1, roadLineColor, 1, 5));
    const postPath = new ShapePath();
    this.drawRoadLine(this.roadPath, postPath, -6, 0.2, RoadLineStyle.DASH(0.2, 50, 0), 0, 1);
    this.drawRoadLine(this.roadPath, postPath, 6, 0.2, RoadLineStyle.DASH(0.2, 50, 0), 0, 1);
    meshes.push(this.makeMesh(postPath, 0.6, 1, roadLineColor, 1, 5));
  }
}
