"use strict";

class Spectre extends Level {
  build(meshes, transparentMeshes) {
    this.name = "The Deep Dark Night";
    this.tint = new THREE.Color(1, 0, 1);
    this.roadPath.scale(0.1, 0.1);
    this.skyLow = 0.35;
    this.skyHigh = -1;
    const postPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, postPath,-25, 0.1, RoadLineStyle.DASH(0.1, 27), 0, 1, 1);
    this.drawRoadLine(this.roadPath, postPath,-15, 0.1, RoadLineStyle.DASH(0.1, 23), 0, 1, 1);
    this.drawRoadLine(this.roadPath, postPath, -5, 0.1, RoadLineStyle.DASH(0.1, 20), 0, 1, 1);
    this.drawRoadLine(this.roadPath, postPath,  5, 0.1, RoadLineStyle.DASH(0.1, 20), 0, 1, 1);
    this.drawRoadLine(this.roadPath, postPath, 15, 0.1, RoadLineStyle.DASH(0.1, 23), 0, 1, 1);
    this.drawRoadLine(this.roadPath, postPath, 25, 0.1, RoadLineStyle.DASH(0.1, 27), 0, 1, 1);
    meshes.push(makeMesh(postPath, 0.1, 0, 1));

    const dotsPath = new THREE.ShapePath();
    const mag = 0.3;
    const width = 30 * mag;
    const radius = 1500 * mag;
    let x = -radius;
    while (x < radius) {
      let y = -radius;
      while (y < radius) {
        const pos = new THREE.Vector2(x, y);
        if (pos.length() < radius && distance(this.roadPath.getNearestPoint(pos), pos) > 30 * mag) {
          addPath(dotsPath, makeRectanglePath(pos.x + -width / 2, pos.y + -width / 2, width, width));
        }
        y += 1000 * mag;
      }
      x += 200 * mag;
    }

    meshes.push(makeMesh(dotsPath, width * 1.25, 1, 0.5));

    const signpostsPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, signpostsPath,-12, 0.2, RoadLineStyle.DASH(0.2, 400), 0, 1, 1);
    this.drawRoadLine(this.roadPath, signpostsPath, 12, 0.2, RoadLineStyle.DASH(0.2, 300), 0, 1, 1);
    meshes.push(makeMesh(signpostsPath, 14, 0, 0.9));

    const signsPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, signsPath,-15, 6, RoadLineStyle.DASH(0.2, 400), 0, 1, 1);
    this.drawRoadLine(this.roadPath, signsPath, 15, 6, RoadLineStyle.DASH(0.2, 300), 0, 1, 1);
    const signsMesh = makeMesh(signsPath, 4, 0, 0.9);
    signsMesh.position.z = 10;
    meshes.push(signsMesh);
  }
}
