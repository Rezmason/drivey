import { Mesh, Color, Vector2, Group, ShapePath } from "./../lib/three/three.module.js";

import Level from "./Level.js";
import RoadPath from "./RoadPath.js";
const dashed = /(.*?)-([a-zA-Z])/g;
const dashedToCamelCase = s => s.replace(dashed, (_, a, b) => a + b.toUpperCase());

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
    const point = new Vector2(Math.cos(theta) * -radius, Math.sin(theta) * radius);
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

const schemasByTagName = new Map([
  [
    "drivey",
    {
      name: [verbatim, "Untitled Level"],
      tint: [parseColor, new Color(0.7, 0.7, 0.7)],
      laneWidth: [safeParseFloat, 2],
      roadScale: [parseVec2, new Vector2(1, 1)],
      skyHigh: [safeParseFloat, 0],
      skyLow: [safeParseFloat, 0],
      ground: [safeParseFloat, 0],
      cruiseSpeed: [safeParseFloat, 50 / 3], // 50 kph
      numLanes: [safeParseFloat, 1],
      windiness: [safeParseFloat, 5],
      roadScale: [parseVec2, new Vector2(1, 1)]
    }
  ],
  [
    "number",
    {
      id: [verbatim],
      value: [safeParseFloat]
    }
  ],
  [
    "mesh",
    {
      depth: [safeParseFloat, 0],
      curveSegments: [safeParseInt, 1],
      shade: [safeParseFloat, 0.5],
      alpha: [safeParseFloat, 1],
      fade: [safeParseFloat, 0],
      z: [safeParseFloat, 0]
    }
  ],
  [
    "line",
    {
      road: [verbatim, "#mainRoad"],
      xPos: [safeParseFloat, 0],
      width: [safeParseFloat, 1],
      start: [safeParseFloat, 0],
      end: [safeParseFloat, 1]
    }
  ],
  [
    "dash",
    {
      on: [safeParseFloat, 1],
      off: [safeParseFloat, 1],
      pointSpacing: [safeParseFloat, 0]
    }
  ],
  [
    "solid",
    {
      pointSpacing: [safeParseFloat, 0]
    }
  ],
  [
    "dot",
    {
      spacing: [safeParseFloat, 100]
    }
  ],
  [
    "road",
    {
      id: [verbatim],
      windiness: [safeParseFloat, 5],
      roadScale: [parseVec2, new Vector2(1, 1)]
    }
  ]
]);

const getAttributes = (element, scope) => {
  const schema = schemasByTagName.get(element.tagName.toLowerCase()) ?? {};

  const resolvePointer = value => {
    const s = value?.toString() ?? "";
    if (s.startsWith("#")) {
      const key = s.substring(1);
      if (scope[key] != null) {
        return scope[key];
      }
    }
    return value;
  };

  const defaultValues = Object.fromEntries(Object.entries(schema).map(([key, [_, value]]) => [key, resolvePointer(value)]));
  const attributes = {
    ...defaultValues,
    ...Object.fromEntries(
      Array.from(element.attributes).map(({ name, value }) => {
        const attributeName = dashedToCamelCase(name);
        const resolvedPointer = resolvePointer(value);
        if (resolvedPointer != value) {
          return [attributeName, resolvedPointer];
        }
        const parseFunc = schema[attributeName]?.[0] ?? verbatim;
        return [attributeName, parseFunc(value)];
      })
    )
  };
  return attributes;
};

const variablesByTagName = new Map([
  ["number", ({ value }) => value],
  ["road", makeRoadPath]
]);

const objectify = (element, parentScope = {}) => {
  const tagName = element.tagName.toLowerCase();
  const basicAttributes = getAttributes(element, parentScope);
  const driveyAttributes = tagName === "drivey" ? { mainRoad: makeRoadPath(basicAttributes) } : {};
  const attributes = {
    ...basicAttributes,
    ...driveyAttributes
  };
  const allChildren = Array.from(element.children);
  const variables = allChildren.filter(child => variablesByTagName.has(child.tagName.toLowerCase())).map(child => objectify(child, parentScope));
  const scope = {
    ...parentScope,
    ...Object.fromEntries(variables.map(({ tagName, attributes }) => [attributes.id, variablesByTagName.get(tagName)(attributes)])),
    ...driveyAttributes
  };

  const objects = allChildren.filter(child => !variablesByTagName.has(child.tagName.toLowerCase()));
  const objectTagNames = Array.from(new Set(objects.map(child => child.tagName)));
  const children = Object.fromEntries(objectTagNames.map(tagName => [tagName.toLowerCase(), objects.filter(child => child.tagName === tagName).map(child => objectify(child, scope))]));
  return { tagName, attributes, children };
};

const forEachChild = (element, tagName, f) => (element.children[tagName] ?? []).forEach(f);

const parseRoadLineStyle = element => ({ ...element.attributes, type: element.tagName });

const parseLine = (element, linePath, level, mush) => {
  const styleElement = ["solid", "dash", "dot"].map(tagName => element.children[tagName]).filter(list => list != null)?.[0]?.[0];
  if (styleElement == null) {
    return;
  }
  const style = parseRoadLineStyle(styleElement);
  const { road, xPos, width, start, end } = element.attributes;
  level.drawRoadLine(road, linePath, xPos, width, style, start, end);
};

const parseMesh = (element, level, mush) => {
  const linePath = new ShapePath();
  forEachChild(element, "line", line => parseLine(line, linePath, level, mush));
  const { depth, curveSegments, shade, alpha, fade, z } = element.attributes;
  const mesh = level.makeMesh(linePath, depth, curveSegments, shade, alpha, fade);
  mesh.position.z = z;
  if (alpha < 1) {
    mush.transparentMeshes.push(mesh);
  } else {
    mush.meshes.push(mesh);
  }
};

const parseRoot = (element, level, mush) => {
  Object.assign(level, element.attributes);
  // level.roadPath = makeRoadPath(5, level.roadScale);
  forEachChild(element, "mesh", mesh => parseMesh(mesh, level, mush));
};

export default dom => {
  const level = new Level();
  const meshes = [];
  const transparentMeshes = [];
  const skyMeshes = [];

  const root = objectify(dom.querySelector("drivey"));
  console.log(root);
  parseRoot(root, level, { meshes, transparentMeshes, skyMeshes });
  level.finish(meshes, transparentMeshes, skyMeshes);
  // console.log(level);
  return level;
};
