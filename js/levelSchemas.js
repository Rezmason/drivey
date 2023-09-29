import { Color, Vector2 } from "./../lib/three/three.module.js";
import { verbatim, safeParseFloat, safeParseInt, parseNumberList, parseColor, parseVec2, parseBool } from "./parseFunctions.js";

const idAttribute = { id: {} };
const shadeAttribute = {
  shade: { parseFunc: safeParseFloat, defaultValue: 0.5 },
};
const alphaAttribute = {
  alpha: { parseFunc: safeParseFloat, defaultValue: 1 },
};
const roadAttribute = {
  road: { parseFunc: verbatim, defaultValue: "{mainRoad}" },
};
const fadeAttribute = { fade: { parseFunc: safeParseFloat, defaultValue: 0 } };
const spacingAttribute = {
  spacing: { parseFunc: safeParseFloat, defaultValue: 1 },
};

const horizontalTagSchema = {
  mirror: { parseFunc: parseBool, defaultValue: false },
  x: { parseFunc: safeParseFloat, defaultValue: 0 },
  width: { parseFunc: safeParseFloat, defaultValue: 1 },
};

const verticalTagSchema = {
  y: { parseFunc: safeParseFloat, defaultValue: 0 },
  height: { parseFunc: safeParseFloat, defaultValue: 0 },
};

const numberTagSchema = {
  ...idAttribute,
  value: { parseFunc: safeParseFloat },
};

const repeatTagSchema = {
  ...idAttribute,
  value: { parseFunc: safeParseInt, defaultValue: 1 },
};

const shapeTagSchema = {
  ...shadeAttribute,
  ...alphaAttribute,
  ...fadeAttribute,
  ...verticalTagSchema,
  scale: { parseFunc: parseVec2, defaultValue: new Vector2(1, 1) },
};

const segmentTagSchema = {
  start: { parseFunc: safeParseFloat, defaultValue: NaN },
  end: { parseFunc: safeParseFloat, defaultValue: NaN },
};

const lineTagSchema = {
  ...roadAttribute,
  ...horizontalTagSchema,
  ...segmentTagSchema,
};

const dashedTagSchema = {
  ...lineTagSchema,
  ...spacingAttribute,
  length: { parseFunc: safeParseFloat, defaultValue: 1 },
};

const solidAttribute = {
  ...lineTagSchema,
  spacing: { parseFunc: safeParseFloat, defaultValue: 0 },
};

const dottedTagSchema = {
  ...lineTagSchema,
  ...spacingAttribute,
};

const cityscapeTagSchema = {
  ...roadAttribute,
  rowSpacing: { parseFunc: safeParseFloat, defaultValue: 200 },
  columnSpacing: { parseFunc: safeParseFloat, defaultValue: 200 },
  heights: { parseFunc: parseNumberList, defaultValue: [50] },
  width: { parseFunc: safeParseFloat, defaultValue: 100 },
  proximity: { parseFunc: safeParseFloat, defaultValue: 100 },
  radius: { parseFunc: safeParseFloat, defaultValue: 2000 },
  ...shadeAttribute,
};

const cloudsTagSchema = {
  count: { parseFunc: safeParseInt, defaultValue: 100 },
  ...shadeAttribute,
  scale: { parseFunc: parseVec2, defaultValue: new Vector2(1000, 1000) },
  altitude: { parseFunc: safeParseFloat, defaultValue: 0 },
  cloudRadius: { parseFunc: safeParseFloat, defaultValue: 50 },
};

const roadTagSchema = {
  ...idAttribute,
  basis: { parseFunc: verbatim, defaultValue: null },
  windiness: { parseFunc: safeParseFloat, defaultValue: 0 },
  scale: { parseFunc: parseVec2, defaultValue: new Vector2(1, 1) },
  seed: { parseFunc: safeParseInt, defaultValue: NaN },
  splinePoints: { parseFunc: parseNumberList, defaultValue: [] },
  length: { parseFunc: safeParseFloat, defaultValue: 1000 },
};

const driveyTagSchema = {
  ...roadTagSchema,
  id: { parseFunc: (_) => "mainRoad", defaultValue: "mainRoad" },
  name: { parseFunc: verbatim, defaultValue: "Untitled Level" },
  tint: { parseFunc: parseColor, defaultValue: new Color(0.7, 0.7, 0.7) },
  skyHigh: { parseFunc: safeParseFloat, defaultValue: 0 },
  skyLow: { parseFunc: safeParseFloat, defaultValue: 0 },
  ground: { parseFunc: safeParseFloat, defaultValue: 0 },
  cruiseSpeed: { parseFunc: safeParseFloat, defaultValue: 50 / 3 }, // 50 kph
  laneWidth: { parseFunc: safeParseFloat, defaultValue: 2 },
  numLanes: { parseFunc: safeParseFloat, defaultValue: 1 },
};

const featureTagSchema = {
  ...spacingAttribute,
  ...roadAttribute,
  ...segmentTagSchema,
};

const partTagSchema = {
  ...shadeAttribute,
  ...alphaAttribute,
  ...fadeAttribute,
  ...horizontalTagSchema,
  ...verticalTagSchema,
  z: { parseFunc: safeParseFloat, defaultValue: 0 },
};

const boxTagSchema = {
  ...partTagSchema,
  length: { parseFunc: safeParseFloat, defaultValue: 0 },
};

const diskTagSchema = {
  ...partTagSchema,
};

const wireTagSchema = {
  ...partTagSchema,
};

const schemasByType = {
  number: numberTagSchema,
  repeat: repeatTagSchema,
  shape: shapeTagSchema,
  dashed: dashedTagSchema,
  solid: solidAttribute,
  dotted: dottedTagSchema,
  cityscape: cityscapeTagSchema,
  clouds: cloudsTagSchema,
  road: roadTagSchema,
  drivey: driveyTagSchema,
  feature: featureTagSchema,
  box: boxTagSchema,
  disk: diskTagSchema,
  wire: wireTagSchema,
};

const hoistForId = (renderFunc) => (attributes) => ({
  [attributes.id]: renderFunc(attributes),
});

const hoistsByType = {
  number: hoistForId(({ value }) => value),
  repeat: hoistForId(({ value }) => value),
  road: hoistForId(verbatim),
  drivey: hoistForId(verbatim),
};

const getDefaultValuesForType = (type) => {
  const schema = schemasByType[type] ?? {};
  return Object.fromEntries(Object.entries(schema).map(([name, { defaultValue }]) => [name, defaultValue]));
};

const getParseFuncForAttribute = (type, name) => {
  const schema = schemasByType[type] ?? {};
  return schema[name]?.parseFunc ?? verbatim;
};

const getHoistForType = (type) => hoistsByType[type];

export { getDefaultValuesForType, getParseFuncForAttribute, getHoistForType };
