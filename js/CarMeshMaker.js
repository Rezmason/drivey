const createVolume = (topFront, bottomFront, topBack, bottomBack) => {
  const geometry = new THREE.CubeGeometry();
  geometry.vertices[0].copy(topFront);
  geometry.vertices[1].copy(bottomFront);
  geometry.vertices[2].copy(topBack);
  geometry.vertices[3].copy(bottomBack);
  geometry.vertices[4].copy(bottomFront);
  geometry.vertices[5].copy(topFront);
  geometry.vertices[6].copy(bottomBack);
  geometry.vertices[7].copy(topBack);
  geometry.vertices[4].x *= -1;
  geometry.vertices[5].x *= -1;
  geometry.vertices[6].x *= -1;
  geometry.vertices[7].x *= -1;
  // geometry.verticesNeedUpdate = true;
  return geometry;
}

const generate = () => {
  const boxes = Math.floor(Math.random() * 3) + 1;
  const hasPillarD = Math.random() > 0.5;
  const pillarPositions = Array(4).fill().map(() => Math.random());
  const [cabinWidth, cabinLength, cabinHeight] = [Math.random(), Math.random(), Math.random()];
  const [hoodLength, trunkLength] = [Math.random(), Math.random()];
  const [roofWidth, roofLength, roofHeight] = [Math.random(), Math.random(), Math.random()];
  const hasDeck = Math.random() > 0.5;
  const isConvertible = Math.random() > 0.9;
  const [frontOverhang, rearOverhang] = [Math.random(), Math.random()];

  const hoodVolume = createVolume(
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  );
  const roofVolume = createVolume(
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  );
  const lowerCabinVolume = createVolume(
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  );
  const columnAVolumes = createVolume(
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  );
  const columnBVolumes = createVolume(
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  );
  const columnCVolumes = createVolume(
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  );
  const columnDVolumes = createVolume(
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  );
  const trunkVolume = createVolume(
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  );

  // Declare front axle
  // Declare rear axle

  /*
  Details:
    Wheel wells and wheels
      Hub caps
    Front and back windows (light, or maybe absent)
    Side windows (light)
    License plates
    Fenders (black)
    Character lines
    Headlights (white)
    Tail lights
  */

  return new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10), new THREE.MeshBasicMaterial({color: Math.floor(Math.random() * 0xFFFFFF), wireframe: true})); // silhouette
};

const CarMeshMaker = { generate };
