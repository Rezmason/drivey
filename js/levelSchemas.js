import { Color, Vector2 } from "./../lib/three/three.module.js";
import { verbatim, safeParseFloat, safeParseInt, parseNumberList, parseColor, parseVec2, parseBool } from "./parseFunctions.js";

const idAttribute = { id: {} };
const shadeAttribute = { shade: { parseFunc: safeParseFloat, defaultValue: 0.5 } };
const alphaAttribute = { alpha: { parseFunc: safeParseFloat, defaultValue: 1 } };
const zAttribute = { z: { parseFunc: safeParseFloat, defaultValue: 0 } };
const roadAttribute = { road: { parseFunc: verbatim, defaultValue: "{mainRoad}" } };

const numberTagSchema = {
  ...idAttribute,
  value: { parseFunc: safeParseFloat }
};

const repeatTagSchema = {
  ...idAttribute,
  value: { parseFunc: safeParseInt, defaultValue: 1 }
};

const meshTagSchema = {
  depth: { parseFunc: safeParseFloat, defaultValue: 0 },
  curveSegments: { parseFunc: safeParseInt, defaultValue: 0 },
  ...shadeAttribute,
  ...alphaAttribute,
  ...zAttribute,
  fade: { parseFunc: safeParseFloat, defaultValue: 0 },
  scale: { parseFunc: parseVec2, defaultValue: new Vector2(1, 1) }
};

const lineTagSchema = {
  ...roadAttribute,
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

const solidAttribute = {
  ...lineTagSchema,
  pointSpacing: { parseFunc: safeParseFloat, defaultValue: 0 }
};

const dotTagSchema = {
  ...lineTagSchema,
  spacing: { parseFunc: safeParseFloat, defaultValue: 100 }
};

const cityscapeTagSchema = {
  ...roadAttribute,
  rowSpacing: { parseFunc: safeParseFloat, defaultValue: 200 },
  columnSpacing: { parseFunc: safeParseFloat, defaultValue: 200 },
  heights: { parseFunc: parseNumberList, defaultValue: "50" },
  width: { parseFunc: safeParseFloat, defaultValue: 100 },
  proximity: { parseFunc: safeParseFloat, defaultValue: 100 },
  radius: { parseFunc: safeParseFloat, defaultValue: 2000 },

  ...shadeAttribute,
  ...alphaAttribute
};

const cloudsTagSchema = {
  count: { parseFunc: safeParseInt, defaultValue: 100 },
  ...shadeAttribute,
  scale: { parseFunc: safeParseFloat, defaultValue: 1 },
  ...zAttribute
};

const roadTagSchema = {
  ...idAttribute,
  basis: { parseFunc: verbatim, defaultValue: null },
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
  repeat: repeatTagSchema,
  mesh: meshTagSchema,
  dash: dashTagSchema,
  solid: solidAttribute,
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
  repeat: hoistForId(({ value }) => value),
  road: hoistForId(verbatim),
  drivey: hoistForId(verbatim)
};

const getDefaultValuesForType = type => {
  const schema = schemasByType[type] ?? {};
  return Object.fromEntries(Object.entries(schema).map(([name, { defaultValue }]) => [name, defaultValue]));
};

const getParseFuncForAttribute = (type, name) => {
  const schema = schemasByType[type] ?? {};
  return schema[name]?.parseFunc ?? verbatim;
};

const getHoistForType = type => hoistsByType[type];

export { getDefaultValuesForType, getParseFuncForAttribute, getHoistForType };
