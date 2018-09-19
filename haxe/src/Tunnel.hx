import js.three.ShapePath;
import js.three.Color;
import drivey.ThreeUtils.*;

class Tunnel extends Level {

    override function build() {
        name = 'The Tunnel';
        tint = new Color(0.2, 0.7, 0.1);
        var tarmac = 0.1;
        var whiteLinesColor = 0.8;
        var lightColor = 1;
        var wallColor = 0;

        var tarmacPath = new ShapePath();
        drawRoadLine(roadPath, tarmacPath, 0, 7, SOLID, 0, 1, 1);
        var tarmacMesh = makeMesh(tarmacPath, 0, 1000, tarmac);
        meshes.push(tarmacMesh);

        // do white lines
        var roadLinesPath = new ShapePath();
        drawRoadLine(roadPath, roadLinesPath, -3.5, 0.2, DASH(30, 2), 0, 1, 5);
        drawRoadLine(roadPath, roadLinesPath, 3.5, 0.2, DASH(30, 2), 0, 1, 5);
        drawRoadLine(roadPath, roadLinesPath, -0.15, 0.15, DASH(4, 8), 0, 1, 1);
        var roadLinesMesh = makeMesh(roadLinesPath, 0, 1000, whiteLinesColor);
        roadLinesMesh.position.z = 0.01;
        meshes.push(roadLinesMesh);

        // do crossings
        if (true)
        {
            var crossingPath = new ShapePath();
            drawRoadLine(roadPath, crossingPath, 0, 1, DASH(2, 200), 0, 1, 1);
            var crossingMesh = makeMesh(crossingPath, 0, 1000, tarmac);
            crossingMesh.position.z = 0.001;
            meshes.push(crossingMesh);

            var crossingLinesPath = new ShapePath();
            for (i in 0...6)
            {
                var width = 6.0 / 6 * 0.5;
                drawRoadLine(roadPath, crossingLinesPath, i * 2 * width - 3 + width, width, DASH(2, 200), 0, 1, 1);
            }
            var crossingLinesMesh = makeMesh(crossingLinesPath, 0, 1000, whiteLinesColor);
            crossingLinesMesh.position.z = 0.01;
            meshes.push(crossingLinesMesh);
        }

        // do lights
        if (true)
        {
            var lightsPath = new ShapePath();
            drawRoadLine(roadPath, lightsPath, -4, 0.1, DASH(4, 6), 0, 1, 1);
            drawRoadLine(roadPath, lightsPath, 4, 0.1, DASH(4, 6), 0, 1, 1);
            var lightsMesh = makeMesh(lightsPath, 0.1, 1000, lightColor);
            meshes.push(lightsMesh);
            lightsMesh.position.z = 4;
        }

        if (true)   // walls
        {
            var wallPath = new ShapePath();
            drawRoadLine(roadPath, wallPath, -5, 0.4, SOLID, 0, 1, 800);
            drawRoadLine(roadPath, wallPath, 5, 0.4, SOLID, 0, 1, 800);
            var wallMesh = makeMesh(wallPath, 4, 1000, wallColor);
            meshes.push(wallMesh);
        }
    }
}
