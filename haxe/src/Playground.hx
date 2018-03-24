import js.Browser;

import drivey.Screen;

import js.three.BufferGeometry;
import js.three.ExtrudeGeometry;
import js.three.Group;
import js.three.Mesh;
import js.three.MeshBasicMaterial;
import js.three.Curve;
import js.three.Path;
import js.three.Shape;
import js.three.ShapeBufferGeometry;
import js.three.Vector2;
import js.three.Vector;
import js.three.CatmullRomCurve3;

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
        
        function addShape( shape:Shape, amount:Float, curveSegments:UInt, color, x, y, z) {
            var material = new MeshBasicMaterial( { wireframe: true, color: color } );
            // material.side = DoubleSide;

            var geometry = new ExtrudeGeometry(shape, {amount:amount, bevelEnabled:false, curveSegments:curveSegments});
            var mesh = new Mesh( geometry, material );
            mesh.position.set(x, y, z);
            group.add( mesh );
        }
        
        addShape( expandShape(makeSteeringWheelShape(), 6, 250),     2, 240, 0x333333, 0, 0,    0);
        addShape( expandShape(makeSteeringWheelShape(), 3, 250),     6, 240, 0x000000, 0, 0, -1.5);

        // addShape( makeHeadlightShape(), 1, 30, 0xFFFFFF, 0, 0, 0);
    }

    function makeSquareShape() {
        var sqLength = 80;
        var squareShape:Shape = new Shape();
        squareShape.moveTo( -sqLength / 2, -sqLength / 2 );
        squareShape.lineTo(  sqLength / 2, -sqLength / 2 );
        squareShape.lineTo(  sqLength / 2,  sqLength / 2 );
        squareShape.lineTo( -sqLength / 2,  sqLength / 2 );
        squareShape.lineTo( -sqLength / 2, -sqLength / 2 );
        return squareShape;
    }

    function makeDonutShape() {
        var donutShape:Shape = new Shape();
        donutShape.absarc( 0, 0, 40, 0, Math.PI * 2, true);
        var holePath = new Path();
        holePath.absarc( 0, 0, 30, 0, Math.PI * 2, true);
        donutShape.holes.push( holePath );
        return donutShape;
    }

    function makeRoadShape() {

        var pts = [];

        var n = 16;
        for (i in 0...n)
        {
            var theta:Float = i * Math.PI * 2 / n;
            var mag = (Math.random() + 5) * 20;
            var pt = new Vector2(Math.cos(theta) * mag, Math.sin(theta) * mag);
            pts.push(pt);
        }

        return makeSplineShape(pts, true);
    }

    function makeHeadlightShape() {
        var pts:Array<Vector2> = [
            new Vector2( 0,   0),
            new Vector2(-6,  13),
            new Vector2( 4,  15),
            new Vector2( 0,   0),
        ];
        
        return makeSplineShape(pts, true);
    }

    function makeSteeringWheelShape() {
        var scale = 200;

        var steeringWheelShape:Shape = new Shape();

        var outerRim = new Shape();
        outerRim.absarc( 0, 0, scale * 0.5, 0, Math.PI * 2, true);

        var innerRim1Points = [];
        var n = 60;
        for (i in 0...25) {
            var theta = (57 - i) * Math.PI * 2 / n;
            var mag = ((i & 1 != 0) ? 0.435: 0.45) * scale;
            innerRim1Points.push(new Vector2(Math.cos(theta) * mag, Math.sin(theta) * mag));
        }
        var innerRim1 = makeSplineShape(innerRim1Points, true);

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
        var innerRim2 = makeSplineShape(innerRim2Points, true);

        steeringWheelShape.curves.push(outerRim);
        steeringWheelShape.holes.push(innerRim1);
        steeringWheelShape.holes.push(innerRim2);

        return steeringWheelShape;
    }

    function makeSplineShape(pts:Array<Vector2>, closed:Bool):Shape {
        var shape:Shape = new Shape();
        var spline = new CatmullRomCurve3([for (pt in pts) new js.three.Vector3(pt.x, pt.y)], closed);
        shape.curves.push(cast spline);
        return shape;
    }

    function expandShape(shape:Shape, thickness:Float, divisions:UInt):Shape {
        function expandCurve(source:Curve<Vector2>, isHole:Bool):Shape {
            var points:Array<Vector2> = [];
            for (i in 0...divisions) {
                var t:Float = i / divisions;
                var pos:Vector2 = source.getPoint(t);
                var bump:Vector2 = source.getTangent(t);
                // [bump.x, bump.y] = [-bump.y, bump.x];
                var temp = bump.x;
                bump.x = -bump.y;
                bump.y = temp;
                if (isHole) bump.negate();
                bump.multiplyScalar(thickness / 2);
                points.push(cast pos.clone().add(bump));
            }

            var curve:Shape = new Shape();
            curve.moveTo(points[divisions - 1].x, points[divisions - 1].y);
            for (point in points) curve.lineTo(point.x, point.y);
            return curve;
        }

        var expansion:Shape = expandCurve(shape, false);
        for (hole in shape.holes) expansion.holes.push(expandCurve(hole, true));
        return expansion;
    }

    function update() {
        group.rotation.z = Math.PI + Math.sin(haxe.Timer.stamp()) / 2;
        //group.rotation.x += 0.025;
        screen.clear();
        screen.drawObject(group);
        group.position.z = -300;
    }
}
