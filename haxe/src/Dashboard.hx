import js.three.Group;
import js.three.ShapePath;
import js.three.Vector2;

import drivey.ThreeUtils.*;

class Dashboard {
    public var object(default, null):Group;
    public var wheelRotation(get, set):Float;
    public var needle1Rotation(get, set):Float;
    public var needle2Rotation(get, set):Float;
    var wheel:Group;
    var needle1:Group;
    var needle2:Group;

    public function new() {
        object = new Group();

        function addDashboardElement(path, edgeAmount:Float = 0, hasFill:Bool) {
            var element = new Group();

            if (edgeAmount != 0) {
                var edge = makeMesh(expandShapePath(path, 1 + edgeAmount, 250), 0, 0, 0x343434);
                edge.position.z = -0.1;
                element.add(edge);
            }

            if (hasFill && edgeAmount != 0) {
                var fill = makeMesh(expandShapePath(path, 1, 250), 0, 0, 0x000000);
                fill.position.z = 0;
                element.add(fill);
            } else if (hasFill) {
                var fill = makeMesh(path, 0, 240, 0x343434);
                fill.position.z = 0;
                element.add(fill);
            }
            object.add(element);
            return element;
        }

        var edge = 2; // 3.5

        var backing = addDashboardElement(makeDashboardBacking(), edge, true);
        backing.position.set(-50, -80, -110);

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
    }

    function makeDashboardBacking() {
        var pts:Array<Vector2> = [
            new Vector2(-200, -40),
            new Vector2(-200,  40),
            new Vector2( 200,  40),
            new Vector2( 200, -40),
        ];

        var path = makeSplinePath(pts, true);
        var shapePath:ShapePath = new ShapePath();
        shapePath.subPaths.push(path);
        return shapePath;
    }

    function makeSpeedometer() {
        var shapePath:ShapePath = new ShapePath();

        var outerRadius = 20;
        var innerRadius = outerRadius - 1;
        var dashEnd = innerRadius - 2;

        var outerRim = makeCirclePath(0, 0, outerRadius);
        var innerRim = makeCirclePath(0, 0, innerRadius, false);

        shapePath.subPaths.push(outerRim);
        shapePath.subPaths.push(innerRim);

        var nudge = Math.PI * 0.0075;

        for (i in 0...10) {
            var angle = Math.PI * 2 * (i + 0.5) / 10;
            shapePath.subPaths.push(makePolygonPath([
                new Vector2(Math.cos(angle - nudge) * outerRadius, Math.sin(angle - nudge) * outerRadius),
                new Vector2(Math.cos(angle - nudge) * dashEnd, Math.sin(angle - nudge) * dashEnd),
                new Vector2(Math.cos(angle + nudge) * dashEnd, Math.sin(angle + nudge) * dashEnd),
                new Vector2(Math.cos(angle + nudge) * outerRadius, Math.sin(angle + nudge) * outerRadius),
            ]));
        }

        return shapePath;
    }

    function makeNeedle() {
        var shapePath:ShapePath = new ShapePath();
        var scale = 40;
        shapePath.subPaths.push(makePolygonPath([
            new Vector2(-0.02 * scale, 0.1 * scale),
            new Vector2(-0.005 * scale, -0.4 * scale),
            new Vector2(0.005 * scale, -0.4 * scale),
            new Vector2(0.02 * scale, 0.1 * scale),
        ]));
        return shapePath;
    }

    function makeSteeringWheel() {
        var scale:Float = 148;

        var shapePath:ShapePath = new ShapePath();

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

        shapePath.subPaths.push(outerRim);
        shapePath.subPaths.push(innerRim1);
        shapePath.subPaths.push(innerRim2);

        return shapePath;
    }

    function get_wheelRotation() {
        return wheel.rotation.z;
    }

    function set_wheelRotation(value) {
        wheel.rotation.z = value;
        return value;
    }

    function get_needle1Rotation() {
        return needle1.rotation.z;
    }

    function set_needle1Rotation(value) {
        needle1.rotation.z = value;
        return value;
    }

    function get_needle2Rotation() {
        return needle2.rotation.z;
    }

    function set_needle2Rotation(value) {
        needle2.rotation.z = value;
        return value;
    }

}
