"use strict";

class City extends Level {
  build() {
    this.name = "The City";
    this.tint = new THREE.Color(0.3, 0.3, 0.7).multiplyScalar(1.5);
    this.roadPath.scale(2, 2);
    this.ground = 0.05;
    var roadLineColor = 0.6;
    this.skyLow = 0.4;
    var cloudsPath = new THREE.ShapePath();
    var _g = 0;
    while (_g < 100) {
      var i = _g++;
      var pos = new THREE.Vector2(Math.random() - 0.5, Math.random() - 0.5);
      if (pos.length() > 0.5 || pos.length() < 0.1) {
        continue;
      }
      pos.multiplyScalar(8000);
      addPath(cloudsPath, makeCirclePath(pos.x, pos.y, 500));
    }
    var cloudsMesh = makeMesh(cloudsPath, 1, 200,(this.skyLow + this.skyHigh) / 2);
    cloudsMesh.scale.multiplyScalar(2);
    cloudsMesh.position.z = 400;
    this.meshes.push(cloudsMesh);
    var skylinePath1 = new THREE.ShapePath();
    var skylinePath2 = new THREE.ShapePath();
    var skylinePath3 = new THREE.ShapePath();
    var skylinePath4 = new THREE.ShapePath();
    var mag = 4;
    var width = 40 * mag;
    var radius = 1800 * mag;
    var x = -radius;
    while (x < radius) {
      var y = -radius;
      while (y < radius) {
        var pos1 = new THREE.Vector2(x, y);
        if (pos1.length() < radius && distance(this.roadPath.getNearestPoint(pos1), pos1) > 60 * mag) {
          var building = makeRectanglePath(pos1.x + -width / 2, pos1.y + -width / 2, width, width);
          if (Math.random() > 0.8) {
            addPath(skylinePath1, building);
          } else if (Math.random() > 0.5) {
            addPath(skylinePath2, building);
          } else if (Math.random() > 0.25) {
            addPath(skylinePath3, building);
          } else {
            addPath(skylinePath4, building);
          }
        }
        y += 150 * mag;
      }
      x += 150 * mag;
    }
    this.meshes.push(makeMesh(skylinePath2, 60, 1, this.ground));
    this.meshes.push(makeMesh(skylinePath3, 100, 1, this.ground));
    this.meshes.push(makeMesh(skylinePath4, 240, 1, this.ground));
    var signpostsPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, signpostsPath,-16, 0.2, RoadLineStyle.DASH(0.2, 400), 0, 1, 1);
    this.drawRoadLine(this.roadPath, signpostsPath,-12, 0.2, RoadLineStyle.DASH(0.2, 400), 0, 1, 1);
    this.drawRoadLine(this.roadPath, signpostsPath, 12, 0.2, RoadLineStyle.DASH(0.2, 300), 0, 1, 1);
    this.drawRoadLine(this.roadPath, signpostsPath, 16, 0.2, RoadLineStyle.DASH(0.2, 300), 0, 1, 1);
    this.meshes.push(makeMesh(signpostsPath, 10, 0, this.ground));
    var signsPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, signsPath,-14, 6, RoadLineStyle.DASH(0.2, 400), 0, 1, 1);
    this.drawRoadLine(this.roadPath, signsPath, 14, 6, RoadLineStyle.DASH(0.2, 300), 0, 1, 1);
    var signsMesh = makeMesh(signsPath, 4, 0, this.ground);
    signsMesh.position.z = 10;
    this.meshes.push(signsMesh);
    var roadLinesPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, roadLinesPath, 0, 0.1, RoadLineStyle.SOLID, 0, 1, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath, 0.2, 0.1, RoadLineStyle.SOLID, 0, 1, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath,-6, 0.15, RoadLineStyle.DASH(30, 1), 0, 1, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath, 6, 0.15, RoadLineStyle.DASH(30, 1), 0, 1, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath,-3, 0.15, RoadLineStyle.DASH(3, 12), 0, 1, 1);
    this.drawRoadLine(this.roadPath, roadLinesPath, 3, 0.15, RoadLineStyle.DASH(3, 12), 0, 1, 1);
    this.meshes.push(makeMesh(roadLinesPath, 0, 1, roadLineColor));
  }
}
