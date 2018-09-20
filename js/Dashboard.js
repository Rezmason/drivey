"use strict";

class Dashboard {
  constructor() {
    this.object = new THREE.Group();
    var edge1 = 2;
    var backing = this.addDashboardElement(this.makeDashboardBacking(), edge1, true);
    backing.position.set(-50,-80,-110);
    var speedometer1 = this.addDashboardElement(this.makeSpeedometer(), 0, true);
    speedometer1.position.set(-25,-35,-105);
    this.needle1 = this.addDashboardElement(this.makeNeedle(), 0, true);
    this.needle1.position.set(-25,-35,-105);
    var speedometer2 = this.addDashboardElement(this.makeSpeedometer(), 0, true);
    speedometer2.position.set(-70,-35,-105);
    this.needle2 = this.addDashboardElement(this.makeNeedle(), 0, true);
    this.needle2.position.set(-70,-35,-105);
    this.wheel = this.addDashboardElement(this.makeSteeringWheel(), edge1, true);
    this.wheel.position.set(-50,-55,-100);
    this.wheel.rotation.z = Math.PI;
  }

  addDashboardElement(path, edgeAmount, hasFill) {
    if (edgeAmount == null) {
      edgeAmount = 0;
    }
    var element = new THREE.Group();
    if (edgeAmount != 0) {
      var edge = makeMesh(expandShapePath(path, 1 + edgeAmount, 250), 0, 0, 0.2);
      edge.position.z = -0.1;
      element.add(edge);
    }
    if (hasFill && edgeAmount != 0) {
      var fill = makeMesh(expandShapePath(path, 1, 250), 0, 0, 0);
      fill.position.z = 0;
      element.add(fill);
    } else if (hasFill) {
      var fill1 = makeMesh(path, 0, 240, 0.2);
      fill1.position.z = 0;
      element.add(fill1);
    }
    this.object.add(element);
    return element;
  };

  makeDashboardBacking() {
    var pts = [new THREE.Vector2(-200,-40), new THREE.Vector2(-200, 40), new THREE.Vector2(200, 40), new THREE.Vector2(200,-40)];
    var path = makeSplinePath(pts, true);
    var shapePath = new THREE.ShapePath();
    shapePath.subPaths.push(path);
    return shapePath;
  }

  makeSpeedometer() {
    var shapePath = new THREE.ShapePath();
    var outerRadius = 20;
    var innerRadius = outerRadius - 1;
    var dashEnd = innerRadius - 2;
    var outerRim = makeCirclePath(0, 0, outerRadius);
    var innerRim = makeCirclePath(0, 0, innerRadius, false);
    shapePath.subPaths.push(outerRim);
    shapePath.subPaths.push(innerRim);
    var nudge = Math.PI * 0.0075;
    for (let i = 0; i < 10; i++) {
      var angle = Math.PI * 2 * (i + 0.5) / 10;
      shapePath.subPaths.push(makePolygonPath([new THREE.Vector2(Math.cos(angle - nudge) * outerRadius, Math.sin(angle - nudge) * outerRadius), new THREE.Vector2(Math.cos(angle - nudge) * dashEnd, Math.sin(angle - nudge) * dashEnd), new THREE.Vector2(Math.cos(angle + nudge) * dashEnd, Math.sin(angle + nudge) * dashEnd), new THREE.Vector2(Math.cos(angle + nudge) * outerRadius, Math.sin(angle + nudge) * outerRadius)]));
    }
    return shapePath;
  }

  makeNeedle() {
    var shapePath = new THREE.ShapePath();
    var scale = 40;
    shapePath.subPaths.push(makePolygonPath([new THREE.Vector2(-0.02 * scale, 0.1 * scale), new THREE.Vector2(-0.005 * scale,-0.4 * scale), new THREE.Vector2(0.005 * scale,-0.4 * scale), new THREE.Vector2(0.02 * scale, 0.1 * scale)]));
    return shapePath;
  }

  makeSteeringWheel() {
    var scale = 148;
    var shapePath = new THREE.ShapePath();
    var outerRim = makeCirclePath(0, 0, scale * 0.5);
    var innerRim1Points = [];
    var n = 60;
    for (let i = 0; i < 25; i++) {
      var theta = (57 - i) * Math.PI * 2 / n;
      var mag = ((i & 1) != 0 ? 0.435 : 0.45) * scale;
      innerRim1Points.push(new THREE.Vector2(Math.cos(theta) * mag, Math.sin(theta) * mag));
    }
    innerRim1Points.reverse();
    var innerRim1 = makeSplinePath(innerRim1Points, true);
    var innerRim2Points = [];
    for (let i = 0; i < 29; i++) {
      var theta1 = (29 - i) * 2 * Math.PI / n;
      var mag1 = ((i & 1) != 0 ? 0.435 : 0.45) * scale;
      innerRim2Points.push(new THREE.Vector2(Math.cos(theta1) * mag1, Math.sin(theta1) * mag1));
    }
    innerRim2Points.push(new THREE.Vector2(scale * 0.25, scale * 0.075));
    innerRim2Points.push(new THREE.Vector2(scale * 0.125, scale * 0.2));
    innerRim2Points.push(new THREE.Vector2(scale * -0.125, scale * 0.2));
    innerRim2Points.push(new THREE.Vector2(scale * -0.25, scale * 0.075));
    innerRim2Points.reverse();
    var innerRim2 = makeSplinePath(innerRim2Points, true);
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
}
