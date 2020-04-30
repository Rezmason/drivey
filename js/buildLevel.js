import { Mesh, Color, Vector2, Group, ShapePath } from "./../lib/three/three.module.js";
import { getExtrudedPointAt, makeGeometry, addPath, makeCirclePath, makePolygonPath, mergeGeometries } from "./shapes.js";
import { makeShadedMesh } from "./rendering.js";

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

const drawRoadLine = (roadPath, shapePath, xPos, width, style, start, end) => {
  if (start == end) {
    return shapePath;
  }

  switch (style.type) {
    case "solid":
      {
        const [pointSpacing] = [style.pointSpacing];
        width = Math.abs(width);
        const outsideOffset = xPos - width / 2;
        const insideOffset = xPos + width / 2;
        const outsidePoints = [];
        const insidePoints = [];
        outsidePoints.push(getExtrudedPointAt(roadPath.curve, start, outsideOffset));
        insidePoints.push(getExtrudedPointAt(roadPath.curve, start, insideOffset));
        if (pointSpacing > 0) {
          const psFraction = pointSpacing / roadPath.length;
          let i = Math.ceil(start / psFraction) * psFraction;
          if (i == start) i += psFraction;
          while (i < end) {
            outsidePoints.push(getExtrudedPointAt(roadPath.curve, i, outsideOffset));
            insidePoints.push(getExtrudedPointAt(roadPath.curve, i, insideOffset));
            i += psFraction;
          }
        }

        outsidePoints.push(getExtrudedPointAt(roadPath.curve, end, outsideOffset));
        insidePoints.push(getExtrudedPointAt(roadPath.curve, end, insideOffset));
        outsidePoints.reverse();
        if (start == 0 && end == 1) {
          addPath(shapePath, makePolygonPath(outsidePoints));
          addPath(shapePath, makePolygonPath(insidePoints));
        } else {
          addPath(shapePath, makePolygonPath(outsidePoints.concat(insidePoints)));
        }
      }

      break;
    case "dash":
      {
        const [off, on, pointSpacing] = [style.off, style.on, style.pointSpacing];
        let dashStart = start;
        const dashSpan = (on + off) / roadPath.length;
        const dashLength = (dashSpan * on) / (on + off);
        while (dashStart < end) {
          drawRoadLine(roadPath, shapePath, xPos, width, { type: "solid", pointSpacing }, dashStart, Math.min(end, dashStart + dashLength));
          dashStart += dashSpan;
        }
      }

      break;
    case "dot":
      {
        const [spacing] = [style.spacing];
        let dotStart = start;
        const dotSpan = spacing / roadPath.length;
        while (dotStart < end) {
          const pos = getExtrudedPointAt(roadPath.curve, dotStart, xPos);
          addPath(shapePath, makeCirclePath(pos.x, pos.y, width));
          dotStart += dotSpan;
        }
      }

      break;
  }

  return shapePath;
};

const mergeMeshes = meshes => {
  const geom = mergeGeometries(meshes.map(mesh => mesh.geometry));
  return new Mesh(geom, meshes[0]?.material);
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

const numberTagSchema = {
  id: [verbatim],
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
  road: [verbatim, "#mainRoad"],
  xPos: [safeParseFloat, 0],
  width: [safeParseFloat, 1],
  start: [safeParseFloat, 0],
  end: [safeParseFloat, 1]
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
  id: [verbatim],
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

const schemasByTagName = {
  number: numberTagSchema,
  mesh: meshTagSchema,
  line: lineTagSchema,
  dash: dashTagSchema,
  solid: solidTagSchema,
  dot: dotTagSchema,
  road: roadTagSchema,
  drivey: driveyTagSchema,
};

const getAttributes = (element, scope) => {
  const schema = schemasByTagName[element.tagName.toLowerCase()] ?? {};

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
  const style = parseRoadLineStyle(element);
  const { road, xPos, width, start, end } = element.attributes;
  drawRoadLine(road, linePath, xPos, width, style, start, end);
};

const parseMesh = (element, level, mush) => {
  const linePath = new ShapePath();
  forEachChild(element, "solid", line => parseLine(line, linePath, level, mush));
  forEachChild(element, "dash", line => parseLine(line, linePath, level, mush));
  forEachChild(element, "dot", line => parseLine(line, linePath, level, mush));
  const { depth, curveSegments, shade, alpha, fade, z } = element.attributes;
  const mesh = makeShadedMesh(makeGeometry(linePath, depth, curveSegments), shade, alpha, fade);
  mesh.position.z = z;
  if (alpha < 1) {
    mush.transparentMeshes.push(mesh);
  } else {
    mush.meshes.push(mesh);
  }
};

const parseRoot = (element, level, mush) => {
  Object.assign(level, element.attributes);
  forEachChild(element, "mesh", mesh => parseMesh(mesh, level, mush));
};

export default dom => {
  const level = {};
  const meshes = [];
  const transparentMeshes = [];
  const skyMeshes = [];

  const root = objectify(dom.querySelector("drivey"));
  console.log(root);
  parseRoot(root, level, { meshes, transparentMeshes, skyMeshes });

  const world = new Group();
  level.world = world;
  meshes.forEach(flattenMesh);
  const combinedMesh = mergeMeshes(meshes);
  combinedMesh.geometry.computeBoundingSphere();
  level.worldRadius = combinedMesh.geometry.boundingSphere.radius;
  if (meshes.length > 0) world.add(combinedMesh);
  meshes.forEach(mesh => mesh.geometry.dispose());
  meshes.length = 0;

  transparentMeshes.forEach(flattenMesh);
  if (transparentMeshes.length > 0) world.add(mergeMeshes(transparentMeshes));
  transparentMeshes.forEach(mesh => mesh.geometry.dispose());
  transparentMeshes.length = 0;

  skyMeshes.forEach(flattenMesh);
  const sky = new Group();
  level.sky = sky;
  if (skyMeshes.length > 0) sky.add(mergeMeshes(skyMeshes));
  skyMeshes.forEach(mesh => mesh.geometry.dispose());
  skyMeshes.length = 0;

  level.dispose = () => {
    if (world.parent != null) {
      world.parent.remove(this.world);
    }

    world.children.forEach(child => child.geometry.dispose());
  };

  return level;
};
