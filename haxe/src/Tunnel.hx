import js.three.ShapePath;
import js.three.Color;
import drivey.ThreeUtils.*;

class Tunnel extends Level {

    inline static var DIVISIONS = 2000;

    override function build() {
        name = 'The Tunnel';
        tint = new Color(0.2, 0.7, 0.1);
        skyLow = skyHigh = 0;

        var tarmac = new Color(0.1, 0.1, 0.1).getHex();
        var whiteLines = new Color(0.8, 0.8, 0.8).getHex();
        var yellowLines = new Color(0.75, 0.75, 0.75).getHex();
        var lightColor = new Color(1, 1, 1).getHex();
        var walls = new Color(0, 0, 0).getHex();

        var tunnelTarmacPath = new ShapePath();
        drawRoadLine(roadPath, tunnelTarmacPath, 0, 7, SOLID, 0, 1, DIVISIONS);
        var tunnelTarmacMesh = makeMesh(tunnelTarmacPath, 0, 1000, tarmac);
        world.add(tunnelTarmacMesh);

        // do white lines
        var tunnelWhiteLinesPath = new ShapePath();
        drawRoadLine(roadPath, tunnelWhiteLinesPath, -3.5, 0.2, DASH(30, 2), 0, 1, DIVISIONS);
        drawRoadLine(roadPath, tunnelWhiteLinesPath, 3.5, 0.2, DASH(30, 2), 0, 1, DIVISIONS);
        drawRoadLine(roadPath, tunnelWhiteLinesPath, -0.15, 0.15, DASH(4, 8), 0, 1, DIVISIONS);
        var tunnelWhiteLinesMesh = makeMesh(tunnelWhiteLinesPath, 0, 1000, whiteLines);
        tunnelWhiteLinesMesh.position.z = 0.01;
        world.add(tunnelWhiteLinesMesh);

        // do crossings
        if (true)
        {
            var tunnelCrossingPath = new ShapePath();
            drawRoadLine(roadPath, tunnelCrossingPath, 0, 1, DASH(2, 200), 0, 1, DIVISIONS);
            var tunnelCrossingMesh = makeMesh(tunnelCrossingPath, 0, 1000, tarmac);
            tunnelCrossingMesh.position.z = 0.001;
            world.add(tunnelCrossingMesh);

            var tunnelCrossingLinesPath = new ShapePath();
            for (i in 0...6)
            {
                var width = 6.0 / 6 * 0.5;
                drawRoadLine(roadPath, tunnelCrossingLinesPath, i * 2 * width - 3 + width, width, DASH(2, 200), 0, 1, DIVISIONS);
            }
            var tunnelCrossingLinesMesh = makeMesh(tunnelCrossingLinesPath, 0, 1000, whiteLines);
            tunnelCrossingLinesMesh.position.z = 0.01;
            world.add(tunnelCrossingLinesMesh);
        }

        // do lights
        if (true)
        {
            var tunnelLightsPath = new ShapePath();
            drawRoadLine(roadPath, tunnelLightsPath, -4, 0.1, DASH(4, 6), 0, 1, DIVISIONS);
            drawRoadLine(roadPath, tunnelLightsPath, 4, 0.1, DASH(4, 6), 0, 1, DIVISIONS);
            var tunnelLightsMesh = makeMesh(tunnelLightsPath, 0.1, 1000, lightColor);
            world.add(tunnelLightsMesh);
            tunnelLightsMesh.position.z = 4;
        }

        if (true)   // walls
        {
            var tunnelWallPath = new ShapePath();
            drawRoadLine(roadPath, tunnelWallPath, -5, 0.4, DASH(100, 0), 0, 1, DIVISIONS);
            drawRoadLine(roadPath, tunnelWallPath, 5, 0.4, DASH(100, 0), 0, 1, DIVISIONS);
            var tunnelWallMesh = makeMesh(tunnelWallPath, 4, 1000, walls);
            world.add(tunnelWallMesh);
        }
    }
}
