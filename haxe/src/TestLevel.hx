import js.three.ShapePath;
import drivey.ThreeUtils.*;

class TestLevel extends Level
{
    override function build() {
        var roadStripes = new ShapePath();
        mergeShapePaths(roadStripes, drawRoadLine(roadPath, new ShapePath(),  10, 0.5, 0, 1.0, 1000));
        mergeShapePaths(roadStripes, drawRoadLine(roadPath, new ShapePath(), -10, 0.5, 0, 1.0, 1000));
        world.add(makeMesh(roadStripes, 0, 1000, 0x969696));

        var dashedLine = new ShapePath();
        for (i in 0...200) {
            drawRoadLine(roadPath, dashedLine,  0.25, 0.25, i / 200, (i + 0.5) / 200, 1000);
            drawRoadLine(roadPath, dashedLine, -0.25, 0.25, i / 200, (i + 0.5) / 200, 1000);
        }
        mergeShapePaths(roadStripes, dashedLine);
        world.add(makeMesh(dashedLine, 0, 3, 0x969696));

        var tops = new ShapePath();
        var sides = new ShapePath();
        for (i in 0...50) {
            drawRoadLine(roadPath, tops, 0, 40, i / 50, (i + 0.005) / 50, 1000);
            drawRoadLine(roadPath, sides, -20, 1, i / 50, (i + 0.005) / 50, 1000);
            drawRoadLine(roadPath, sides,  20, 1, i / 50, (i + 0.005) / 50, 1000);
        }
        var topsMesh = makeMesh(tops, 1, 20);
        topsMesh.position.z = 20;
        world.add(topsMesh);
        var sidesMesh = makeMesh(sides, 21, 20);
        world.add(sidesMesh);
    }
}
