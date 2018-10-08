"use strict";

class City extends Level {
  build(meshes, transparentMeshes) {
    this.name = "The City";
    this.tint = new THREE.Color(0.33, 0.33, 1); // * 1.5

    this.roadPath.scale(2, 2);
    this.ground = 0.05;
    const roadLineColor = 0.6;
    this.skyLow = 0.4;
    this.skyHigh = 0;

    // sky
    const cloudsPath = new THREE.ShapePath();
    for (let i = 0; i < 100; i++) {
      const pos = new THREE.Vector2(Math.random() - 0.5, Math.random() - 0.5);
      if (pos.length() > 0.9 || pos.length() < 0.3) { // 0.5, 0.1
        continue;
      }
      pos.multiplyScalar(1000);

      // TODO: more efficient distance test
      // if ((pos - cloudsPath.getNearestPoint(pos)).length() < 200) continue;

      addPath(cloudsPath, makeCirclePath(pos.x, pos.y, 50));
    }
    const cloudsMesh = makeMesh(cloudsPath, 1, 200, (this.skyLow + this.skyHigh) / 2);
    cloudsMesh.scale.multiplyScalar(2);
    cloudsMesh.position.z = 80;
    meshes.push(cloudsMesh);

    // do bg
    const shorterBuildings = new THREE.ShapePath();
    const shortBuildings = new THREE.ShapePath();
    const tallBuildings = new THREE.ShapePath();
    const tallerBuildings = new THREE.ShapePath();
    const mag = 0.6;
    const width = 40 * mag;
    const radius = 1800 * mag;
    const approximation = this.roadPath.approximate();
    let x = -radius;
    while (x < radius) {
      let y = -radius;
      while (y < radius) {
        const pos1 = new THREE.Vector2(x, y);
        if (pos1.length() < radius && distance(approximation.getNearestPoint(pos1), pos1) > 60 * mag) {
          const building = makeRectanglePath(pos1.x + -width / 2, pos1.y + -width / 2, width, width);
          if (Math.random() > 0.8) {
            addPath(shorterBuildings, building);
          } else if (Math.random() > 0.5) {
            addPath(shortBuildings, building);
          } else if (Math.random() > 0.25) {
            addPath(tallBuildings, building);
          } else {
            addPath(tallerBuildings, building);
          }
        }
        y += 150 * mag;
      }
      x += 150 * mag;
    }

    // meshes.push(makeMesh(shorterBuildings, 15 * mag, 1, this.ground));
    meshes.push(makeMesh(shortBuildings, 30 * mag, 1, this.ground));
    meshes.push(makeMesh(tallBuildings, 50 * mag, 1, this.ground));
    meshes.push(makeMesh(tallerBuildings, 120 * mag, 1, this.ground));

    const signpostsPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, signpostsPath, -16, 0.2, RoadLineStyle.DASH(0.2, 400, 0), 0, 1);
    this.drawRoadLine(this.roadPath, signpostsPath, -12, 0.2, RoadLineStyle.DASH(0.2, 400, 0), 0, 1);
    this.drawRoadLine(this.roadPath, signpostsPath, 12, 0.2, RoadLineStyle.DASH(0.2, 300, 0), 0, 1);
    this.drawRoadLine(this.roadPath, signpostsPath, 16, 0.2, RoadLineStyle.DASH(0.2, 300, 0), 0, 1);
    meshes.push(makeMesh(signpostsPath, 10, 0, this.ground));

    const signsPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, signsPath, -14, 6, RoadLineStyle.DASH(0.2, 400, 0), 0, 1);
    this.drawRoadLine(this.roadPath, signsPath, 14, 6, RoadLineStyle.DASH(0.2, 300, 0), 0, 1);
    const signsMesh = makeMesh(signsPath, 4, 0, this.ground);
    signsMesh.position.z = 10;
    meshes.push(signsMesh);

    const roadLinesPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, roadLinesPath, 0, 0.1, RoadLineStyle.SOLID(10), 0, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath, 0.2, 0.1, RoadLineStyle.SOLID(10), 0, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath, -6, 0.15, RoadLineStyle.DASH(30, 1, 10), 0, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath, 6, 0.15, RoadLineStyle.DASH(30, 1, 10), 0, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath, -3, 0.15, RoadLineStyle.DASH(3, 12, 0), 0, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath, 3, 0.15, RoadLineStyle.DASH(3, 12, 0), 0, 1);
    meshes.push(makeMesh(roadLinesPath, 0, 1, roadLineColor));
  }
}
