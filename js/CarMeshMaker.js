const createVolume = (topFront, bottomFront, topBack, bottomBack, outerSlope, innerSlope) => {
  if (outerSlope == null) outerSlope = v => 0.5;
  if (innerSlope == null) innerSlope = v => 0;

  const geometry = new THREE.CubeGeometry();
  geometry.vertices[0].set(outerSlope(topFront), topFront.y, topFront.x);
  geometry.vertices[1].set(outerSlope(bottomFront), bottomFront.y, bottomFront.x);
  geometry.vertices[2].set(outerSlope(topBack), topBack.y, topBack.x);
  geometry.vertices[3].set(outerSlope(bottomBack), bottomBack.y, bottomBack.x);
  geometry.vertices[4].set(innerSlope(bottomFront), bottomFront.y, bottomFront.x);
  geometry.vertices[5].set(innerSlope(topFront), topFront.y, topFront.x);
  geometry.vertices[6].set(innerSlope(bottomBack), bottomBack.y, bottomBack.x);
  geometry.vertices[7].set(innerSlope(topBack), topBack.y, topBack.x);
  // geometry.verticesNeedUpdate = true;
  return geometry;
}

const generate = () => {

  const rand = (mag, offset) => offset + mag * Math.random();

  const wheelRadius = rand(0.05, 0.25);
  const groundClearance = wheelRadius * 0.5;
  const columnNudge = new THREE.Vector2(0.05, 0);
  const roofThickness = 0.05;

  const isTwoDoor = Math.random() > 0.5;
  const hasPillarD = isTwoDoor || Math.random() > 0.5;
  const isConvertible = Math.random() > 0.9;
  const pillarSpacings = [
    rand(0.1, wheelRadius * 2 + 0.1), // front windshield
    rand(isTwoDoor ? 0.2 : 0.1, 0.7), // front seats
    isTwoDoor ? 0 : rand(0.1, 0.5), // rear seats
    rand((hasPillarD && !isTwoDoor) ? 0.2 : 0.1, wheelRadius * 2 + 0.1) // rear windshield
  ];
  const cabinWidth = rand(1, 0);
  const roofWidth = rand(1, 0);
  const hoodHeight = rand(0.0125, 0);
  const cabinHeight1 = rand(0.0125, 0.05 + wheelRadius * 2 - groundClearance);
  const cabinHeight2 = rand(0.0125, 0.1);
  const roofHeight = rand(0.025, 0.3);
  const frontWindshieldTaper = rand(0.8, 0.05);
  const rearWindshieldTaper = Math.min(frontWindshieldTaper, rand(hasPillarD ? 0.2 : 0.3, 0));
  const frontOverhang = rand(0.7, 0.1);
  const rearOverhang = rand(0.7, 0.1);
  const bottomTaper = rand(0.1, 0);

  /*

                    T----U------V-----------W
                    P----Q------R-----------S
                   /     |      |            \
                  /      |      |             \
  K_______-------L-------M------N--------------O     Side view
  |              |       |      |              |
  F--------------G-------H------I--------------J
   \       __    |       |      |      __     /   ====33 toot!
    A-----/  \---B-------C------D-----/  \---E

           FA                          RA

  F-A-----[==]---B-------C------D-----[==]---E-J
  | |     [==]   |       |      |     [==]   | |
  | |      ][    |       |      |      ][    | |
  | |      ][    |       |      |      ][    | |
  | |      ][    |       |      |      ][    | |
  | |      ][    |       |      |      ][    | |
  | |      ][    |       |      |      ][    | |     Bottom view
  | |      ][    |       |      |      ][    | |
  | |      ][    |       |      |      ][    | |
  | |      ][    |       |      |      ][    | |
  | |      ][    |       |      |      ][    | |
  | |     [==]   |       |      |     [==]   | |
  f-a-----[==]---b-------c------d-----[==]---e-j

   _______-------L-------M------N--------------O
  K              |\      |      |             /|
  |              | \     |      |            / |
  |              |  P----Q------R-----------S  |
  |              |  |                       |  |
  |              |  |                       |  |
  |              |  |                       |  |     Top view
  |              |  |                       |  |
  |              |  |                       |  |
  |              |  p----q------r-----------s  |
  |              | /     |      |            \ |
  k              |/      |      |             \|
   -------_______l-------m------n--------------o

  */

  // main bottom
  const a = new THREE.Vector2(0 + bottomTaper, groundClearance);
  const b = new THREE.Vector2(a.x + pillarSpacings[0], groundClearance);
  const c = new THREE.Vector2(b.x + pillarSpacings[1], groundClearance);
  const d = new THREE.Vector2(c.x + pillarSpacings[2], groundClearance);
  const e = new THREE.Vector2(d.x + pillarSpacings[3] - bottomTaper, groundClearance);

  // main middle
  const f = new THREE.Vector2(a.x - bottomTaper, a.y + cabinHeight1);
  const g = new THREE.Vector2(b.x, b.y + cabinHeight1);
  const h = new THREE.Vector2(c.x, c.y + cabinHeight1);
  const i = new THREE.Vector2(d.x, d.y + cabinHeight1);
  const j = new THREE.Vector2(e.x + bottomTaper, e.y + cabinHeight1);

  // main top
  const k = new THREE.Vector2(f.x, f.y + hoodHeight);
  const l = new THREE.Vector2(g.x, g.y + hoodHeight + cabinHeight2);
  const m = new THREE.Vector2(h.x, h.y + hoodHeight + cabinHeight2);
  const n = new THREE.Vector2(i.x, i.y + hoodHeight + cabinHeight2);
  const o = new THREE.Vector2(j.x, j.y + hoodHeight + cabinHeight2);

  // roof
  const p = new THREE.Vector2(l.x + frontWindshieldTaper * pillarSpacings[1], l.y + roofHeight);
  const q = new THREE.Vector2(m.x, m.y + roofHeight);
  const r = new THREE.Vector2(hasPillarD ? n.x : n.x - rearWindshieldTaper, n.y + roofHeight);
  const s = new THREE.Vector2(o.x - rearWindshieldTaper, hasPillarD ? o.y + roofHeight : o.y);

  // below roof
  const t = new THREE.Vector2(p.x + columnNudge.x, p.y + roofThickness);
  const u = new THREE.Vector2(q.x, q.y + roofThickness);
  const v = new THREE.Vector2(r.x + (hasPillarD ? 0 : -columnNudge.x), r.y + roofThickness);
  const w = new THREE.Vector2(s.x + (hasPillarD ? -columnNudge.x : 0), s.y + roofThickness);

  // Column bar vertices
  const l2 = l.clone().add(columnNudge);
  const m2 = m.clone().add(columnNudge);
  const n2 = hasPillarD ? n.clone().add(columnNudge) : n.clone().sub(columnNudge);
  const o2 = o.clone().sub(columnNudge);

  const p2 = p.clone().add(columnNudge);
  const q2 = q.clone().add(columnNudge);
  const r2 = hasPillarD ? r.clone().add(columnNudge) : r.clone().sub(columnNudge);
  const s2 = s.clone().sub(columnNudge);

  // mirrors
  const mirrorBF = l.clone();
  const mirrorTF = l.clone(); mirrorTF.y += 0.1;
  const mirrorBB = l2.clone();
  const mirrorTB = l2.clone(); mirrorTB.y += 0.1;

  const mergedGeometry = new THREE.Geometry();
  const mergedTransparentGeometry = new THREE.Geometry();
  const volumes = [];
  const transparentVolumes = [];

  volumes.push(createVolume(mirrorTF, mirrorBF, mirrorTB, mirrorBB, v => 0.5 + 0.15, v => 0.5));

  volumes.push(createVolume(f, a, g, b));
  volumes.push(createVolume(g, b, h, c));
  volumes.push(createVolume(h, c, i, d));
  volumes.push(createVolume(i, d, j, e));

  volumes.push(createVolume(k, f, l, g));
  volumes.push(createVolume(l, g, m, h));
  volumes.push(createVolume(m, h, n, i));
  volumes.push(createVolume(n, i, o, j));

  volumes.push(createVolume(p, l, p2, l2, v => 0.5, v => 0.5 - columnNudge.x));

  transparentVolumes.push(createVolume(p2, l2, p2, l2, v => 0.5 - columnNudge.x));

  if (isConvertible) {
    volumes.push(createVolume(p, t, p2, t /*, outerSlope, innerSlope*/));
  } else {
    volumes.push(createVolume(q, m, q2, m2, v => 0.5, v => 0.5 - columnNudge.x));
    volumes.push(createVolume(r, n, r2, n2, v => 0.5, v => 0.5 - columnNudge.x));
    volumes.push(createVolume(s, o, s2, o2, v => 0.5, v => 0.5 - columnNudge.x));

    transparentVolumes.push(createVolume(p2, l2, q, m, v => 0.5 - columnNudge.x, v => 0.5 - columnNudge.x));
    transparentVolumes.push(createVolume(q2, m2, r, n, v => 0.5 - columnNudge.x, v => 0.5 - columnNudge.x));

    if (hasPillarD) {
      volumes.push(createVolume(t, p, w, s /*, outerSlope, innerSlope*/));
      transparentVolumes.push(createVolume(s, o, s, o, v => 0.5 - columnNudge.x));
      transparentVolumes.push(createVolume(r2, n2, s2, o2, v => 0.5 - columnNudge.x, v => 0.5 - columnNudge.x));
    } else {
      volumes.push(createVolume(t, p, v, r /*, outerSlope, innerSlope*/));
      transparentVolumes.push(createVolume(r, n, r, n, v => 0.5 - columnNudge.x));
    }
  }

  volumes.forEach(geom => mergedGeometry.merge(geom));
  transparentVolumes.forEach(geom => mergedTransparentGeometry.merge(geom));

  const flip = new THREE.Matrix4().scale(new THREE.Vector3(-1, 1, 1));
  mergedGeometry.merge(mergedGeometry.clone(), flip);
  mergedTransparentGeometry.merge(mergedTransparentGeometry.clone(), flip);

  const frontAxle = a.clone(); frontAxle.x += wheelRadius + frontOverhang * (pillarSpacings[0] - wheelRadius * 2);
  const rearAxle = e.clone(); rearAxle.x -= wheelRadius + rearOverhang * (pillarSpacings[3] - wheelRadius * 2 - bottomTaper);

  // TODO: horizontal differences

  /*
  TODO: Details
    License plates
    Fenders (black)
    Headlights (white)
    Tail lights
    Character lines
  */

  const mesh = new THREE.Mesh(
    mergedGeometry,
    new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0xFFFFFF, wireframe: false}) // silhouette
  );

  const windowMesh = new THREE.Mesh(
    mergedTransparentGeometry,
    new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0xFF0000, transparent: true, blending: THREE.MultiplyBlending})
  );

  const whole = new THREE.Group();

  whole.add(mesh);
  whole.add(windowMesh);
  whole.position.y = e.x / 2; // temporary
  whole.rotation.x = Math.PI * 0.5;
  whole.scale.multiplyScalar(1.5);

  const frontLeftWheel = new THREE.Mesh(
    new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelRadius * 0.5, 30),
    new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: false})
  );
  const hubcap = new THREE.Mesh(
    new THREE.CylinderGeometry(wheelRadius * 0.6, wheelRadius * 0.6, wheelRadius * 0.55, 30),
    new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: false})
  );
  frontLeftWheel.add(hubcap);

  frontLeftWheel.rotation.z = Math.PI * 0.5;
  frontLeftWheel.position.y = wheelRadius;

  const frontRightWheel = frontLeftWheel.clone();
  const rearLeftWheel = frontLeftWheel.clone();
  const rearRightWheel = frontLeftWheel.clone();

  frontLeftWheel.position.x = 0.5;
  rearLeftWheel.position.x = 0.5;
  frontRightWheel.position.x = -0.5;
  rearRightWheel.position.x = -0.5;

  frontLeftWheel.position.z = frontAxle.x;
  frontRightWheel.position.z = frontAxle.x;
  rearLeftWheel.position.z = rearAxle.x;
  rearRightWheel.position.z = rearAxle.x;

  mesh.add(frontLeftWheel);
  mesh.add(frontRightWheel);
  mesh.add(rearLeftWheel);
  mesh.add(rearRightWheel);

  const group = new THREE.Group();
  group.add(whole);
  return group;
};

const CarMeshMaker = { generate };
