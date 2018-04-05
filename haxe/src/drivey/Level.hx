package drivey;

import drivey.Utils.*;

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
        roadPath = new Form('roadPath');
        roadForm = new Form('roadForm');

        var n = 16;
        var points = [];
        for (i in 0...n)
        {
            var theta:Float = i * Math.PI * 2 / n;
            points.push(new Vector2(Math.cos(theta), Math.sin(theta)) * (Math.random() + 5));
        }
        roadPath.addSplineCurve(points, true);
        roadPath.boxFit();
        roadPath.scale(new Vector2(400,400));
        roadPath.recenter();

        roadForm.merge(roadPath);

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

    function makeRoadLine(id:String, p:Form, xpos:Float, width:Float, dashOn:Float, dashOff:Float)
    {
        var sh:Form = new Form(id);
        // TODO
        
        /*
        var smooth = dashOn > 0;
        dashOn = abs(dashOn);
        var on = true;
        var begin:Float = 0;
        var end:Float = p.length;
        var t0:Float = begin;
        while (t0 < end)
        {
            // we need to establish an interval t0-t1 of the desired length
            var t1;

            if (on && dashOn == 0) {
                t1 = t0;
            }
            else
            {
                t1 = p.stepInterval((on ? dashOn : dashOff), t0);
                if (t1 < 0 || t1 > end) {
                    t1 = end;
                }
            }
        
            var p0 = p.getPoint(t0);
            var p1 = p.getPoint(t1);

            if (on)
            {
                var x0 = p.getNormal(t0);
                var x1 = p.getNormal(t1);
                if (dashOn == 0)    // special case?
                {
                    var c:Form = new Form('$id point');
                    c.makeCircle(p0 + x0 * xpos, width);
                    sh.merge(c);
                }
                else
                {
                    // calculate how many mid points are needed
                    var between = smooth ? dashOn * 0.5 : 0;

                    sh.addVertex(p0+x0*(xpos-width*0.5));
                    sh.addVertex(p0+x0*(xpos+width*0.5));

                    for (i in 0...Std.int(between))
                    {
                        var t = lerp(t0,t1,(i+1)/(between+1));
                        var pt = p.getPoint(t) + p.getNormal(t)*(xpos+width*0.5);
                        sh.addControl(pt);
                    }

                    sh.addVertex(p1+x1*(xpos+width*0.5));
                    sh.addVertex(p1+x1*(xpos-width*0.5));

                    for (i in 0...Std.int(between))
                    {
                        var t = lerp(t1,t0,(i+1)/(between+1));
                        var pt = p.getPoint(t) + p.getNormal(t)*(xpos-width*0.5);
                        sh.addControl(pt);
                    }

                    sh.closePath();
                }
            }

            t0 = t1;

            if (dashOff > 0) {
                on = !on;
            }
        }
        */
        return sh;
    }

    function addLayer(id:String):Form {
        var layer = new Form('layer_$id');
        forms.push(layer);
        return layer;
    }
}
