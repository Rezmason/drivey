package drivey;

import js.three.CatmullRomCurve3;
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

    public static function makeMesh(shapePath:ShapePath, amount:Float, curveSegments:UInt, colorHex = 0x0f0f0f) {
        return new Mesh(
            new ExtrudeGeometry(shapePath.toShapes(false, false), {amount:amount, bevelEnabled:false, curveSegments:curveSegments}),
            getMaterial(colorHex)
        );
    }

    static var basicMaterialsByHex:Map<Int, MeshBasicMaterial> = new Map();

    public static function getMaterial(colorHex:Int):MeshBasicMaterial {
        if (!basicMaterialsByHex.exists(colorHex)) {
            basicMaterialsByHex.set(colorHex, new MeshBasicMaterial({color:colorHex}));
        }
        return basicMaterialsByHex[colorHex];
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

}
