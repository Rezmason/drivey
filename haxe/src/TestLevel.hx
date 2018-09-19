import js.three.ShapePath;
import ThreeUtils.*;
import Level.RoadLineStyle;

class TestLevel extends Level
{
    inline static var DIVISIONS = 2000;

    override function build() {
        name = "Test";
        var roadStripesPath = new ShapePath();
        mergeShapePaths(roadStripesPath, drawRoadLine(roadPath, new ShapePath(),  3, 0.15, SOLID, 0, 1.0, DIVISIONS));
        mergeShapePaths(roadStripesPath, drawRoadLine(roadPath, new ShapePath(), -3, 0.15, SOLID, 0, 1.0, DIVISIONS));
        meshes.push(makeMesh(roadStripesPath, 0, 1000, 0.58));

        var dashedLinePath = new ShapePath();
        drawRoadLine(roadPath, dashedLinePath,  0.0625, 0.0625, DASH(30, 30), 0, 1, DIVISIONS);
        drawRoadLine(roadPath, dashedLinePath, -0.0625, 0.0625, DASH(30, 30), 0, 1, DIVISIONS);
        meshes.push(makeMesh(dashedLinePath, 0, 1000, 0.58));

        var hoopTopsPath = new ShapePath();
        var hoopSidesPath = new ShapePath();
        var hoopStyle:RoadLineStyle = DASH(1, 200);
        drawRoadLine(roadPath, hoopTopsPath,   0,  8, hoopStyle, 0, 1, DIVISIONS);
        drawRoadLine(roadPath, hoopSidesPath, -4,  1, hoopStyle, 0, 1, DIVISIONS);
        drawRoadLine(roadPath, hoopSidesPath,  4,  1, hoopStyle, 0, 1, DIVISIONS);
        var hoopTopsMesh = makeMesh(hoopTopsPath, 1, 20);
        hoopTopsMesh.position.z = 4;
        meshes.push(hoopTopsMesh);
        var hoopSidesMesh = makeMesh(hoopSidesPath, 5, 20);
        meshes.push(hoopSidesMesh);
    }
}
