import { Mesh, Color, Vector2, Group } from "./../lib/three/three.module.js";

import RoadLineStyle from "./RoadLineStyle.js";
import { getExtrudedPointAt, makeGeometry, addPath, makeCirclePath, makePolygonPath, mergeGeometries } from "./shapes.js";
import { makeShadedMesh } from "./rendering.js";

const mergeMeshes = meshes => {
  const geom = mergeGeometries(meshes.map(mesh => mesh.geometry));
  return new Mesh(geom, meshes[0]?.material);
};

const flattenMesh = mesh => {
  const geom = mesh.geometry;
  mesh.updateMatrix();
  geom.applyMatrix(mesh.matrix);
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.set(1, 1, 1);
  mesh.updateMatrix();
};

export default class Level {
  constructor() {}

  dispose() {
    if (this.world.parent != null) {
      this.world.parent.remove(this.world);
    }

    this.world.children.forEach(child => child.geometry.dispose());
    this.world = null;
  }

  build(meshes, transparentMeshes, skyMeshes) {}

  drawRoadLine(roadPath, shapePath, xPos, width, style, start, end) {
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
            this.drawRoadLine(roadPath, shapePath, xPos, width, { type: "solid", pointSpacing }, dashStart, Math.min(end, dashStart + dashLength));
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
  }

  makeMesh(shapePath, depth, curveSegments, value, alpha = 1, fade = 0) {
    return makeShadedMesh(makeGeometry(shapePath, depth, curveSegments), value, alpha, fade);
  }

  finish(meshes, transparentMeshes, skyMeshes) {
    this.world = new Group();
    meshes.forEach(flattenMesh);
    const combinedMesh = mergeMeshes(meshes);
    combinedMesh.geometry.computeBoundingSphere();
    this.worldRadius = combinedMesh.geometry.boundingSphere.radius;
    if (meshes.length > 0) this.world.add(combinedMesh);
    meshes.forEach(mesh => mesh.geometry.dispose());
    meshes.length = 0;

    transparentMeshes.forEach(flattenMesh);
    if (transparentMeshes.length > 0) this.world.add(mergeMeshes(transparentMeshes));
    transparentMeshes.forEach(mesh => mesh.geometry.dispose());
    transparentMeshes.length = 0;

    skyMeshes.forEach(flattenMesh);
    this.sky = new Group();
    if (skyMeshes.length > 0) this.sky.add(mergeMeshes(skyMeshes));
    skyMeshes.forEach(mesh => mesh.geometry.dispose());
    skyMeshes.length = 0;
  }
}
