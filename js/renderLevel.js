import { Mesh, Group, Vector2, ShapePath } from "./../lib/three/three.module.js";
import { getExtrudedPointAt, makeGeometry, addPath, makeCirclePath, makePolygonPath, makeRectanglePath, mergeGeometries } from "./shapes.js";
import { distance } from "./math.js";
import { makeShadedMesh } from "./rendering.js";

const renderSolidLine = (shapePath, { pointSpacing, road, xPos, width, start, end }) => {
  if (start == end) {
    return;
  }
  width = Math.abs(width);
  const outsideOffset = xPos - width / 2;
  const insideOffset = xPos + width / 2;
  const outsidePoints = [];
  const insidePoints = [];
  outsidePoints.push(getExtrudedPointAt(road.curve, start, outsideOffset));
  insidePoints.push(getExtrudedPointAt(road.curve, start, insideOffset));
  if (pointSpacing > 0) {
    const psFraction = pointSpacing / road.length;
    let i = Math.ceil(start / psFraction) * psFraction;
    if (i == start) i += psFraction;
    while (i < end) {
      outsidePoints.push(getExtrudedPointAt(road.curve, i, outsideOffset));
      insidePoints.push(getExtrudedPointAt(road.curve, i, insideOffset));
      i += psFraction;
    }
  }
  outsidePoints.push(getExtrudedPointAt(road.curve, end, outsideOffset));
  insidePoints.push(getExtrudedPointAt(road.curve, end, insideOffset));
  outsidePoints.reverse();
  if (start == 0 && end == 1) {
    addPath(shapePath, makePolygonPath(outsidePoints));
    addPath(shapePath, makePolygonPath(insidePoints));
  } else {
    addPath(shapePath, makePolygonPath(outsidePoints.concat(insidePoints)));
  }
};

const renderDashedLine = (shapePath, { off, on, pointSpacing, road, xPos, width, start, end }) => {
  if (start == end) {
    return shapePath;
  }
  const dashSpan = (on + off) / road.length;
  const dashLength = (dashSpan * on) / (on + off);
  for (let dashStart = start; dashStart < end; dashStart += dashSpan) {
    const dashEnd = Math.min(end, dashStart + dashLength);
    renderSolidLine(shapePath, {
      pointSpacing,
      road,
      xPos,
      width,
      start: dashStart,
      end: dashEnd
    });
  }
};

const renderDottedLine = (shapePath, { spacing, road, xPos, width, start, end }) => {
  if (start == end) {
    return;
  }
  const dotSpan = spacing / road.length;
  for (let dotStart = start; dotStart < end; dotStart += dotSpan) {
    const pos = getExtrudedPointAt(road.curve, dotStart, xPos);
    addPath(shapePath, makeCirclePath(pos.x, pos.y, width));
  }
};

const lineRenderersByType = {
  solid: renderSolidLine,
  dash: renderDashedLine,
  dot: renderDottedLine
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

const forEachChildOfType = (node, type, f) => node.children.filter(child => child.type === type).forEach(f);

const renderLine = ({ attributes, type }, path) => {
  const render = lineRenderersByType[type];
  render(path, { ...attributes, xPos: attributes.xPos });
  if (attributes.mirror) {
    render(path, { ...attributes, xPos: -attributes.xPos });
  }
};

const renderCityscape = ({ attributes }, mush) => {
  const { road, rowSpacing, columnSpacing, heights, proximity, width, radius } = attributes;
  if (rowSpacing <= 0) rowSpacing = 100;
  if (columnSpacing <= 0) columnSpacing = 100;
  const paths = Array(heights.length)
    .fill()
    .map(_ => new ShapePath());

  const approximation = road.approximate();
  for (let x = -radius; x < radius; x += rowSpacing) {
    for (let y = -radius; y < radius; y += columnSpacing) {
      const pos = new Vector2(x, y);
      if (pos.length() < radius && distance(approximation.getNearestPoint(pos), pos) > proximity) {
        addPath(paths[Math.floor(Math.random() * heights.length)], makeRectanglePath(pos.x + -width / 2, pos.y + -width / 2, width, width));
      }
    }
  }

  const { shade, alpha, fade } = attributes;
  heights.forEach((height, index) => {
    if (height <= 0) {
      return;
    }
    const path = paths[index];
    const geometry = makeGeometry(path, height, 1);
    const mesh = makeShadedMesh(geometry, shade, alpha, fade);
    if (alpha < 1) {
      mush.transparentMeshes.push(mesh);
    } else {
      mush.meshes.push(mesh);
    }
  });
};

const renderClouds = ({ attributes }, { skyMeshes }) => {
  const { count, shade, scale, z } = attributes;
  const path = new ShapePath();
  for (let i = 0; i < count; i++) {
    const pos = new Vector2(Math.random() - 0.5, Math.random() - 0.5);
    if (pos.length() < 0.9 && pos.length() > 0.3) {
      pos.multiplyScalar(1000);
      addPath(path, makeCirclePath(pos.x, pos.y, 50));
    }
  }

  const cloudsMesh = makeShadedMesh(makeGeometry(path, 1, 200), shade);
  cloudsMesh.scale.multiplyScalar(scale);
  cloudsMesh.position.z = z;
  skyMeshes.push(cloudsMesh);
};

const renderMesh = (node, mush) => {
  const path = new ShapePath();
  forEachChildOfType(node, "solid", line => renderLine(line, path));
  forEachChildOfType(node, "dash", line => renderLine(line, path));
  forEachChildOfType(node, "dot", line => renderLine(line, path));
  const { depth, curveSegments, shade, alpha, fade, z, scale } = node.attributes;
  const mesh = makeShadedMesh(makeGeometry(path, depth, curveSegments), shade, alpha, fade);
  mesh.position.z = z;
  mesh.scale.set(scale.x, scale.y, 1);
  if (alpha < 1) {
    mush.transparentMeshes.push(mesh);
  } else {
    mush.meshes.push(mesh);
  }
};

const renderLevel = node => {
  const meshes = [];
  const transparentMeshes = [];
  const skyMeshes = [];
  const mush = { meshes, transparentMeshes, skyMeshes }; // TODO: refactor

  forEachChildOfType(node, "mesh", mesh => renderMesh(mesh, mush));
  forEachChildOfType(node, "cityscape", cityscape => renderCityscape(cityscape, mush));
  forEachChildOfType(node, "clouds", clouds => renderClouds(clouds, mush));
  return {
    ...node.attributes,
    meshes,
    transparentMeshes,
    skyMeshes,
    mainRoad: node.mainRoad
  };
};

export default root => {
  console.log(root);

  const level = renderLevel(root);
  const { meshes, transparentMeshes, skyMeshes } = level;

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
