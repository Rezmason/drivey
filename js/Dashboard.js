import { Group, Vector2, ShapePath, Path } from "./../lib/three/three.module.js";

import { lerp } from "./math.js";
import { makeSplinePath, getOffsetPoints, makeCirclePath, makePolygonPath } from "./paths.js";
import { makeGeometry, makeMesh } from "./geometry.js";

const wheelScale = 5;
const gaugeScale = 5;
const gaugeMinAngle = Math.PI * (1 + 0.8);
const gaugeMaxAngle = Math.PI * (1 - 0.8);

const expandShapePath = (source, offset) => {
  const expansion = new ShapePath();
  source.subPaths.forEach(subPath => expansion.subPaths.push(new Path(getOffsetPoints(subPath, offset))));
  return expansion;
};

export default class Dashboard {
  constructor() {
    this.speed = 1;
    this.tach = 1;
    this.object = new Group();
    const edge1 = 2;
    this.backing = this.addDashboardElement(this.makeDashboardBacking(), edge1, true);
    this.backing.position.set(-50, -80, -110);
    this.speedGauge = this.addDashboardElement(this.makeGauge(), 0, true);
    this.speedGauge.position.set(-25, -35, -105);
    this.speedGauge.scale.set(1 / gaugeScale, 1 / gaugeScale, 1);
    this.speedNeedle = this.addDashboardElement(this.makeNeedle(), 0, true);
    this.speedNeedle.position.set(-25, -35, -105);
    this.speedNeedle.rotation.z = Math.PI * 1.5;
    this.tachGauge = this.addDashboardElement(this.makeGauge(), 0, true);
    this.tachGauge.position.set(-70, -35, -105);
    this.tachGauge.scale.set(1 / gaugeScale, 1 / gaugeScale, 1);
    this.tachNeedle = this.addDashboardElement(this.makeNeedle(), 0, true);
    this.tachNeedle.position.set(-70, -35, -105);
    this.tachNeedle.rotation.z = Math.PI * 1.5;
    this.wheel = this.addDashboardElement(this.makeSteeringWheel(), edge1 * wheelScale, true);
    this.wheel.position.set(-50, -55, -100);
    this.wheel.scale.set(1 / wheelScale, 1 / wheelScale, 1);
    this.wheel.rotation.z = Math.PI;
    this.drivingSide = -1;
  }

  addDashboardElement(path, strokeWidth, hasFill) {
    if (strokeWidth == null) {
      strokeWidth = 0;
    }
    strokeWidth = Math.abs(strokeWidth);

    const element = new Group();
    if (strokeWidth != 0) {
      const edge = makeMesh(makeGeometry(expandShapePath(path, 1 + strokeWidth), 0, 0.2));
      edge.position.z = -0.1;
      element.add(edge);
    }

    if (hasFill && strokeWidth != 0) {
      const fill = makeMesh(makeGeometry(expandShapePath(path, 1), 0, 0));
      fill.position.z = 0;
      element.add(fill);
    } else if (hasFill) {
      const fill1 = makeMesh(makeGeometry(path, 0, 0.2));
      fill1.position.z = 0;
      element.add(fill1);
    }

    this.object.add(element);
    return element;
  }

  makeDashboardBacking() {
    const pts = [new Vector2(-200, -40), new Vector2(-200, 40), new Vector2(200, 40), new Vector2(200, -40)];
    const path = makeSplinePath(pts, true);
    const shapePath = new ShapePath();
    shapePath.subPaths.push(path);
    return shapePath;
  }

  makeGauge() {
    const shapePath = new ShapePath();
    const outerRadius = 20 * gaugeScale;
    const innerRadius = outerRadius - gaugeScale;
    const dashEnd = innerRadius - 2 * gaugeScale;
    const outerRim = makeCirclePath(0, 0, outerRadius);
    const innerRim = makeCirclePath(0, 0, innerRadius, false);
    shapePath.subPaths.push(outerRim);
    shapePath.subPaths.push(innerRim);
    const nudge = Math.PI * 0.0075;
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * (i + 0.5)) / 10;
      shapePath.subPaths.push(
        makePolygonPath([
          new Vector2(Math.cos(angle - nudge) * outerRadius, Math.sin(angle - nudge) * outerRadius),
          new Vector2(Math.cos(angle - nudge) * dashEnd, Math.sin(angle - nudge) * dashEnd),
          new Vector2(Math.cos(angle + nudge) * dashEnd, Math.sin(angle + nudge) * dashEnd),
          new Vector2(Math.cos(angle + nudge) * outerRadius, Math.sin(angle + nudge) * outerRadius)
        ])
      );
    }

    return shapePath;
  }

  makeNeedle() {
    const shapePath = new ShapePath();
    const scale = 40;
    shapePath.subPaths.push(
      makePolygonPath([
        new Vector2(-0.02 * scale, 0.1 * scale),
        new Vector2(-0.005 * scale, -0.4 * scale),
        new Vector2(0.005 * scale, -0.4 * scale),
        new Vector2(0.02 * scale, 0.1 * scale)
      ])
    );
    return shapePath;
  }

  makeSteeringWheel() {
    const scale = 148 * wheelScale;
    const shapePath = new ShapePath();
    const outerRim = makeCirclePath(0, 0, scale * 0.5);
    const innerRim1Points = [];
    const n = 60;
    for (let i = 0; i < 25; i++) {
      const theta = ((57 - i) * Math.PI * 2) / n;
      const mag = ((i & 1) != 0 ? 0.435 : 0.45) * scale;
      innerRim1Points.push(new Vector2(Math.cos(theta) * mag, Math.sin(theta) * mag));
    }

    innerRim1Points.reverse();
    const innerRim1 = makeSplinePath(innerRim1Points, true);
    const innerRim2Points = [];
    for (let i = 0; i < 29; i++) {
      const theta1 = ((29 - i) * 2 * Math.PI) / n;
      const mag1 = ((i & 1) != 0 ? 0.435 : 0.45) * scale;
      innerRim2Points.push(new Vector2(Math.cos(theta1) * mag1, Math.sin(theta1) * mag1));
    }

    innerRim2Points.push(new Vector2(scale * 0.25, scale * 0.075));
    innerRim2Points.push(new Vector2(scale * 0.125, scale * 0.2));
    innerRim2Points.push(new Vector2(scale * -0.125, scale * 0.2));
    innerRim2Points.push(new Vector2(scale * -0.25, scale * 0.075));
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

  update() {
    const lerpAmount = 0.05;
    this.backing.position.x = lerp(this.backing.position.x, 50 * this.drivingSide, lerpAmount);
    this.wheel.position.x = lerp(this.wheel.position.x, 50 * this.drivingSide, lerpAmount);
    const gaugePositions = [25 * this.drivingSide, 70 * this.drivingSide];
    this.speedGauge.position.x = lerp(this.speedGauge.position.x, Math.max(...gaugePositions), lerpAmount);
    this.tachGauge.position.x = lerp(this.tachGauge.position.x, Math.min(...gaugePositions), lerpAmount);

    this.speedNeedle.position.x = this.speedGauge.position.x;
    this.tachNeedle.position.x = this.tachGauge.position.x;

    this.speedNeedle.rotation.z = lerp(this.speedNeedle.rotation.z, lerp(gaugeMinAngle, gaugeMaxAngle, Math.min(this.speed, 1)), 0.05);
    this.tachNeedle.rotation.z = lerp(this.tachNeedle.rotation.z, lerp(gaugeMinAngle, gaugeMaxAngle, Math.min(this.tach, 1)), 0.05);
  }
}
