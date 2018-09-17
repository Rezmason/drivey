package drivey;

import js.three.CatmullRomCurve3;
import js.three.Color;
import js.three.ExtrudeGeometry;
import js.three.Mesh;
import js.three.MeshBasicMaterial;
import js.three.Path;
import js.three.Shape;
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

    public static function makeMesh(shapePath:ShapePath, amount:Float, curveSegments:UInt, colorHex = 0x0f0f0f, alpha:Float = 1) {
        return new Mesh(
            new ExtrudeGeometry(shapePath.toShapes(false, false), {amount:amount, bevelEnabled:false, curveSegments:curveSegments}),
            getMaterial(colorHex, alpha)
        );
    }

    static var basicMaterialsByHex:Map<String, MeshBasicMaterial> = new Map();

    public static function getMaterial(colorHex:Int, alpha:Float):MeshBasicMaterial {
        var key = '${colorHex}_$alpha';
        if (!basicMaterialsByHex.exists(key)) {
            basicMaterialsByHex.set(key, new MeshBasicMaterial({color:colorHex, opacity:alpha, transparent:alpha < 1}));
        }
        return basicMaterialsByHex[key];
    }

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

    public static function averageColors(color1:Color, color2:Color):Color {
        return new Color(
            (color1.r + color2.r) * 0.5,
            (color1.g + color2.g) * 0.5,
            (color1.b + color2.b) * 0.5
        );
    }

    public static function distance(v1:Vector2, v2:Vector2):Float {
        var dx = v1.x - v2.x;
        var dy = v1.y - v2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
