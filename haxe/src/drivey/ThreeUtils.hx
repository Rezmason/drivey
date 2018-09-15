package drivey;

import js.three.CatmullRomCurve3;
import js.three.Path;
import js.three.Shape;
import js.three.ShapePath;

import drivey.Vector2.ThreeVector2;

class ThreeUtils {
    public static function makeSplinePath(pts:Array<ThreeVector2>, closed:Bool):Path {
        var spline:Path = new Path();
        spline.curves.push(cast new CatmullRomCurve3([for (pt in pts) new js.three.Vector3(pt.x, pt.y)], closed));
        return spline;
    }

    public static function makeCirclePath(radius:Float, aClockwise:Bool = true):Path {
        var circle:Path = new Path();
        circle.absarc( 0, 0, radius, 0, Math.PI * 2, aClockwise);
        return circle;
    }

    public static function makePolygonPath(points:Array<ThreeVector2>):Path {
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

    public static function getExtrudedPointAt(source:Path, t:Float, offset:Float):ThreeVector2 {
        while (t < 0) t++;
        while (t > 1) t--;
        var tangent:ThreeVector2 = source.getTangent(t);
        return cast source.getPoint(t).add(new ThreeVector2(-tangent.y * offset, tangent.x * offset));
    }
}
