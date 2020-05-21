import { Mesh, Group, Vector2, ShapePath } from "./../lib/three/three.module.js";
import { getOffsetPoints, makeCirclePath, makePolygonPath, makeSquarePath } from "./paths.js";
import { fract, lerp, distance } from "./math.js";
import { makeGeometry, mergeGeometries, makeShadedMesh } from "./rendering.js";
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
  if (attributes == null) {
    return null;
  }
  const { id } = attributes;
  if (roadsById[id] == null) {
    const basis = getRoad(attributes.basis, roadsById);
    roadsById[id] = makeRoad(attributes, basis);
  }
  return roadsById[id];
};

// Lines

const renderSolidLine = ({ spacing, road, x, width, start, end }) => {
  if (start === end) {
    return [];
  }
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
  if (start === end) {
    return [];
  }
  start = fract(start);
  end = end === 1 ? 1 : fract(end);
  if (end < start) {
    end++;
  }
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
  if (start === end) {
    return [];
  }
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

// Meshes

const wrapPaths = paths => {
  const shape = new ShapePath();
  shape.subPaths = paths.slice();
  return shape;
};

const renderShape = (node, roadsById) => {
  const shape = wrapPaths(
    getChildrenOfTypes(node, ["solid", "dashed", "dotted"])
      .map(line => renderLine(line, roadsById))
      .flat()
  );
  const { y, height, shade, alpha, fade, scale } = node.attributes;
  const mesh = makeShadedMesh(makeGeometry(shape, height, 1), shade, alpha, fade);
  mesh.position.z = y;
  mesh.scale.set(scale.x, scale.y, 1);
  return [mesh];
};

const renderWire = attributes => {
  const start = attributes.start + attributes.z;
  const end = attributes.end + attributes.z;
  const shape = wrapPaths(
    renderSolidLine({
      ...attributes,
      start,
      end
    })
  );

  const { y, height, shade, alpha, fade } = attributes;
  const mesh = makeShadedMesh(makeGeometry(shape, height, 1), shade, alpha, fade);
  mesh.position.z = y;
  return mesh;
};

const renderBox = attributes => {
  const start = attributes.start + attributes.z;
  const end = attributes.end + attributes.z;
  const shape = wrapPaths(
    renderDashedLine({
      ...attributes,
      start,
      end
    })
  );

  const { y, height, shade, alpha, fade } = attributes;
  const mesh = makeShadedMesh(makeGeometry(shape, height, 1), shade, alpha, fade);
  mesh.position.z = y;
  return mesh;
};

const renderDisk = attributes => {
  const start = attributes.start + attributes.z;
  const end = attributes.end + attributes.z;
  const shape = wrapPaths(
    renderDottedLine({
      ...attributes,
      start,
      end
    })
  );

  const { y, height, shade, alpha, fade } = attributes;
  const mesh = makeShadedMesh(makeGeometry(shape, height, 1), shade, alpha, fade);
  mesh.position.z = y;
  return mesh;
};

const partRenderersByType = {
  disk: renderDisk,
  box: renderBox,
  wire: renderWire
};

const renderPart = ({ attributes, type }, featureAttributes) => {
  const render = partRenderersByType[type];
  const mesh = render({ ...attributes, ...featureAttributes });
  if (attributes.mirror) {
    return [mesh, render({ ...attributes, ...featureAttributes, x: -attributes.x })];
  }
  return [mesh];
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

  const { shade, fade } = attributes;
  return heights.filter(height => height > 0).map((height, index) => makeShadedMesh(makeGeometry(wrapPaths(paths[index]), height), shade, 1, fade));
};

const renderClouds = ({ attributes }) => {
  const { count, shade, scale, altitude, cloudRadius } = attributes;
  const paths = [];
  for (let i = 0; i < count; i++) {
    const pos = new Vector2(Math.random() - 0.5, Math.random() - 0.5);
    if (pos.length() < 0.9 && pos.length() > 0.3) {
      pos.multiply(scale);
      paths.push(makeCirclePath(pos.x, pos.y, cloudRadius));
    }
  }

  const cloudsMesh = makeShadedMesh(makeGeometry(wrapPaths(paths), 1), shade);
  cloudsMesh.position.z = altitude;
  return cloudsMesh;
};

const renderLevel = node => {
  const roadsById = {};
  getRoad(node.attributes, roadsById);
  const allMeshes = [
    ...getChildrenOfTypes(node, ["feature"])
      .map(feature => renderFeature(feature, roadsById))
      .flat(),
    ...getChildrenOfTypes(node, ["shape"]).map(mesh => renderShape(mesh, roadsById)),
    ...getChildrenOfTypes(node, ["cityscape"]).map(cityscape => renderCityscape(cityscape, roadsById))
  ].flat();
  const meshes = allMeshes.filter(mesh => !mesh.material.transparent);
  const transparentMeshes = allMeshes.filter(mesh => mesh.material.transparent);
  const skyMeshes = getChildrenOfTypes(node, ["clouds"]).map(renderClouds);
  return {
    ...node.attributes,
    meshes,
    transparentMeshes,
    skyMeshes,
    ...roadsById
  };
};

const mergeMeshes = meshes => new Mesh(mergeGeometries(meshes.map(({ geometry }) => geometry)), meshes[0]?.material);

const flattenMesh = mesh => {
  const geom = mesh.geometry;
  mesh.updateMatrix();
  geom.applyMatrix4(mesh.matrix);
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.set(1, 1, 1);
  mesh.updateMatrix();
};

export default levelData => {
  console.dir(levelData.attributes.name, levelData);
  console.time("Rendering " + levelData.attributes.name);
  const level = renderLevel(levelData);
  console.timeEnd("Rendering " + levelData.attributes.name);

  const { meshes, transparentMeshes, skyMeshes } = level;

  const world = new Group();
  level.world = world;
  meshes.forEach(flattenMesh);
  const combinedMesh = mergeMeshes(meshes);
  combinedMesh.geometry.computeBoundingSphere();
  level.worldRadius = combinedMesh.geometry.boundingSphere.radius;
  if (meshes.length > 0) {
    world.add(combinedMesh);
    console.log(combinedMesh.geometry.getAttribute("position").count / 3, "opaque triangles");
  }
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
      world.parent.remove(world);
    }

    world.children.forEach(child => child.geometry.dispose());
  };

  return level;
};
