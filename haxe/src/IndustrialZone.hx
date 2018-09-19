import js.three.ShapePath;
import js.three.Color;
import drivey.ThreeUtils.*;
import js.three.Vector2;
import js.three.ShapePath;

class IndustrialZone extends Level {

    override function build() {
        name = 'The Industrial Zone';
        tint = new Color(0.7, 0.4, 0.1);

        skyHigh = new Color(0.15, 0.15, 0.15);
        skyLow = new Color(1.0, 1.0, 1.0);
        skyGradient = new Color(0.25, 0.25, 0.25);

        ground = new Color(0.05, 0.05, 0.05);
        var whiteLinesColor:Color = new Color(0.6, 0.6, 0.6);
        var lightColor:Color = new Color(1, 1, 1);

        // far off buildings
        // very tall things

        var industrialTallThingAPath = new ShapePath();
        drawRoadLine(roadPath, industrialTallThingAPath, 300, 0.5, DOT(250), 0, 1, 1);
        drawRoadLine(roadPath, industrialTallThingAPath, 320, 0.75, DOT(250), 0, 1, 1);
        var industrialTallThingAMesh = makeMesh(industrialTallThingAPath, 2, 10, lightColor.getHex());
        industrialTallThingAMesh.position.z = 60;
        world.add(industrialTallThingAMesh);

        var industrialTallThingBPath = new ShapePath();
        drawRoadLine(roadPath, industrialTallThingBPath, 300, 0.5, DOT(250), 0, 1, 1);
        drawRoadLine(roadPath, industrialTallThingBPath, 320, 0.75, DOT(250), 0, 1, 1);
        drawRoadLine(roadPath, industrialTallThingBPath, 400, 8, DOT(240), 0, 1, 1);
        drawRoadLine(roadPath, industrialTallThingBPath, 500, 8, DOT(240), 0, 1, 1);
        var industrialTallThingBMesh = makeMesh(industrialTallThingBPath, 60, 10, ground.getHex());
        world.add(industrialTallThingBMesh);

        // medium buildings
        var industrialMediumThingsPath = new ShapePath();
        drawRoadLine(roadPath, industrialMediumThingsPath, -80, 20, DASH(40, 60), 0, 1, 1);
        drawRoadLine(roadPath, industrialMediumThingsPath, 180, 50, DASH(40, 30), 0, 1, 1);
        drawRoadLine(roadPath, industrialMediumThingsPath, 300, 50, DASH(20, 20), 0, 1, 1);

        drawRoadLine(roadPath, industrialMediumThingsPath, -100, 8, DOT(200), 0, 1, 1);
        drawRoadLine(roadPath, industrialMediumThingsPath, -60, 8, DOT(1500), 0, 1, 1);
        drawRoadLine(roadPath, industrialMediumThingsPath, 100, 8, DOT(140), 0, 1, 1);
        drawRoadLine(roadPath, industrialMediumThingsPath, 120, 8, DOT(220), 0, 1, 1);
        var industrialMediumThingsMesh = makeMesh(industrialMediumThingsPath, 12, 10, ground.getHex());
        world.add(industrialMediumThingsMesh);

        // do white lines
        var industrialWhiteLinesPath = new ShapePath();
        drawRoadLine(roadPath, industrialWhiteLinesPath, -3.5, 0.15, DASH(60, 2), 0, 1, 1000);
        drawRoadLine(roadPath, industrialWhiteLinesPath, 3.5, 0.15, DASH(60, 2), 0, 1, 1000);
        drawRoadLine(roadPath, industrialWhiteLinesPath, -0.15, 0.125, DASH(4, 6), 0, 1, 1);
        drawRoadLine(roadPath, industrialWhiteLinesPath, 0.125, 0.125, SOLID, 0, 1, 1000);
        var industrialWhiteLinesMesh = makeMesh(industrialWhiteLinesPath, 0, 10, whiteLinesColor.getHex());
        world.add(industrialWhiteLinesMesh);

        // do crossings
        var industrialCrossingPath = new ShapePath();
        drawRoadLine(roadPath, industrialCrossingPath, 0, 1, DASH(2, 200), 0, 1, 1);
        var industrialCrossingMesh = makeMesh(industrialCrossingPath, 0, 10, ground.getHex());
        industrialCrossingMesh.position.z = 0.001;
        world.add(industrialCrossingMesh);

        var industrialCrossingLinesPath = new ShapePath();
        for (i in 0...6)
        {
            var width = 6.0 / 6 * 0.5;
            drawRoadLine(roadPath, industrialCrossingLinesPath, i * 2 * width - 3 + width, width, DASH(2, 200), 0, 1, 1);
        }
        var industrialCrossingLinesMesh = makeMesh(industrialCrossingLinesPath, 0, 10, whiteLinesColor.getHex());
        industrialCrossingLinesMesh.position.z = 0.01;
        world.add(industrialCrossingLinesMesh);

        // street lights
        var left = 80;
        var right = 80;
        var thick = 0.2;
        var tall = 15;

        var industrialStreetLight1Path = new ShapePath();
        drawRoadLine(roadPath, industrialStreetLight1Path, -5.6, 5, DASH(thick, left), 0, 1, 1);
        var industrialStreetLight1Mesh = makeMesh(industrialStreetLight1Path, thick, 10, ground.getHex());
        industrialStreetLight1Mesh.position.z = tall + thick;
        world.add(industrialStreetLight1Mesh);


        var industrialStreetLight2Path = new ShapePath();
        drawRoadLine(roadPath, industrialStreetLight2Path, -8, thick, DASH(thick, left), 0, 1, 1);
        var industrialStreetLight2Mesh = makeMesh(industrialStreetLight2Path, tall + thick, 10, ground.getHex());
        world.add(industrialStreetLight2Mesh);


        var industrialStreetLight3Path = new ShapePath();
        drawRoadLine(roadPath, industrialStreetLight3Path, -4, 2, DASH(thick, left), 0, 1, 1);
        var industrialStreetLight3Mesh = makeMesh(industrialStreetLight3Path, thick * 2, 10, lightColor.getHex());
        industrialStreetLight3Mesh.position.z = tall - thick;
        world.add(industrialStreetLight3Mesh);

        // overpasses
        var depth = 8;
        var spacing = 300;
        var highwayAbove = roadPath.clone();
        highwayAbove.scale(1, 1.5);

        var industrialOverpassAPath = new ShapePath();
        drawRoadLine(highwayAbove, industrialOverpassAPath, 0, 162, DASH(depth, spacing), 0, 1, 1);
        var industrialOverpassAMesh = makeMesh(industrialOverpassAPath, 2, 10, ground.getHex());
        industrialOverpassAMesh.position.z = 10;
        industrialOverpassAMesh.scale.set(1, 1/1.5, 1);
        world.add(industrialOverpassAMesh);

        var industrialOverpassBPath = new ShapePath();
        drawRoadLine(highwayAbove, industrialOverpassBPath, -100, 42, DASH(depth, spacing), 0, 1, 1);
        drawRoadLine(highwayAbove, industrialOverpassBPath, -40, 2, DASH(depth, spacing), 0, 1, 1);
        drawRoadLine(highwayAbove, industrialOverpassBPath, -15, 2, DASH(depth, spacing), 0, 1, 1);
        drawRoadLine(highwayAbove, industrialOverpassBPath, 15, 2, DASH(depth, spacing), 0, 1, 1);
        drawRoadLine(highwayAbove, industrialOverpassBPath, 40, 2, DASH(depth, spacing), 0, 1, 1);
        drawRoadLine(highwayAbove, industrialOverpassBPath, 200, 242, DASH(depth, spacing), 0, 1, 1);

        // var wall = new ShapePath();
        // drawRoadLine(highwayAbove, wall, -15, 2, DASH(depth, spacing), 0, 1, 1);
        // drawRoadLine(highwayAbove, wall, 15, 2, DASH(depth, spacing), 0, 1, 1);

        var industrialOverpassBMesh = makeMesh(industrialOverpassBPath, 10, 10, ground.getHex());
        industrialOverpassBMesh.scale.set(1, 1/1.5, 1);
        world.add(industrialOverpassBMesh);

        // various poles
        var industrialPolesPath = new ShapePath();
        drawRoadLine(roadPath, industrialPolesPath, -30, 0.25, DOT(90), 0, 1, 1);
        drawRoadLine(roadPath, industrialPolesPath, -40, 0.25, DOT(110), 0, 1, 1);
        drawRoadLine(roadPath, industrialPolesPath, 60, 0.25, DOT(60), 0, 1, 1);
        drawRoadLine(roadPath, industrialPolesPath, -50, 0.25, DOT(60), 0, 1, 1);
        drawRoadLine(roadPath, industrialPolesPath, -20, 0.125, DOT(100), 0, 1, 1);
        drawRoadLine(roadPath, industrialPolesPath, 20, 0.25, DOT(45), 0, 1, 1);
        drawRoadLine(roadPath, industrialPolesPath, 50, 0.125, DOT(50), 0, 1, 1);
        drawRoadLine(roadPath, industrialPolesPath, 70, 0.25, DOT(75), 0, 1, 1);
        var industrialPolesMesh = makeMesh(industrialPolesPath, 12, 10, ground.getHex());
        world.add(industrialPolesMesh);

        // knobs
        var industrialKnobsPath = new ShapePath();
        drawRoadLine(roadPath, industrialKnobsPath, -40, 1, DOT(110), 0, 1, 1);
        drawRoadLine(roadPath, industrialKnobsPath, 60, 1, DOT(60), 0, 1, 1);
        var industrialKnobsMesh = makeMesh(industrialKnobsPath, 1, 10, ground.getHex());
        industrialKnobsMesh.position.z = 12;
        world.add(industrialKnobsMesh);

        // wires
        var wireThickness = 0.075; // 0.025;
        var industrialWiresPath = new ShapePath();
        drawRoadLine(roadPath, industrialWiresPath, -50, wireThickness, DASH(60, 0), 0, 1, 1);
        drawRoadLine(roadPath, industrialWiresPath, -20, wireThickness, DASH(100, 0), 0, 1, 1);
        drawRoadLine(roadPath, industrialWiresPath, 20, wireThickness, DASH(45, 0), 0, 1, 1);
        drawRoadLine(roadPath, industrialWiresPath, 50, wireThickness, DASH(50, 0), 0, 1, 1);
        drawRoadLine(roadPath, industrialWiresPath, 70, wireThickness, DASH(75, 0), 0, 1, 1);
        var industrialWiresMesh = makeMesh(industrialWiresPath, wireThickness, 10, ground.getHex());
        industrialWiresMesh.position.z = 11.25;
        world.add(industrialWiresMesh);

        // fencing
        var tall = 5;
        var spacing = 30;
        var dist = 25;

        var industrialFenceAPath = new ShapePath();
        drawRoadLine(roadPath, industrialFenceAPath, -dist, 0.1, DOT(spacing), 0, 1, 1);
        drawRoadLine(roadPath, industrialFenceAPath, dist, 0.1, DOT(spacing), 0, 1, 1);
        var industrialFenceAMesh = makeMesh(industrialFenceAPath, tall, 10, ground.getHex());
        world.add(industrialFenceAMesh);


        var industrialFenceBPath = new ShapePath();
        drawRoadLine(roadPath, industrialFenceBPath, -dist, 0.1, DASH(spacing, 0), 0, 1, 1);
        drawRoadLine(roadPath, industrialFenceBPath, dist, 0.1, DASH(spacing, 0), 0, 1, 1);
        var industrialFenceBMesh = makeMesh(industrialFenceBPath, 0.1, 10, ground.getHex());
        industrialFenceBMesh.position.z = tall-0.5;
        world.add(industrialFenceBMesh);


        var industrialFenceCPath = new ShapePath();
        drawRoadLine(roadPath, industrialFenceCPath, -dist, 0.1, DASH(spacing, 0), 0, 1, 1);
        drawRoadLine(roadPath, industrialFenceCPath, dist, 0.1, DASH(spacing, 0), 0, 1, 1);
        var industrialFenceCMesh = makeMesh(industrialFenceCPath, tall - 0.5, 10, ground.getHex(), 0.25);
        world.add(industrialFenceCMesh);
    }
}
