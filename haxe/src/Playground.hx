import js.Browser;

import drivey.Screen;
import drivey.Level;
import drivey.levels.*;

import js.three.BufferGeometry;
import js.three.CatmullRomCurve3;
import js.three.Curve;
import js.three.ExtrudeGeometry;
import js.three.Group;
import js.three.Mesh;
import js.three.MeshBasicMaterial;
import js.three.Path;
import js.three.Shape;
import js.three.ShapePath;
import js.three.ShapeBufferGeometry;
import js.three.Vector2;
import js.three.Vector3;
import js.three.Vector;
import js.three.SphereGeometry;
import js.three.Color;

import drivey.ThreeUtils.*;

class Playground
{
    var world:Group;
    var dashboard:Group;
    var skybox:Group;
    var wheel:Group;
    var screen:Screen;
    var roadPath:Path;
    var cockpit:Group;
    var carStuff:Group;
    var needle1:Group;
    var needle2:Group;

    public static function run(screen:Screen)
    {
        new Playground(screen);
    }

    function new(screen:Screen) {
        this.screen = screen;
        init();
        screen.addRenderListener(update);
        // screen.bg = new drivey.Color(0.7, 0.4, 0.1);
        screen.bg = new drivey.Color(0.0588, 0.0588, 0.0588);
    }

    function init() {
        world = new Group();
        dashboard = new Group();
        skybox = new Group();
        var sky = makeSky();
        skybox.add(sky);
        // sky.material.vertexColors = cast 0;

        cockpit = new Group();
        cockpit.rotation.order = "ZYX";
        carStuff = new Group();
        cockpit.add(carStuff);
        // cockpit.add(new Mesh(
        //     new SphereGeometry(1, 10, 10),
        //     screen.getMaterial(0xFF0000)
        // ));
        cockpit.add(skybox);
        carStuff.add(screen.camera);
        carStuff.add(dashboard);
        screen.scene.add(cockpit);

        screen.orthoCamera.position.set(0, 700, 600);
        screen.orthoCamera.up = new Vector3(0, 0, 1);
        screen.orthoCamera.zoom = 0.5;
        screen.orthoCamera.updateProjectionMatrix();

        screen.scene.add(world);

        roadPath = makeRoadPath();

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

        function addDashboardElement(path, edgeAmount:Float = 0, hasFill:Bool) {
            var element = new Group();

            if (edgeAmount != 0) {
                var edge = makeMesh(expandShapePath(path, 1 + edgeAmount, 250), 0, 240, 0x343434);
                edge.position.z = -0.1;
                element.add(edge);
            }

            if (hasFill && edgeAmount != 0) {
                var fill = makeMesh(expandShapePath(path, 1, 250), 0, 240, 0x000000);
                fill.position.z = 0;
                element.add(fill);
            } else if (hasFill) {
                var fill = makeMesh(path, 0, 240, 0x343434);
                fill.position.z = 0;
                element.add(fill);
            }
            dashboard.add(element);
            return element;
        }

        var edge = 2; // 3.5

        var backing = addDashboardElement(makeDashboardBacking(), edge, true);
        backing.position.set(-50, -60, -110);

        var speedometer1 = addDashboardElement(makeSpeedometer(), 0, true);
        speedometer1.position.set(-25, -35, -105);

        needle1 = addDashboardElement(makeNeedle(), 0, true);
        needle1.position.set(-25, -35, -105);

        var speedometer2 = addDashboardElement(makeSpeedometer(), 0, true);
        speedometer2.position.set(-70, -35, -105);

        needle2 = addDashboardElement(makeNeedle(), 0, true);
        needle2.position.set(-70, -35, -105);

        wheel = addDashboardElement(makeSteeringWheel(), edge, true);
        wheel.position.set(-50, -55, -100);
        wheel.rotation.z = Math.PI;

        dashboard.scale.set(0.01, 0.01, 0.01);

        /*
        var headlight = new ShapePath();
        headlight.subPaths.push(makeHeadlightPath());
        world.add(makeMesh(headlight, 1, 30, 0xFFFFFF));
        /**/

        var level:DeepDarkNight = new DeepDarkNight();
        screen.drawLevel(level);
    }

    function makeSky() {
        var size = 10000;
        var skyGeom = new SphereGeometry(size, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2);
        for (face in skyGeom.faces) {
            var vertices = [skyGeom.vertices[face.a], skyGeom.vertices[face.b], skyGeom.vertices[face.c]];
            for (i in 0...3) {
                var color = new Color();
                color.setHSL(0, 0, 0.675 * (1 - (vertices[i].y) / size * 2.25));
                face.vertexColors[i] = color;
            }
        }

        var sky = new Mesh(
            skyGeom,
            new MeshBasicMaterial(cast {
                vertexColors: 2, // VertexColors
                side: 1, // BackSide
            })
        );
        // sky.position.z = -size * 2;
        return sky;
    }

    function makeMesh(shapePath:ShapePath, amount:Float, curveSegments:UInt, colorHex = 0x0f0f0f) {
        return new Mesh(
            new ExtrudeGeometry(shapePath.toShapes(false, false), {amount:amount, bevelEnabled:false, curveSegments:curveSegments}),
            screen.getMaterial(colorHex)
        );
    }

    function mergeShapePaths(shapePath:ShapePath, other:ShapePath) {
        for (path in other.subPaths) shapePath.subPaths.push(path.clone());
    }

    function drawRoadLine(roadPath:Path, form:ShapePath, xPos:Float, width:Float, start:Float, end:Float, divisions:UInt):ShapePath {
        width = Math.abs(width);
        var outsideOffset = xPos - width / 2;
        var insideOffset = xPos + width / 2;

        if (start == end) {
            return form;
        }

        var outsidePoints:Array<Vector2> = [];
        var insidePoints:Array<Vector2> = [];
        var diff = 1 / divisions;
        var i = start;
        while (i < end) {
            outsidePoints.push(cast getExtrudedPointAt(roadPath, i, outsideOffset));
            insidePoints.push(cast getExtrudedPointAt(roadPath, i, insideOffset));
            i += diff;
        }
        outsidePoints.push(cast getExtrudedPointAt(roadPath, end, outsideOffset));
        insidePoints.push(cast getExtrudedPointAt(roadPath, end, insideOffset));
        outsidePoints.reverse();

        if (start == 0 && end == 1) {
            form.subPaths.push(makePolygonPath(outsidePoints));
            form.subPaths.push(makePolygonPath(insidePoints));
        } else {
            form.subPaths.push(makePolygonPath(outsidePoints.concat(insidePoints)));
        }

        return form;
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

        return makeSplinePath(pts, true);
    }

    function makeHeadlightPath() {
        var pts:Array<Vector2> = [
            new Vector2( 0,   0),
            new Vector2(-6,  13),
            new Vector2( 4,  15),
            new Vector2( 0,   0),
        ];

        return makeSplinePath(pts, true);
    }

    function makeDashboardBacking() {
        var pts:Array<Vector2> = [
            new Vector2(-170, -30),
            new Vector2(-170,  30),
            new Vector2( 170,  30),
            new Vector2( 170, -30),
        ];

        var path = makeSplinePath(pts, true);
        var form:ShapePath = new ShapePath();
        form.subPaths.push(path);
        return form;
    }

    function makeSpeedometer() {
        var form:ShapePath = new ShapePath();

        var outerRadius = 20;
        var innerRadius = outerRadius - 1;
        var dashEnd = innerRadius - 2;

        var outerRim = makeCirclePath(0, 0, outerRadius);
        var innerRim = makeCirclePath(0, 0, innerRadius, false);

        form.subPaths.push(outerRim);
        form.subPaths.push(innerRim);

        var nudge = Math.PI * 0.0075;

        for (i in 0...10) {
            var angle = Math.PI * 2 * (i + 0.5) / 10;
            form.subPaths.push(makePolygonPath([
                new Vector2(Math.cos(angle - nudge) * outerRadius, Math.sin(angle - nudge) * outerRadius),
                new Vector2(Math.cos(angle - nudge) * dashEnd, Math.sin(angle - nudge) * dashEnd),
                new Vector2(Math.cos(angle + nudge) * dashEnd, Math.sin(angle + nudge) * dashEnd),
                new Vector2(Math.cos(angle + nudge) * outerRadius, Math.sin(angle + nudge) * outerRadius),
            ]));
        }

        return form;
    }

    function makeNeedle() {
        var form:ShapePath = new ShapePath();
        var scale = 40;
        form.subPaths.push(makePolygonPath([
            new Vector2(-0.02 * scale, 0.1 * scale),
            new Vector2(-0.005 * scale, -0.4 * scale),
            new Vector2(0.005 * scale, -0.4 * scale),
            new Vector2(0.02 * scale, 0.1 * scale),
        ]));
        return form;
    }

    function makeSteeringWheel() {
        var scale:Float = 148;

        var form:ShapePath = new ShapePath();

        var outerRim = makeCirclePath(0, 0, scale * 0.5);

        var innerRim1Points = [];
        var n = 60;
        for (i in 0...25) {
            var theta = (57 - i) * Math.PI * 2 / n;
            var mag = ((i & 1 != 0) ? 0.435: 0.45) * scale;
            innerRim1Points.push(new Vector2(Math.cos(theta) * mag, Math.sin(theta) * mag));
        }
        innerRim1Points.reverse();
        var innerRim1 = makeSplinePath(innerRim1Points, true);

        var innerRim2Points = [];
        for (i in 0...29) {
            var theta = (29-i) * 2 * Math.PI / n;
            var mag = ((i & 1 != 0) ? 0.435: 0.45) * scale;
            innerRim2Points.push(new Vector2(Math.cos(theta) * mag, Math.sin(theta) * mag));
        }
        innerRim2Points.push(new Vector2(scale *  0.25 , scale * 0.075));
        innerRim2Points.push(new Vector2(scale *  0.125, scale * 0.2));
        innerRim2Points.push(new Vector2(scale * -0.125, scale * 0.2));
        innerRim2Points.push(new Vector2(scale * -0.25 , scale * 0.075));
        innerRim2Points.reverse();
        var innerRim2 = makeSplinePath(innerRim2Points, true);

        form.subPaths.push(outerRim);
        form.subPaths.push(innerRim1);
        form.subPaths.push(innerRim2);

        return form;
    }

    var carT:Float = 0;

    function update() {

        var step = 0.0001;
        var simSpeed = 1.0;
        if (screen.isKeyDown('ShiftLeft') || screen.isKeyDown('ShiftRight')) simSpeed = 0.125;
        else if (screen.isKeyDown('ControlLeft') || screen.isKeyDown('ControlRight')) simSpeed = 4;

        // BEGIN FAKE CAR STUFF
        var carSpeed = 2.5;
        var roadMidOffset = -5;
        carT = (carT + (step * simSpeed * carSpeed)) % 1;
        var carPosition = getExtrudedPointAt(roadPath, carT, roadMidOffset);
        var nextPosition = getExtrudedPointAt(roadPath, (carT + 0.001) % 1, roadMidOffset);
        // END FAKE CAR STUFF

        var angle = Math.atan2(nextPosition.y - carPosition.y, nextPosition.x - carPosition.x) - Math.PI / 2;

        var tilt = diffAngle(angle, cockpit.rotation.z);
        wheel.rotation.z = lerpAngle(wheel.rotation.z, Math.PI - tilt * 4, 0.1 * simSpeed);

        cockpit.position.set(carPosition.x, carPosition.y, 3.0);
        cockpit.rotation.set(Math.PI * 0.5, 0, lerpAngle(cockpit.rotation.z, angle, 0.05 * simSpeed));
        carStuff.rotation.x = Math.PI * -0.0625;

        screen.camera.rotation.z = lerpAngle(screen.camera.rotation.z, tilt, 0.1 * simSpeed);

        screen.orthoCamera.lookAt(cockpit.position);

        needle1.rotation.z += step * simSpeed * 100;
        needle2.rotation.z += step * simSpeed * 100;

        if (screen.isKeyHit('KeyC')) {
            if (dashboard.parent != null) {
                carStuff.remove(dashboard);
            } else {
                carStuff.add(dashboard);
            }
        }
        if (screen.isKeyHit('Digit0')) screen.useOrtho = !screen.useOrtho;
        if (screen.isKeyHit('Digit2')) screen.wireframe = !screen.wireframe;
        if (screen.isKeyHit('Digit4')) screen.camera.rotation.y += Math.PI;
    }

    static function diffAngle(a:Float, b:Float):Float {
        a = a % (Math.PI * 2);
        b = b % (Math.PI * 2);
        if (a - b > Math.PI) {
            b += Math.PI * 2;
        } else if (b - a > Math.PI) {
            a += Math.PI * 2;
        }
        return b - a;
    }

    static function lerpAngle(from:Float, to:Float, amount:Float):Float {
        return from + diffAngle(from, to) * amount;
    }
}
