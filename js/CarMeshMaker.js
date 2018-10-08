const createVolumes = (topFront, bottomFront, topRear, bottomRear, outerSlope, innerSlope, reflect = false) => {
  if (outerSlope == null) throw new Error('Unspecified outer slope');
  if (innerSlope == null) innerSlope = v => -outerSlope(v);
  const boxGeometry = new THREE.BoxGeometry();
  boxGeometry.vertices[0].set(outerSlope(topFront), topFront.y, topFront.x);
  boxGeometry.vertices[1].set(outerSlope(bottomFront), bottomFront.y, bottomFront.x);
  boxGeometry.vertices[2].set(outerSlope(topRear), topRear.y, topRear.x);
  boxGeometry.vertices[3].set(outerSlope(bottomRear), bottomRear.y, bottomRear.x);
  boxGeometry.vertices[4].set(innerSlope(bottomFront), bottomFront.y, bottomFront.x);
  boxGeometry.vertices[5].set(innerSlope(topFront), topFront.y, topFront.x);
  boxGeometry.vertices[6].set(innerSlope(bottomRear), bottomRear.y, bottomRear.x);
  boxGeometry.vertices[7].set(innerSlope(topRear), topRear.y, topRear.x);
  const geometry = new THREE.BufferGeometry();
  geometry.fromGeometry(boxGeometry);
  boxGeometry.dispose();
  const geometries = [geometry];
  if (reflect) {
    geometries.push(
      createVolumes(topFront, bottomFront, topRear, bottomRear, v => -innerSlope(v), v => -outerSlope(v), false)
      .pop()
    );
  }
  return geometries;
}

const generate = () => {

  const carColor = 0.075;
  const rand = (mag, offset) => offset + mag * Math.random();

  const wheelRadius = rand(0.05, 0.25);
  const groundClearance = wheelRadius * 0.8;
  const columnNudge = new THREE.Vector2(0.05, 0);
  const roofThickness = 0.025;

  const isTwoDoor = Math.random() > 0.5;
  const hasPillarD = isTwoDoor || Math.random() > 0.5;
  const isConvertible = Math.random() > 0.9;
  const pillarSpacings = [
    rand(0.1, wheelRadius * 2 + 0.1), // front windshield
    rand(isTwoDoor ? 0.2 : 0.1, 0.7), // front seats
    isTwoDoor ? 0 : rand(0.1, 0.5), // rear seats
    rand((hasPillarD && !isTwoDoor) ? 0.2 : 0.1, wheelRadius * 2 + 0.1) // rear windshield
  ];
  const cabinWidth = rand(0.4, 0.8);
  const roofWidth = rand(0.3, 0.7) * cabinWidth;
  const hoodHeight = rand(0.0125, 0);
  const cabinHeight1 = rand(0.0125, 0.02 + wheelRadius * 2 - groundClearance);
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

  // undercarriage
  const frontWheelPos = a.clone(); frontWheelPos.x += wheelRadius + frontOverhang * (pillarSpacings[0] - wheelRadius * 2);
  const rearWheelPos = e.clone(); rearWheelPos.x -= wheelRadius + rearOverhang * (pillarSpacings[3] - wheelRadius * 2 - bottomTaper);
  const undercarriageTF = a.clone();
  const undercarriageBF = frontWheelPos.clone(); undercarriageBF.y -= 0.1;
  const undercarriageTR = e.clone();
  const undercarriageBR = rearWheelPos.clone(); undercarriageBR.y -= 0.1;

  // front fender
  const frontFenderTF = f.clone(); frontFenderTF.x -= 0.02; frontFenderTF.y -= cabinHeight1 * 0.5;
  const frontFenderBF = a.clone(); frontFenderBF.x -= 0.02; frontFenderBF.y -= 0.01;
  const frontFenderTR = f.clone(); frontFenderTR.x += 0.05; frontFenderTR.y -= cabinHeight1 * 0.5;
  const frontFenderBR = a.clone(); frontFenderBR.x += 0.05; frontFenderBR.y -= 0.01;

  // rear fender
  const rearFenderTF = j.clone(); rearFenderTF.x -= 0.05; rearFenderTF.y -= cabinHeight1 * 0.5;
  const rearFenderBF = e.clone(); rearFenderBF.x -= 0.05; rearFenderBF.y -= 0.01;
  const rearFenderTR = j.clone(); rearFenderTR.x += 0.02; rearFenderTR.y -= cabinHeight1 * 0.5;
  const rearFenderBR = e.clone(); rearFenderBR.x += 0.02; rearFenderBR.y -= 0.01;

  // mirrors
  const mirrorBF = l.clone();
  const mirrorTF = l.clone(); mirrorTF.y += 0.1;
  const mirrorBR = l2.clone();
  const mirrorTR = l2.clone(); mirrorTR.y += 0.1;

  // headlights
  const frontLightTF = k.clone(); frontLightTF.x -= 0.01; frontLightTF.y -= cabinHeight1 * 0.5;
  const frontLightBF = f.clone(); frontLightBF.x -= 0.01; frontLightBF.y -= 0.01;
  const frontLightTR = k.clone(); frontLightTR.x += 0.05; frontLightTR.y -= cabinHeight1 * 0.5;
  const frontLightBR = f.clone(); frontLightBR.x += 0.05; frontLightBR.y -= 0.01;

  // tail lights
  const rearLightTF = o.clone(); rearLightTF.x -= 0.05; rearLightTF.y -= cabinHeight1 * 0.5;
  const rearLightBF = j.clone(); rearLightBF.x -= 0.05; rearLightBF.y -= 0.01;
  const rearLightTR = o.clone(); rearLightTR.x += 0.01; rearLightTR.y -= cabinHeight1 * 0.5;
  const rearLightBR = j.clone(); rearLightBR.x += 0.01; rearLightBR.y -= 0.01;

  // license plates
  const frontPlateTF = frontFenderTF.clone();
  const frontPlateBF = frontFenderTF.clone(); frontPlateBF.y -= 0.1;
  const rearPlateTF = j.clone(); rearPlateTF.x += 0.01; rearPlateTF.y -= 0.15;
  const rearPlateBF = j.clone(); rearPlateBF.x += 0.01; rearPlateBF.y -= 0.05;

  const frame = [];
  const windows = [];

  const bodySlope = v => cabinWidth / 2;
  const roofSlope = v => roofWidth / 2;
  const greenhouseOuterSlope = v => lerp(cabinWidth, roofWidth, (v.y - l.y) / roofHeight) / 2;
  const greenhouseInnerSlope = v => greenhouseOuterSlope(v) - columnNudge.x;

  frame.push(...createVolumes(mirrorTF, mirrorBF, mirrorTR, mirrorBR, v => (cabinWidth / 2) + 0.15, bodySlope, true));
  frame.push(...createVolumes(undercarriageTF, undercarriageBF, undercarriageTR, undercarriageBR, v => (cabinWidth / 2 * 0.7)));

  frame.push(...createVolumes(f, a, g, b, bodySlope));
  frame.push(...createVolumes(g, b, h, c, bodySlope));
  frame.push(...createVolumes(h, c, i, d, bodySlope));
  frame.push(...createVolumes(i, d, j, e, bodySlope));

  frame.push(...createVolumes(k, f, l, g, bodySlope));
  frame.push(...createVolumes(l, g, m, h, bodySlope));
  frame.push(...createVolumes(m, h, n, i, bodySlope));
  frame.push(...createVolumes(n, i, o, j, bodySlope));


  frame.push(...createVolumes(p, l, p2, l2, greenhouseOuterSlope, greenhouseInnerSlope, true));
  windows.push(...createVolumes(p2, l2, p2, l2, greenhouseInnerSlope));

  if (isConvertible) {
    frame.push(...createVolumes(p, t, p2, t, greenhouseOuterSlope));
  } else {
    frame.push(...createVolumes(q, m, q2, m2, greenhouseOuterSlope, greenhouseInnerSlope, true));
    frame.push(...createVolumes(r, n, r2, n2, greenhouseOuterSlope, greenhouseInnerSlope, true));
    frame.push(...createVolumes(s, o, s2, o2, greenhouseOuterSlope, greenhouseInnerSlope, true));

    windows.push(...createVolumes(p2, l2, q, m, greenhouseInnerSlope, greenhouseInnerSlope, true));
    windows.push(...createVolumes(q2, m2, r, n, greenhouseInnerSlope, greenhouseInnerSlope, true));

    if (hasPillarD) {
      frame.push(...createVolumes(t, p, w, s, roofSlope));
      windows.push(...createVolumes(s, o, s, o, greenhouseInnerSlope));
      windows.push(...createVolumes(r2, n2, s2, o2, greenhouseInnerSlope, greenhouseInnerSlope, true));
    } else {
      frame.push(...createVolumes(t, p, v, r, roofSlope));
      windows.push(...createVolumes(r, n, r, n, greenhouseInnerSlope));
    }
  }

  const fenders = [];
  fenders.push(...createVolumes(frontFenderTF, frontFenderBF, frontFenderTR, frontFenderBR, v => (cabinWidth / 2) + 0.01));
  fenders.push(...createVolumes(rearFenderTF, rearFenderBF, rearFenderTR, rearFenderBR, v => (cabinWidth / 2) + 0.01));
  const frontLights = createVolumes(frontLightTF, frontLightBF, frontLightTR, frontLightBR, v => (cabinWidth / 2 * 0.7), v => (cabinWidth / 2) + 0.01, true);
  const rearLights = createVolumes(rearLightTF, rearLightBF, rearLightTR, rearLightBR, v => (cabinWidth / 2 * 0.7), v => (cabinWidth / 2) + 0.01, true);
  const plates = [];
  plates.push(...createVolumes(frontPlateTF, frontPlateBF, frontPlateTF, frontPlateBF, v => 0.1));
  plates.push(...createVolumes(rearPlateTF, rearPlateBF, rearPlateTF, rearPlateBF, v => 0.1));

  ///////

  frame.forEach(volume => shadeGeometry(volume, carColor));
  windows.forEach(volume => shadeGeometry(volume, carColor, 0.4));
  fenders.forEach(fender => shadeGeometry(fender, carColor + 0.05));
  frontLights.forEach(frontLight => shadeGeometry(frontLight, 1));
  rearLights.forEach(rearLight => shadeGeometry(rearLight, 0.75));
  plates.forEach(plate => shadeGeometry(plate, 0.2));

  ///////

  const allGeometries = [].concat(
    frame,
    fenders,
    frontLights,
    rearLights,
    plates
  );
  const mesh = new THREE.Mesh(mergeGeometries(allGeometries), silhouette);
  allGeometries.forEach(geometry => geometry.dispose());

  const windowMesh = new THREE.Mesh(mergeGeometries(windows), transparent);
  mesh.add(windowMesh);
  mesh.rotation.x = Math.PI * 0.5;
  mesh.scale.multiplyScalar(1.5);

  const tireGeometry = shadeGeometry(new THREE.CylinderBufferGeometry(wheelRadius, wheelRadius, wheelRadius * 0.5, 30), 0.1);
  const hubcapGeometry = shadeGeometry(new THREE.CylinderBufferGeometry(wheelRadius * 0.6, wheelRadius * 0.6, wheelRadius * 0.55, 30), carColor);
  const frontLeftWheel = new THREE.Mesh(mergeGeometries([tireGeometry, hubcapGeometry]), silhouette);
  frontLeftWheel.rotation.z = Math.PI * 0.5;
  frontLeftWheel.position.y = wheelRadius;

  const frontRightWheel = frontLeftWheel.clone();
  const rearLeftWheel = frontLeftWheel.clone();
  const rearRightWheel = frontLeftWheel.clone();

  frontLeftWheel.position.x = (cabinWidth / 2 - 0.05);
  rearLeftWheel.position.x = (cabinWidth / 2 - 0.05);
  frontRightWheel.position.x = -(cabinWidth / 2 - 0.05);
  rearRightWheel.position.x = -(cabinWidth / 2 - 0.05);

  frontLeftWheel.position.z = frontWheelPos.x;
  frontRightWheel.position.z = frontWheelPos.x;
  rearLeftWheel.position.z = rearWheelPos.x;
  rearRightWheel.position.z = rearWheelPos.x;

  mesh.add(frontLeftWheel);
  mesh.add(frontRightWheel);
  mesh.add(rearLeftWheel);
  mesh.add(rearRightWheel);

  const group = new THREE.Group();
  group.add(mesh);
  return group;
};

const CarMeshMaker = { generate };
