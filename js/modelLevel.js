import { Vector2, Vector3, Matrix4, ShapePath } from "./../lib/three/three.module.js";
import { getOffsetPoints, makeCirclePath, makeSquarePath } from "./paths.js";
import { distance, origin, sanitize, TWO_PI } from "./math.js";
import { makeGeometry, mergeGeometries } from "./geometry.js";
import { lineModelersByType, partModelersByType } from "./lineModelers.js";
import { makeRoad } from "./roads.js";

const getChildrenOfTypes = (node, types) => node.children.filter((child) => types.includes(child.type));

const getRoad = (attributes, roadsById) => {
  if (attributes == null) return null;
  const { id } = attributes;
  if (roadsById[id] == null) {
    const basis = getRoad(attributes.basis, roadsById);
    roadsById[id] = makeRoad(attributes, basis);
  }
  return roadsById[id];
};

const modelLine = ({ attributes, type }, roadsById) => {
  const modeler = lineModelersByType[type];
  const road = getRoad(attributes.road, roadsById);
  const roadLength = road.length;
  const curve = road.curve;
  const segmentAttributes = {
    start: sanitize(attributes.start / roadLength, 0),
    end: sanitize(attributes.end / roadLength, 1),
    spacing: attributes.spacing / roadLength,
    length: attributes.length / roadLength,
  };
  const paths = modeler({ ...attributes, curve, ...segmentAttributes });
  if (attributes.mirror) {
    return paths.concat(modeler({ ...attributes, curve, ...segmentAttributes, x: -attributes.x }));
  }
  return paths;
};

const pathsToModel = (paths, { y = 0, height = 0, shade = 0.5, alpha = 1, fade = 0, scaleX = 1, scaleY = 1, scaleZ = 1 }) => {
  const shape = new ShapePath();
  shape.subPaths = paths;
  const transparent = alpha < 1;
  return {
    transparent,
    geometry: makeGeometry(shape, height, shade, alpha, fade),
    position: new Vector3(0, 0, y),
    scale: new Vector3(scaleX, scaleY, scaleZ),
  };
};

const modelShape = (node, roadsById) => [
  pathsToModel(
    getChildrenOfTypes(node, ["solid", "dashed", "dotted"])
      .map((line) => modelLine(line, roadsById))
      .flat(),
    {
      ...node.attributes,
      scaleX: node.attributes.scale.x,
      scaleY: node.attributes.scale.y,
    }
  ),
];

const modelPart = ({ attributes, type }, featureAttributes) => {
  const modeler = partModelersByType[type];
  const lineAttributes = {
    ...attributes,
    ...featureAttributes,
    curve: featureAttributes.road.curve,
    start: featureAttributes.start + attributes.z,
    end: featureAttributes.end + attributes.z,
    length: attributes.length / featureAttributes.road.length,
  };
  const model = pathsToModel(modeler(lineAttributes), lineAttributes);
  if (attributes.mirror) {
    return [model, pathsToModel(modeler({ ...lineAttributes, x: -attributes.x }), lineAttributes)];
  }
  return [model];
};

const modelFeature = (node, roadsById) => {
  const road = getRoad(node.attributes.road, roadsById);
  const roadLength = road.length;
  const attributes = {
    ...node.attributes,
    road,
    start: sanitize(node.attributes.start / roadLength, 0),
    end: sanitize(node.attributes.end / roadLength, 1),
    spacing: node.attributes.spacing / roadLength,
  };
  return getChildrenOfTypes(node, ["box", "disk", "wire"])
    .map((part) => modelPart(part, attributes))
    .flat();
};

const modelCityscape = ({ attributes }, roadsById) => {
  const { rowSpacing, columnSpacing, heights, proximity, width, radius } = attributes;
  const road = getRoad(attributes.road, roadsById);
  if (rowSpacing <= 0) rowSpacing = 100;
  if (columnSpacing <= 0) columnSpacing = 100;
  const paths = Array(heights.length)
    .fill()
    .map((_) => []);

  const approximation = road.approximate();
  for (let x = -radius; x < radius; x += rowSpacing) {
    for (let y = -radius; y < radius; y += columnSpacing) {
      const pos = new Vector2(x, y);
      if (pos.length() < radius && distance(approximation.getNearestPoint(pos), pos) > proximity) {
        paths[Math.floor(Math.random() * heights.length)].push(makeSquarePath(pos.x, pos.y, width));
      }
    }
  }
  return heights.filter((height) => height > 0).map((height, index) => pathsToModel(paths[index], { ...attributes, height }));
};

const modelClouds = ({ attributes }) => {
  const { count, shade, scale, altitude, cloudRadius } = attributes;
  const paths = Array(count)
    .fill()
    .map((_) => new Vector2(Math.random() * 0.6 + 0.3).rotateAround(origin, Math.random() * TWO_PI).multiply(scale))
    .map(({ x, y }) => makeCirclePath(x, y, cloudRadius));
  return pathsToModel(paths, {
    y: altitude,
    height: 1,
    shade,
  });
};

const matrixElements = Array(16).fill(0);
const transformGeometry = ({ geometry, scale, position }) => {
  matrixElements[0] = scale.x;
  matrixElements[5] = scale.y;
  matrixElements[10] = scale.z;
  matrixElements[11] = position.z;
  matrixElements[12] = position.x;
  matrixElements[13] = position.y;
  matrixElements[15] = 1;
  geometry.applyMatrix4(new Matrix4().set(...matrixElements));
  return geometry;
};

const dehydrate = (geometry) =>
  Object.fromEntries(
    ["bulgeDirection", "idColor", "monochromeValue", "position"].map((name) => {
      const { array, itemSize } = geometry.attributes[name] ?? {
        array: null,
        itemSize: 0,
      };
      return [name, { array, itemSize }];
    })
  );

export default (node) => {
  const { uid } = node;
  const roadsById = {};
  getRoad(node.attributes, roadsById);
  const allModels = [
    ...getChildrenOfTypes(node, ["feature"])
      .map((feature) => modelFeature(feature, roadsById))
      .flat(),
    ...getChildrenOfTypes(node, ["shape"]).map((shape) => modelShape(shape, roadsById)),
    ...getChildrenOfTypes(node, ["cityscape"]).map((cityscape) => modelCityscape(cityscape, roadsById)),
  ].flat();
  const opaqueGeometry = dehydrate(mergeGeometries(allModels.filter((model) => !model.transparent).map(transformGeometry)));
  const transparentGeometry = dehydrate(mergeGeometries(allModels.filter((model) => model.transparent).map(transformGeometry)));
  const skyGeometry = dehydrate(mergeGeometries(getChildrenOfTypes(node, ["clouds"]).map(modelClouds).map(transformGeometry)));
  return {
    uid,
    opaqueGeometry,
    transparentGeometry,
    skyGeometry,
    roadsById: Object.fromEntries(Object.entries(roadsById).map(([key, { points }]) => [key, points])),
  };
};
