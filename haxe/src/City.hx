import js.three.ShapePath;
import js.three.Color;
import ThreeUtils.*;
import js.three.Vector2;
import js.three.ShapePath;

class City extends Level {

    override function build() {

        name = 'The City';
        tint = new Color(0.3, 0.3, 0.7).multiplyScalar(1.5);

        roadPath.scale(2, 2);

        ground = 0.05;
        var roadLineColor = 0.6;

        skyLow = 0.4;

        // sky
        var cloudsPath = new ShapePath();
        for (i in 0...100)
        {
            var pos = new Vector2(Math.random()-0.5, Math.random()-0.5);
            if (pos.length() > 0.5 || pos.length() < 0.1) {
                continue;
            }

            pos.multiplyScalar(8000);
            // TODO: more efficient distance test
            // if ((pos - cloudsPath.getNearestPoint(pos)).length() < 200) continue;

            addPath(cloudsPath, makeCirclePath(pos.x, pos.y, 500));
        }
        var cloudsMesh = makeMesh(cloudsPath, 1, 200, (skyLow + skyHigh) / 2);
        cloudsMesh.scale.multiplyScalar(2);
        cloudsMesh.position.z = 400;
        meshes.push(cloudsMesh);

        // do bg
        var skylinePath1:ShapePath = new ShapePath();
        var skylinePath2:ShapePath = new ShapePath();
        var skylinePath3:ShapePath = new ShapePath();
        var skylinePath4:ShapePath = new ShapePath();

        var mag = 4;
        var width = 40 * mag;
        var radius = 1800 * mag;
        var x:Int = -radius;
        while (x < radius) {
            var y:Int = -radius;
            while (y < radius) {
                var pos = new Vector2(x,y);
                if (pos.length() < radius && distance(roadPath.getNearestPoint(pos), pos) > 60 * mag) {

                    var building = makeRectanglePath(pos.x + -width / 2, pos.y + -width / 2, width, width);
                    if (Math.random() > 0.8) {
                        addPath(skylinePath1, building);
                    } else if (Math.random() > 0.5) {
                        addPath(skylinePath2, building);
                    } else if (Math.random() > 0.25) {
                        addPath(skylinePath3, building);
                    } else {
                        addPath(skylinePath4, building);
                    }
                }
                y += 150 * mag;
           }
           x += 150 * mag;
        }

        // meshes.push(makeMesh(skylinePath1, 15 * 2, 1, ground));
        meshes.push(makeMesh(skylinePath2, 30 * 2, 1, ground));
        meshes.push(makeMesh(skylinePath3, 50 * 2, 1, ground));
        meshes.push(makeMesh(skylinePath4, 120 * 2, 1, ground));

        var signpostsPath = new ShapePath();
        drawRoadLine(roadPath, signpostsPath, -16, 0.2, DASH(0.2, 400), 0, 1, 1);
        drawRoadLine(roadPath, signpostsPath, -12, 0.2, DASH(0.2, 400), 0, 1, 1);
        drawRoadLine(roadPath, signpostsPath, 12, 0.2, DASH(0.2, 300), 0, 1, 1);
        drawRoadLine(roadPath, signpostsPath, 16, 0.2, DASH(0.2, 300), 0, 1, 1);
        meshes.push(makeMesh(signpostsPath, 10, 0, ground));

        var signsPath = new ShapePath();
        drawRoadLine(roadPath, signsPath, -14, 6, DASH(0.2, 400), 0, 1, 1);
        drawRoadLine(roadPath, signsPath, 14, 6, DASH(0.2, 300), 0, 1, 1);
        var signsMesh = makeMesh(signsPath, 4, 0, ground);
        signsMesh.position.z = 10;
        meshes.push(signsMesh);

        var roadLinesPath = new ShapePath();
        drawRoadLine(roadPath, roadLinesPath, 0, 0.1, SOLID, 0, 1, 1);
        drawRoadLine(roadPath, roadLinesPath, 0.2, 0.1, SOLID, 0, 1, 1);

        drawRoadLine(roadPath, roadLinesPath, -6, 0.15, DASH(30, 1), 0, 1, 1);
        drawRoadLine(roadPath, roadLinesPath, 6, 0.15, DASH(30, 1), 0, 1, 1);
        drawRoadLine(roadPath, roadLinesPath, -3, 0.15, DASH(3, 12), 0, 1, 1);
        drawRoadLine(roadPath, roadLinesPath, 3, 0.15, DASH(3, 12), 0, 1, 1);
        meshes.push(makeMesh(roadLinesPath, 0, 1, roadLineColor));
    }
}
