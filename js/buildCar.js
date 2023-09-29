/*

  A car mesh is built from a series of boxes,
  whose vertices conform to this rough plan:

                     T---U------V----------W
                    P----Q------R-----------S
                   /     |      |            \
                  /      |      |             \
  K_______-------L-------M------N--------------O     Side view
  |              |       |      |              |
  F--------------G-------H------I--------------J
   \       __    |       |      |      __     /   ====33 toot!
    A-----/  \---B-------C------D-----/  \---E

           FA                          RA

  K--------------L-------M------N--------------O
  |              |\      |      |             /|
  |              | \     |      |            / |
  |              |  P----Q------R-----------S  |
  |              |  |                       |  |
  |              |  |                       |  |
  |              |  |                       |  |     Top view
  |              |  |                       |  |
  |              |  |                       |  |
  |              |  p----q------r-----------s  |
  |              | /     |      |            \ |
  |              |/      |      |             \|
  k--------------l-------m------n--------------o

*/

import { BoxGeometry, BufferGeometry, Vector2, Group, Mesh, CylinderBufferGeometry } from "./../lib/three/three.module.js";

import { lerp } from "./math.js";
import { mergeGeometries, shadeGeometry, idGeometry } from "./geometry.js";
import { silhouetteMaterial, transparentMaterial } from "./materials.js";

const boxGeometry = new BoxGeometry();
const createBoxes = (topFront, bottomFront, topRear, bottomRear, outerSlope, innerSlope, reflect = false) => {
  // A slope is just a function that returns the horizontal offset of a given vertex.
  // This way guarantees that the six sides of the box are still planar.
  if (outerSlope == null) throw new Error("Unspecified outer slope");
  if (innerSlope == null) innerSlope = (v) => -outerSlope(v); // By default, boxes are bilaterally symmetrical
  boxGeometry.vertices[0].set(outerSlope(topFront), topFront.y, topFront.x);
  boxGeometry.vertices[1].set(outerSlope(bottomFront), bottomFront.y, bottomFront.x);
  boxGeometry.vertices[2].set(outerSlope(topRear), topRear.y, topRear.x);
  boxGeometry.vertices[3].set(outerSlope(bottomRear), bottomRear.y, bottomRear.x);
  boxGeometry.vertices[4].set(innerSlope(bottomFront), bottomFront.y, bottomFront.x);
  boxGeometry.vertices[5].set(innerSlope(topFront), topFront.y, topFront.x);
  boxGeometry.vertices[6].set(innerSlope(bottomRear), bottomRear.y, bottomRear.x);
  boxGeometry.vertices[7].set(innerSlope(topRear), topRear.y, topRear.x);
  const geometry = new BufferGeometry();
  geometry.fromGeometry(boxGeometry);
  const geometries = [geometry];

  // but sometimes, we have a box that's offset from the axis
  // of symmetry, that we still want to reflect bilaterally
  if (reflect) {
    geometries.push(
      createBoxes(
        topFront,
        bottomFront,
        topRear,
        bottomRear,
        (v) => -innerSlope(v),
        (v) => -outerSlope(v),
        false
      ).pop()
    );
  }

  return geometries;
};

export default () => {
  // We start by generating random measurements and states for our car
  const rand = (mag, offset) => offset + mag * Math.random();
  const wheelRadius = rand(0.05, 0.25);
  const hubcapRadius = wheelRadius * 0.6;
  const wheelThickness = wheelRadius * 0.5;
  const hubcapThickness = wheelRadius * 0.55;
  const groundClearance = wheelRadius * 0.8;
  const columnThickness = 0.05;
  const columnNudge = new Vector2(columnThickness, 0);
  const roofThickness = 0.025;
  const isCoupe = Math.random() > 0.5;
  const hasTailgate = isCoupe || Math.random() > 0.5;
  const isConvertible = !hasTailgate && Math.random() > 0.5;
  const isSUV = hasTailgate && Math.random() > 0.5;

  const pillarSpacings = [
    rand(0.1, wheelRadius * 2 + 0.1), // front windshield
    rand(isCoupe ? 0.2 : 0.1, 0.7), // front seats
    isCoupe ? 0 : rand(0.1, 0.5), // rear seats
    rand(hasTailgate && !isCoupe ? 0.2 : 0.1, wheelRadius * 2 + 0.1), // rear windshield
  ];

  const cabinWidth = rand(0.3, 0.9);
  const roofWidth = rand(0.3, 0.7) * cabinWidth;
  const hoodHeight = rand(0.0125, 0);
  const cabinHeight1 = rand(0.0125, 0.02 + wheelRadius * 2 - groundClearance);
  const cabinHeight2 = rand(0.0125, 0.1);
  const roofHeight = rand(0.125, 0.2);
  const frontWindshieldTaper = rand(0.8, 0.05);
  const rearWindshieldTaper = Math.min(frontWindshieldTaper, rand(hasTailgate ? 0.2 : 0.3, 0));
  const frontOverhang = rand(0.7, 0.1);
  const rearOverhang = rand(0.7, 0.1);
  const bottomTaper = rand(0.1, 0); // Honestly not sure what the real term for this is.

  const carColor = 0.075;
  const frame = [];
  const windows = [];
  const bodySlope = (v) => cabinWidth / 2;
  const roofSlope = (v) => roofWidth / 2;

  // frame bottom
  const a = new Vector2(0 + bottomTaper, groundClearance);
  const b = new Vector2(a.x + pillarSpacings[0], groundClearance);
  const c = new Vector2(b.x + pillarSpacings[1], groundClearance);
  const d = new Vector2(c.x + pillarSpacings[2], groundClearance);
  const e = new Vector2(d.x + pillarSpacings[3] - bottomTaper, groundClearance);

  // frame middle
  const f = new Vector2(a.x - bottomTaper, a.y + cabinHeight1);
  const g = new Vector2(b.x, b.y + cabinHeight1);
  const h = new Vector2(c.x, c.y + cabinHeight1);
  const i = new Vector2(d.x, d.y + cabinHeight1);
  const j = new Vector2(e.x + bottomTaper, e.y + cabinHeight1);

  frame.push(...createBoxes(f, a, g, b, bodySlope));
  frame.push(...createBoxes(g, b, h, c, bodySlope));
  frame.push(...createBoxes(h, c, i, d, bodySlope));
  frame.push(...createBoxes(i, d, j, e, bodySlope));

  // frame top
  const k = new Vector2(f.x, f.y + hoodHeight);
  const l = new Vector2(g.x, g.y + hoodHeight + cabinHeight2);
  const m = new Vector2(h.x, h.y + hoodHeight + cabinHeight2);
  const n = new Vector2(i.x, i.y + hoodHeight + cabinHeight2);
  const o = new Vector2(j.x, j.y + hoodHeight + cabinHeight2);

  frame.push(...createBoxes(k, f, l, g, bodySlope));
  frame.push(...createBoxes(l, g, m, h, bodySlope));
  frame.push(...createBoxes(m, h, n, i, bodySlope));
  frame.push(...createBoxes(n, i, o, j, bodySlope));

  // Roof
  const p = new Vector2(l.x + frontWindshieldTaper * pillarSpacings[1], l.y + roofHeight);
  const q = new Vector2(m.x, m.y + roofHeight);
  const r = new Vector2(hasTailgate ? n.x : n.x - rearWindshieldTaper, n.y + roofHeight);
  const s = new Vector2(o.x - rearWindshieldTaper, hasTailgate ? o.y + roofHeight : o.y);

  const t = new Vector2(p.x + columnThickness, p.y + roofThickness);
  const u = new Vector2(q.x, q.y + roofThickness);
  const v = new Vector2(r.x + (hasTailgate ? 0 : -columnThickness), r.y + roofThickness);
  const w = new Vector2(s.x + (hasTailgate ? -columnThickness : 0), s.y + roofThickness);

  // Column bar vertices
  const l2 = l.clone().add(columnNudge);
  const m2 = m.clone().add(columnNudge);
  const n2 = hasTailgate ? n.clone().add(columnNudge) : n.clone().sub(columnNudge);
  const o2 = o.clone().sub(columnNudge);

  const p2 = p.clone().add(columnNudge);
  const q2 = q.clone().add(columnNudge);
  const r2 = hasTailgate ? r.clone().add(columnNudge) : r.clone().sub(columnNudge);
  const s2 = s.clone().sub(columnNudge);

  // Greenhouse
  const greenhouseOuterSlope = (v) => lerp(cabinWidth, roofWidth, (v.y - l.y) / roofHeight) / 2;
  const greenhouseInnerSlope = (v) => greenhouseOuterSlope(v) - columnThickness;

  frame.push(...createBoxes(p, l, p2, l2, greenhouseOuterSlope, greenhouseInnerSlope, true));
  windows.push(...createBoxes(p2, l2, p2, l2, greenhouseInnerSlope));

  if (isConvertible) {
    frame.push(...createBoxes(p, t, p2, t, greenhouseOuterSlope));
  } else {
    frame.push(...createBoxes(q, m, q2, m2, greenhouseOuterSlope, greenhouseInnerSlope, true));
    frame.push(...createBoxes(r, n, r2, n2, greenhouseOuterSlope, greenhouseInnerSlope, true));
    frame.push(...createBoxes(s, o, s2, o2, greenhouseOuterSlope, greenhouseInnerSlope, true));

    windows.push(...createBoxes(p2, l2, q, m, greenhouseInnerSlope, greenhouseInnerSlope, true));
    windows.push(...createBoxes(q2, m2, r, n, greenhouseInnerSlope, greenhouseInnerSlope, true));

    if (hasTailgate) {
      frame.push(...createBoxes(t, p, w, s, roofSlope));
      windows.push(...createBoxes(s, o, s, o, greenhouseInnerSlope));
      windows.push(...createBoxes(r2, n2, s2, o2, greenhouseInnerSlope, greenhouseInnerSlope, true));
    } else {
      frame.push(...createBoxes(t, p, v, r, roofSlope));
      windows.push(...createBoxes(r, n, r, n, greenhouseInnerSlope));
    }
  }

  // Axles
  const frontWheelPos = a.clone();
  frontWheelPos.x += wheelRadius + frontOverhang * (pillarSpacings[0] - wheelRadius * 2);
  const rearWheelPos = e.clone();
  rearWheelPos.x -= wheelRadius + rearOverhang * (pillarSpacings[3] - wheelRadius * 2 - bottomTaper);

  // Undercarriage
  const undercarriageTF = a.clone();
  const undercarriageBF = frontWheelPos.clone();
  undercarriageBF.y -= 0.1;
  const undercarriageTR = e.clone();
  const undercarriageBR = rearWheelPos.clone();
  undercarriageBR.y -= 0.1;
  frame.push(...createBoxes(undercarriageTF, undercarriageBF, undercarriageTR, undercarriageBR, (v) => (cabinWidth / 2) * 0.7));

  frame.forEach((box) => shadeGeometry(box, carColor));
  windows.forEach((box) => shadeGeometry(box, carColor, 0.4));

  // fenders
  const frontFenderTF = f.clone(); frontFenderTF.x -= 0.02; frontFenderTF.y -= cabinHeight1 * 0.5;
  const frontFenderBF = a.clone(); frontFenderBF.x -= 0.02; frontFenderBF.y -= 0.01;
  const frontFenderTR = f.clone(); frontFenderTR.x += 0.05; frontFenderTR.y -= cabinHeight1 * 0.5;
  const frontFenderBR = a.clone(); frontFenderBR.x += 0.05; frontFenderBR.y -= 0.01;
  const rearFenderTF = j.clone(); rearFenderTF.x -= 0.05; rearFenderTF.y -= cabinHeight1 * 0.5;
  const rearFenderBF = e.clone(); rearFenderBF.x -= 0.05; rearFenderBF.y -= 0.01;
  const rearFenderTR = j.clone(); rearFenderTR.x += 0.02; rearFenderTR.y -= cabinHeight1 * 0.5;
  const rearFenderBR = e.clone(); rearFenderBR.x += 0.02; rearFenderBR.y -= 0.01;
  const fenders = [];
  fenders.push(...createBoxes(frontFenderTF, frontFenderBF, frontFenderTR, frontFenderBR, (v) => cabinWidth / 2 + 0.01));
  fenders.push(...createBoxes(rearFenderTF, rearFenderBF, rearFenderTR, rearFenderBR, (v) => cabinWidth / 2 + 0.01));
  fenders.forEach((fender) => shadeGeometry(fender, carColor + 0.05));

  // mirrors
  const mirrorBF = l.clone();
  const mirrorTF = l.clone();
  mirrorTF.y += 0.1;
  const mirrorBR = l2.clone();
  const mirrorTR = l2.clone();
  mirrorTR.y += 0.1;
  const mirrors = [];
  mirrors.push(...createBoxes(mirrorTF, mirrorBF, mirrorTR, mirrorBR, v => bodySlope(v) + 0.15, v => bodySlope(v) - 0.01, true));
  mirrors.forEach(mirror => shadeGeometry(mirror, carColor));

  // headlights
  const frontLightTF = k.clone(); frontLightTF.x -= 0.01; frontLightTF.y -= cabinHeight1 * 0.5;
  const frontLightBF = f.clone(); frontLightBF.x -= 0.01; frontLightBF.y -= 0.01;
  const frontLightTR = k.clone(); frontLightTR.x += 0.05; frontLightTR.y -= cabinHeight1 * 0.5;
  const frontLightBR = f.clone(); frontLightBR.x += 0.05; frontLightBR.y -= 0.01;
  const frontLights = createBoxes(frontLightTF, frontLightBF, frontLightTR, frontLightBR, v => (cabinWidth / 2) * 0.7, v => cabinWidth / 2 + 0.01, true);
  frontLights.forEach(frontLight => shadeGeometry(frontLight, 1));

  // tail lights
  const tailLightTF = o.clone(); tailLightTF.x -= 0.05; tailLightTF.y -= cabinHeight1 * 0.5;
  const tailLightBF = j.clone(); tailLightBF.x -= 0.05; tailLightBF.y -= 0.01;
  const tailLightTR = o.clone(); tailLightTR.x += 0.01; tailLightTR.y -= cabinHeight1 * 0.5;
  const tailLightBR = j.clone(); tailLightBR.x += 0.01; tailLightBR.y -= 0.01;
  const tailLights = createBoxes(tailLightTF, tailLightBF, tailLightTR, tailLightBR, v => (cabinWidth / 2) * 0.7, v => cabinWidth / 2 + 0.01, true);
  tailLights.forEach(tailLight => shadeGeometry(tailLight, 0.75));

  // antenna
  const antennaTF = p.clone().sub(l).multiplyScalar(0.5).add(p);
  const antennaBF = p.clone();
  const antennaTR = antennaTF.clone();
  antennaTF.x -= 0.01;
  const antennaBR = antennaBF.clone();
  antennaBF.x -= 0.01;
  const antennas = [];
  antennas.push(...createBoxes(antennaTF, antennaBF, antennaTR, antennaBR, greenhouseOuterSlope, (v) => greenhouseOuterSlope(v) - 0.01));
  antennas.forEach((antenna) => shadeGeometry(antenna, carColor));

  // license plates
  const frontPlateTF = frontFenderTF.clone();
  const frontPlateBF = frontFenderTF.clone();
  frontPlateBF.y -= 0.1;
  const rearPlateTF = j.clone();
  rearPlateTF.x += 0.01;
  rearPlateTF.y -= 0.15;
  const rearPlateBF = j.clone();
  rearPlateBF.x += 0.01;
  rearPlateBF.y -= 0.05;
  const plates = [];
  plates.push(...createBoxes(frontPlateTF, frontPlateBF, frontPlateTF, frontPlateBF, (v) => 0.1));
  plates.push(...createBoxes(rearPlateTF, rearPlateBF, rearPlateTF, rearPlateBF, (v) => 0.1));
  plates.forEach((plate) => shadeGeometry(plate, 0.2));

  const mesh = new Group();

  mesh.add(new Mesh(idGeometry(mergeGeometries(frame)), silhouetteMaterial));
  mesh.add(new Mesh(idGeometry(mergeGeometries(mirrors)), silhouetteMaterial));
  mesh.add(new Mesh(idGeometry(mergeGeometries(fenders)), silhouetteMaterial));
  mesh.add(new Mesh(idGeometry(mergeGeometries(frontLights)), silhouetteMaterial));
  mesh.add(new Mesh(idGeometry(mergeGeometries(tailLights)), silhouetteMaterial));
  mesh.add(new Mesh(idGeometry(mergeGeometries(plates)), silhouetteMaterial));
  mesh.add(new Mesh(idGeometry(mergeGeometries(antennas)), silhouetteMaterial));

  // merge opaque geometries
  const allGeometries = [].concat(frame, mirrors, fenders, frontLights, tailLights, plates, antennas);
  allGeometries.forEach((geometry) => geometry.dispose());

  // merge transparent geometries
  const windowMesh = new Mesh(mergeGeometries(windows), transparentMaterial);
  mesh.add(windowMesh);
  mesh.rotation.x = Math.PI * 0.5;
  mesh.scale.multiplyScalar(1.5);

  // wheel meshes — kept separate, in case someone
  // wants to turn them in the future or something
  const tireGeometry = idGeometry(shadeGeometry(new CylinderBufferGeometry(wheelRadius, wheelRadius, wheelThickness, 30), 0.1));
  const hubcapGeometry = idGeometry(shadeGeometry(new CylinderBufferGeometry(hubcapRadius, hubcapRadius, hubcapThickness, 30), carColor));
  const frontLeftWheel = new Mesh(mergeGeometries([tireGeometry, hubcapGeometry]), silhouetteMaterial);
  frontLeftWheel.rotation.z = Math.PI * 0.5;
  frontLeftWheel.position.y = wheelRadius;

  const frontRightWheel = frontLeftWheel.clone();
  const rearLeftWheel = frontLeftWheel.clone();
  const rearRightWheel = frontLeftWheel.clone();

  frontLeftWheel.position.x = cabinWidth / 2 - 0.05;
  rearLeftWheel.position.x = cabinWidth / 2 - 0.05;
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

  if (isSUV) {
    const spareTire = frontLeftWheel.clone();
    spareTire.position.x = cabinWidth * 0.05;
    spareTire.position.y = j.y - wheelRadius * 0.5;
    spareTire.position.z = j.x + wheelThickness * 0.5;
    spareTire.rotation.y = Math.PI * 0.5;
    mesh.add(spareTire);
  }

  const group = new Group();
  group.add(mesh);

  return group;
};
