import { Group } from "./../lib/three/three.module.js";
import { getTriangleCount, makeMesh } from "./geometry.js";
import modelLevel from "./modelLevel.js";

export default levelData => {
  console.dir(levelData.attributes.name, levelData);
  console.time("Modeling " + levelData.attributes.name);
  const level = modelLevel(levelData);
  console.timeEnd("Modeling " + levelData.attributes.name);

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
