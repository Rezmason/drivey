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

const variableTagSchema = {
  id: [verbatim]
};

const numberTagSchema = {
  ...variableTagSchema,
  value: [safeParseFloat]
};

const meshTagSchema = {
  depth: [safeParseFloat, 0],
  curveSegments: [safeParseInt, 1],
  shade: [safeParseFloat, 0.5],
  alpha: [safeParseFloat, 1],
  fade: [safeParseFloat, 0],
  z: [safeParseFloat, 0]
};

const lineTagSchema = {
  road: [verbatim, "{mainRoad}"],
  xPos: [safeParseFloat, 0],
  width: [safeParseFloat, 1],
  start: [safeParseFloat, 0],
  end: [safeParseFloat, 1],
  mirror: [parseBool, false]
};

const dashTagSchema = {
  ...lineTagSchema,
  on: [safeParseFloat, 1],
  off: [safeParseFloat, 1],
  pointSpacing: [safeParseFloat, 0]
};

const solidTagSchema = {
  ...lineTagSchema,
  pointSpacing: [safeParseFloat, 0]
};

const dotTagSchema = {
  ...lineTagSchema,
  spacing: [safeParseFloat, 100]
};

const roadTagSchema = {
  ...variableTagSchema,
  windiness: [safeParseFloat, 5],
  roadScale: [parseVec2, new Vector2(1, 1)]
};

const driveyTagSchema = {
  ...roadTagSchema,
  name: [verbatim, "Untitled Level"],
  tint: [parseColor, new Color(0.7, 0.7, 0.7)],
  skyHigh: [safeParseFloat, 0],
  skyLow: [safeParseFloat, 0],
  ground: [safeParseFloat, 0],
  cruiseSpeed: [safeParseFloat, 50 / 3], // 50 kph
  laneWidth: [safeParseFloat, 2],
  numLanes: [safeParseFloat, 1]
};

const schemasByType = {
  number: numberTagSchema,
  mesh: meshTagSchema,
  line: lineTagSchema,
  dash: dashTagSchema,
  solid: solidTagSchema,
  dot: dotTagSchema,
  road: roadTagSchema,
  drivey: driveyTagSchema
};


const parser = new Parser();
const evaluateExpression = (expression, scope) => parser.parse(expression).evaluate(scope);

const braced = /^{(.*)}$/;

const evaluateRawValue = (parser, scope, rawValue, name) => {
  if (parser == null) return rawValue;
  if (rawValue == null || rawValue === "") return undefined;
  if (typeof rawValue !== "string") return rawValue;

  const expression = rawValue.match(braced)?.[1];
  if (expression != null) {
    return evaluateExpression(expression, scope);
  }

  return parser(rawValue);
};

const simplifyAttributes = (type, attributes, scope) => {
  const schema = schemasByType[type] ?? {};

  const rawValues = Object.fromEntries([
    ...Object.entries(schema).map(([name, [_, value]]) => [name, value]),
    ...Array.from(attributes).map(({ name, value }) => [
      dashedToCamelCase(name),
      value
    ])
  ]);

  return Object.fromEntries(
    Object.entries(rawValues).map(([name, value]) => [
      name,
      evaluateRawValue(schema[name]?.[0], scope, value, name)
    ])
  );
};

const variablesByType = new Map([
  [
    "number",
    ({ value }, scope) => {
      console.log(scope);
      return value;
    }
  ],
  ["road", makeRoadPath]
]);

const simplify = (element, parentScope = {}) => {
  // Tag name
  const type = element.tagName.toLowerCase();

  // Attributes
  const basicAttributes = simplifyAttributes(type, element.attributes, parentScope);
  const driveyAttributes =
    type === "drivey" ? { mainRoad: makeRoadPath(basicAttributes) } : {};
  const attributes = {
    ...basicAttributes,
    ...driveyAttributes
  };

  const childElements = Array.from(element.children);
  const variableElements = childElements.filter(child =>
    variablesByType.has(child.tagName.toLowerCase())
  );
  const componentElements = childElements.filter(
    child => !variablesByType.has(child.tagName.toLowerCase())
  );

  // Scope: the parent scope, the attributes, plus the variables within this element.
  // We reduce so that a variable can reference the variables listed before it.
  const variables = variableElements.map(child => simplify(child, parentScope));
  const variableScope = variables.reduce(
    (scope, { type, attributes }) => ({
      ...scope,
      [attributes.id]: variablesByType.get(type)(attributes, scope)
    }),
    parentScope
  );
  const scope = {
    ...variableScope,
    ...driveyAttributes
  };

  // Generate components against the scope
  const components = componentElements.map(element => simplify(element, scope));
  const componentTypes = Array.from(
    new Set(components.map(({ type }) => type))
  );
  const componentsByType = Object.fromEntries(
    componentTypes.map(type => [
      type,
      components.filter(child => child.type === type)
    ])
  );
  return { type, attributes, componentsByType };
};

export default dom => simplify(dom.querySelector("drivey"));
