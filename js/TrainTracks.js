import Level from "./Level.js";
import RoadLineStyle from "./RoadLineStyle.js";
import { addPath, makeCirclePath } from "./shapes.js";

export default class TrainTracks extends Level {
  build(meshes, transparentMeshes, skyMeshes) {
    this.name = "The Indian Pacific";
    this.tint = new THREE.Color(0.8, 0.4, 0.2);
    this.skyHigh = 0.9;
    this.skyLow = 1.0; // 1.0
    this.skyGradient = 0.25;
    this.ground = 0.5;
    this.roadPath.scale(1 / 2, 2);
    this.cruiseSpeed = 10;
    this.laneWidth = 5;

    const railColor = 0.4;
    const sleeperColor = 0.45;
    const ballastColor = 0.6;

    // sky
    const cloudsPath = new THREE.ShapePath();
    for (let i = 0; i < 200; i++) {
      const pos = new THREE.Vector2(Math.random() - 0.5, Math.random() - 0.5);
      if (pos.length() > 0.9 || pos.length() < 0.3) {
        continue;
      }

      pos.multiplyScalar(1000);

      // TODO: more efficient distance test
      // if ((pos - cloudsPath.getNearestPoint(pos)).length() < 200) continue;

      addPath(cloudsPath, makeCirclePath(pos.x, pos.y, 50));
    }

    const cloudsMesh = this.makeMesh(cloudsPath, 1, 200, (this.skyLow + this.skyHigh) / 2);
    cloudsMesh.scale.multiplyScalar(2);
    cloudsMesh.position.z = 80;
    skyMeshes.push(cloudsMesh);

    const rails = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, rails, -2.5 - 0.6, 0.15, RoadLineStyle.SOLID(5), 0, 1);
    this.drawRoadLine(this.roadPath, rails, -2.5 + 0.6, 0.15, RoadLineStyle.SOLID(5), 0, 1);
    this.drawRoadLine(this.roadPath, rails, 2.5 - 0.6, 0.15, RoadLineStyle.SOLID(5), 0, 1);
    this.drawRoadLine(this.roadPath, rails, 2.5 + 0.6, 0.15, RoadLineStyle.SOLID(5), 0, 1);
    meshes.push(this.makeMesh(rails, 0.125, 1, railColor, 1));

    const sleepers = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, sleepers, -2.5, 1.75, RoadLineStyle.DASH(0.5, 1.5, 0), 0, 1);
    this.drawRoadLine(this.roadPath, sleepers, 2.5, 1.75, RoadLineStyle.DASH(0.5, 1.5, 0), 0, 1);
    const sleeperMesh = this.makeMesh(sleepers, 0.12, 1, sleeperColor, 1);
    sleeperMesh.position.z = -0.125;
    meshes.push(sleeperMesh);

    const ballast = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, ballast, -2.5, 2.5, RoadLineStyle.SOLID(5), 0, 1);
    this.drawRoadLine(this.roadPath, ballast, 2.5, 2.5, RoadLineStyle.SOLID(5), 0, 1);
    const ballastMesh = this.makeMesh(ballast, 0, 1, ballastColor, 1);
    ballastMesh.position.z = -0.125;
    meshes.push(ballastMesh);

    const lightFeatures = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, lightFeatures, -20, 8, RoadLineStyle.DOT(200 / 2), 0, 1);
    this.drawRoadLine(this.roadPath, lightFeatures, -12, 8, RoadLineStyle.DOT(1500 / 2), 0, 1);
    this.drawRoadLine(this.roadPath, lightFeatures, 20, 8, RoadLineStyle.DOT(140 / 2), 0, 1);
    this.drawRoadLine(this.roadPath, lightFeatures, 24, 8, RoadLineStyle.DOT(220 / 2), 0, 1);
    const lightFeaturesMesh = this.makeMesh(lightFeatures, 0, 12, this.ground + 0.1, 1);
    lightFeaturesMesh.position.z = -0.1;
    meshes.push(lightFeaturesMesh);

    const darkFeatures = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, darkFeatures, -19, 2, RoadLineStyle.DOT(160 / 2), 0, 1);
    this.drawRoadLine(this.roadPath, darkFeatures, -13, 2, RoadLineStyle.DOT(1200 / 2), 0, 1);
    this.drawRoadLine(this.roadPath, darkFeatures, 15, 2, RoadLineStyle.DOT(110 / 2), 0, 1);
    this.drawRoadLine(this.roadPath, darkFeatures, 19, 2, RoadLineStyle.DOT(180 / 2), 0, 1);
    meshes.push(this.makeMesh(darkFeatures, 0, 12, this.ground - 0.2, 1));
  }
}
