import js.three.Group;
import js.three.Path;
import js.three.ShapePath;
import js.three.Vector2;

import drivey.ThreeUtils.*;

class Level
{
    public var world(default, null):Group;
    public var roadPath(default, null):RoadPath;

    public function new() {
        world = new Group();
        roadPath = makeRoadPath();
        build();
    }

    function build() {}

    function drawRoadLine(roadPath:RoadPath, shapePath:ShapePath, xPos:Float, width:Float, start:Float, end:Float, divisions:UInt):ShapePath {
        width = Math.abs(width);
        var outsideOffset = xPos - width / 2;
        var insideOffset = xPos + width / 2;

        if (start == end) {
            return shapePath;
        }

        var outsidePoints:Array<Vector2> = [];
        var insidePoints:Array<Vector2> = [];
        var diff = 1 / divisions;
        var i = start;
        while (i < end) {
            outsidePoints.push(cast getExtrudedPointAt(roadPath.curve, i, outsideOffset));
            insidePoints.push(cast getExtrudedPointAt(roadPath.curve, i, insideOffset));
            i += diff;
        }
        outsidePoints.push(cast getExtrudedPointAt(roadPath.curve, end, outsideOffset));
        insidePoints.push(cast getExtrudedPointAt(roadPath.curve, end, insideOffset));
        outsidePoints.reverse();

        if (start == 0 && end == 1) {
            shapePath.subPaths.push(makePolygonPath(outsidePoints));
            shapePath.subPaths.push(makePolygonPath(insidePoints));
        } else {
            shapePath.subPaths.push(makePolygonPath(outsidePoints.concat(insidePoints)));
        }

        return shapePath;
    }

    function makeRoadPath() {

        var pts = [];

        var n = 16;
        for (i in 0...n)
        {
            var theta:Float = i * Math.PI * 2 / n;
            var mag = (Math.random() + 10) * 200;
            var pt = new Vector2(Math.cos(theta) * -mag, Math.sin(theta) * mag);
            pts.push(pt);
        }

        return new RoadPath(pts);
    }
}
