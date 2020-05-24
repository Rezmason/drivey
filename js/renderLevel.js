import { Mesh, Group, Vector2, Vector3, Matrix4, ShapePath } from "./../lib/three/three.module.js";
import { getOffsetPoints, makeCirclePath, makePolygonPath, makeSquarePath } from "./paths.js";
import { fract, lerp, distance, origin, TWO_PI } from "./math.js";
import { makeGeometry, mergeGeometries, makeMesh } from "./rendering.js";
import Road from "./Road.js";

const getChildrenOfTypes = (node, types) => node.children.filter(child => types.includes(child.type));

// Roads

const roadWedges = Array(16)
  .fill()
  .map((_, index) => (index / 16) * Math.PI * 2)
  .map(theta => new Vector2(-Math.cos(theta), Math.sin(theta)));

const makeRoad = ({ windiness, scale }, basis) => {
  if (basis != null) {
    const road = basis.clone();
    road.scale(scale.x, scale.y);
    return road;
  }

  const controlPoints = roadWedges.map((point, i) => point.clone().multiplyScalar(lerp(1, Math.random(), windiness)));

  const minX = Math.min(...controlPoints.map(({ x }) => x));
  const maxX = Math.max(...controlPoints.map(({ x }) => x));
  const minY = Math.min(...controlPoints.map(({ y }) => y));
  const maxY = Math.max(...controlPoints.map(({ y }) => y));

  const center = new Vector2(maxX + minX, maxY + minY).multiplyScalar(0.5);
  const aspect = new Vector2(1, (maxY - minY) / (maxX - minX));

  controlPoints.forEach(point => {
    point.sub(center);
    point.multiply(aspect);
    point.multiply(scale);
  });

  return new Road(controlPoints);
};

const getRoad = (attributes, roadsById) => {
  if (attributes == null) return null;
  const { id } = attributes;
  if (roadsById[id] == null) {
    const basis = getRoad(attributes.basis, roadsById);
    roadsById[id] = makeRoad(attributes, basis);
  }
  return roadsById[id];
};

// Lines

const renderSolidLine = ({ spacing, road, x, width, start, end }) => {
  if (start === end) return [];
  width = Math.abs(width);
  const outsidePoints = getOffsetPoints(road.curve, x - width / 2, start, end, spacing / road.length);
  const insidePoints = getOffsetPoints(road.curve, x + width / 2, start, end, spacing / road.length);
  outsidePoints.reverse();
  if (Math.abs(end - start) < 1) {
    return [makePolygonPath(outsidePoints.concat(insidePoints))];
  } else {
    return [makePolygonPath(outsidePoints), makePolygonPath(insidePoints)];
  }
};

const renderDashedLine = ({ spacing, length, road, x, width, start, end }) => {
  if (start === end) return [];
  start = fract(start);
  end = end === 1 ? 1 : fract(end);
  if (end < start) end++;
  const dashSpan = (length + spacing) / road.length;
  const dashLength = (dashSpan * length) / (length + spacing);
  const dashes = [];
  for (let dashStart = start; dashStart < end; dashStart += dashSpan) {
    dashes.push(
      renderSolidLine({
        road,
        x,
        width,
        start: dashStart,
        end: Math.min(end, dashStart + dashLength)
      })
    );
  }
  return dashes.flat(); // TODO: array map
};

const renderDottedLine = ({ spacing, road, x, width, start, end }) => {
  if (start === end) return [];
  const positions = getOffsetPoints(road.curve, x, start, end, spacing / road.length);
  return positions.map(pos => makeCirclePath(pos.x, pos.y, width)).flat();
};

const lineRenderersByType = {
  solid: renderSolidLine,
  dashed: renderDashedLine,
  dotted: renderDottedLine
};

const renderLine = ({ attributes, type }, roadsById) => {
  const render = lineRenderersByType[type];
  const road = getRoad(attributes.road, roadsById);
  const paths = render({ ...attributes, road });
  if (attributes.mirror) {
    return paths.concat(render({ ...attributes, road, x: -attributes.x }));
  }
  return paths;
};

// Models

const pathsToModel = (paths, { y = 0, height = 0, shade = 0.5, alpha = 1, fade = 0, scaleX = 1, scaleY = 1, scaleZ = 1 }) => {
  const shape = new ShapePath();
  shape.subPaths = paths;
  const transparent = alpha < 1;
  return {
    transparent,
    geometry: makeGeometry(shape, height, shade, alpha, fade),
    position: new Vector3(0, 0, y),
    scale: new Vector3(scaleX, scaleY, scaleZ)
  };
};

const renderShape = (node, roadsById) => [
  pathsToModel(
    getChildrenOfTypes(node, ["solid", "dashed", "dotted"])
      .map(line => renderLine(line, roadsById))
      .flat(),
    {
      ...node.attributes,
      scaleX: node.attributes.scale.x,
      scaleY: node.attributes.scale.y
    }
  )
];

const partRenderersByType = {
  disk: renderDottedLine,
  box: renderDashedLine,
  wire: renderSolidLine
};

const renderPart = ({ attributes, type }, featureAttributes) => {
  const render = partRenderersByType[type];
  const lineAttributes = {
    ...attributes,
    ...featureAttributes,
    start: featureAttributes.start + attributes.z,
    end: featureAttributes.end + attributes.z
  };
  const model = pathsToModel(render(lineAttributes), lineAttributes);
  if (attributes.mirror) {
    return [model, pathsToModel(render({ ...lineAttributes, x: -attributes.x }), lineAttributes)];
  }
  return [model];
};

const renderFeature = (node, roadsById) => {
  const road = getRoad(node.attributes.road, roadsById);
  const attributes = { ...node.attributes, road };
  return getChildrenOfTypes(node, ["box", "disk", "wire"])
    .map(part => renderPart(part, attributes))
    .flat();
};

const renderCityscape = ({ attributes }, roadsById) => {
  const { rowSpacing, columnSpacing, heights, proximity, width, radius } = attributes;
  const road = getRoad(attributes.road, roadsById);
  if (rowSpacing <= 0) rowSpacing = 100;
  if (columnSpacing <= 0) columnSpacing = 100;
  const paths = Array(heights.length)
    .fill()
    .map(_ => []);

  const approximation = road.approximate();
  for (let x = -radius; x < radius; x += rowSpacing) {
    for (let y = -radius; y < radius; y += columnSpacing) {
      const pos = new Vector2(x, y);
      if (pos.length() < radius && distance(approximation.getNearestPoint(pos), pos) > proximity) {
        paths[Math.floor(Math.random() * heights.length)].push(makeSquarePath(pos.x, pos.y, width));
      }
    }
  }
  return heights.filter(height => height > 0).map((height, index) => pathsToModel(paths[index], { ...attributes, height }));
};

const renderClouds = ({ attributes }) => {
  const { count, shade, scale, altitude, cloudRadius } = attributes;
  const paths = Array(count)
    .fill()
    .map(_ => new Vector2(Math.random() * 0.6 + 0.3).rotateAround(origin, Math.random() * TWO_PI).multiply(scale))
    .map(({ x, y }) => makeCirclePath(x, y, cloudRadius));
  return pathsToModel(paths, {
    y: altitude,
    height: 1,
    shade
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

const renderLevel = node => {
  const roadsById = {};
  getRoad(node.attributes, roadsById);
  const allModels = [
    ...getChildrenOfTypes(node, ["feature"])
      .map(feature => renderFeature(feature, roadsById))
      .flat(),
    ...getChildrenOfTypes(node, ["shape"]).map(shape => renderShape(shape, roadsById)),
    ...getChildrenOfTypes(node, ["cityscape"]).map(cityscape => renderCityscape(cityscape, roadsById))
  ].flat();
  const opaqueGeometry = mergeGeometries(allModels.filter(model => !model.transparent).map(transformGeometry));
  const transparentGeometry = mergeGeometries(allModels.filter(model => model.transparent).map(transformGeometry));
  const skyGeometry = mergeGeometries(
    getChildrenOfTypes(node, ["clouds"])
      .map(renderClouds)
      .map(transformGeometry)
  );
  return {
    ...node.attributes,
    opaqueGeometry,
    transparentGeometry,
    skyGeometry,
    ...roadsById
  };
};

const getTriangleCount = geometry => (geometry.getAttribute("position")?.count ?? 0) / 3;

export default levelData => {
  console.dir(levelData.attributes.name, levelData);
  console.time("Rendering " + levelData.attributes.name);
  const level = renderLevel(levelData);
  console.timeEnd("Rendering " + levelData.attributes.name);

  const { opaqueGeometry, transparentGeometry, skyGeometry } = level;

  const world = new Group();
  level.world = world;
  opaqueGeometry.computeBoundingSphere();
  level.worldRadius = opaqueGeometry.boundingSphere.radius;

  const opaqueCount = getTriangleCount(opaqueGeometry);
  if (opaqueCount > 0) {
    world.add(makeMesh(opaqueGeometry, false));
    console.log(opaqueCount, "opaque triangles");
  }

  const transparentCount = getTriangleCount(transparentGeometry);
  if (transparentCount > 0) {
    world.add(makeMesh(transparentGeometry, true));
    console.log(transparentCount, "transparent triangles");
  }

  const sky = new Group();
  level.sky = sky;
  const skyCount = getTriangleCount(skyGeometry);
  if (skyCount > 0) {
    sky.add(makeMesh(skyGeometry, false));
    console.log(skyCount, "sky triangles");
  }

  level.dispose = () => {
    world.parent?.remove(world);
    world.children.forEach(child => child.geometry.dispose());
  };

  return level;
};
