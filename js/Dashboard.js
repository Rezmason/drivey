"use strict";

class Dashboard {
  constructor() {
    this.object = new THREE.Group();
    const edge1 = 2;
    this.backing = this.addDashboardElement(this.makeDashboardBacking(), edge1, true);
    this.backing.position.set(-50, -80, -110);
    this.speedometer1 = this.addDashboardElement(this.makeSpeedometer(), 0, true);
    this.speedometer1.position.set(-25, -35, -105);
    this.needle1 = this.addDashboardElement(this.makeNeedle(), 0, true);
    this.needle1.position.set(-25, -35, -105);
    this.needle1.rotation.z = Math.PI * 1.5;
    this.speedometer2 = this.addDashboardElement(this.makeSpeedometer(), 0, true);
    this.speedometer2.position.set(-70, -35, -105);
    this.needle2 = this.addDashboardElement(this.makeNeedle(), 0, true);
    this.needle2.position.set(-70, -35, -105);
    this.needle2.rotation.z = Math.PI * 1.5;
    this.wheel = this.addDashboardElement(this.makeSteeringWheel(), edge1, true);
    this.wheel.position.set(-50, -55, -100);
    this.wheel.rotation.z = Math.PI;
    this.driversSide = 1;
  }

  addDashboardElement(path, edgeAmount, hasFill) {
    if (edgeAmount == null) {
      edgeAmount = 0;
    }
    const element = new THREE.Group();
    if (edgeAmount != 0) {
      const edge = makeMesh(expandShapePath(path, 1 + edgeAmount, 250), 0, 0, 0.2);
      edge.position.z = -0.1;
      element.add(edge);
    }
    if (hasFill && edgeAmount != 0) {
      const fill = makeMesh(expandShapePath(path, 1, 250), 0, 0, 0);
      fill.position.z = 0;
      element.add(fill);
    } else if (hasFill) {
      const fill1 = makeMesh(path, 0, 240, 0.2);
      fill1.position.z = 0;
      element.add(fill1);
    }
    this.object.add(element);
    return element;
  }

  makeDashboardBacking() {
    const pts = [new THREE.Vector2(-200, -40), new THREE.Vector2(-200, 40), new THREE.Vector2(200, 40), new THREE.Vector2(200, -40)];
    const path = makeSplinePath(pts, true);
    const shapePath = new THREE.ShapePath();
    shapePath.subPaths.push(path);
    return shapePath;
  }

  makeSpeedometer() {
    const shapePath = new THREE.ShapePath();
    const outerRadius = 20;
    const innerRadius = outerRadius - 1;
    const dashEnd = innerRadius - 2;
    const outerRim = makeCirclePath(0, 0, outerRadius);
    const innerRim = makeCirclePath(0, 0, innerRadius, false);
    shapePath.subPaths.push(outerRim);
    shapePath.subPaths.push(innerRim);
    const nudge = Math.PI * 0.0075;
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * (i + 0.5)) / 10;
      shapePath.subPaths.push(
        makePolygonPath([
          new THREE.Vector2(Math.cos(angle - nudge) * outerRadius, Math.sin(angle - nudge) * outerRadius),
          new THREE.Vector2(Math.cos(angle - nudge) * dashEnd, Math.sin(angle - nudge) * dashEnd),
          new THREE.Vector2(Math.cos(angle + nudge) * dashEnd, Math.sin(angle + nudge) * dashEnd),
          new THREE.Vector2(Math.cos(angle + nudge) * outerRadius, Math.sin(angle + nudge) * outerRadius)
        ])
      );
    }
    return shapePath;
  }

  makeNeedle() {
    const shapePath = new THREE.ShapePath();
    const scale = 40;
    shapePath.subPaths.push(
      makePolygonPath([
        new THREE.Vector2(-0.02 * scale, 0.1 * scale),
        new THREE.Vector2(-0.005 * scale, -0.4 * scale),
        new THREE.Vector2(0.005 * scale, -0.4 * scale),
        new THREE.Vector2(0.02 * scale, 0.1 * scale)
      ])
    );
    return shapePath;
  }

  makeSteeringWheel() {
    const scale = 148;
    const shapePath = new THREE.ShapePath();
    const outerRim = makeCirclePath(0, 0, scale * 0.5);
    const innerRim1Points = [];
    const n = 60;
    for (let i = 0; i < 25; i++) {
      const theta = ((57 - i) * Math.PI * 2) / n;
      const mag = ((i & 1) != 0 ? 0.435 : 0.45) * scale;
      innerRim1Points.push(new THREE.Vector2(Math.cos(theta) * mag, Math.sin(theta) * mag));
    }
    innerRim1Points.reverse();
    const innerRim1 = makeSplinePath(innerRim1Points, true);
    const innerRim2Points = [];
    for (let i = 0; i < 29; i++) {
      const theta1 = ((29 - i) * 2 * Math.PI) / n;
      const mag1 = ((i & 1) != 0 ? 0.435 : 0.45) * scale;
      innerRim2Points.push(new THREE.Vector2(Math.cos(theta1) * mag1, Math.sin(theta1) * mag1));
    }
    innerRim2Points.push(new THREE.Vector2(scale * 0.25, scale * 0.075));
    innerRim2Points.push(new THREE.Vector2(scale * 0.125, scale * 0.2));
    innerRim2Points.push(new THREE.Vector2(scale * -0.125, scale * 0.2));
    innerRim2Points.push(new THREE.Vector2(scale * -0.25, scale * 0.075));
    innerRim2Points.reverse();
    const innerRim2 = makeSplinePath(innerRim2Points, true);
    shapePath.subPaths.push(outerRim);
    shapePath.subPaths.push(innerRim1);
    shapePath.subPaths.push(innerRim2);
    return shapePath;
  }

  get wheelRotation() {
    return this.wheel.rotation.z;
  }

  set wheelRotation(value) {
    this.wheel.rotation.z = value;
    return value;
  }

  get needle1Rotation() {
    return this.needle1.rotation.z;
  }

  set needle1Rotation(value) {
    this.needle1.rotation.z = value;
    return value;
  }

  get needle2Rotation() {
    return this.needle2.rotation.z;
  }

  set needle2Rotation(value) {
    this.needle2.rotation.z = value;
    return value;
  }

  update() {
    const lerpAmount = 0.05;
    this.backing.position.x = lerp(this.backing.position.x, -50 * this.driversSide, lerpAmount);
    this.wheel.position.x = lerp(this.wheel.position.x, -50 * this.driversSide, lerpAmount);
    const speedometerPositions = [-25 * this.driversSide, -70 * this.driversSide];
    this.speedometer1.position.x = lerp(this.speedometer1.position.x, Math.max(...speedometerPositions), lerpAmount);
    this.speedometer2.position.x = lerp(this.speedometer2.position.x, Math.min(...speedometerPositions), lerpAmount);

    this.needle1.position.x = this.speedometer1.position.x;
    this.needle2.position.x = this.speedometer2.position.x;
  }
}
