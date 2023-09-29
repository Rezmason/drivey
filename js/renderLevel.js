import { Group, BufferGeometry, BufferAttribute } from "./../lib/three/three.module.js";
import { Road } from "./roads.js";
import { getTriangleCount, makeMesh } from "./geometry.js";
import modelLevel from "./modelLevel.js";

const rehydrate = (attributeData) => {
  const geometry = new BufferGeometry();
  Object.keys(attributeData).forEach((name) => {
    const { array, itemSize } = attributeData[name];
    if (itemSize > 0) {
      geometry.setAttribute(name, new BufferAttribute(array, itemSize));
    }
  });
  return geometry;
};

// const worker = new Worker("./js/worker.js", {type: "module"});
// worker.addEventListener("error", event => console.log(event));

const modelLevelAsync = (levelData) =>
  new Promise((resolve) => {
    resolve(modelLevel(levelData));
    /*
  const uid = Math.floor(Math.random() * 0xFFFFFFFF);
  const handler = ({data}) => {
    if (data.uid === uid) {
      worker.removeEventListener("message", handler);
      resolve(data);
    }
  };
  worker.addEventListener("message", handler);
  worker.postMessage({ ...levelData, uid });
  */
  });

export default async (levelData) => {
  console.dir(levelData.attributes.name, levelData);
  console.time("Modeling " + levelData.attributes.name);
  const models = await modelLevelAsync(levelData);
  console.timeEnd("Modeling " + levelData.attributes.name);

  const opaqueGeometry = rehydrate(models.opaqueGeometry);
  const transparentGeometry = rehydrate(models.transparentGeometry);
  const skyGeometry = rehydrate(models.skyGeometry);
  const roadsById = Object.fromEntries(Object.entries(models.roadsById).map(([id, points]) => [id, new Road(points)]));

  opaqueGeometry.computeBoundingSphere();
  const worldRadius = opaqueGeometry.boundingSphere.radius;
  const world = new Group();

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
  const skyCount = getTriangleCount(skyGeometry);
  if (skyCount > 0) {
    sky.add(makeMesh(skyGeometry, false));
    console.log(skyCount, "sky triangles");
  }

  const dispose = () => {
    world.parent?.remove(world);
    world.children.forEach((child) => child.geometry.dispose());
  };

  return {
    ...levelData.attributes,
    ...roadsById,
    world,
    sky,
    worldRadius,
    dispose,
  };
};
