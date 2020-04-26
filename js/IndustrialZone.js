"use strict";

class IndustrialZone extends Level {
  build(meshes, transparentMeshes, skyMeshes) {
    this.name = "The Industrial Zone";
    this.tint = new THREE.Color(1, 0.5, 0.1);
    this.skyHigh = -0.15;
    this.skyLow = 0.7; // 1.0
    this.skyGradient = 0.25;
    this.ground = 0.05;
    const whiteLinesColor = 0.6;
    const lightColor = 1.0;
    const brightColor = 0.2;

    this.laneWidth = 3.5;

    // far off buildings
    // very tall things
    const smokestack1Path = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, smokestack1Path, 300, 0.5, RoadLineStyle.DOT(250), 0, 1);
    this.drawRoadLine(this.roadPath, smokestack1Path, 320, 0.75, RoadLineStyle.DOT(250), 0, 1);
    const smokestack1Mesh = makeMesh(smokestack1Path, 2, 10, lightColor);
    smokestack1Mesh.position.z = 60;
    meshes.push(smokestack1Mesh);

    const smokestack2Path = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, smokestack2Path, 300, 0.5, RoadLineStyle.DOT(250), 0, 1);
    this.drawRoadLine(this.roadPath, smokestack2Path, 320, 0.75, RoadLineStyle.DOT(250), 0, 1);
    this.drawRoadLine(this.roadPath, smokestack2Path, 400, 8, RoadLineStyle.DOT(240), 0, 1);
    this.drawRoadLine(this.roadPath, smokestack2Path, 500, 8, RoadLineStyle.DOT(240), 0, 1);
    const smokestack2Mesh = makeMesh(smokestack2Path, 60, 10, this.ground);
    meshes.push(smokestack2Mesh);

    // medium-height buildings
    const buildingsPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, buildingsPath, -80, 20, RoadLineStyle.DASH(40, 60, 0), 0, 1);
    this.drawRoadLine(this.roadPath, buildingsPath, 180, 50, RoadLineStyle.DASH(40, 30, 0), 0, 1);
    this.drawRoadLine(this.roadPath, buildingsPath, 300, 50, RoadLineStyle.DASH(20, 20, 0), 0, 1);

    this.drawRoadLine(this.roadPath, buildingsPath, -100, 8, RoadLineStyle.DOT(200), 0, 1);
    this.drawRoadLine(this.roadPath, buildingsPath, -60, 8, RoadLineStyle.DOT(1500), 0, 1);
    this.drawRoadLine(this.roadPath, buildingsPath, 100, 8, RoadLineStyle.DOT(140), 0, 1);
    this.drawRoadLine(this.roadPath, buildingsPath, 120, 8, RoadLineStyle.DOT(220), 0, 1);
    const buildingsMesh = makeMesh(buildingsPath, 12, 10, this.ground);
    meshes.push(buildingsMesh);

    // do white lines
    const whiteLinesPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, whiteLinesPath, -3.5, 0.15, RoadLineStyle.DASH(60, 2, 5), 0, 1);
    this.drawRoadLine(this.roadPath, whiteLinesPath, 3.5, 0.15, RoadLineStyle.DASH(60, 2, 5), 0, 1);
    this.drawRoadLine(this.roadPath, whiteLinesPath, -0.15, 0.125, RoadLineStyle.DASH(4, 6, 0), 0, 1);
    this.drawRoadLine(this.roadPath, whiteLinesPath, 0.125, 0.125, RoadLineStyle.SOLID(5), 0, 1);
    const whiteLinesMesh = makeMesh(whiteLinesPath, 0, 10, whiteLinesColor, 1, 2.25);
    meshes.push(whiteLinesMesh);

    // do crossings
    const crossingPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, crossingPath, 0, 1, RoadLineStyle.DASH(2, 200, 0), 0, 1);
    const crossingMesh = makeMesh(crossingPath, 0, 10, this.ground);
    crossingMesh.position.z = 0.001;
    meshes.push(crossingMesh);
    const crossingLinesPath = new THREE.ShapePath();
    for (let i = 0; i < 6; i++) {
      const width = (6.0 / 6) * 0.5;
      this.drawRoadLine(this.roadPath, crossingLinesPath, i * 2 * width - 3 + width, width, RoadLineStyle.DASH(2, 200, 0), 0, 1);
    }
    const crossingLinesMesh = makeMesh(crossingLinesPath, 0, 10, whiteLinesColor, 1, 2.25);
    crossingLinesMesh.position.z = 0.01;
    meshes.push(crossingLinesMesh);

    // street lights
    const streetLightSpacing = 80;
    const streetLightThickness = 0.2;
    const streetLightHeight = 15;
    const streetLightPolePath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, streetLightPolePath, -8, streetLightThickness, RoadLineStyle.DASH(streetLightThickness, streetLightSpacing, 0), 0, 1);
    const streetLightPoleMesh = makeMesh(streetLightPolePath, streetLightHeight + streetLightThickness, 10, this.ground);
    meshes.push(streetLightPoleMesh);
    const streetLightArmPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, streetLightArmPath, -5.6, 5, RoadLineStyle.DASH(streetLightThickness, streetLightSpacing, 0), 0, 1);
    const streetLightArmMesh = makeMesh(streetLightArmPath, streetLightThickness, 10, this.ground);
    streetLightArmMesh.position.z = streetLightHeight + streetLightThickness;
    meshes.push(streetLightArmMesh);
    const streetLightBulbPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, streetLightBulbPath, -4, 2, RoadLineStyle.DASH(streetLightThickness, streetLightSpacing, 0), 0, 1);
    const streetLightBulbMesh = makeMesh(streetLightBulbPath, streetLightThickness * 2, 10, lightColor);
    streetLightBulbMesh.position.z = streetLightHeight - streetLightThickness;
    meshes.push(streetLightBulbMesh);

    // Light circles beneath streetlamps
    if (false) {
      const streetLightShinePath = new THREE.ShapePath();
      this.drawRoadLine(this.roadPath, streetLightShinePath, -4, 8, RoadLineStyle.DOT(streetLightSpacing, 0), 0, 1);
      const streetLightShineMesh = makeMesh(streetLightShinePath, 0, 30, brightColor);
      streetLightShineMesh.position.z = -0.01;
      meshes.push(streetLightShineMesh);
      const streetLightShadowPath = new THREE.ShapePath();
      this.drawRoadLine(this.roadPath, streetLightShadowPath, -13, 10, RoadLineStyle.DASH(streetLightThickness, streetLightSpacing, 0), 0, 1);
      meshes.push(makeMesh(streetLightShadowPath, 0, 10, this.ground));
    }

    // overpasses
    const overpassDepth = 10;
    const overpassSpacing = 300;
    const highwayAbove = this.roadPath.clone();
    highwayAbove.scale(1, 1.5);
    const overpassSpanPath = new THREE.ShapePath();
    this.drawRoadLine(highwayAbove, overpassSpanPath, 0, 500, RoadLineStyle.DASH(overpassDepth, overpassSpacing, 0), 0, 1);
    const overpassSpanMesh = makeMesh(overpassSpanPath, 3, 2, this.ground);
    overpassSpanMesh.position.z = 12;
    overpassSpanMesh.scale.set(1, 1 / 1.5, 1);
    meshes.push(overpassSpanMesh);

    const overpassBasePath = new THREE.ShapePath();
    this.drawRoadLine(highwayAbove, overpassBasePath, -200, 130, RoadLineStyle.DASH(overpassDepth, overpassSpacing, 0), 0, 1);
    this.drawRoadLine(highwayAbove, overpassBasePath, 200, 130, RoadLineStyle.DASH(overpassDepth, overpassSpacing, 0), 0, 1);
    const overpassBaseMesh = makeMesh(overpassBasePath, 12, 2, this.ground);
    overpassBaseMesh.scale.set(1, 1 / 1.5, 1);
    meshes.push(overpassBaseMesh);


    const overpassFeetPath = new THREE.ShapePath();

    this.drawRoadLine(highwayAbove, overpassFeetPath, -45, 4, RoadLineStyle.DASH(overpassDepth - 4, overpassSpacing + 4, 0), 0, 1);
    this.drawRoadLine(highwayAbove, overpassFeetPath, -18, 4, RoadLineStyle.DASH(overpassDepth - 4, overpassSpacing + 4, 0), 0, 1);
    this.drawRoadLine(highwayAbove, overpassFeetPath, 18, 4, RoadLineStyle.DASH(overpassDepth - 4, overpassSpacing + 4, 0), 0, 1);
    this.drawRoadLine(highwayAbove, overpassFeetPath, 45, 4, RoadLineStyle.DASH(overpassDepth - 4, overpassSpacing + 4, 0), 0, 1);

    // var wall = new ShapePath();
    // drawRoadLine(highwayAbove, wall, -15, 2, DASH(overpassDepth, overpassSpacing), 0, 1, 1);
    // drawRoadLine(highwayAbove, wall, 15, 2, DASH(overpassDepth, overpassSpacing), 0, 1, 1);

    const overpassFeetMesh = makeMesh(overpassFeetPath, 12, 2, this.ground);
    overpassFeetMesh.scale.set(1, 1 / 1.5, 1);
    meshes.push(overpassFeetMesh);

    const knobSpacing1 = 110;
    const knobSpacing2 = 60;
    const wireSpacing1 = 60;
    const wireSpacing2 = 100;
    const wireSpacing3 = 45;
    const wireSpacing4 = 50;
    const wireSpacing5 = 75;

    // various poles
    const polesPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, polesPath, -30, 0.25, RoadLineStyle.DOT(90), 0, 1); // Nicolaus Copernicus

    this.drawRoadLine(this.roadPath, polesPath, -40, 0.25, RoadLineStyle.DOT(knobSpacing1), 0, 1); // Marie Curie
    this.drawRoadLine(this.roadPath, polesPath, 60, 0.25, RoadLineStyle.DOT(knobSpacing2), 0, 1); // Monika Soćko

    this.drawRoadLine(this.roadPath, polesPath, -50, 0.25, RoadLineStyle.DOT(wireSpacing1), 0, 1); // Raphael Lemkin
    this.drawRoadLine(this.roadPath, polesPath, -20, 0.125, RoadLineStyle.DOT(wireSpacing2), 0, 1); // Stanislaw Ulam
    this.drawRoadLine(this.roadPath, polesPath, 20, 0.25, RoadLineStyle.DOT(wireSpacing3), 0, 1); // Wanda Krahelska-Filipowicz
    this.drawRoadLine(this.roadPath, polesPath, 50, 0.125, RoadLineStyle.DOT(wireSpacing4), 0, 1); // Tamara de Lempicka
    this.drawRoadLine(this.roadPath, polesPath, 70, 0.25, RoadLineStyle.DOT(wireSpacing5), 0, 1); // André Citroën
    const polesMesh = makeMesh(polesPath, 12, 10, this.ground);
    meshes.push(polesMesh);

    // knobs
    const knobsPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, knobsPath, -40, 1, RoadLineStyle.DOT(knobSpacing1), 0, 1);
    this.drawRoadLine(this.roadPath, knobsPath, 60, 1, RoadLineStyle.DOT(knobSpacing2), 0, 1);
    const knobsMesh = makeMesh(knobsPath, 1, 10, this.ground);
    knobsMesh.position.z = 12;
    meshes.push(knobsMesh);

    // wires
    const wireThickness = 0.075;
    const wiresPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, wiresPath, -50, wireThickness, RoadLineStyle.SOLID(wireSpacing1), 0, 1);
    this.drawRoadLine(this.roadPath, wiresPath, -20, wireThickness, RoadLineStyle.SOLID(wireSpacing2), 0, 1);
    this.drawRoadLine(this.roadPath, wiresPath, 20, wireThickness, RoadLineStyle.SOLID(wireSpacing3), 0, 1);
    this.drawRoadLine(this.roadPath, wiresPath, 50, wireThickness, RoadLineStyle.SOLID(wireSpacing4), 0, 1);
    this.drawRoadLine(this.roadPath, wiresPath, 70, wireThickness, RoadLineStyle.SOLID(wireSpacing5), 0, 1);
    const wiresMesh = makeMesh(wiresPath, wireThickness, 10, this.ground);
    wiresMesh.position.z = 11.25;
    meshes.push(wiresMesh);

    // fencing
    const fenceTall = 5;
    const fenceSpacing = 30;
    const fenceDist = 25;
    const fencePolesPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, fencePolesPath, -fenceDist, 0.1, RoadLineStyle.DOT(fenceSpacing, 0), 0, 1);
    this.drawRoadLine(this.roadPath, fencePolesPath, fenceDist, 0.1, RoadLineStyle.DOT(fenceSpacing, 0), 0, 1);
    const fencePolesMesh = makeMesh(fencePolesPath, fenceTall, 10, this.ground);
    meshes.push(fencePolesMesh);
    const fenceTopPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, fenceTopPath, -fenceDist, 0.1, RoadLineStyle.SOLID(fenceSpacing), 0, 1);
    this.drawRoadLine(this.roadPath, fenceTopPath, fenceDist, 0.1, RoadLineStyle.SOLID(fenceSpacing), 0, 1);
    const fenceTopMesh = makeMesh(fenceTopPath, 0.1, 10, this.ground);
    fenceTopMesh.position.z = fenceTall - 0.5;
    meshes.push(fenceTopMesh);
    const fenceAreaPath = new THREE.ShapePath();
    this.drawRoadLine(this.roadPath, fenceAreaPath, -fenceDist, 0.1, RoadLineStyle.SOLID(fenceSpacing), 0, 1);
    this.drawRoadLine(this.roadPath, fenceAreaPath, fenceDist, 0.1, RoadLineStyle.SOLID(fenceSpacing), 0, 1);
    const fenceAreaMesh = makeMesh(fenceAreaPath, fenceTall - 0.5, 10, this.ground, 0.25);
    transparentMeshes.push(fenceAreaMesh);
  }
}
