import { Float32BufferAttribute, Mesh, BufferGeometry, ExtrudeBufferGeometry } from "./../lib/three/three.module.js";
import { BufferGeometryUtils } from "./../lib/three/utils/BufferGeometryUtils.js";
import { silhouetteMaterial, transparentMaterial } from "./materials.js";

const makeGeometry = (source, height, shade = 0, alpha = 1, fade = 0) => {
  const geom = new ExtrudeBufferGeometry(source.toShapes(false, false), {
    depth: Math.max(Math.abs(height), 0.0000001),
    curveSegments: 10,
    bevelEnabled: false,
  });
  geom.deleteAttribute("uv");
  geom.deleteAttribute("normal");
  shadeGeometry(geom, shade, alpha, fade);
  idGeometry(geom);
  bulgeGeometry(geom);
  return geom;
};

const getTriangleCount = (geometry) => (geometry.getAttribute("position")?.count ?? 0) / 3;

const bulgeGeometry = (geometry) => {
  const positions = geometry.getAttribute("position");
  const numVertices = positions.count;
  const bulgeDirections = [];
  for (let i = 0; i < numVertices; i++) {
    const z = positions.array[i * 3 + 2];
    bulgeDirections.push(z <= 0 ? -1 : 1);
  }

  geometry.setAttribute("bulgeDirection", new Float32BufferAttribute(bulgeDirections, 1));
  return geometry;
};

const shadeGeometry = (geometry, shade, alpha = 1, fade = 0) => {
  const numVertices = geometry.getAttribute("position").count;
  const monochromeValues = [];
  for (let i = 0; i < numVertices; i++) {
    monochromeValues.push(shade);
    monochromeValues.push(alpha);
    monochromeValues.push(fade);
  }

  geometry.setAttribute("monochromeValue", new Float32BufferAttribute(monochromeValues, 3));
  return geometry;
};

let [idRed, idGreen, idBlue] = [0, 0, 0];

const idGeometry = (geometry) => {
  const numVertices = geometry.getAttribute("position").count;
  idRed = (idRed + 0x23) % 0xff;
  idGreen = (idGreen + 0x67) % 0xff;
  idBlue = (idBlue + 0xac) % 0xff;
  const idValues = [];
  for (let i = 0; i < numVertices; i++) {
    idValues.push(idRed / 0xff);
    idValues.push(idGreen / 0xff);
    idValues.push(idBlue / 0xff);
  }

  geometry.setAttribute("idColor", new Float32BufferAttribute(idValues, 3));
  return geometry;
};

const mergeGeometries = (geometries, dispose = true) => {
  if (geometries.length === 0) return new BufferGeometry();

  const numIndexed = geometries.filter((geometry) => geometry.index != null).length;
  if (numIndexed > 0 && numIndexed < geometries.length) {
    throw new Error("You can't merge indexed and non-indexed buffer geometries.");
  }

  const merged = BufferGeometryUtils.mergeBufferGeometries(geometries);
  if (dispose) geometries.forEach((geom) => geom.dispose());
  return merged;
};

const makeMesh = (geom, isTransparent = false) => new Mesh(geom, isTransparent ? transparentMaterial : silhouetteMaterial);

export { makeGeometry, getTriangleCount, shadeGeometry, bulgeGeometry, idGeometry, mergeGeometries, makeMesh };
