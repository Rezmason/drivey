import js.three.BufferGeometry;
import js.three.CatmullRomCurve3;
import js.three.Color;
import js.three.ExtrudeGeometry.ExtrudeBufferGeometry;
import js.three.Float32BufferAttribute;
import js.three.Geometry;
import js.three.Mesh;
import js.three.Path;
import js.three.RawShaderMaterial;
import js.three.Shape;
import js.three.ShapeGeometry.ShapeBufferGeometry;
import js.three.ShapePath;
import js.three.Vector2;

class ThreeUtils {
    public static function makeSplinePath(pts:Array<Vector2>, closed:Bool):Path {
        var spline:Path = new Path();
        spline.curves.push(cast new CatmullRomCurve3([for (pt in pts) new js.three.Vector3(pt.x, pt.y)], closed));
        return spline;
    }

    public static function makeCirclePath(x:Float, y:Float, radius:Float, aClockwise:Bool = true):Path {
        var circle:Path = new Path();
        circle.absarc( x, y, radius, 0, Math.PI * 2, aClockwise);
        return circle;
    }

    public static function makeRectanglePath(x:Float, y:Float, width:Float, height:Float) {
        return makePolygonPath([
            new Vector2(x, y),
            new Vector2(x + width, y),
            new Vector2(x + width, y + height),
            new Vector2(x, y + height)
        ]);
    }

    public static function makePolygonPath(points:Array<Vector2>):Path {
        return new Shape(points);
    }

    public static function expandPath(source:Path, thickness:Float, divisions:UInt):Path {
        return new Path([for (i in 0...divisions) getExtrudedPointAt(source, i / divisions, thickness / 2)]);
    }

    public static function expandShapePath(shapePath:ShapePath, thickness:Float, divisions:UInt):ShapePath {
        var expansion:ShapePath = new ShapePath();
        for (subPath in shapePath.subPaths) expansion.subPaths.push(expandPath(subPath, thickness, divisions));
        return expansion;
    }

    public static function getExtrudedPointAt(source:Path, t:Float, offset:Float):Vector2 {
        while (t < 0) t++;
        while (t > 1) t--;
        var tangent:Vector2 = source.getTangent(t);
        return cast source.getPoint(t).add(new Vector2(-tangent.y * offset, tangent.x * offset));
    }

    public static function makeMesh(shapePath:ShapePath, amount:Float, curveSegments:UInt, value:Float = 0, alpha:Float = 1) {
        var geom:BufferGeometry = cast (amount == 0
            ? new ShapeBufferGeometry(shapePath.toShapes(false, false), curveSegments)
            : new ExtrudeBufferGeometry(shapePath.toShapes(false, false), {amount:amount, bevelEnabled:false, curveSegments:curveSegments}));

        var numVertices = Reflect.field(geom.attributes, 'position').count;

        var monochromeValues = [];
        for (i in 0...numVertices) {
            monochromeValues.push(value);
            monochromeValues.push(alpha);
        }

        geom.addAttribute('monochromeValue', new Float32BufferAttribute( monochromeValues, 2 ));

        return new Mesh(geom, silhouette);
    }

    public static function flattenMesh(mesh:Mesh) {
        var geom:BufferGeometry = cast mesh.geometry;
        geom.applyMatrix(mesh.matrix);
        mesh.matrix.identity();
    }

    public static var silhouette(default, null):RawShaderMaterial = new RawShaderMaterial(cast {
        vertexShader: '
            uniform vec3 tint;
            attribute vec2 monochromeValue;
            attribute vec3 position;
            uniform mat4 projectionMatrix;
            uniform mat4 modelViewMatrix;
            varying vec4 vColor;
            void main() {
                float value = monochromeValue.r;
                vec3 color = value < 0.5
                    ? mix(vec3(0.0), tint, value * 2.0)
                    : mix(tint, vec3(1.0), value * 2.0 - 1.0);
                vColor = vec4(color, monochromeValue.g);
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        ',
        fragmentShader: '
            precision highp float;
            varying vec4 vColor;
            void main() {
                gl_FragColor = vColor;
            }
        ',
        transparent: true
    });

    public static function minDistSquaredIndex(points:Array<Vector2>, toPoint:Vector2):UInt {
        var minimum = Math.POSITIVE_INFINITY;
        var minimumPoint = -1;
        for (i in 0...points.length) {
            var point = points[i];
            var dx = toPoint.x - point.x;
            var dy = toPoint.y - point.y;
            var distSquared = dx * dx + dy * dy;
            if (minimum > distSquared) {
                minimum = distSquared;
                minimumPoint = i;
            }
        }
        return minimumPoint;
    }

    public static function diffAngle(a:Float, b:Float):Float {
        a = a % (Math.PI * 2);
        b = b % (Math.PI * 2);
        if (a - b > Math.PI) {
            b += Math.PI * 2;
        } else if (b - a > Math.PI) {
            a += Math.PI * 2;
        }
        return b - a;
    }

    public static function lerpAngle(from:Float, to:Float, amount:Float):Float {
        return from + diffAngle(from, to) * amount;
    }

    public static function mergeShapePaths(shapePath:ShapePath, other:ShapePath) {
        for (path in other.subPaths) shapePath.subPaths.push(path.clone());
    }

    public static function addPath(shapePath:ShapePath, path:Path) {
        shapePath.subPaths.push(path.clone());
    }

    public static function distance(v1:Vector2, v2:Vector2):Float {
        var dx = v1.x - v2.x;
        var dy = v1.y - v2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
