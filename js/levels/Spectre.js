import { Color, ShapePath, Vector2 } from "./../../lib/three/three.module.js";

import Level from "./../Level.js";
import RoadLineStyle from "./../RoadLineStyle.js";
import { distance } from "./../math.js";
import { addPath, makeRectanglePath } from "./../shapes.js";

export default class Spectre extends Level {
  build(meshes, transparentMeshes, skyMeshes) {
    this.name = "Central Systems Matrix";
    this.tint = new Color(1, 0, 1);
    this.skyLow = 0.35;
    this.skyHigh = -1;
    this.laneWidth = 4;
    const postPath = new ShapePath();
    this.drawRoadLine(this.roadPath, postPath, -25, 0.1, RoadLineStyle.DASH(0.1, 27, 0), 0, 1);
    this.drawRoadLine(this.roadPath, postPath, -15, 0.1, RoadLineStyle.DASH(0.1, 23, 0), 0, 1);
    this.drawRoadLine(this.roadPath, postPath, -5, 0.1, RoadLineStyle.DASH(0.1, 20, 0), 0, 1);
    this.drawRoadLine(this.roadPath, postPath, 5, 0.1, RoadLineStyle.DASH(0.1, 20, 0), 0, 1);
    this.drawRoadLine(this.roadPath, postPath, 15, 0.1, RoadLineStyle.DASH(0.1, 23, 0), 0, 1);
    this.drawRoadLine(this.roadPath, postPath, 25, 0.1, RoadLineStyle.DASH(0.1, 27, 0), 0, 1);
    meshes.push(this.makeMesh(postPath, 0.1, 0, 1));

    const dotsPath = new ShapePath();
    const mag = 0.3;
    const width = 30 * mag;
    const radius = 1500 * mag;
    const approximation = this.roadPath.approximate();

    let x = -radius;
    while (x < radius) {
      let y = -radius;
      while (y < radius) {
        const pos = new Vector2(x, y);
        if (pos.length() < radius && distance(approximation.getNearestPoint(pos), pos) > 30 * mag) {
          addPath(dotsPath, makeRectanglePath(pos.x + -width / 2, pos.y + -width / 2, width, width));
        }
        y += 1000 * mag;
      }
      x += 200 * mag;
    }

    meshes.push(this.makeMesh(dotsPath, width * 1.25, 1, 0.5));

    const flagpolesPath = new ShapePath();
    this.drawRoadLine(this.roadPath, flagpolesPath, -12, 0.2, RoadLineStyle.DASH(0.2, 400, 0), 0, 1);
    this.drawRoadLine(this.roadPath, flagpolesPath, 12, 0.2, RoadLineStyle.DASH(0.2, 300, 0), 0, 1);
    meshes.push(this.makeMesh(flagpolesPath, 14, 0, 0.9));

    const flagsPath = new ShapePath();
    this.drawRoadLine(this.roadPath, flagsPath, -15, 6, RoadLineStyle.DASH(0.2, 400, 0), 0, 1);
    this.drawRoadLine(this.roadPath, flagsPath, 15, 6, RoadLineStyle.DASH(0.2, 300, 0), 0, 1);
    const signsMesh = this.makeMesh(flagsPath, 4, 0, 0.9);
    signsMesh.position.z = 10;
    meshes.push(signsMesh);
  }
}
