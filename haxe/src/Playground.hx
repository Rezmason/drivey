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

class Playground
{
    var group:Group;
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
        group = new Group();
        group.position.z = -100;
        group.rotation.x = -Math.PI / 8;
        
        function addMesh( shapePath:ShapePath, amount:Float, curveSegments:UInt, color, x, y, z) {
            var material = new MeshBasicMaterial( { wireframe: false, color: color } );
            var geometry = new ExtrudeGeometry(shapePath.toShapes(false, false), {amount:amount, bevelEnabled:false, curveSegments:curveSegments});
            var mesh = new Mesh( geometry, material );
            mesh.position.set(x, y, z);
            group.add(mesh);
        }

        var roadPath = makeRoadPath();

        var roadStripes = new ShapePath();
        merge(roadStripes, drawRoadLine(roadPath, new ShapePath(),  1,  1, 0, 1, 250));
        merge(roadStripes, drawRoadLine(roadPath, new ShapePath(), -1,  1, 0, 0.5, 250));
        addMesh(roadStripes, 0, 250, 0xFF8000, 0, 0, 0);

        var dashedLine = new ShapePath();
        for (i in 0...100) drawRoadLine(roadPath, dashedLine, -3, 1, i / 100, (i + 0.5) / 100, 250);
        merge(roadStripes, dashedLine);
        addMesh(dashedLine, 0, 3, 0xFFFF00, 0, 0, 0);

        /*
        var wheel = makeSteeringWheel();
        addMesh(expandShapePath(wheel, 6, 250),     2, 240, 0x333333, 0, 0,    0);
        addMesh(expandShapePath(wheel, 3, 250),     6, 240, 0x000000, 0, 0, -1.5);
        /**/
        
        /*
        var headlight = new ShapePath();
        headlight.subPaths.push(makeHeadlightPath());
        addMesh(headlight, 1, 30, 0xFFFFFF, 0, 0, 0);
        /**/
    }

    function merge(shapePath:ShapePath, other:ShapePath) {
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
        var scale = 200;

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
        // group.rotation.z += 0.005;
        // group.rotation.x += 0.025;
        group.rotation.z = Math.PI + Math.sin(haxe.Timer.stamp()) / 2;
        
        screen.clear();
        screen.drawObject(group);
        group.position.z = -300;
    }
}
