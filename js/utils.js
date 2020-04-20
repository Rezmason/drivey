"use strict";

const isMobile = (function() {
  const str = (navigator.userAgent || navigator.vendor || window.opera);
  return (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(str)
      ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(str.substr(0,4))
  );
}());

const sign = input => (input < 0 ? -1 : 1);

const mod = (a, b) => ((a % b) + b) % b;

const getAngle = v2 => Math.atan2(v2.y, v2.x);

const rotate = (v2, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new THREE.Vector2(
    v2.x * cos - v2.y * sin,
    v2.x * sin + v2.y * cos
  );
}

const rotateY = (v3, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new THREE.Vector3(
    v3.x * cos - v3.z * sin,
    v3.y,
    v3.x * sin + v3.z * cos
  );
}

const rotateZ = (v3, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new THREE.Vector3(
    v3.x * cos - v3.y * sin,
    v3.x * sin + v3.y * cos,
    v3.z
  );
}

const silhouette = new THREE.RawShaderMaterial({
  uniforms: {
    resolution: { type: "v2", value: new THREE.Vector2(1, 1) }
  },
  vertexShader: `
    attribute vec3 idColor;
    attribute vec3 monochromeValue;
    attribute float bulgeDirection;
    attribute vec3 position;
    uniform bool isWireframe;
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    uniform vec2 resolution;
    varying float vShade;
    varying float vOpacity;
    varying vec4 vIdColor;
    void main() {
      float value = monochromeValue.r;
      float fade = monochromeValue.b;
      vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
      float screenZ = (projectionMatrix * worldPosition).z;

      value - fade * screenZ / resolution.y;
      vShade = value;
      vOpacity = monochromeValue.g;
      vIdColor = vec4(idColor, 1.0);

      float bulgeAmount = isWireframe ? 1.5 : 0.9;
      worldPosition.y += bulgeDirection * screenZ * bulgeAmount / resolution.y;
      gl_Position = projectionMatrix * worldPosition;
    }
  `,

  fragmentShader: `
    precision mediump float;
    #define PI 3.14159265359

    uniform vec3 tint;
    uniform float scramble;
    uniform float ditherMagnitude;
    uniform bool isWireframe;
    varying float vShade;
    varying float vOpacity;
    varying vec4 vIdColor;

    highp float rand( const in vec2 uv, const in float t ) {
      const highp float a = 12.9898, b = 78.233, c = 43758.5453;
      highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
      return fract(sin(sn) * c + t);
    }

    void main() {
      if (isWireframe) {
        if (vOpacity < 1.0) {
          discard;
        }
        gl_FragColor = vIdColor;
      } else {
        float value = clamp(vShade + (rand( gl_FragCoord.xy, scramble ) - 0.5) * ditherMagnitude, 0., 1.);

        vec3 color = value < 0.5
          ? mix(vec3(0.0), tint, value * 2.0)
          : mix(tint, vec3(1.0), value * 2.0 - 1.0);

        gl_FragColor = vec4(color, vOpacity);
      }
    }
  `
});
silhouette.uniforms.ditherMagnitude = { value: 0.02 };
silhouette.uniforms.isWireframe = { value : false };
silhouette.uniforms.scramble = { value: 0 };
silhouette.uniforms.tint = { value: new THREE.Color() };

const transparent = new THREE.RawShaderMaterial({
  vertexShader: silhouette.vertexShader,
  fragmentShader: silhouette.fragmentShader,
  transparent: true
});
transparent.uniforms.ditherMagnitude = { value: 0.02 };
transparent.uniforms.isWireframe = { value : false };
transparent.uniforms.scramble = { value: 0 };
transparent.uniforms.tint = { value: new THREE.Color() };

const makeSplinePath = (pts, closed) => {
  const spline = new THREE.Path();
  spline.curves.push(
    new THREE.CatmullRomCurve3(pts.map(({x, y}) => new THREE.Vector3(x, y)), closed)
  );
  return spline;
};

const makeCirclePath = (x, y, radius, aClockwise = true) => {
  const circle = new THREE.Path();
  circle.absarc(x, y, radius, 0, Math.PI * 2, aClockwise);
  return circle;
};

const makeRectanglePath = (x, y, width, height) => {
  return makePolygonPath([
    new THREE.Vector2(x, y),
    new THREE.Vector2(x + width, y),
    new THREE.Vector2(x + width, y + height),
    new THREE.Vector2(x, y + height)
  ]);
};

const makePolygonPath = points => {
  return new THREE.Shape(points);
};

const expandPath = (source, thickness, divisions) => {
  return new THREE.Path(
    Array(divisions)
      .fill()
      .map((_, i) => getExtrudedPointAt(source, i / divisions, thickness / 2))
  );
};

const expandShapePath = (shapePath, thickness, divisions) => {
  const expansion = new THREE.ShapePath();
  shapePath.subPaths.forEach(subPath =>
    expansion.subPaths.push(expandPath(subPath, thickness, divisions))
  );
  return expansion;
};

const getExtrudedPointAt = (source, t, offset) => {
  t = mod(t, 1);
  // These are Vector3, but we need a Vector2
  const tangent = source.getTangent(t);
  const pos = source.getPoint(t);

  return new THREE.Vector2(
    pos.x - tangent.y * offset,
    pos.y + tangent.x * offset
  );
};

const makeMesh = (shapePath, depth, curveSegments, value = 0, alpha = 1, fade = 0) => {
  if (depth < 0) {
    throw new Error("depth must be greater than or equal to zero");
  }
  depth = Math.max(depth, 0.0000001);
  const geom = new THREE.ExtrudeBufferGeometry(
    shapePath.toShapes(false, false),
    { depth, curveSegments, bevelEnabled : false }
  );
  shadeGeometry(geom, value, alpha, fade);
  idGeometry(geom);
  bulgeGeometry(geom);
  return new THREE.Mesh(geom, alpha == 1 ? silhouette : transparent);
};

const bulgeGeometry = (geometry) => {
  const positions = geometry.getAttribute("position");
  const numVertices = positions.count;
  const bulgeDirections = [];
  for (let i = 0; i < numVertices; i++) {
    const z = positions.array[i * 3 + 2];
    bulgeDirections.push(z <= 0 ? -1 : 1);
  }
  geometry.setAttribute("bulgeDirection", new THREE.Float32BufferAttribute(bulgeDirections, 1));
  return geometry;
}

const shadeGeometry = (geometry, value, alpha = 1, fade = 0) => {
  const numVertices = geometry.getAttribute("position").count;
  const monochromeValues = [];
  for (let i = 0; i < numVertices; i++) {
    monochromeValues.push(value);
    monochromeValues.push(alpha);
    monochromeValues.push(fade);
  }
  geometry.setAttribute("monochromeValue", new THREE.Float32BufferAttribute(monochromeValues, 3));
  return geometry;
};


let [idRed, idGreen, idBlue] = [0, 0, 0];

const idGeometry = (geometry) => {
  const numVertices = geometry.getAttribute("position").count;
  idRed = (idRed + 0x23) % 0xFF;
  idGreen = (idGreen + 0x67) % 0xFF;
  idBlue = (idBlue + 0xAC) % 0xFF
  const idValues = [];
  for (let i = 0; i < numVertices; i++) {
    idValues.push(idRed / 0xFF);
    idValues.push(idGreen / 0xFF);
    idValues.push(idBlue / 0xFF);
  }
  geometry.setAttribute("idColor", new THREE.Float32BufferAttribute(idValues, 3));
  return geometry;
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

const mergeMeshes = meshes => {
  const geom = mergeGeometries(meshes.map(mesh => mesh.geometry));
  return new THREE.Mesh(geom, meshes[0].material);
};

const mergeGeometries = geometries => {
  if (geometries.length == 0) {
    throw new Error("You can't merge zero geometries.");
  }
  const numIndexed = geometries.filter(geometry => geometry.index != null).length;
  if (numIndexed > 0 && numIndexed < geometries.length) {
    throw new Error("You can't merge indexed and non-indexed buffer geometries.");
  }
  return THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
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

const lerpAngle = (from, to, amount) => {
  return from + diffAngle(from, to) * amount;
};

const mergeShapePaths = (shapePath, other) => {
  other.subPaths.forEach(path => shapePath.subPaths.push(path.clone()));
};

const addPath = (shapePath, path) => {
  shapePath.subPaths.push(path.clone());
};

const distance = (v1, v2) => {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const vector2Pool = [];

const borrowVector2 = (from) => {
  const vec = vector2Pool.length > 0 ? vector2Pool.pop() : new THREE.Vector2();
  if (from != null) {
    vec.copy(from);
  }
  return vec;
}

const returnVector2 = (vec) => {
  vector2Pool.push(vec);
}
