package drivey;

import haxe.Timer;

import drivey.Utils.*;

class Drivey {

    static function main() new Drivey();

    var skyLow:Color = 0.5;
    var skyHigh:Color = 0.5;
    var skyGradient:Color = 0.5; // power
    var ground:Color = new Color();
    
    var auto:Bool = true;
    var center:Vector2 = new Vector2(0.5, 0.3);
    var collisions:Bool = true;
    var cycle:Bool = false;
    var fade:Float = 0.0;
    var frameRate:Float = 1.0;
    var gradient:Bool = true;
    var laneOffset:Float = -2.5; // north american
    var laneSpacing:Int = 2;
    var noAA:Bool = false;
    var project:Bool = true;
    var rearView:Bool = false;
    var levelID:Int = 3;
    var showDashboard:Bool = true;
    var timeSlice:Float = 0.05;
    var tint:Color = new Color(0.2, 0.3, 0.8); // colors for palette tinting
    var wireframe:Bool = false;
    var xfunc:Bool = true;
    var zoom:Float = 0.6;

    var appname = 'DRIVEY (graphic test)';
    var version = '0.15';
    var copyright = '¬© 2005 Mark Pursey';
    var roadPath:Form = new Form('roadPath');
    var roadForm:Form = new Form('roadForm');
    var wallsForm:Form = new Form('wallsForm');
    var scr:Screen = new Screen();
    var user:Car = new Car();
    var other:Array<Car> = [];
    var message:String;
    var tt:Float = 0;
    var g_lastTime:Float = 0;
    var g_lastStep:Float = 0.05;
    var g_zoom:Float = 1;

    var level:Array<Form>;
    var speedoForm:Form;
    var speedoNeedle:Form;
    var steeringWheelForm:Form;
    var carLights:Form;
    var carLightPaths:Form;
    var carTailLightForm:Form;
    var carBodyBottom:Form;
    var carBodyTop:Form;

    var g_startTime:Float;
    var g_frameInterval:Float;
    var lastTime:Float;
    var lastStep:Float;
    var lastJoyX:Float;
    var timer:Timer;
    var finishTime:Float;
    
    function new() {

        Playground.run(scr);
        
        /*
        win.create(640,480);
        win.showCursor(false);
        win.fullScreen(true);
        win.setText(appname + ' ' + version);
        win.show(true);
        */

        scr.showMessage([
            'DRIVEY',
            'hypnotic motorway simulation',
            '',
            'original © 2007 Mark Pursey',
            'retreaded for the web by @rezmason',
            '',
            '[ F1 ] for keyboard shortcuts',
        ].join('\n'), false);

        level = buildLevel();
        speedoForm = makeSpeedoForm();
        speedoNeedle = makeSpeedoNeedle();
        steeringWheelForm = makeSteeringWheelForm();
        carLights = makeCarLights();
        carLightPaths = makeCarLightPaths();
        carTailLightForm = makeCarTailLightForm();
        carBodyBottom = makeCarBodyBottom();
        carBodyTop = makeCarBodyTop();

        g_startTime = Timer.stamp();
        g_frameInterval = 0.01;

        lastTime = g_startTime;
        lastStep = 0;
        lastJoyX = 0;

        update();
        scr.addRenderListener(update);

        finishTime = Timer.stamp();
    }

    function makeSpeedoForm():Form {
        var speedoForm:Form = new Form('speedoForm');
        speedoForm.makeCircle(new Vector2(0,0), 0.5);
        speedoForm.outline(0.025);

        var dash:Form = new Form('dash');
        dash.addVertexXY(-0.01,-0.49);
        dash.addVertexXY(0.01,-0.49);
        dash.addVertexXY(0.01,-0.44);
        dash.addVertexXY(-0.01,-0.44);
        var n = 8;
        for (i in 0...n)
        {
            var sh:Form = dash.clone('dash$i');
            sh.rotate(lerp(-Math.PI * 0.8, Math.PI * 0.8, i / n));
            speedoForm.merge(sh);
        }
        return speedoForm;
    }

    function makeSpeedoNeedle():Form {
        var speedoNeedle:Form = new Form('speedoNeedle');
        speedoNeedle.addVertexXY(-0.02,0.1);
        speedoNeedle.addVertexXY(-0.005,-0.4);
        speedoNeedle.addVertexXY(0.005,-0.4);
        speedoNeedle.addVertexXY(0.02,0.1);
        speedoNeedle.closePath();
        return speedoNeedle;
    }

    function makeSteeringWheelForm():Form {
        var steeringWheelForm:Form = new Form('steeringWheel');
        steeringWheelForm.makeCircle(new Vector2(0,0), 0.5);
        steeringWheelForm.closePath();
        var n = 60;
        var points = [];
        for (i in 0...25) {
            var theta = (57 - i) * Math.PI * 2 / n;
            var mag = ((i & 1 != 0) ? 0.435: 0.45);
            points.push(new Vector2(Math.cos(theta), Math.sin(theta)) * mag);
        }
        steeringWheelForm.addSplineCurve(points, true);
        points = [];
        for (i in 0...29) {
            var theta = (29-i) * 2 * Math.PI / n;
            var mag = ((i & 1 != 0) ? 0.435: 0.45);
            points.push(new Vector2(Math.cos(theta), Math.sin(theta)) * mag);
        }
        points.push(new Vector2(0.25, 0.075));
        points.push(new Vector2(0.125, 0.2));
        points.push(new Vector2(-0.125, 0.2));
        points.push(new Vector2(-0.25, 0.075));
        steeringWheelForm.addSplineCurve(points, true);
        return steeringWheelForm;
    }

    function makeCarLights():Form {
        var carLights:Form = new Form('carLights');
        carLights.init();
        var sq:Form = new Form('carLight');
        sq.makeUnit();
        carLights.merge(sq);
        sq.move(new Vector2(3,0));
        carLights.merge(sq);
        carLights.boxFit();
        carLights.recenter();
        carLights.scale(new Vector2(2,0.1));
        carLights.move(new Vector2(0,2));
        return carLights;
    }

    function makeCarLightPaths():Form {
        var carLightPaths:Form = new Form('carLightPaths');
        carLightPaths.init();
        var sq:Form = new Form('carLightPath');
        var points = [
            new Vector2( 0,   0),
            new Vector2(-6,  13),
            new Vector2( 4,  15),
            new Vector2( 0,   0),
        ];
        sq.addSplineCurve(points, true);
        carLightPaths.merge(sq);
        sq.scale(new Vector2(-1,1));
        sq.invert();
        sq.move(new Vector2(1.6,0));
        carLightPaths.merge(sq);
        carLightPaths.move(new Vector2(-0.8,3));
        return carLightPaths;
    }

    function makeCarTailLightForm():Form {
        var carTailLightForm:Form = new Form('carTailLights');
        carTailLightForm.init();
        var sq:Form = new Form('carTailLight');
        sq.makeUnit();
        carTailLightForm.merge(sq);
        sq.move(new Vector2(3,0));
        carTailLightForm.merge(sq);
        carTailLightForm.boxFit();
        carTailLightForm.recenter();
        carTailLightForm.scale(new Vector2(2,0.05));
        carTailLightForm.move(new Vector2(0,-2));
        return carTailLightForm;
    }

    function makeCarBodyBottom():Form {
        var carBodyBottom:Form = new Form('carBodyBottom');
        carBodyBottom.init();
        carBodyBottom.makeUnit();
        carBodyBottom.boxFit();
        carBodyBottom.recenter();
        carBodyBottom.scale(new Vector2(2,4));
        return carBodyBottom;
    }

    function makeCarBodyTop():Form {
        var carBodyTop:Form = new Form('carBodyTop');
        carBodyTop.init();
        carBodyTop.makeUnit();
        carBodyTop.boxFit();
        carBodyTop.recenter();
        carBodyTop.scale(new Vector2(2,3));
        carBodyTop.move(new Vector2(0,-0.5));
        return carBodyTop;
    }

    function addNPCCar()
    {
        var npcCar = new Car();
        other.push(npcCar);
        npcCar.roadDir = (other.length & 1 != 0) ? -1 : 1;
        placeCar(npcCar, roadPath, Math.random());
    }

    function placeCar(car:Car, rd:Form, along:Float)
    {
        var t = along * rd.length;
        var tan = !rd.getTangent(t);
        var normal = -rd.getNormal(t);
        if (car.roadDir < 0) {
            tan = -tan;
            normal = -normal;
        }

        car.pos = m2w(rd.getPoint(t) + normal * (laneSpacing * car.roadPos + laneOffset));
        car.lastPos = car.pos.clone();
        car.angle = -tan.getAngle() + Math.PI * 0.5;
        car.vel = new Vector3(0, 0, car.cruise).rotateY(-car.angle);
        car.lastVel = car.vel.clone();
    }

    function autoDrive(car:Car, aroad:Form)
    {
        var dir = car.vel;
        if (dir.length() > 0) {
            dir = !car.vel;
        } else {
            dir = new Vector3(0, 0, 1).rotateY(-car.angle);
        }

        // get position on road for 1 second ahead of now

        var lookAhead = 20; // basic direction stuff
        var t = aroad.getNearest(w2m(car.pos + dir * lookAhead));

        var targetDir = m2w(aroad.getPoint(t)) - car.pos;
        var tangent = m2w(!aroad.getTangent(t));

        if (car.roadDir < 0) {
            tangent = -tangent;
        }

        var normal = tangent.rotateY(Math.PI * 0.5);
        targetDir += normal * (laneSpacing * car.roadPos + laneOffset);

        if (targetDir.length() > 0) {
            tangent = Vector2.lerp(tangent, targetDir, 0.05);
        }

        var newAngle = w2m(tangent).getAngle() - Math.PI * 0.5;
        newAngle = -newAngle;

        newAngle -= car.angle;

        while (newAngle > Math.PI) {
            newAngle -= Math.PI * 2;
        }

        while (newAngle < -Math.PI) {
            newAngle += Math.PI * 2;
        }

        if (abs(newAngle) > 1) {
            newAngle /= abs(newAngle);
        }

        car.steerTo = newAngle / (min(targetDir.length() * 0.5, 50) + 1);

        if (abs(car.steerTo) > 0.02) {
            car.steerTo *= 0.02/abs(car.steerTo);
        }

        if (car.vel.length() < car.cruise) {
            car.accelerate = 1;
        } else {
            car.accelerate = car.cruise / car.vel.length();
        }
    }

    function drawBackground(screen:Screen)
    {
        // screen.alpha = 1;
        // screen.bg = ground;
        screen.clear();

        if (!project)
        {
            return;
        }

        var center = new Vector2(screen.width * center.x, screen.height * center.y);

        var sh:Form = new Form('background');

        sh.addVertex(new Vector2(1,0));
        sh.addVertex(new Vector2(1,1));
        sh.addVertex(new Vector2(0,1));
        sh.addVertex(new Vector2(0,0));

        sh.move(new Vector2(-0.5,0.0001));
        sh.scale(new Vector2(-1,1));

        var vo:Vector3 = new Vector3();
        vo.set(0,0,rearView ? -0.01 : 0.01);
        var vx:Vector3 = new Vector3();
        vx.set(1,0,0);
        var vy:Vector3 = new Vector3();
        vy.set(0,1,0); // vertical

        var tilt = user.tilt * Math.PI;
        var pitch = -user.pitch * Math.PI;
        var zoom = 1.0/(rearView ? -zoom : zoom);

        var vo:Vector3 = vo.rotateZ(tilt).rotateX(pitch);
        var vx:Vector3 = vx.rotateZ(tilt).rotateX(pitch);
        var vy:Vector3 = vy.rotateZ(tilt).rotateX(pitch);

        vo.z *= zoom;
        vo.y = -vo.y;
        if (rearView) vo.x = -vo.x;
        vx.z *= zoom;
        vx.y = -vx.y;
        if (rearView) vx.x = -vx.x;
        vy.z *= zoom;
        vy.y = -vy.y;
        if (rearView) vy.x = -vy.x;

        sh.project(vo, vx, vy);

        var scale = max(center.x, center.y);

        var gradTopVec:Vector3 = vo + vy * 0.015;
        var gradTop:Vector2 = new Vector2(gradTopVec.x / gradTopVec.z, gradTopVec.y / gradTopVec.z);
        var vop:Vector2 = vo;
        var gradOrg:Vector2 = vop / vo.z;
        gradTop -= gradOrg;
        gradTop *= scale;
        gradOrg *= scale;
        gradOrg += center;

        sh.scaleUniform(scale);

        sh.move(center);

        screen.bg = skyHigh;
        // screen.rgb = skyLow;

        if (gradient)
        {
            screen.cmd('pattern gradient linear power ${skyGradient} org ${gradOrg.x} ${gradOrg.y} dx ${gradTop.x} ${gradTop.y}');
        } else {
            // screen.rgb = (skyHigh + skyLow) * 0.5; // average the two
        }

        screen.drawForm(sh);
        screen.cmd('pattern');
    }

    function drawRoadForm(screen:Screen, sh:Form, height:Float, extr:Float)
    {
        if (screen.height > 0) {
            screen.cmd('pattern');
        }

        var center = new Vector2(screen.width * center.x, screen.height * center.y);
        if (project)
        {
            var up = user.pos;

            var vo:Vector3 = new Vector3();
            vo.set(0,height,0);
            var vx:Vector3 = new Vector3();
            vx.set(1,0,0);
            var vy:Vector3 = new Vector3();
            vy.set(0,0,1);

            vo -= up;

            var yaw = user.angle;
            var tilt = user.tilt * Math.PI;
            var pitch = -user.pitch * Math.PI;

            vo = vo.rotateY(yaw).rotateZ(tilt).rotateX(pitch);
            vx = vx.rotateY(yaw).rotateZ(tilt).rotateX(pitch);
            vy = vy.rotateY(yaw).rotateZ(tilt).rotateX(pitch);

            var vz:Vector3 = (vx * vy) * extr;

            // factor in zoom here now
            var zoom = 1.0/(rearView ? -zoom : zoom);

            vo.z *= zoom;
            if (rearView) vo.x = -vo.x;
            vx.z *= zoom;
            if (rearView) vx.x = -vx.x;
            vy.z *= zoom;
            if (rearView) vy.x = -vy.x;
            vz.z *= zoom;
            if (rearView) vz.x = -vz.x;

            if (extr != 0) {
                sh.project(vo, vx, vy, vz);
            } else {
                sh.project(vo, vx, vy);
            }

            // make sure positive y is up
            sh.scale(new Vector2(1,-1) * max(center.x, center.y));// * zoom);

            sh.move(center);
        }
        else
        {
            sh.move(-w2m(user.pos));
            sh.rotate(user.angle);
            sh.scale(new Vector2(30,-30) * ((center.x + center.y) * 0.0025 / (user.pos.y * 0.05 + 4)));
            center = new Vector2(screen.width * 0.5, screen.height * 0.6);
            sh.move(center);
        }

        screen.drawForm(sh);
    }

    function drawForms(screen:Screen, forms:Array<Form>)
    {
        for (form in forms)
        {
            // screen.rgb = form.rgb;
            // screen.alpha = form.alpha;

            drawRoadForm(screen, form, form.height, form.extrude);
        }

        // screen.rgb = 1;
        // screen.alpha = 1;
    }

    function makeRoadLine(id:String, p:Form, xpos:Float, width:Float, dashOn:Float, dashOff:Float)
    {
        var smooth = dashOn > 0;
        dashOn = abs(dashOn);
        var sh:Form = new Form(id);
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
        return sh;
    }

    function buildLevel()
    {
        scr.clear();
        auto = true;
        laneSpacing = 4;
        wallsForm.init();
        roadPath.init();
        roadForm.init();
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

        var newLevel:Array<Form> = [];

        function addLayer(id:String):Form {
            var layer = new Form('layer_$id');
            newLevel.push(layer);
            return layer;
        }

        var layer = addLayer('sharedLayer');

        tint = 0.5;
        ground = 0.0;
        skyLow = 0.75;
        skyHigh = 0.25;
        skyGradient = 0.5;

        if (levelID == 1)
        {
            scr.showMessage('Now driving through: The Tunnel', false);
            tint = new Color(0.2, 0.7, 0.1);
            skyLow = skyHigh = 0;
            var tarmac = 0.1;
            var whiteLines = 0.8;
            var yellowLines = 0.75;
            var lightColor = 1;

            // do white lines
            var layer = addLayer('tunnelTarmac');
            layer.rgb = tarmac;
            layer.merge(makeRoadLine('tunnelTarmac', roadPath, 0, 7, 30, 0));

            var layer = addLayer('tunnelWhiteLines');
            layer.rgb = whiteLines;
            layer.merge(makeRoadLine('tunnelWhiteLines1', roadPath, -3.5, 0.2, 30, 2));
            layer.merge(makeRoadLine('tunnelWhiteLines2', roadPath, 3.5, 0.2, 30, 2));
            layer.merge(makeRoadLine('tunnelWhiteLines3', roadPath, -0.15, 0.15, -4, 8));

            // do yellow lines
            var layer = addLayer('tunnelYellowLines');
            layer.rgb = yellowLines;
            layer.merge(makeRoadLine('tunnelYellowLines', roadPath, 0.125, 0.125, 30, 0));

            // do crossings
            if (true)
            {
                var layer = addLayer('tunnelCrossing');
                layer.rgb = tarmac;
                layer.merge(makeRoadLine('tunnelCrossing', roadPath, 0, 1, -2, 200));
                layer.expand(1);

                var layer = addLayer('tunnelCrossingLines');
                layer.rgb = whiteLines;
                for (i in 0...6)
                {
                    var width = 6.0 / 6 * 0.5;
                    layer.merge(makeRoadLine('tunnelCrossingLine$i', roadPath, i * 2 * width - 3 + width, width, -2, 200));
                }
            }

            // do lights
            if (true)
            {
                var layer = addLayer('tunnelLights');
                layer.rgb = lightColor;

                layer.height = 4;
                layer.extrude = 0.1;
                layer.merge(makeRoadLine('tunnelLight1', roadPath, -4, 0.1, -4, 6));
                layer.merge(makeRoadLine('tunnelLight2', roadPath, 4, 0.1, -4, 6));
            }

            if (true)   // walls
            {
                var layer:Form = addLayer('tunnelWall1');
                layer.rgb = skyLow;

                layer.height = 4;
                layer.extrude = 4;
                layer.merge(makeRoadLine('tunnelWall1Left', roadPath, -5, 0.4, 100, 0));
                layer.merge(makeRoadLine('tunnelWall1Right', roadPath, 5, 0.4, 100, 0));

                var layer:Form = addLayer('tunnelWall2');
                layer.rgb = skyLow;
                layer.height = 0;
                layer.extrude = -4;
                layer.merge(makeRoadLine('tunnelWall2Left', roadPath, -5, 0.4, 200, 0));
                layer.merge(makeRoadLine('tunnelWall2Right', roadPath, 5, 0.4, 200, 0));
            }
        }
        else if (levelID == 2)
        {
            tint = new Color(0.3, 0.3, 0.7) * 1.5;

            scr.showMessage('Now driving through: The City', false);
            roadPath.scaleUniform(2);

            ground = 0.05;
            var lines:Color = 0.6;
            var obc:Color = ground.clone();

            skyLow = 0.4;
            skyHigh = 0.0;

            if (true)   // sky ?
            {
                var sh = addLayer('cityClouds');
                sh.rgb = (skyLow + skyHigh) * 0.5;
                sh.alpha = 1;
                sh.height = 200;
                for (i in 0...100)
                {
                    var sh2:Form = new Form('cloud$i');
                    var p = new Vector2(Math.random()-0.5, Math.random()-0.5);
                    if (p.length() > 0.5 || p.length() < 0.1) {
                        continue;
                    }

                    p *= 8000;
                    if ((p - sh.getNearestPoint(p)).length() < 200) {
                        continue;
                    }

                    sh2.makeCircle(p, 500);
                    sh.merge(sh2);
                }
                // sh.makeBendy(); // No idea what the hell this is
                sh.scaleUniform(2);
                sh.height *= 2;
            }
            // do bg
            if (false)
            {
                var sh = addLayer('cityBG1');
                sh.rgb = ground;
                sh.height = 50;
                sh.extrude = 50;
                sh.merge(makeRoadLine('cityLine1', roadPath, -200, 15, 0, 200));
                sh.merge(makeRoadLine('cityLine2', roadPath, 200, 15, 0, 150));
                
                // do bg
                
                var sh = addLayer('cityBG2');
                sh.rgb = ground;
                sh.height = 70;
                sh.extrude = 70;
                sh.merge(makeRoadLine('cityLine3', roadPath, -160, 10, -20, 90));
                sh.merge(makeRoadLine('cityLine4', roadPath, 160, 20, -25, 85));
                sh.merge(makeRoadLine('cityLine5', roadPath, 260, 20, -25, 40));

                // do bg
                
                var sh = addLayer('cityBG3');
                sh.rgb = ground;
                sh.height = 40;
                sh.extrude = 40;
                sh.merge(makeRoadLine('cityLine6', roadPath, -80, 20, -25, 150));
                sh.merge(makeRoadLine('cityLine7', roadPath, 80, 20, -20, 200));
                sh.merge(makeRoadLine('cityLine8', roadPath, 300, 20, -40, 100));

                // do bg
                
                var sh = addLayer('cityBG4');
                sh.rgb = ground;
                sh.height = 20;
                sh.extrude = 20;
                sh.merge(makeRoadLine('cityLine9', roadPath, -80, 40, -20, 45));
                sh.merge(makeRoadLine('cityLine10', roadPath, 80, 40, -25, 40));
            }
            else
            {
                var box:Form = new Form('cityBuilding');
                box.makeUnit();
                box.recenter();
                box.scaleUniform(40);

                var l0:Form = new Form('unused layer citySkyline1');
                l0.rgb = obc;
                l0.height = 15;
                l0.extrude = l0.height;
                var l1:Form = addLayer('citySkyline2');
                l1.rgb = obc;
                l1.height = 30;
                l1.extrude = l1.height;
                var l2:Form = addLayer('citySkyline3');
                l2.rgb = obc;
                l2.height = 50;
                l2.extrude = l2.height;
                var l3:Form = addLayer('citySkyline4');
                l3.rgb = obc;
                l3.height = 120;
                l3.extrude = l3.height;

                var radius = 1800;
                for (i in 0...12)
                {
                    var x = i * 150 - radius;
                    for (j in 0...12)
                    {
                        var y = j * 150 - radius;

                        var pos = new Vector2(x+Math.random()*100,y+Math.random()*100);
                        if (pos.length() > radius) {
                            continue;
                        }

                        var pt = roadPath.getNearestPoint(pos);
                        if ((pt - pos).length() < 60) {
                            continue;
                        }

                        var s:Form = box.clone('cityBuilding$i');
                        s.move(pos);
                        if (Math.random() > 0.8) {
                            l0.merge(s);
                        }
                        else if (Math.random() > 0.5) {
                            l1.merge(s);
                        }
                        else if (Math.random() > 0.25) {
                            l2.merge(s);
                        }
                        else {
                            l3.merge(s);
                        }
                    }
                }
            }

            
            var sh = addLayer('cityWalls');
            sh.rgb = obc;
            sh.extrude = 10;
            sh.height = 10;
            sh.merge(makeRoadLine('cityWall1', roadPath, -16, 0.2, -0.2, 400));
            sh.merge(makeRoadLine('cityWall2', roadPath, -12, 0.2, -0.2, 400));
            sh.merge(makeRoadLine('cityWall3', roadPath, 12, 0.2, -0.2, 300));
            sh.merge(makeRoadLine('cityWall4', roadPath, 16, 0.2, -0.2, 300));
            wallsForm.merge(sh);
            
            var sh = addLayer('cityLinesA');
            sh.rgb = obc;
            sh.height = 14;
            sh.extrude = 4;
            sh.merge(makeRoadLine('cityLine11', roadPath, -14, 6, -0.2, 400));
            sh.merge(makeRoadLine('cityLine12', roadPath, 14, 6, -0.2, 300));
            
            var sh = addLayer('cityLinesB');
            sh.rgb = lines;
            sh.height = 0;
            sh.merge(makeRoadLine('cityLine13', roadPath, 0, 0.1, 60, 0));
            sh.merge(makeRoadLine('cityLine14', roadPath, 0.2, 0.1, 60, 0));
            sh.merge(makeRoadLine('cityLine15', roadPath, -6, 0.15, 30, 1));
            sh.merge(makeRoadLine('cityLine16', roadPath, 6, 0.15, 30, 1));
            
            var sh = addLayer('cityLinesC');
            sh.height = 0;
            sh.rgb = lines;
            sh.merge(makeRoadLine('cityLine17', roadPath, -3, 0.15, 3, 12));
            sh.merge(makeRoadLine('cityLine18', roadPath, 3, 0.15, 3, 12));
        }
        else if (levelID == 3)
        {
            scr.showMessage('Now driving through: The Industrial Zone', false);
            tint = new Color(0.7, 0.4, 0.1);

            skyHigh = 0.15;
            skyLow = 1.0;
            skyGradient = 0.25;

            ground = 0.05;
            var lines:Color = 0.6;
            var obc:Color = ground;

            // far off buildings
            if (true)
            {
                // very tall things
                
                var sh = addLayer('industrialTallThingA');
                sh.rgb = 1;
                sh.height = 62;
                sh.extrude = 2;
                sh.merge(makeRoadLine('tallThing1', roadPath, 300, 0.5, 0, 250));
                sh.merge(makeRoadLine('tallThing2', roadPath, 320, 0.75, 0, 250));

                if (true)
                {
                    var layer = addLayer('industrialTallThingB');
                    layer.rgb = obc;
                    layer.height = 60;
                    layer.extrude = 60;
                    layer.merge(makeRoadLine('tallthing3', roadPath, 300, 0.5, 0, 250));
                    layer.merge(makeRoadLine('tallthing4', roadPath, 320, 0.75, 0, 250));
                    layer.merge(makeRoadLine('tallthing5', roadPath, 400, 8, 0, 240));
                    layer.merge(makeRoadLine('tallthing6', roadPath, 500, 8, 0, 240));
                }

                // medium buildings
                var layer = addLayer('industrialMediumThings');
                layer.rgb = obc;
                layer.height = 12;
                layer.extrude = 12;
                layer.merge(makeRoadLine('mediumThing1', roadPath, -80, 20, -40, 60));
                layer.merge(makeRoadLine('mediumThing2', roadPath, 180, 50, -40, 30));
                layer.merge(makeRoadLine('mediumThing3', roadPath, 300, 50, -20, 20));

                layer.merge(makeRoadLine('mediumThing4', roadPath, -100, 8, 0, 200));
                layer.merge(makeRoadLine('mediumThing5', roadPath, -60, 8, 0, 1500));
                layer.merge(makeRoadLine('mediumThing6', roadPath, 100, 8, 0, 140));
                layer.merge(makeRoadLine('mediumThing7', roadPath, 120, 8, 0, 220));
            }

            // do white lines
            if (true)
            {
                var sh = addLayer('industrialWhiteLines');
                sh.rgb = lines;
                sh.merge(makeRoadLine('industrialWhiteLine1', roadPath, -3.5, 0.15, 60, 2));
                sh.merge(makeRoadLine('industrialWhiteLine2', roadPath, 3.5, 0.15, 60, 2));
                sh.merge(makeRoadLine('industrialWhiteLine3', roadPath, -0.15, 0.125, -4, 6));
                sh.merge(makeRoadLine('industrialWhiteLine4', roadPath, 0.125, 0.125, 60, 0));

                // do crossings
                if (true)
                {
                    
                    var sh = addLayer('industrialCrossing');
                    sh.rgb = ground;
                    sh.merge(makeRoadLine('industrialCrossingBase', roadPath, 0, 1, -2, 200));
                    sh.expand(1);

                    
                    var sh = addLayer('industrialCrossingLines');
                    sh.rgb = lines;
                    for (i in 0...6)
                    {
                        var width = 6.0 / 6 * 0.5;
                        sh.merge(makeRoadLine('industrialCrossingLine$i', roadPath, i * 2 * width - 3 + width, width, -2, 200));
                    }
                }
            }

            // street lights
            if (true)
            {
                var left = 80;
                var right = 80;
                var thick = 0.2;
                var tall = 15;

                
                var sh = addLayer('industrialStreetLight1');
                sh.rgb = obc;
                sh.height = tall + thick;
                sh.extrude = thick;
                sh.merge(makeRoadLine('industrialStreetLight1', roadPath, -5.6, 5, thick, left));

                
                var sh = addLayer('industrialStreetLight2');
                sh.rgb = obc;
                sh.height = tall;
                sh.extrude = tall;
                sh.merge(makeRoadLine('industrialStreetLight2', roadPath, -8, thick, thick, left));
                wallsForm.merge(sh);

                
                var sh = addLayer('industrialStreetLight3');
                sh.rgb = 1;
                sh.height = tall;
                sh.extrude = thick*2;
                sh.merge(makeRoadLine('industrialStreetLight3', roadPath, -4, 2, thick, left));
            }

            // overpasses
            if (true)
            {
                var depth = 8;
                var spacing = 300;
                var highwayAbove = roadPath.clone('highwayAbove');
                highwayAbove.scale(new Vector2(1,1.5));

                var sh = addLayer('industrialOverpassA');
                sh.rgb = obc;
                sh.height = 12;
                sh.extrude = 2;
                sh.merge(makeRoadLine('industrialOverpass1', highwayAbove, 0, 162, -depth, spacing));
                sh.scale(new Vector2(1,1/1.5));

                
                var sh = addLayer('industrialOverpassB');
                sh.rgb = obc;
                sh.height = 10;
                sh.extrude = 10;
                sh.merge(makeRoadLine('industrialOverpass2', highwayAbove, -100, 42, -depth, spacing));
                sh.merge(makeRoadLine('industrialOverpass3', highwayAbove, -40, 2, -depth, spacing));
                sh.merge(makeRoadLine('industrialOverpass4', highwayAbove, -10, 2, -depth, spacing));
                sh.merge(makeRoadLine('industrialOverpass5', highwayAbove, 10, 2, -depth, spacing));
                sh.merge(makeRoadLine('industrialOverpass6', highwayAbove, 40, 2, -depth, spacing));
                sh.merge(makeRoadLine('industrialOverpass7', highwayAbove, 200, 242, -depth, spacing));
                sh.scale(new Vector2(1,1/1.5));

                var wall:Form = makeRoadLine('industrialWall1', highwayAbove, -10, 2, -depth, spacing);
                wall.merge(makeRoadLine('industrialWall2', highwayAbove, 10, 2, -depth, spacing));
                wall.scale(new Vector2(1,1/1.5));
                wallsForm.merge(wall);
            }

            // various poles
            if (true)
            {
                var sh = addLayer('industrialPoles');
                sh.rgb = obc;

                sh.height = 12;
                sh.extrude = 12;
                sh.merge(makeRoadLine('industrialPole1', roadPath, -30, 0.25, 0, 90));

                sh.merge(makeRoadLine('industrialPole2', roadPath, -40, 0.25, 0, 110));
                sh.merge(makeRoadLine('industrialPole3', roadPath, 60, 0.25, 0, 60));

                sh.merge(makeRoadLine('industrialPole4', roadPath, -50, 0.25, 0, 60));
                sh.merge(makeRoadLine('industrialPole5', roadPath, -20, 0.125, 0, 100));
                sh.merge(makeRoadLine('industrialPole6', roadPath, 20, 0.25, 0, 45));
                sh.merge(makeRoadLine('industrialPole7', roadPath, 50, 0.125, 0, 50));
                sh.merge(makeRoadLine('industrialPole8', roadPath, 70, 0.25, 0, 75));

                // knobs
                
                var sh = addLayer('industrialKnobs');
                sh.rgb = obc;
                sh.height = 13;
                sh.extrude = 1;
                sh.merge(makeRoadLine('industrialKnob1', roadPath, -40, 1, 0, 110));
                sh.merge(makeRoadLine('industrialKnob2', roadPath, 60, 1, 0, 60));

                // wires
                
                var sh = addLayer('industrialWires');
                sh.rgb = obc;
                sh.height = 11.25;
                sh.extrude = 0.025;

                sh.merge(makeRoadLine('industrialWire1', roadPath, -50, 0.025, -60, 0));
                sh.merge(makeRoadLine('industrialWire2', roadPath, -20, 0.025, -100, 0));
                sh.merge(makeRoadLine('industrialWire3', roadPath, 20, 0.025, -45, 0));
                sh.merge(makeRoadLine('industrialWire4', roadPath, 50, 0.025, -50, 0));
                sh.merge(makeRoadLine('industrialWire5', roadPath, 70, 0.025, -75, 0));
            }
            // fencing
            if (true)
            {
                var tall = 5;
                var spacing = 30;
                var dist = 25;

                
                var sh = addLayer('industrialFenceA');
                sh.rgb = obc;
                sh.height = tall;
                sh.extrude = tall;

                sh.merge(makeRoadLine('industrialFence1', roadPath, -dist, 0.1, 0, spacing));
                sh.merge(makeRoadLine('industrialFence2', roadPath, dist, 0.1, 0, spacing));

                
                var sh = addLayer('industrialFenceB');
                sh.rgb = obc;
                sh.height = tall-0.5;
                sh.extrude = 0.1;

                sh.merge(makeRoadLine('industrialFence3', roadPath, -dist, 0.1, -spacing, 0));
                sh.merge(makeRoadLine('industrialFence4', roadPath, dist, 0.1, -spacing, 0));

                
                var sh = addLayer('industrialFenceC');
                sh.rgb = obc;
                sh.alpha = 0.25;
                sh.height = tall - 0.6;
                sh.extrude = tall - 0.6;

                sh.merge(makeRoadLine('industrialFence5', roadPath, -dist, 0.1, -spacing, 0));
                sh.merge(makeRoadLine('industrialFence6', roadPath, dist, 0.1, -spacing, 0));
                wallsForm.merge(sh);
            }
        }
        else
        {
            scr.showMessage('Now driving through: The Deep Dark Night', false);
            tint = 0.7;
            ground = 0;
            skyHigh = 0;
            skyLow = 0;
            var lines:Color = 0.75;

            roadForm.scaleUniform(2);
            layer.rgb = lines;
            layer.height = 0;

            layer.merge(makeRoadLine('nightLine1', roadPath, 0, 0.2, 4, 10));
            layer.merge(makeRoadLine('nightLine2', roadPath, -3, 0.15, 30, 2));
            layer.merge(makeRoadLine('nightLine3', roadPath, 3, 0.15, 30, 2));

            // posts
            if (true)
            {
                var sh = addLayer('nightPosts');
                sh.rgb = lines;
                sh.height = 0.6;
                sh.extrude = 1;
                sh.merge(makeRoadLine('nightPost1', roadPath, -6, 0.2, 0.2, 50));
                sh.merge(makeRoadLine('nightPost2', roadPath, 6, 0.2, 0.2, 50));
            }

            scr.setTint(0, 0.6, 1);
        }


        var scale = new Vector2(1.25,1.25);
        roadForm.scale(scale);
        wallsForm.scale(scale);
        for (i in 0...newLevel.length)
        {
            newLevel[i].scale(scale);
        }

        placeCar(user, roadPath, 0);
        other = [];

        return newLevel;
    }

    // main loop
    function update()
    {
        if (scr.isKeyHit('F1'))
        {
            scr.showMessage([
                '[home]: return to road',
                'W,A,S,D & arrow keys: speed and steering control',
                'F1: toggle help',
                'F2: wireframe',
                'F3: toggle dashboard',
                'F4: rear view',
                'F5: toggle (awful) manual control',
                'F6: toggle (awful) collision detection',
                'F7: toggle sky gradient',
                'F8: switch driving side',
                'F9: save configuration',
                'F11: toggle fullscreen',
                'G: greyscale palette',
                'H: random palette',
                'K: toggle palette cycling',
                'N,M: adjust view angle',
                'V,B: adjust brightness',
                'C: add other cars',
                '1-4: switch environment type',
                '[ctrl]: super fast',
                '[shift]: super slow',
            ].join('\n'), true, 6);
        }
        if (scr.isKeyHit('F7'))
        {
            gradient = !gradient;
            scr.showMessage('gradient ' + (gradient ? 'on': 'off'), false);
        }
        if (scr.isKeyHit('Escape'))
        {
            // exit
        }
        if (scr.isKeyHit('KeyC'))
        {
            if (other.length > 16) {
                other = [];
            }
            else {
                for (i in 0...8) {
                    addNPCCar();
                }
            }
            scr.showMessage('' + other.length + ' cars on the road', false);
        }
        if (scr.isKeyHit('F8'))
        {
            laneOffset = -laneOffset;
            scr.showMessage('driving style: ' + (laneOffset < 0 ? 'North American': 'Australian'), false);
        }
        if (scr.isKeyHit('F6'))
        {
            collisions = !collisions;
            scr.showMessage('collision detection ' + (collisions ? 'on (crappy)': 'off'), false);
        }
        if (scr.isKeyHit('F5'))
        {
            auto = !auto;
            scr.showMessage(auto ? 'autodrive' : 'manual steer', false);
        }
        if (scr.isKeyHit('KeyG'))
        {
            tint = 0.5;
            cycle = false;
            scr.showMessage('greyscale', false);
        }
        if (scr.isKeyHit('KeyH'))
        {
            var tint = new Color(Math.random(),Math.random(),Math.random());
            tint *= 1.0/tint.brightness();
            tint = tint * 0.6;
            cycle = false;
            scr.showMessage('random palette', false);
        }
        if (scr.isKeyHit('KeyK'))
        {
            cycle = !cycle;
            scr.showMessage('palette cycle ' + (cycle ? 'on' : 'off' ), false);
        }
        if (scr.isKeyHit('F3'))
        {
            showDashboard = !showDashboard;
            scr.showMessage('dashboard ' + (showDashboard ? 'on' : 'off' ), false);
        }
        if (scr.isKeyHit('Digit1'))
        {
            levelID = (levelID + 1) % 4;
            user.init();
            level = buildLevel();
            lastTime = Timer.stamp();
        }

        var lineThickness = scr.width * 0.0025;
        center.y = min(0.5, max(0.3, 1.0 - (scr.width * 0.5/scr.height)));

        // now let's get the time step here
        var tm = Timer.stamp();
        var period:Float = tm - lastTime;
        lastTime = tm;
        var step:Float = period;

        // maximum frame step is 0.1 seconds
        if (step > 0.1) {
            step = 0.1;
        }

        if (scr.isKeyDown('ShiftLeft') || scr.isKeyDown('ShiftRight')) {
            step *= 0.125;
        } else if (scr.isKeyDown('ControlLeft') || scr.isKeyDown('ControlRight')) {
            step *= 4;
        }

        // soften it to deal with coarse timing issues
        step = lerp(lastStep, step, 0.5);
        lastStep = step;


        var acc:Vector2 = new Vector2(0,0);

        var joy = new Vector2(0,0);
        joy.x = lerp(lastJoyX, joy.x, 0.5);
        lastJoyX = joy.x;

        joy.y = -joy.y;

        acc.y = joy.y;

        var temp_steer = 0;

        if (scr.isKeyDown('ArrowUp') || scr.isKeyDown('KeyW'))
        {
            acc.y += 1;
        }
        if (scr.isKeyDown('ArrowDown') || scr.isKeyDown('KeyS'))
        {
            acc.y -= 2;
        }

        if (scr.isKeyDown('ArrowLeft') || scr.isKeyDown('KeyA'))
        {
            if (auto)
            {
                user.roadPos += 3 * step;
            }
            else
            {
                temp_steer -= 1;
            }
        }
        if (scr.isKeyDown('ArrowRight') || scr.isKeyDown('KeyD'))
        {
            if (auto)
            {
                user.roadPos += -3 * step;
            }
            else
            {
                temp_steer += 1;
            }
        }

        if (auto)
        {
            if (user.roadPos > 0.1)
            {
                user.roadPos -= step;
            }
            else if (user.roadPos < -0.1)
            {
                user.roadPos += step;
            }
        }

        var wanted = Std.int(user.roadPos + 100.5) - 100;

        // read function keys
        if (wireframe != scr.isKeyDown('F2'))
        {
            wireframe = !wireframe;
            scr.cmd('wireframe ' + (wireframe ? 'on' : 'off'));
            scr.showMessage('wireframe ' + (wireframe ? 'on' : 'off'), false);
        }

        rearView = scr.isKeyDown('F4');
        if (rearView) {
            scr.showMessage('rear view', false);
        }

        if (scr.isKeyDown('KeyB'))    // hi contrast
        {
            tint *= Math.pow(2, step);
            cycle = false;
        }
        if (scr.isKeyDown('KeyV'))    // lo contrast
        {
            tint *= Math.pow(2, -step);
            cycle = false;
        }

        if (scr.isKeyDown('KeyM'))
        {
            zoom *= Math.pow(2, step);
            scr.showMessage('zoom ' + Std.int(zoom * 100), true);
        }
        if (scr.isKeyDown('KeyN'))
        {
            zoom *= Math.pow(2, -step);
            if (zoom < 0.125)
            {
                zoom = 0.125;
            }
            scr.showMessage('zoom ' + Std.int(zoom * 100), true);
        }

        if (scr.isKeyHit('Home'))
        {
            auto = true;
            user.roadPos = 0;
            placeCar(user, roadPath, 0);
            fade = 0;
            scr.showMessage('returned to road', false);
        }

        user.brake = 0;
        user.accelerate = 0;


        if (scr.isKeyDown('Space'))
            user.brake = 1;

        var xs = joy.x;

        if (xfunc)
        {
            xs = sign(xs) * 0.75 * (Math.pow(abs(xs), 3) + abs(xs) * 0.25);
        }
        else
        {
            xs *= 0.5;
        }

        var tt = step;
        while (tt > 0)
        {
            var step = min(tt, timeSlice);

            if (auto)
            {
                autoDrive(user, roadPath);
            }
            else
            {
                var diff = -sign(user.steerTo) * 0.0002 * user.vel.length() * step;
                if (abs(diff) >= abs(user.steerTo))
                {
                    user.steerTo = 0;
                } else
                {
                    user.steerTo += diff;
                }

                user.steerTo = user.steerTo + temp_steer * 0.025 * step;
            }

            user.accelerate += acc.y;

            user.steerTo += xs * 0.05;

            user.advance(step);
            for (o in other)
            {
                autoDrive(o, roadPath);
                o.advance(step);
                if (collisions)
                {
                    user.collideWithCar(o);
                }
            }

            if (collisions)
            {
                user.collideWithForm(wallsForm);
            }

            tt -= timeSlice;
        }

        user.steerTo -= xs * 0.05;

        if (cycle)    // cycle colors
        {
            var t:Float = lastTime * 0.125;
            var tint1 = new Color(Math.sin(t * 0.7) * 0.5 + 0.5, Math.sin(t*0.9) * 0.5 + 0.5, Math.sin(t*1.3) * 0.5 + 0.5);

            tint1 *= 0.7 / tint1.brightness();

            tint = tint1;
        }

        scr.cmd('pattern zoom ' + (Math.sin(lastTime * 0.1) * 0.1 + 1));
        if (wireframe)
        {
            scr.bg = 0;
            scr.clear();
        }
        else
        {
            drawBackground(scr);
        }

        // draw the road itself
        drawForms(scr, level);

        var carBodiesTop:Form = new Form('carBodiesTop');
        var carBodiesBottom:Form = new Form('carBodiesBottom');
        var cars:Form = new Form('cars');
        var lights:Form = new Form('lights');
        var lightPaths:Form = new Form('lightPaths');

        // scr.rgb = 1;
        for (i in (project ? 0 : -1)...other.length)
        {
            var c = i < 0 ? user : other[i];

            var dir = c.dir();

            var a = carLights;
            a.rotate(-c.angle);
            a.move(w2m(c.pos));
            if (((user.pos - (c.pos + dir)) ^ dir) > 0)
            {
                lights.merge(a);
            }
            else
            {
                var a = carTailLightForm;
                a.rotate(-c.angle);
                a.move(w2m(c.pos));
                cars.merge(a);
            }

            var a = carBodyTop;
            a.rotate(-c.angle);
            a.move(w2m(c.pos));
            carBodiesTop.merge(a);

            var a = carBodyBottom;
            a.rotate(-c.angle);
            a.move(w2m(c.pos));
            carBodiesBottom.merge(a);

            var a = carLightPaths;
            a.rotate(-c.angle);
            a.move(w2m(c.pos));
            lightPaths.merge(a);
        }

        if (true)
        {
            // scr.rgb = ground; // black bodies
            // scr.alpha = 1;
            drawRoadForm(scr, carBodiesTop, 2, 1.75);
            drawRoadForm(scr, carBodiesBottom, 0.25, -1.75);

            // scr.rgb = 0.6; // tail light?
            // scr.alpha = 1;
            drawRoadForm(scr, cars, 0.75, 0.2);

            // scr.alpha = 1;

            // scr.rgb = 1.0; // head light?
            // scr.alpha = 1;

            // scr.alpha = 1;
            drawRoadForm(scr, lights, 1, 0.3);
        }

        if (project && showDashboard && !rearView)    // draw controls
        {
            var dwidth = scr.width;
            var dheight = scr.height;

            // scr.alpha = 1;

            var fill:Color = 0;
            var line:Color = 0.2;
            var shadow:Color = 0;

            var thick = lineThickness * 4;
            var sh:Form = new Form('dashboardBacking');
            sh.makeCircle(new Vector2(0,0), 1);
            sh.scale(new Vector2(1.2,0.3) * dwidth);
            sh.move(new Vector2(dwidth * (laneOffset < 0 ? 0.2 : 0.8), dheight * 1.05));
            // scr.rgb = fill;

            scr.drawForm(sh);
            scr.cmd('pattern');

            sh.outline(thick);
            // scr.rgb = line;
            scr.drawForm(sh);

            // do speedo
            // scr.rgb = line;

            var sh = speedoForm;
            sh.scale(new Vector2(1,1) * dwidth * 0.2);
            sh.move(new Vector2(dwidth * (laneOffset < 0 ? 0.325 : 0.675), dheight * 0.875));
            scr.drawForm(sh);

            var sh = speedoForm;
            sh.scale(new Vector2(1,1) * dwidth * 0.2);
            sh.move(new Vector2(dwidth * (laneOffset < 0 ? 0.1 : 0.9), dheight * 0.875));
            scr.drawForm(sh);

            var speed:Float = user.vel.length() / 1000 * 3600;
            speed = lerp(-Math.PI * 0.8, Math.PI * 0.8, min(speed/400, 1));
            var sh = speedoNeedle;
            sh.scale(new Vector2(1,1) * dwidth * 0.2);
            sh.rotate(speed);
            sh.move(new Vector2(dwidth * (laneOffset < 0 ? 0.325 : 0.675), dheight * 0.875));
            // scr.rgb = line;
            scr.drawForm(sh);

            var speed:Float = frameRate;
            speed = lerp(-Math.PI * 0.8, Math.PI * 0.8, min(speed/80, 1));
            var sh = speedoNeedle;
            sh.scale(new Vector2(1,1) * dwidth * 0.2);
            sh.rotate(speed);
            sh.move(new Vector2(dwidth * (laneOffset < 0 ? 0.1 : 0.9), dheight * 0.875));
            // scr.rgb = line;
            scr.drawForm(sh);

            // do steeringwheel
            var sh = steeringWheelForm;
            sh.rotate(user.steerPos * 50);
            sh.scale(new Vector2(1,1) * dwidth * 0.9);
            sh.move(new Vector2(dwidth * (laneOffset < 0 ? 0.2 : 0.8), dheight * 1.1));
            if (true)
            {
                // scr.rgb = line;
                var s2 = sh;
                s2.move(new Vector2(0, -thick*0.5));
                s2.expand(-thick*0.5);
                sh.expand(thick*0.5);
                // scr.rgb = line;
                scr.drawForm(sh);
                if (shadow != fill)
                {
                    // scr.rgb = shadow;
                    sh.scale(new Vector2(1.1,1.3));
                    // scr.alpha = 0.25;
                    scr.drawForm(sh);
                    // scr.alpha = 1;
                }

                // scr.rgb = fill;
                scr.drawForm(s2);
            }
            else
            {
                // scr.rgb = fill;
                scr.drawForm(sh);

                sh.outline(thick);
                // scr.rgb = line;
                scr.drawForm(sh);
            }
            // scr.alpha = 1;

        }

        g_frameInterval = lerp(g_frameInterval, period, 0.01);

        frameRate = 1.0/g_frameInterval;

        if (wireframe)
        {
        
            var t:Color = new Color(0,0,0.5);
            scr.setTint(t, Color.lerp(t,1,0.75), 1);
        }
        else
        {
            if (fade < 1)
            {
                fade = lerp(1, fade, 0.8/Math.pow(2, period));
            }

            if (fade > 1)
            {
                fade = 1;
            }

            scr.setTint(0, tint * fade, fade);
        }
    }
}
