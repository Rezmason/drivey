const sign = input => (input < 0 ? -1 : 1);

const mod = (a, b) => ((a % b) + b) % b;

const getAngle = v2 => Math.atan2(v2.y, v2.x);

const rotate = (v2, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new THREE.Vector2(v2.x * cos - v2.y * sin, v2.x * sin + v2.y * cos);
};

const rotateY = (v3, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new THREE.Vector3(v3.x * cos - v3.z * sin, v3.y, v3.x * sin + v3.z * cos);
};

const minDistSquaredIndex = (points, toPoint) => {
  let minimum = Infinity;
  let minimumPoint = -1;

  points.forEach((point, i) => {
    const dx = toPoint.x - point.x;
    const dy = toPoint.y - point.y;
    const distSquared = dx * dx + dy * dy;
    if (minimum > distSquared) {
      minimum = distSquared;
      minimumPoint = i;
    }
  });

  return minimumPoint;
};

const diffAngle = (a, b) => {
  a %= Math.PI * 2;
  b %= Math.PI * 2;
  if (a - b > Math.PI) {
    b += Math.PI * 2;
  } else if (b - a > Math.PI) {
    a += Math.PI * 2;
  }

  return b - a;
};

const lerp = (from, to, amount) => {
  return from * (1 - amount) + to * amount;
};

const distance = (v1, v2) => {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export { distance, getAngle, lerp, rotate, rotateY, sign, mod, minDistSquaredIndex };
