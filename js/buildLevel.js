import { Parser } from "./../lib/expr-eval.js";
import { Color, Vector2, ShapePath } from "./../lib/three/three.module.js";
import RoadPath from "./RoadPath.js";

const dashed = /(.*?)-([a-zA-Z])/g;
const dashedToCamelCase = s =>
  s.replace(dashed, (_, a, b) => a + b.toUpperCase());
const verbatim = _ => _;
const safeParseFloat = s => {
  const f = parseFloat(s);
  return isNaN(f) ? 0 : f;
};
const safeParseInt = s => {
  const i = parseInt(s);
  return isNaN(i) ? 0 : i;
};
const parseNumberList = s => s.split(",").map(s => safeParseFloat(s.trim()));
const parseColor = s => new Color(...parseNumberList(s));
const parseVec2 = s => new Vector2(...parseNumberList(s));
const parseBool = s => s === "true";

const makeRoadPath = ({ windiness, roadScale }) => {
  const points = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const n = 16;
  for (let i = 0; i < n; i++) {
    const theta = (i * Math.PI * 2) / n;
    const radius = Math.random() + windiness;
    const point = new Vector2(
      Math.cos(theta) * -radius,
      Math.sin(theta) * radius
    );
    points.push(point);
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  const centerX = (maxX + minX) * 0.5;
  const centerY = (maxY + minY) * 0.5;
  const width = maxX - minX;
  const height = maxY - minY;
  for (const point of points) {
    point.x -= centerX;
    point.y -= centerY;
    point.y *= width / height;
    point.x *= 80; // 400
    point.y *= 80; // 400
    point.x *= roadScale.x;
    point.y *= roadScale.y;
  }

  const roadPath = new RoadPath(points);

  return new RoadPath(points);
};

const flattenMesh = mesh => {
  const geom = mesh.geometry;
  mesh.updateMatrix();
  geom.applyMatrix4(mesh.matrix);
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.set(1, 1, 1);
  mesh.updateMatrix();
};

const idTagSchema = { id: {} };

const numberTagSchema = {
  ...idTagSchema,
  value: { parseFunc: safeParseFloat }
};

const loopTagSchema = {
  ...idTagSchema,
  value: { parseFunc: safeParseInt, defaultValue: 1 }
};

const meshTagSchema = {
  depth: { parseFunc: safeParseFloat, defaultValue: 0 },
  curveSegments: { parseFunc: safeParseInt, defaultValue: 1 },
  shade: { parseFunc: safeParseFloat, defaultValue: 0.5 },
  alpha: { parseFunc: safeParseFloat, defaultValue: 1 },
  fade: { parseFunc: safeParseFloat, defaultValue: 0 },
  z: { parseFunc: safeParseFloat, defaultValue: 0 }
};

const lineTagSchema = {
  road: { parseFunc: verbatim, defaultValue: "{mainRoad}" },
  xPos: { parseFunc: safeParseFloat, defaultValue: 0 },
  width: { parseFunc: safeParseFloat, defaultValue: 1 },
  start: { parseFunc: safeParseFloat, defaultValue: 0 },
  end: { parseFunc: safeParseFloat, defaultValue: 1 },
  mirror: { parseFunc: parseBool, defaultValue: false }
};

const dashTagSchema = {
  ...lineTagSchema,
  on: { parseFunc: safeParseFloat, defaultValue: 1 },
  off: { parseFunc: safeParseFloat, defaultValue: 1 },
  pointSpacing: { parseFunc: safeParseFloat, defaultValue: 0 }
};

const solidTagSchema = {
  ...lineTagSchema,
  pointSpacing: { parseFunc: safeParseFloat, defaultValue: 0 }
};

const dotTagSchema = {
  ...lineTagSchema,
  spacing: { parseFunc: safeParseFloat, defaultValue: 100 }
};

const cityscapeTagSchema = {
  road: { parseFunc: verbatim, defaultValue: "{mainRoad}" },
  rowSpacing: { parseFunc: safeParseFloat, defaultValue: 200 },
  columnSpacing: { parseFunc: safeParseFloat, defaultValue: 200 },
  heights: { parseFunc: parseNumberList, defaultValue: "50" },
  width: { parseFunc: safeParseFloat, defaultValue: 100 },
  proximity: { parseFunc: safeParseFloat, defaultValue: 100 },
  radius: { parseFunc: safeParseFloat, defaultValue: 2000 },

  shade: { parseFunc: safeParseFloat, defaultValue: 0.5 },
  alpha: { parseFunc: safeParseFloat, defaultValue: 1 },
  fade: { parseFunc: safeParseFloat, defaultValue: 0 }
};

const cloudsTagSchema = {
  count: { parseFunc: safeParseInt, defaultValue: 100 },
  shade: { parseFunc: safeParseFloat, defaultValue: 0.5 },
  scale: { parseFunc: safeParseFloat, defaultValue: 1 },
  z: { parseFunc: safeParseFloat, defaultValue: 100 }
};

const roadTagSchema = {
  ...idTagSchema,
  windiness: { parseFunc: safeParseFloat, defaultValue: 5 },
  roadScale: { parseFunc: parseVec2, defaultValue: new Vector2(1, 1) }
};

const driveyTagSchema = {
  ...roadTagSchema,
  id: { parseFunc: _ => "mainRoad", defaultValue: "mainRoad" },
  name: { parseFunc: verbatim, defaultValue: "Untitled Level" },
  tint: { parseFunc: parseColor, defaultValue: new Color(0.7, 0.7, 0.7) },
  skyHigh: { parseFunc: safeParseFloat, defaultValue: 0 },
  skyLow: { parseFunc: safeParseFloat, defaultValue: 0 },
  ground: { parseFunc: safeParseFloat, defaultValue: 0 },
  cruiseSpeed: { parseFunc: safeParseFloat, defaultValue: 50 / 3 }, // 50 kph
  laneWidth: { parseFunc: safeParseFloat, defaultValue: 2 },
  numLanes: { parseFunc: safeParseFloat, defaultValue: 1 }
};

const schemasByType = {
  number: numberTagSchema,
  loop: loopTagSchema,
  mesh: meshTagSchema,
  dash: dashTagSchema,
  solid: solidTagSchema,
  dot: dotTagSchema,
  cityscape: cityscapeTagSchema,
  clouds: cloudsTagSchema,
  road: roadTagSchema,
  drivey: driveyTagSchema
};

const hoistForId = renderFunc => attributes => ({
  [attributes.id]: renderFunc(attributes)
});

const hoistsByType = {
  number: hoistForId(({ value }) => value),
  loop: hoistForId(({ value }) => value),
  road: hoistForId(makeRoadPath),
  drivey: hoistForId(makeRoadPath)
};

const parser = new Parser();
const evaluateExpression = (expression, scope) =>
  parser.parse(expression).evaluate(scope);

const braced = /^{(.*)}$/;

const evaluateRawValue = (parser, scope, rawValue) => {
  if (rawValue == null || rawValue === "") return undefined;
  if (typeof rawValue !== "string") return rawValue;

  const expression = rawValue.match(braced)?.[1];
  if (expression != null) {
    return evaluateExpression(expression, scope);
  }

  return parser(rawValue);
};

const simplify = (element, parentScope = {}) => {
  const type = element.tagName.toLowerCase();
  const schema = schemasByType[type] ?? {};

  const rawAttributes = Object.fromEntries([
    ...Object.entries(schema).map(([name, { defaultValue }]) => [
      name,
      defaultValue
    ]),
    ...Array.from(element.attributes).map(({ name, value }) => [
      dashedToCamelCase(name),
      value
    ])
  ]);

  const attributes = Object.fromEntries(
    Object.entries(rawAttributes).map(([name, value]) => [
      name,
      evaluateRawValue(schema[name]?.parseFunc ?? verbatim, parentScope, value)
    ])
  );

  const hoist = hoistsByType[type]?.(attributes);
  Object.assign(parentScope, hoist);

  const iteratorId = type === "loop" ? Object.keys(hoist).pop() : undefined;
  const count = type === "loop" ? hoist[iteratorId] : 1;
  const scopes = Array(count)
    .fill()
    .map((_, index) => ({ ...parentScope, [iteratorId]: index }));
  const children = scopes
    .map(scope =>
      Array.from(element.children).map(child => simplify(child, scope))
    )
    .flat()
    .map(child => (child.type === "loop" ? child.children : [child]))
    .flat();

  return { type, id: attributes.id, attributes, children, ...hoist };
};

export default dom => simplify(dom.querySelector("drivey"));
