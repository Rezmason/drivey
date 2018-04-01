import js.Browser;

import drivey.Screen;

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

class Playground
{
    var world:Group;
    var dashboard:Group;
    var skybox:Group;
    var wheel:Group;
    var screen:Screen;

    public static function run(screen:Screen)
    {
        new Playground(screen);
    }

    function new(screen:Screen) {
        this.screen = screen;
        init();
        screen.addRenderListener(update);
        // screen.bg = new drivey.Color(0.7, 0.4, 0.1);
    }

    function init() {
        world = new Group();
        world.position.z = -100;
        world.rotation.x = -Math.PI / 8;
        
        dashboard = new Group();
        skybox = new Group();
        skybox.add(makeSky());

        var cockpit:Group = new Group();
        cockpit.add(skybox);
        cockpit.add(dashboard);
        cockpit.add(screen.camera);
        screen.scene.add(cockpit); // For now

        screen.scene.add(world);

        var roadPath = makeRoadPath();

        var roadStripes = new ShapePath();
        mergeShapePaths(roadStripes, drawRoadLine(roadPath, new ShapePath(),  10,  1, 0, 1.0, 250));
        mergeShapePaths(roadStripes, drawRoadLine(roadPath, new ShapePath(), -10,  1, 0, 0.5, 250));
        world.add(makeMesh(roadStripes, 0, 250, 0xFF8000));

        var dashedLine = new ShapePath();
        for (i in 0...50) drawRoadLine(roadPath, dashedLine, 0, 1, i / 50, (i + 0.7) / 50, 250);
        mergeShapePaths(roadStripes, dashedLine);
        world.add(makeMesh(dashedLine, 0, 3, 0xFFFF00));

        var tops = new ShapePath();
        var sides = new ShapePath();
        for (i in 0...5) {
            drawRoadLine(roadPath, tops, 0, 40, i / 5, (i + 0.005) / 5, 250);
            drawRoadLine(roadPath, sides, -20, 1, i / 5, (i + 0.005) / 5, 250);
            drawRoadLine(roadPath, sides,  20, 1, i / 5, (i + 0.005) / 5, 250);
        }
        var topsMesh = makeMesh(tops, 1, 20);
        topsMesh.position.z = 20;
        world.add(topsMesh);
        var sidesMesh = makeMesh(sides, 21, 20);
        world.add(sidesMesh);


        function addDashboardElement(path, depth:Float, hasEdge:Bool, hasFill:Bool) {
            var element = new Group();
            if (hasEdge) {
                var edge = makeMesh(expandShapePath(path, 4, 250), 0, 240, 0x333333);
                element.add(edge);
                
            }
            if (hasFill) {
                var fill = makeMesh(expandShapePath(path, 1, 250), 0, 240, 0x000000);
                fill.position.z = 1;
                element.add(fill);
            }
            dashboard.add(element);
            return element;
        }
        wheel = addDashboardElement(makeSteeringWheel(), 0, true, true);
        wheel.position.set(-30, -50, 0);
        
        dashboard.position.z = -100;
        
        /*
        var headlight = new ShapePath();
        headlight.subPaths.push(makeHeadlightPath());
        world.add(makeMesh(headlight, 1, 30, 0xFFFFFF));
        /**/
    }

    function makeSky() {
        var size = 1000;
        var skyGeom = new SphereGeometry(size, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2);
        for (face in skyGeom.faces) {
            var vertices = [skyGeom.vertices[face.a], skyGeom.vertices[face.b], skyGeom.vertices[face.c]];
            for (i in 0...3) {
                var color = new Color();
                color.setHSL(0, 0, vertices[i].y / size * 2);
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

    function makeMesh(shapePath:ShapePath, amount:Float, curveSegments:UInt, color = 0xFFFFFF) {
        return new Mesh(
            new ExtrudeGeometry(shapePath.toShapes(false, false), {amount:amount, bevelEnabled:false, curveSegments:curveSegments}),
            new MeshBasicMaterial( { wireframe: false, color: color } )
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
            var mag = (Math.random() + 5) * 20;
            var pt = new Vector2(Math.cos(theta) * mag, Math.sin(theta) * mag);
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

    function makeSteeringWheel() {
        var scale = 90;

        var form:ShapePath = new ShapePath();

        var outerRim = makeCirclePath(scale * 0.5);
        
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

    function makeSplinePath(pts:Array<Vector2>, closed:Bool):Path {
        var spline:Path = new Path();
        spline.curves.push(cast new CatmullRomCurve3([for (pt in pts) new js.three.Vector3(pt.x, pt.y)], closed));
        return spline;
    }

    function makeCirclePath(radius:Float):Path {
        var circle:Path = new Path();
        circle.absarc( 0, 0, radius, 0, Math.PI * 2, true);
        return circle;
    }

    function makePolygonPath(points:Array<Vector2>):Path {
        return new Shape(points);
    }

    function expandPath(source:Path, thickness:Float, divisions:UInt) return new Path([for (i in 0...divisions) getExtrudedPointAt(source, i / divisions, thickness / 2)]);

    function expandShapePath(shapePath:ShapePath, thickness:Float, divisions:UInt):ShapePath {
        var expansion:ShapePath = new ShapePath();
        for (subPath in shapePath.subPaths) expansion.subPaths.push(expandPath(subPath, thickness, divisions));
        return expansion;
    }

    function getExtrudedPointAt(source:Path, t:Float, offset:Float):Vector2 {
        while (t < 0) t++;
        while (t > 1) t--;
        var tangent:Vector2 = source.getTangent(t);
        return cast source.getPoint(t).add(new Vector2(-tangent.y * offset, tangent.x * offset));
    }

    function update() {
        world.rotation.z += 0.005;
        wheel.rotation.z = Math.PI + Math.sin(haxe.Timer.stamp()) / 2;
        // skybox.rotation.y += 0.05;
        screen.clear();
        world.position.z = -300;
        world.rotation.x = -0.4 * Math.PI;
    }
}
