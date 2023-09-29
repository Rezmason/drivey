import { Group, Vector2, ShapePath, Path } from "./../lib/three/three.module.js";

import { lerp, PI, TWO_PI, unitVector, origin } from "./math.js";
import { makeSplinePath, getOffsetPoints, makeCirclePath, makePolygonPath } from "./paths.js";
import { makeGeometry, makeMesh } from "./geometry.js";

const wheelScale = 5;
const gaugeScale = 5;
const gaugeMinAngle = PI * (1 + 0.8);
const gaugeMaxAngle = PI * (1 - 0.8);

const expandShapePath = (source, offset) => {
  const expansion = new ShapePath();
  source.subPaths.forEach((subPath) => expansion.subPaths.push(new Path(getOffsetPoints(subPath, offset))));
  return expansion;
};

const makeDashboardElement = (path, strokeWidth, hasFill) => {
  const element = new Group();
  const hasStroke = strokeWidth != 0;

  if (hasStroke) {
    const stroke = makeMesh(makeGeometry(expandShapePath(path, 1 + strokeWidth), 0, 0.2));
    stroke.position.z = -0.1;
    element.add(stroke);
  }

  if (hasFill) {
    const fill = hasStroke ? makeMesh(makeGeometry(expandShapePath(path, 1), 0, 0)) : makeMesh(makeGeometry(path, 0, 0.2));
    fill.position.z = 0;
    element.add(fill);
  }

  return element;
};

const makeBacking = () => {
  const pts = [new Vector2(-200, -40), new Vector2(-200, 40), new Vector2(200, 40), new Vector2(200, -40)];
  const path = makeSplinePath(pts, true);
  const shapePath = new ShapePath();
  shapePath.subPaths.push(path);
  return shapePath;
};

const makeGauge = () => {
  const shapePath = new ShapePath();
  const outerRadius = 20 * gaugeScale;
  const innerRadius = outerRadius - gaugeScale;
  const dashEnd = innerRadius - 2 * gaugeScale;

  const nudge = PI * 0.0075;
  shapePath.subPaths = [
    makeCirclePath(0, 0, outerRadius),
    makeCirclePath(0, 0, innerRadius, false),
    ...Array(10)
      .fill()
      .map((_, index) => (TWO_PI * (index + 0.5)) / 10)
      .map((angle) =>
        makePolygonPath([
          new Vector2(Math.cos(angle - nudge) * outerRadius, Math.sin(angle - nudge) * outerRadius),
          new Vector2(Math.cos(angle - nudge) * dashEnd, Math.sin(angle - nudge) * dashEnd),
          new Vector2(Math.cos(angle + nudge) * dashEnd, Math.sin(angle + nudge) * dashEnd),
          new Vector2(Math.cos(angle + nudge) * outerRadius, Math.sin(angle + nudge) * outerRadius),
        ])
      ),
  ];

  return shapePath;
};

const makeNeedle = () => {
  const shapePath = new ShapePath();
  const scale = 40;
  shapePath.subPaths.push(
    makePolygonPath([
      new Vector2(-0.02 * scale, 0.1 * scale),
      new Vector2(-0.005 * scale, -0.4 * scale),
      new Vector2(0.005 * scale, -0.4 * scale),
      new Vector2(0.02 * scale, 0.1 * scale),
    ])
  );
  return shapePath;
};

const makeSteeringWheel = () => {
  const scale = 148 * wheelScale;
  const shapePath = new ShapePath();

  shapePath.subPaths.push(makeCirclePath(0, 0, scale * 0.5));

  const numBumps = 60;
  const topGap = 3;
  const bottomGap = 1;
  const numTopBumps = numBumps / 2 - 2 * topGap + 1;
  const numBottomBumps = numBumps / 2 - 2 * bottomGap + 1;

  const upperVertices = Array(numTopBumps)
    .fill()
    .map((_, index) =>
      unitVector
        .clone()
        .rotateAround(origin, (TWO_PI * (index + topGap)) / numBumps + PI)
        .multiplyScalar((index % 2 === 1 ? 0.42 : 0.435) * scale)
    );
  shapePath.subPaths.push(makeSplinePath(upperVertices, true));

  const lowerVertices = Array(numBottomBumps)
    .fill()
    .map((_, index) =>
      unitVector
        .clone()
        .rotateAround(origin, (TWO_PI * (index + bottomGap)) / numBumps)
        .multiplyScalar((index % 2 === 1 ? 0.42 : 0.435) * scale)
    )
    .concat([
      new Vector2(scale * -0.25, scale * 0.085),
      new Vector2(scale * -0.125, scale * 0.235),
      new Vector2(scale * 0.125, scale * 0.235),
      new Vector2(scale * 0.25, scale * 0.085),
    ]);

  shapePath.subPaths.push(makeSplinePath(lowerVertices, true));

  return shapePath;
};

export default class Dashboard {
  constructor() {
    this.speed = 1;
    this.tach = 1;
    this.wheelRotation = PI;
    this.drivingSide = -1;
    this.object = new Group();

    this.backing = makeDashboardElement(makeBacking(), 2, true);
    this.backing.position.set(-50, -80, -110);

    this.speedGauge = makeDashboardElement(makeGauge(), 0, true);
    this.speedGauge.position.set(-25, -35, -105);
    this.speedGauge.scale.set(1 / gaugeScale, 1 / gaugeScale, 1);

    this.speedNeedle = makeDashboardElement(makeNeedle(), 0, true);
    this.speedNeedle.position.set(-25, -35, -105);
    this.speedNeedle.rotation.z = PI * 1.5;

    this.tachGauge = makeDashboardElement(makeGauge(), 0, true);
    this.tachGauge.position.set(-70, -35, -105);
    this.tachGauge.scale.set(1 / gaugeScale, 1 / gaugeScale, 1);

    this.tachNeedle = makeDashboardElement(makeNeedle(), 0, true);
    this.tachNeedle.position.set(-70, -35, -105);
    this.tachNeedle.rotation.z = PI * 1.5;

    this.wheel = makeDashboardElement(makeSteeringWheel(), 2 * wheelScale, true);
    this.wheel.position.set(-50, -55, -100);
    this.wheel.scale.set(1 / wheelScale, 1 / wheelScale, 1);

    [this.backing, this.speedGauge, this.speedNeedle, this.tachGauge, this.tachNeedle, this.wheel].forEach((element) => this.object.add(element));

    this.update();
  }

  update() {
    const lerpAmount = 0.05;

    this.backing.position.x = lerp(this.backing.position.x, 50 * this.drivingSide, lerpAmount);

    this.wheel.position.x = lerp(this.wheel.position.x, 50 * this.drivingSide, lerpAmount);
    this.wheel.rotation.z = this.wheelRotation;

    const gaugePositions = [25 * this.drivingSide, 70 * this.drivingSide];

    this.speedGauge.position.x = lerp(this.speedGauge.position.x, Math.max(...gaugePositions), lerpAmount);
    this.speedNeedle.position.x = this.speedGauge.position.x;
    this.speedNeedle.rotation.z = lerp(this.speedNeedle.rotation.z, lerp(gaugeMinAngle, gaugeMaxAngle, Math.min(this.speed, 1)), 0.05);

    this.tachGauge.position.x = lerp(this.tachGauge.position.x, Math.min(...gaugePositions), lerpAmount);
    this.tachNeedle.position.x = this.tachGauge.position.x;
    this.tachNeedle.rotation.z = lerp(this.tachNeedle.rotation.z, lerp(gaugeMinAngle, gaugeMaxAngle, Math.min(this.tach, 1)), 0.05);
  }
}
