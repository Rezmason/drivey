"use strict";

class WarpGate extends Level {
  build(meshes, transparentMeshes, skyMeshes) {
    this.name = "The Cyber Tube";
    this.tint = new THREE.Color(1, 0.1, 0.3);
    this.laneWidth = 0;

    for (let i = 0; i < 2; i += 1 / 8) {
      const x = Math.cos(i * Math.PI);
      const y = Math.sin(i * Math.PI);
      const linePath1 = new THREE.ShapePath();
      this.drawRoadLine(this.roadPath, linePath1, x * 4, 0.15, RoadLineStyle.DASH(10, 10 + i * 10, 0), 0, 1);
      const mesh1 = makeMesh(linePath1, 0.1, 0, 0.5);
      mesh1.position.z = y * 4;
      meshes.push(mesh1);

      const linePath2 = new THREE.ShapePath();
      this.drawRoadLine(this.roadPath, linePath2, x * 20, 0.15, RoadLineStyle.DASH(5, 50 + i * 50, 0), 0, 1);
      const mesh2 = makeMesh(linePath2, 0.1, 0, 1);
      mesh2.position.z = y * 20;
      meshes.push(mesh2);
    }
  }
}
