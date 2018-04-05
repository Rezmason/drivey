package drivey;

import drivey.Utils.*;
import drivey.ThreeUtils.*;
import drivey.Vector2.ThreeVector2;

class Level {
    public var forms:Array<Form>;
    public var roadForm:Form;
    public var wallsForm:Form;
    public var roadPath:Form;
    public var name:String;

    var ground:Color;
    var skyLow:Color;
    var skyHigh:Color;
    var skyGradient:Color;

    public var tint:Color;

    public function new() {
        setup();
        build();
        finish();
    }

    function setup() {
        wallsForm = new Form('wallsForm');
        roadForm = new Form('roadForm');

        var n = 16;
        var points = [];
        var minX:Float = Math.POSITIVE_INFINITY;
        var maxX:Float = Math.NEGATIVE_INFINITY;
        var minY:Float = Math.POSITIVE_INFINITY;
        var maxY:Float = Math.NEGATIVE_INFINITY;
        for (i in 0...n)
        {
            var theta:Float = i * Math.PI * 2 / n;
            var radius = Math.random() + 5;
            var point = new Vector2(Math.cos(theta) * radius, Math.sin(theta) * radius);
            points.push(point);
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        }
        var centerX = maxX - minX;
        var centerY = maxY - minY;
        for (point in points) {
            point.x -= centerX;
            point.y -= centerY;
            point.y *= centerX / centerY;
            point.x *= 400;
            point.y *= 400;
        }
        roadPath = new Form('roadPath');
        roadPath.addSplineCurve(points, true);
        
        forms = [];

        var layer = addLayer('sharedLayer');

        tint = 0.5;
        ground = 0.0;
        skyLow = 0.75;
        skyHigh = 0.25;
        skyGradient = 0.5;
    }

    function build() {

    }

    function finish() {
        var scale = new Vector2(1.25,1.25);
        roadForm.scale(scale);
        wallsForm.scale(scale);
        for (i in 0...forms.length)
        {
            forms[i].scale(scale);
        }
    }

    function drawRoadLine(form:Form, roadPath:Form, xPos:Float, width:Float, dashOn:Float = 0, dashOff:Float = 0, start:Float = 0, end:Float = 1, divisions:UInt = Form.DIVISIONS)
    {
        width = Math.abs(width);
        var outsideOffset = xPos - width / 2;
        var insideOffset = xPos + width / 2;

        if (start == end) {
            return form;
        }

        var dashTotal = dashOn + dashOff;
        if (dashTotal == 0) {
            dashOn = 0;
            dashOff = end;
            dashTotal = end;
        }

        var numDashes = Math.ceil((end - start) / dashTotal);
        var diff = 1 / divisions;

        var path = roadPath.shapePath.subPaths[0];
        
        for (dash in 0...numDashes) {
            var outsidePoints:Array<ThreeVector2> = [];
            var insidePoints:Array<ThreeVector2> = [];

            var dashStart = start + dash * dashTotal;
            var dashEnd = Math.min(end, start + (dash + 1) * dashTotal);
            var i = dashStart;
            while (i < dashEnd) {
                outsidePoints.push(cast getExtrudedPointAt(path, i, outsideOffset));
                insidePoints.push(cast getExtrudedPointAt(path, i, insideOffset));
                i += diff;
            }
            outsidePoints.push(cast getExtrudedPointAt(path, dashEnd, outsideOffset));
            insidePoints.push(cast getExtrudedPointAt(path, dashEnd, insideOffset));
            outsidePoints.reverse();
            
            if (start == 0 && end == 1 && dashTotal == 0) {
                form.shapePath.subPaths.push(makePolygonPath(outsidePoints));
                form.shapePath.subPaths.push(makePolygonPath(insidePoints));
            } else {
                form.shapePath.subPaths.push(makePolygonPath(outsidePoints.concat(insidePoints)));
            }
        }
        
        return form;
    }

    function addLayer(id:String):Form {
        var layer = new Form('layer_$id');
        forms.push(layer);
        return layer;
    }
}
