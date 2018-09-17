import js.three.ShapePath;
import drivey.ThreeUtils.*;
import Level.RoadLineStyle;

class TestLevel extends Level
{
    inline static var DIVISIONS = 1000;

    override function build() {
        name = "Test";
        var roadStripes = new ShapePath();
        mergeShapePaths(roadStripes, drawRoadLine(roadPath, new ShapePath(),  3, 0.15, SOLID, 0, 1.0, DIVISIONS));
        mergeShapePaths(roadStripes, drawRoadLine(roadPath, new ShapePath(), -3, 0.15, SOLID, 0, 1.0, DIVISIONS));
        world.add(makeMesh(roadStripes, 0, 1000, 0x969696));

        var dashedLine = new ShapePath();

        drawRoadLine(roadPath, dashedLine,  0.0625, 0.0625, DASH(30, 30), 0, 1, DIVISIONS);
        drawRoadLine(roadPath, dashedLine, -0.0625, 0.0625, DASH(30, 30), 0, 1, DIVISIONS);

        mergeShapePaths(roadStripes, dashedLine);
        world.add(makeMesh(dashedLine, 0, 3, 0x969696));

        var tops = new ShapePath();
        var sides = new ShapePath();
        var hoopStyle:RoadLineStyle = DASH(1, 200);
        drawRoadLine(roadPath, tops,   0,  8, hoopStyle, 0, 1, DIVISIONS);
        drawRoadLine(roadPath, sides, -4,  1, hoopStyle, 0, 1, DIVISIONS);
        drawRoadLine(roadPath, sides,  4,  1, hoopStyle, 0, 1, DIVISIONS);
        var topsMesh = makeMesh(tops, 1, 20);
        topsMesh.position.z = 4;
        world.add(topsMesh);
        var sidesMesh = makeMesh(sides, 5, 20);
        world.add(sidesMesh);
    }
}
