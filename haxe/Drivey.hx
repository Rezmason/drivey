package;

import haxe.Timer;

import Utils.*;

typedef Global = {
    zoom : Float,
    xfunc : Bool,
    wireframe : Bool,
    tint : Color,
    timeSlice : Float,
    showHelp : Float,
    showDashboard : Bool,
    roadType : Int,
    rearView : Bool,
    project : Bool,
    noAA : Bool,
    laneSpacing : Int,
    laneOffset : Float,
    gradient : Bool,
    frameRate : Float,
    fade : Float,
    cycle : Bool,
    collisions : Bool,
    col : {
        sky : {
            lo : Color,
            hi : Color,
            gradient : Color,
        },
        ground : Color
    },
    center : Point,
    blur : Bool,
    auto : Bool, 
};

class Drivey {

    static function main() new Drivey();

    static var g:Global = {
        project:true,
        showDashboard:true,
        showHelp:0.0,

        blur:false,
        wireframe:false,
        noAA:false,
        frameRate:1.0,
        rearView:false,
        zoom:0.6,
        xfunc:true,
        roadType:3,

        col: {
            sky: {
                lo:0.5,
                hi:0.5,
                gradient:0.5, // power
            },
            ground:new Color(),
        },

        // colors for palette tinting
        tint:new Color(0.2, 0.3, 0.8),

        fade:0.0,

        gradient:true,
        auto:true,
        cycle:false,
        collisions:true,
        center:new Point(0.5, 0.3),

        laneSpacing:2,
        laneOffset:-2.5, // north american
        
        timeSlice:0.05,
    };

    var appname = 'DRIVEY (graphic test)';
    var version = '0.15';
    var copyright = '¬© 2005 Mark Pursey';
    var theRoad:Shape = new Shape();
    var theWalls:Shape = new Shape();
    var scr:Screen = new Screen();
    var user:Car = new Car();
    var other:Array<Car> = [];
    var message:String;
    var tt:Float = 0;
    var g_lastTime:Float = 0;
    var g_lastStep:Float = 0.05;
    var g_zoom:Float = 1;

    var road:Array<Shape>;
    var speedoShape:Shape;
    var speedoNeedle:Shape;
    var steeringWheelShape:Shape;
    var carLights:Shape;
    var carLightPaths:Shape;
    var carTailLightShape:Shape;
    var carBodyBottom:Shape;
    var carBodyTop:Shape;

    var g_startTime:Float;
    var g_frameInterval:Float;
    var lastTime:Float;
    var lastStep:Float;
    var lastJoyX:Float;
    var timer:haxe.Timer;
    var finishTime:Float;
    
    function new() {

        /*
        win.create(640,480);
        win.showCursor(false);
        win.fullScreen(true);
        win.setText(appname + ' ' + version);
        win.show(true);
        */

        road = makeRoad();
        speedoShape = makeSpeedoShape();
        speedoNeedle = makeSpeedoNeedle();
        steeringWheelShape = makeSteeringWheelShape();
        carLights = makeCarLights();
        carLightPaths = makeCarLightPaths();
        carTailLightShape = makeCarTailLightShape();
        carBodyBottom = makeCarBodyBottom();
        carBodyTop = makeCarBodyTop();

        g_startTime = Timer.stamp();
        g_frameInterval = 0.01;

        lastTime = g_startTime;
        lastStep = 0;
        lastJoyX = 0;

        setMessage('ESC to quit, F1 for help\n(arrow keys adjust speed and steering)');
        g.showHelp = 2;

        tick();
        timer = new haxe.Timer(33);
        timer.run = tick;

        finishTime = Timer.stamp();
    }

    function makeSpeedoShape():Shape {
        var speedoShape:Shape = new Shape();
        speedoShape.makeCircle(new Point(0,0), 0.5);
        speedoShape.outline(0.025);

        var dash:Shape = new Shape();
        dash.addVertexXY(-0.01,-0.49);
        dash.addVertexXY(0.01,-0.49);
        dash.addVertexXY(0.01,-0.44);
        dash.addVertexXY(-0.01,-0.44);
        var n = 8;
        for (i in 0...n)
        {
            var sh:Shape = dash.clone();
            sh.rotate(mix(-Math.PI * 0.8, Math.PI * 0.8, i / n));
            speedoShape.merge(sh);
        }
        return speedoShape;
    }

    function makeSpeedoNeedle():Shape {
        var speedoNeedle:Shape = new Shape();
        speedoNeedle.addVertexXY(-0.02,0.1);
        speedoNeedle.addVertexXY(-0.005,-0.4);
        speedoNeedle.addVertexXY(0.005,-0.4);
        speedoNeedle.addVertexXY(0.02,0.1);
        speedoNeedle.closePath();
        return speedoNeedle;
    }

    function makeSteeringWheelShape():Shape {
        var steeringWheelShape:Shape = new Shape();
        steeringWheelShape.makeCircle(new Point(0,0), 0.5);
        steeringWheelShape.closePath();
        var n = 60;
        for (i in 0...25) {
            var theta = (57 - i) * Math.PI * 2 / n;
            var mag = ((i & 1 != 0) ? 0.435: 0.45);
            steeringWheelShape.addControl(new Point(Math.cos(theta), Math.sin(theta)) * mag);
        }
        steeringWheelShape.closePath();
        for (i in 0...29) {
            var theta = (29-i) * 2 * Math.PI / n;
            var mag = ((i & 1 != 0) ? 0.435: 0.45);
            steeringWheelShape.addControl(new Point(Math.cos(theta), Math.sin(theta)) * mag);
        }
        steeringWheelShape.addControl(new Point(0.25, 0.075));
        steeringWheelShape.addControl(new Point(0.125, 0.2));
        steeringWheelShape.addControl(new Point(-0.125, 0.2));
        steeringWheelShape.addControl(new Point(-0.25, 0.075));
        steeringWheelShape.closePath();
        return steeringWheelShape;
    }

    function makeCarLights():Shape {
        var carLights:Shape = new Shape();
        carLights.init();
        var sq:Shape = new Shape();
        sq.makeUnit();
        carLights.merge(sq);
        sq.move(new Point(3,0));
        carLights.merge(sq);
        carLights.boxFit();
        carLights.recenter();
        carLights.scale(new Point(2,0.1));
        carLights.move(new Point(0,2));
        return carLights;
    }

    function makeCarLightPaths():Shape {
        var carLightPaths:Shape = new Shape();
        carLightPaths.init();
        var sq:Shape = new Shape();
        sq.addVertexXY(0,0);
        sq.addControlXY(-6,13);
        sq.addControlXY(4,15);
        carLightPaths.merge(sq);
        sq.scale(new Point(-1,1));
        sq.invert();
        sq.move(new Point(1.6,0));
        carLightPaths.merge(sq);
        carLightPaths.move(new Point(-0.8,3));
        return carLightPaths;
    }

    function makeCarTailLightShape():Shape {
        var carTailLightShape:Shape = new Shape();
        carTailLightShape.init();
        var sq:Shape = new Shape();
        sq.makeUnit();
        carTailLightShape.merge(sq);
        sq.move(new Point(3,0));
        carTailLightShape.merge(sq);
        carTailLightShape.boxFit();
        carTailLightShape.recenter();
        carTailLightShape.scale(new Point(2,0.05));
        carTailLightShape.move(new Point(0,-2));
        return carTailLightShape;
    }

    function makeCarBodyBottom():Shape {
        var carBodyBottom:Shape = new Shape();
        carBodyBottom.init();
        carBodyBottom.makeUnit();
        carBodyBottom.boxFit();
        carBodyBottom.recenter();
        carBodyBottom.scale(new Point(2,4));
        return carBodyBottom;
    }

    function makeCarBodyTop():Shape {
        var carBodyTop:Shape = new Shape();
        carBodyTop.init();
        carBodyTop.makeUnit();
        carBodyTop.boxFit();
        carBodyTop.recenter();
        carBodyTop.scale(new Point(2,3));
        carBodyTop.move(new Point(0,-0.5));
        return carBodyTop;
    }

    function isKeyDown(code) {
        return false; // TODO, event listeners
    }

    function addNPCCar()
    {
        var npcCar = new Car();
        other.push(npcCar);
        var t = theRoad.getPath(0).length * Math.random();
        npcCar.pos = m2w(theRoad.getPath(0).getPoint(t));
        npcCar.roadDir = (other.length & 1 != 0) ? -1 : 1;
        placeOn(npcCar, theRoad.getPath(0));
    }

    function setMessage(msg:String)
    {
        message = msg;
        g.showHelp = 1; // 2 seconds should be enough?
    }

    function drawHelp()
    {
        var print = function(s) trace(s);

        if (g.showHelp > 0)
        {
            if (message.length > 0)
            {
                print(message);
            }
            else
            {
                print('<esc>: quit');
                print('<home>: return to road');
                print('W,A,S,D & arrow keys: speed and steering control');
                print('F1: toggle help');
                print('F2: wireframe');
                print('F3: toggle dashboard');
                print('F4: rear view');
                print('F5: toggle (awful) manual control');
                print('F6: toggle (awful) collision detection');
                print('F7: toggle sky gradient');
                print('F8: switch driving side');
                print('F9: save configuration');
                print('F11: toggle fullscreen');
                print('G: greyscale palette');
                print('H: random palette');
                print('K: toggle palette cycling');
                print('N,M: adjust view angle');
                print('V,B: adjust brightness');
                print('C: add other cars');
                print('1-4: switch environment type');
                print('<ctrl>: super fast');
                print('<shift>: super slow');
            }
        }
    }

    function placeOn(car:Car, rd:Path)
    {
        var t = rd.getNearest(w2m(car.pos));
        var tan = !rd.getTangent(t);
        var normal = -rd.getNormal(t);
        if (car.roadDir < 0) {
            tan = -tan;
            normal = -normal;
        }

        car.pos = m2w(rd.getPoint(t) + normal * (g.laneSpacing * car.roadPos + g.laneOffset));
        car.lastPos = car.pos.clone();
        car.angle = -tan.getAngle() + Math.PI * 0.5;
        car.vel = new Vector(0, 0, car.cruise).rotateY(-car.angle);
        car.lastVel = car.vel.clone();
    }

    function autoDrive(car:Car, aroad:Path)
    {
        var dir = car.vel;
        if (dir.magnitude > 0) {
            dir = !car.vel;
        } else {
            dir = new Vector(0, 0, 1).rotateY(-car.angle);
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
        targetDir += normal * (g.laneSpacing * car.roadPos + g.laneOffset);

        if (targetDir.magnitude > 0) {
            tangent = Point.mix(tangent, targetDir, 0.05);
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

        if (bar(newAngle) > 1) {
            newAngle /= bar(newAngle);
        }

        car.steerTo = newAngle / (min(targetDir.magnitude * 0.5, 50) + 1);

        if (bar(car.steerTo) > 0.02) {
            car.steerTo *= 0.02/bar(car.steerTo);
        }

        if (car.vel.magnitude < car.cruise) {
            car.accelerate = 1;
        } else {
            car.accelerate = car.cruise / car.vel.magnitude;
        }
    }

    function drawBackground(screen:Screen)
    {
        screen.alpha = 1;
        screen.bg = g.col.ground;
        screen.clear();

        if (!g.project)
        {
            return;
        }

        var center = new Point(screen.width * g.center.x, screen.height * g.center.y);

        var sh:Shape = new Shape();

        sh.addVertex(new Point(1,0));
        sh.addVertex(new Point(1,1));
        sh.addVertex(new Point(0,1));
        sh.addVertex(new Point(0,0));

        sh.move(new Point(-0.5,0.0001));
        sh.scale(new Point(-1,1));

        var vo:Vector = new Vector();
        vo.set(0,0,g.rearView ? -0.01 : 0.01);
        var vx:Vector = new Vector();
        vx.set(1,0,0);
        var vy:Vector = new Vector();
        vy.set(0,1,0); // vertical

        var tilt = user.tilt * Math.PI;
        var pitch = -user.pitch * Math.PI;
        var zoom = 1.0/(g.rearView ? -g.zoom : g.zoom);

        var vo:Vector = vo.rotateZ(tilt).rotateX(pitch);
        var vx:Vector = vx.rotateZ(tilt).rotateX(pitch);
        var vy:Vector = vy.rotateZ(tilt).rotateX(pitch);

        vo.z *= zoom;
        vo.y = -vo.y;
        if (g.rearView) vo.x = -vo.x;
        vx.z *= zoom;
        vx.y = -vx.y;
        if (g.rearView) vx.x = -vx.x;
        vy.z *= zoom;
        vy.y = -vy.y;
        if (g.rearView) vy.x = -vy.x;

        sh.project(vo, vx, vy);

        var scale = max(center.x, center.y);

        var gradTopVec:Vector = vo + vy * 0.015;
        var gradTop:Point = new Point(gradTopVec.x / gradTopVec.z, gradTopVec.y / gradTopVec.z);
        var vop:Point = vo;
        var gradOrg:Point = vop / vo.z;
        gradTop -= gradOrg;
        gradTop *= scale;
        gradOrg *= scale;
        gradOrg += center;

        sh.scaleUniform(scale);

        sh.move(center);

        screen.bg = g.col.sky.hi;
        screen.rgb = g.col.sky.lo;

        if (g.gradient)
        {
            screen.cmd('pattern gradient linear power ${g.col.sky.gradient} org ${gradOrg.x} ${gradOrg.y} dx ${gradTop.x} ${gradTop.y}');
        } else {
            screen.rgb = (g.col.sky.hi + g.col.sky.lo) * 0.5; // average the two
        }

        screen.drawShape(sh);
        screen.cmd('pattern');
    }

    function drawRoadShape(screen:Screen, sh:Shape, height:Float, extr:Float)
    {
        if (screen.height > 0) {
            screen.cmd('pattern');
        }

        var center = new Point(screen.width * g.center.x, screen.height * g.center.y);
        if (g.project)
        {
            var up = user.pos;

            var vo:Vector = new Vector();
            vo.set(0,height,0);
            var vx:Vector = new Vector();
            vx.set(1,0,0);
            var vy:Vector = new Vector();
            vy.set(0,0,1);

            vo -= up;

            var yaw = user.angle;
            var tilt = user.tilt * Math.PI;
            var pitch = -user.pitch * Math.PI;

            vo = vo.rotateY(yaw).rotateZ(tilt).rotateX(pitch);
            vx = vx.rotateY(yaw).rotateZ(tilt).rotateX(pitch);
            vy = vy.rotateY(yaw).rotateZ(tilt).rotateX(pitch);

            var vz:Vector = (vx * vy) * extr;

            // factor in zoom here now
            var zoom = 1.0/(g.rearView ? -g.zoom : g.zoom);

            vo.z *= zoom;
            if (g.rearView) vo.x = -vo.x;
            vx.z *= zoom;
            if (g.rearView) vx.x = -vx.x;
            vy.z *= zoom;
            if (g.rearView) vy.x = -vy.x;
            vz.z *= zoom;
            if (g.rearView) vz.x = -vz.x;

            if (extr != 0) {
                sh.project(vo, vx, vy, vz);
            } else {
                sh.project(vo, vx, vy);
            }

            // make sure positive y is up
            sh.scale(new Point(1,-1) * max(center.x, center.y));// * g.zoom);

            sh.move(center);
        }
        else
        {
            sh.move(-w2m(user.pos));
            sh.rotate(user.angle);
            sh.scale(new Point(30,-30) * ((center.x + center.y) * 0.0025 / (user.pos.y * 0.05 + 4)));
            center = new Point(screen.width * 0.5, screen.height * 0.6);
            sh.move(center);
        }

        screen.drawShape(sh);
    }

    function drawShapes(screen:Screen, shapes:Array<Shape>)
    {
        for (shape in shapes)
        {
            screen.rgb = shape.rgb;
            screen.alpha = shape.alpha;

            drawRoadShape(screen, shape, shape.height, shape.extrude);
        }

        screen.rgb = 1;
        screen.alpha = 1;
    }

    function makeRoadLine(p:Path, xpos:Float, width:Float, dashOn:Float, dashOff:Float)
    {
        var smooth = dashOn > 0;
        dashOn = bar(dashOn);
        var sh:Shape = new Shape();
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
                    var c:Shape = new Shape();
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
                        var t = mix(t0,t1,(i+1)/(between+1));
                        var pt = p.getPoint(t) + p.getNormal(t)*(xpos+width*0.5);
                        sh.addControl(pt);
                    }

                    sh.addVertex(p1+x1*(xpos+width*0.5));
                    sh.addVertex(p1+x1*(xpos-width*0.5));

                    for (i in 0...Std.int(between))
                    {
                        var t = mix(t1,t0,(i+1)/(between+1));
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

    function makeRoad()
    {
        scr.clear();
        g.auto = true;
        g.laneSpacing = 4;
        theWalls.init();
        theRoad.init();
        var n = 16;
        for (i in 0...n)
        {
            var theta:Float = i * Math.PI * 2 / n;
            var pt = new Point(Math.cos(theta), Math.sin(theta)) * (Math.random() + 5);
            theRoad.addControl(pt);
        }

        theRoad.boxFit();
        theRoad.scale(new Point(400,400));
        theRoad.recenter();

        var p = theRoad.getPath(0);

        var newRoad:Array<Shape> = [];

        var layer = new Shape();
        newRoad.push(layer);

        g.tint = 0.5;
        g.col.ground = 0.0;
        g.col.sky.lo = 0.75;
        g.col.sky.hi = 0.25;
        g.col.sky.gradient = 0.5;

        if (g.roadType == 1)    // tunnel
        {
            setMessage('(tunnel)');
            g.tint = new Color(0.2, 0.7, 0.1);
            g.col.sky.lo = g.col.sky.hi = 0;
            var tarmac = 0.1;
            var whiteLines = 0.8;
            var yellowLines = 0.75;
            var lightColor = 1;

            // do white lines
            var layer = new Shape();
            newRoad.push(layer);
            layer.rgb = tarmac;
            layer.merge(makeRoadLine(p, 0, 7, 30, 0));

            var layer = new Shape();
            newRoad.push(layer);
            layer.rgb = whiteLines;
            layer.merge(makeRoadLine(p, -3.5, 0.2, 30, 2));
            layer.merge(makeRoadLine(p, 3.5, 0.2, 30, 2));
            layer.merge(makeRoadLine(p, -0.15, 0.15, -4, 8));

            // do yellow lines
            var layer = new Shape();
            newRoad.push(layer);
            layer.rgb = yellowLines;
            layer.merge(makeRoadLine(p, 0.125, 0.125, 30, 0));

            // do crossings
            if (true)
            {
                var layer = new Shape();
                newRoad.push(layer);
                layer.rgb = tarmac;
                layer.merge(makeRoadLine(p, 0, 1, -2, 200));
                layer.expand(1);

                var layer = new Shape();
                newRoad.push(layer);
                layer.rgb = whiteLines;
                for (i in 0...6)
                {
                    var width = 6.0 / 6 * 0.5;
                    layer.merge(makeRoadLine(p, i * 2 * width - 3 + width, width, -2, 200));
                }
            }

            // do lights
            if (true)
            {
                var layer = new Shape();
                newRoad.push(layer);
                layer.rgb = lightColor;

                layer.height = 4;
                layer.extrude = 0.1;
                layer.merge(makeRoadLine(p, -4, 0.1, -4, 6));
                layer.merge(makeRoadLine(p, 4, 0.1, -4, 6));
            }

            if (true)   // walls
            {
                var layer:Shape = new Shape();
                layer.rgb = g.col.sky.lo;

                layer.height = 4;
                layer.extrude = 4;
                layer.merge(makeRoadLine(p, -5, 0.4, 100, 0));
                layer.merge(makeRoadLine(p, 5, 0.4, 100, 0));

                newRoad.push(layer);
                layer.rgb = g.col.sky.lo;

                layer.height = 0;
                layer.extrude = -4;
                layer.merge(makeRoadLine(p, -5, 0.4, 200, 0));
                layer.merge(makeRoadLine(p, 5, 0.4, 200, 0));
                newRoad.push(layer);
            }
        }
        else if (g.roadType == 2)   // city
        {
            g.tint = new Color(0.3, 0.3, 0.7) * 1.5;

            setMessage('(city)');
            p.scaleUniform(2);

            g.col.ground = 0.05;
            var lines:Color = 0.6;
            var obc:Color = g.col.ground.clone();

            g.col.sky.lo = 0.4;
            g.col.sky.hi = 0.0;

            if (true)   // sky ?
            {
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = (g.col.sky.lo + g.col.sky.hi) * 0.5;
                sh.alpha = 1;
                sh.height = 200;
                for (i in 0...100)
                {
                    var sh2:Shape = new Shape();
                    var p = new Point(Math.random()-0.5, Math.random()-0.5);
                    if (p.magnitude > 0.5 || p.magnitude < 0.1) {
                        continue;
                    }

                    p *= 8000;
                    if ((p - sh.getNearestPoint(p)).magnitude < 200) {
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
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = g.col.ground;
                sh.height = 50;
                sh.extrude = 50;
                sh.merge(makeRoadLine(p, -200, 15, 0, 200));
                sh.merge(makeRoadLine(p, 200, 15, 0, 150));
                
                // do bg
                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = g.col.ground;
                sh.height = 70;
                sh.extrude = 70;
                sh.merge(makeRoadLine(p, -160, 10, -20, 90));
                sh.merge(makeRoadLine(p, 160, 20, -25, 85));
                sh.merge(makeRoadLine(p, 260, 20, -25, 40));

                // do bg
                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = g.col.ground;
                sh.height = 40;
                sh.extrude = 40;
                sh.merge(makeRoadLine(p, -80, 20, -25, 150));
                sh.merge(makeRoadLine(p, 80, 20, -20, 200));
                sh.merge(makeRoadLine(p, 300, 20, -40, 100));

                // do bg
                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = g.col.ground;
                sh.height = 20;
                sh.extrude = 20;
                sh.merge(makeRoadLine(p, -80, 40, -20, 45));
                sh.merge(makeRoadLine(p, 80, 40, -25, 40));
            }
            else
            {
                var box:Shape = new Shape();
                box.makeUnit();
                box.recenter();
                box.scaleUniform(40);

                var l0:Shape = new Shape();
                l0.rgb = obc;
                l0.height = 15;
                l0.extrude = l0.height;
                var l1:Shape = new Shape();
                l1.rgb = obc;
                l1.height = 30;
                l1.extrude = l1.height;
                var l2:Shape = new Shape();
                l2.rgb = obc;
                l2.height = 50;
                l2.extrude = l2.height;
                var l3:Shape = new Shape();
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

                        var pos = new Point(x+Math.random()*100,y+Math.random()*100);
                        if (pos.magnitude > radius) {
                            continue;
                        }

                        var pt = p.getNearestPoint(pos);
                        if ((pt - pos).magnitude < 60) {
                            continue;
                        }

                        var s:Shape = box.clone();
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
                
                newRoad.push(l1);
                newRoad.push(l2);
                newRoad.push(l3);
            }

            
            var sh = new Shape();
            newRoad.push(sh);
            sh.rgb = obc;
            sh.extrude = 10;
            sh.height = 10;
            sh.merge(makeRoadLine(p, -16, 0.2, -0.2, 400));
            sh.merge(makeRoadLine(p, -12, 0.2, -0.2, 400));
            sh.merge(makeRoadLine(p, 12, 0.2, -0.2, 300));
            sh.merge(makeRoadLine(p, 16, 0.2, -0.2, 300));
            theWalls.merge(sh);
            
            var sh = new Shape();
            newRoad.push(sh);
            sh.rgb = obc;
            sh.height = 14;
            sh.extrude = 4;
            sh.merge(makeRoadLine(p, -14, 6, -0.2, 400));
            sh.merge(makeRoadLine(p, 14, 6, -0.2, 300));
            
            var sh = new Shape();
            newRoad.push(sh);
            sh.rgb = lines;
            sh.height = 0;
            sh.merge(makeRoadLine(p, 0, 0.1, 60, 0));
            sh.merge(makeRoadLine(p, 0.2, 0.1, 60, 0));
            sh.merge(makeRoadLine(p, -6, 0.15, 30, 1));
            sh.merge(makeRoadLine(p, 6, 0.15, 30, 1));
            
            var sh = new Shape();
            newRoad.push(sh);
            sh.height = 0;
            sh.rgb = lines;
            sh.merge(makeRoadLine(p, -3, 0.15, 3, 12));
            sh.merge(makeRoadLine(p, 3, 0.15, 3, 12));
        }
        else if (g.roadType == 3)   // industrial
        {
            setMessage('(industrial)');
            g.tint = new Color(0.7, 0.4, 0.1);

            g.col.sky.hi = 0.15;
            g.col.sky.lo = 1.0;
            g.col.sky.gradient = 0.25;

            g.col.ground = 0.05;
            var lines:Color = 0.6;
            var obc:Color = g.col.ground;

            // far off buildings
            if (true)
            {
                // very tall things
                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = 1;
                sh.height = 62;
                sh.extrude = 2;
                sh.merge(makeRoadLine(p, 300, 0.5, 0, 250));
                sh.merge(makeRoadLine(p, 320, 0.75, 0, 250));

                if (true)
                {
                    var layer = new Shape();
                    newRoad.push(layer);
                    layer.rgb = obc;
                    layer.height = 60;
                    layer.extrude = 60;
                    layer.merge(makeRoadLine(p, 300, 0.5, 0, 250));
                    layer.merge(makeRoadLine(p, 320, 0.75, 0, 250));
                    layer.merge(makeRoadLine(p, 400, 8, 0, 240));
                    layer.merge(makeRoadLine(p, 500, 8, 0, 240));
                }

                // medium buildings
                var layer = new Shape();
                newRoad.push(layer);
                layer.rgb = obc;
                layer.height = 12;
                layer.extrude = 12;
                layer.merge(makeRoadLine(p, -80, 20, -40, 60));
                layer.merge(makeRoadLine(p, 180, 50, -40, 30));
                layer.merge(makeRoadLine(p, 300, 50, -20, 20));

                layer.merge(makeRoadLine(p, -100, 8, 0, 200));
                layer.merge(makeRoadLine(p, -60, 8, 0, 1500));
                layer.merge(makeRoadLine(p, 100, 8, 0, 140));
                layer.merge(makeRoadLine(p, 120, 8, 0, 220));
            }

            // do white lines
            if (true)
            {
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = lines;
                sh.merge(makeRoadLine(p, -3.5, 0.15, 60, 2));
                sh.merge(makeRoadLine(p, 3.5, 0.15, 60, 2));
                sh.merge(makeRoadLine(p, -0.15, 0.125, -4, 6));
                sh.merge(makeRoadLine(p, 0.125, 0.125, 60, 0));

                // do crossings
                if (true)
                {
                    
                    var sh = new Shape();
                    newRoad.push(sh);
                    sh.rgb = g.col.ground;
                    sh.merge(makeRoadLine(p, 0, 1, -2, 200));
                    sh.expand(1);

                    
                    var sh = new Shape();
                    newRoad.push(sh);
                    sh.rgb = lines;
                    for (i in 0...6)
                    {
                        var width = 6.0 / 6 * 0.5;
                        sh.merge(makeRoadLine(p, i * 2 * width - 3 + width, width, -2, 200));
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

                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = obc;
                sh.height = tall + thick;
                sh.extrude = thick;
                sh.merge(makeRoadLine(p, -5.6, 5, thick, left));

                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = obc;
                sh.height = tall;
                sh.extrude = tall;
                sh.merge(makeRoadLine(p, -8, thick, thick, left));
                theWalls.merge(sh);

                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = 1;
                sh.height = tall;
                sh.extrude = thick*2;
                sh.merge(makeRoadLine(p, -4, 2, thick, left));
            }

            // overpasses
            if (true)
            {
                var depth = 8;
                var spacing = 300;
                var p2 = p.clone();
                p2.scale(new Point(1,1.5));

                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = obc;
                sh.height = 12;
                sh.extrude = 2;
                sh.merge(makeRoadLine(p2, 0, 162, -depth, spacing));
                sh.scale(new Point(1,1/1.5));

                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = obc;
                sh.height = 10;
                sh.extrude = 10;
                sh.merge(makeRoadLine(p2, -100, 42, -depth, spacing));
                sh.merge(makeRoadLine(p2, -40, 2, -depth, spacing));
                sh.merge(makeRoadLine(p2, -10, 2, -depth, spacing));
                sh.merge(makeRoadLine(p2, 10, 2, -depth, spacing));
                sh.merge(makeRoadLine(p2, 40, 2, -depth, spacing));
                sh.merge(makeRoadLine(p2, 200, 242, -depth, spacing));
                sh.scale(new Point(1,1/1.5));

                var wall:Shape = makeRoadLine(p2, -10, 2, -depth, spacing);
                wall.merge(makeRoadLine(p2, 10, 2, -depth, spacing));
                wall.scale(new Point(1,1/1.5));
                theWalls.merge(wall);
            }

            // various poles
            if (true)
            {
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = obc;

                sh.height = 12;
                sh.extrude = 12;
                sh.merge(makeRoadLine(p, -30, 0.25, 0, 90));

                sh.merge(makeRoadLine(p, -40, 0.25, 0, 110));
                sh.merge(makeRoadLine(p, 60, 0.25, 0, 60));

                sh.merge(makeRoadLine(p, -50, 0.25, 0, 60));
                sh.merge(makeRoadLine(p, -20, 0.125, 0, 100));
                sh.merge(makeRoadLine(p, 20, 0.25, 0, 45));
                sh.merge(makeRoadLine(p, 50, 0.125, 0, 50));
                sh.merge(makeRoadLine(p, 70, 0.25, 0, 75));

                // knobs
                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = obc;
                sh.height = 13;
                sh.extrude = 1;
                sh.merge(makeRoadLine(p, -40, 1, 0, 110));
                sh.merge(makeRoadLine(p, 60, 1, 0, 60));

                // wires
                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = obc;
                sh.height = 11.25;
                sh.extrude = 0.025;

                sh.merge(makeRoadLine(p, -50, 0.025, -60, 0));
                sh.merge(makeRoadLine(p, -20, 0.025, -100, 0));
                sh.merge(makeRoadLine(p, 20, 0.025, -45, 0));
                sh.merge(makeRoadLine(p, 50, 0.025, -50, 0));
                sh.merge(makeRoadLine(p, 70, 0.025, -75, 0));
            }
            // fencing
            if (true)
            {
                var tall = 5;
                var spacing = 30;
                var dist = 25;

                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = obc;
                sh.height = tall;
                sh.extrude = tall;

                sh.merge(makeRoadLine(p, -dist, 0.1, 0, spacing));
                sh.merge(makeRoadLine(p, dist, 0.1, 0, spacing));

                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = obc;
                sh.height = tall-0.5;
                sh.extrude = 0.1;

                sh.merge(makeRoadLine(p, -dist, 0.1, -spacing, 0));
                sh.merge(makeRoadLine(p, dist, 0.1, -spacing, 0));

                
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = obc;
                sh.alpha = 0.25;
                sh.height = tall - 0.6;
                sh.extrude = tall - 0.6;

                sh.merge(makeRoadLine(p, -dist, 0.1, -spacing, 0));
                sh.merge(makeRoadLine(p, dist, 0.1, -spacing, 0));
                theWalls.merge(sh);
            }
        }
        else // ordinary road
        {
            setMessage('(very sparse road)');
            g.tint = 0.7;
            g.col.ground = 0;
            g.col.sky.hi = 0;
            g.col.sky.lo = 0;
            var lines:Color = 0.75;

            theRoad.scaleUniform(2);
            layer.rgb = lines;
            layer.height = 0;

            layer.merge(makeRoadLine(p, 0, 0.2, 4, 10));
            layer.merge(makeRoadLine(p, -3, 0.15, 30, 2));
            layer.merge(makeRoadLine(p, 3, 0.15, 30, 2));

            // posts
            if (true)
            {
                var sh = new Shape();
                newRoad.push(sh);
                sh.rgb = lines;
                sh.height = 0.6;
                sh.extrude = 1;
                sh.merge(makeRoadLine(p, -6, 0.2, 0.2, 50));
                sh.merge(makeRoadLine(p, 6, 0.2, 0.2, 50));
            }

            scr.setTint(0, 0.6, 1);
        }


        var scale = new Point(1.25,1.25);
        theRoad.scale(scale);
        theWalls.scale(scale);
        for (i in 0...newRoad.length)
        {
            newRoad[i].scale(scale);
        }

        placeOn(user, theRoad.getPath(0));
        other = [];

        return newRoad;
    }

    // main loop
    function tick()
    {
        if (isKeyDown('F1'))
        {
            if (message.length ==  0&& g.showHelp > 1) {
                g.showHelp = 0;
            } else {
                g.showHelp = 6;
            }

            message = '';
        }
        if (isKeyDown('F7'))
        {
            g.gradient = !g.gradient;
            setMessage('gradient ' + (g.gradient ? 'on': 'off'));
        }
        if (isKeyDown('Esc'))
        {
            // exit
        }
        if (isKeyDown('C'))
        {
            if (other.length > 16) {
                other = [];
            }
            else {
                for (i in 0...8) {
                    addNPCCar();
                }
            }
            setMessage('' + other.length + ' cars on the road');
        }
        if (isKeyDown('F8'))
        {
            g.laneOffset = -g.laneOffset;
            setMessage('driving style: ' + (g.laneOffset < 0 ? 'North American': 'Australian'));
        }
        if (isKeyDown('F6'))
        {
            g.collisions = !g.collisions;
            setMessage('collision detection ' + (g.collisions ? 'on (crappy)': 'off'));
        }
        if (isKeyDown('F5'))
        {
            g.auto = !g.auto;
            setMessage(g.auto ? 'autodrive' : 'manual steer');
        }
        if (isKeyDown('G'))
        {
            g.tint = 0.5;
            g.cycle = false;
            setMessage('greyscale');
        }
        if (isKeyDown('H'))
        {
            var tint = new Color(Math.random(),Math.random(),Math.random());
            tint *= 1.0/tint.brightness();
            g.tint = tint * 0.6;
            g.cycle = false;
            setMessage('random palette');
        }
        if (isKeyDown('K'))
        {
            g.cycle = !g.cycle;
            setMessage('palette cycle ' + (g.cycle ? 'on' : 'off' ));
        }
        if (isKeyDown('F3'))
        {
            g.showDashboard = !g.showDashboard;
            setMessage('dashboard ' + (g.showDashboard ? 'on' : 'off' ));
        }
        if (isKeyDown('1'))
        {
            g.roadType = (g.roadType + 1) % 4;
            user.init();
            road = makeRoad();
            lastTime = Timer.stamp();
        }

        var lineThickness = scr.width * 0.0025;
        g.center.y = min(0.5, max(0.3, 1.0 - (scr.width * 0.5/scr.height)));

        // now let's get the time step here
        var tm = Timer.stamp();
        var period:Float = tm - lastTime;
        lastTime = tm;
        var step:Float = period;

        // maximum frame step is 0.1 seconds
        if (step > 0.1) {
            step = 0.1;
        }

        if (isKeyDown('shift')) {
            step *= 0.125;
        } else if (isKeyDown('control')) {
            step *= 4;
        }

        // soften it to deal with coarse timing issues
        step = mix(lastStep, step, 0.5);
        lastStep = step;


        var acc:Point = new Point(0,0);

        var joy = new Point(0,0);
        joy.x = mix(lastJoyX, joy.x, 0.5);
        lastJoyX = joy.x;

        joy.y = -joy.y;

        acc.y = joy.y;

        var temp_steer = 0;

        if (isKeyDown('up') || isKeyDown('W'))
        {
            acc.y += 1;
        }
        if (isKeyDown('down') || isKeyDown('S'))
        {
            acc.y -= 2;
        }

        if (isKeyDown('left') || isKeyDown('A'))
        {
            if (g.auto)
            {
                user.roadPos += 3 * step;
            }
            else
            {
                temp_steer -= 1;
            }
        }
        if (isKeyDown('right') || isKeyDown('D'))
        {
            if (g.auto)
            {
                user.roadPos += -3 * step;
            }
            else
            {
                temp_steer += 1;
            }
        }

        if (g.auto)
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
        if (g.wireframe != isKeyDown('F2'))
        {
            g.wireframe = !g.wireframe;
            scr.cmd('wireframe ' + (g.wireframe ? 'on' : 'off'));
            setMessage('wireframe ' + (g.wireframe ? 'on' : 'off'));
        }

        g.rearView = isKeyDown('F4');
        if (g.rearView) {
            setMessage('rear view');
        }

        if (isKeyDown('B'))    // hi contrast
        {
            g.tint *= Math.pow(2, step);
            g.cycle = false;
        }
        if (isKeyDown('V'))    // lo contrast
        {
            g.tint *= Math.pow(2, -step);
            g.cycle = false;
        }

        if (isKeyDown('M'))
        {
            g.zoom *= Math.pow(2, step);
            setMessage('zoom ' + Std.int(g.zoom * 100));
        }
        if (isKeyDown('N'))
        {
            g.zoom *= Math.pow(2, -step);
            if (g.zoom < 0.125)
            {
                g.zoom = 0.125;
            }
            setMessage('zoom ' + Std.int(g.zoom * 100));
        }

        if (isKeyDown('home'))
        {
            g.auto = true;
            user.roadPos = 0;
            placeOn(user, theRoad.getPath(0));
            g.fade = 0;
            setMessage('returned to road');
        }

        user.brake = 0;
        user.accelerate = 0;


        if (isKeyDown(' '))
            user.brake = 1;

        var xs = joy.x;

        if (g.xfunc)
        {
            xs = sign(xs) * 0.75 * (Math.pow(bar(xs), 3) + bar(xs) * 0.25);
        }
        else
        {
            xs *= 0.5;
        }

        var tt = step;
        while (tt > 0)
        {
            var step = min(tt, g.timeSlice);

            if (g.auto)
            {
                autoDrive(user, theRoad.getPath(0));
            }
            else
            {
                var diff = -sign(user.steerTo) * 0.0002 * user.vel.magnitude * step;
                if (bar(diff) >= bar(user.steerTo))
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
                autoDrive(o, theRoad.getPath(0));
                o.advance(step);
                if (g.collisions)
                {
                    user.collideWithCar(o);
                }
            }

            if (g.collisions)
            {
                user.collideWithShape(theWalls);
            }

            tt -= g.timeSlice;
        }

        user.steerTo -= xs * 0.05;

        if (g.cycle)    // cycle colors
        {
            var t:Float = lastTime * 0.125;
            var tint1 = new Color(Math.sin(t * 0.7) * 0.5 + 0.5, Math.sin(t*0.9) * 0.5 + 0.5, Math.sin(t*1.3) * 0.5 + 0.5);

            tint1 *= 0.7 / tint1.brightness();

            g.tint = tint1;
        }

        scr.cmd('pattern zoom ' + (Math.sin(lastTime * 0.1) * 0.1 + 1));
        if (g.wireframe)
        {
            scr.bg = 0;
            scr.clear();
        }
        else
        {
            drawBackground(scr);
        }

        // draw the road itself
        drawShapes(scr, road);

        // draw the road itself

        var carBodiesTop:Shape = new Shape();
        var carBodiesBottom:Shape = new Shape();
        var cars:Shape = new Shape();
        var lights:Shape = new Shape();
        var lightPaths:Shape = new Shape();

        scr.rgb = 1;
        for (i in (g.project ? 0 : -1)...other.length)
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
                var a = carTailLightShape;
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
            scr.rgb = g.col.ground; // black bodies
            scr.alpha = 1;
            drawRoadShape(scr, carBodiesTop, 2, 1.75);
            drawRoadShape(scr, carBodiesBottom, 0.25, -1.75);

            scr.rgb = 0.6; // tail light?
            scr.alpha = 1;
            drawRoadShape(scr, cars, 0.75, 0.2);

            scr.alpha = 1;

            scr.rgb = 1.0; // head light?
            scr.alpha = 1;

            scr.alpha = 1;
            drawRoadShape(scr, lights, 1, 0.3);
        }

        var nearest:Point = theRoad.getNearestPoint(user.pos);

        var normalSpeed = 100 * 1000 / 3600; // 100 km/h


        if (g.project && g.showDashboard && !g.rearView)    // draw controls
        {
            var dwidth = scr.width;
            var dheight = scr.height;

            scr.alpha = 1;

            var fill:Color = 0;
            var line:Color = 0.2;
            var shadow:Color = 0;

            var thick = lineThickness * 4;
            var sh:Shape = new Shape();
            sh.makeCircle(new Point(0,0), 1);
            sh.scale(new Point(1.2,0.3) * dwidth);
            sh.move(new Point(dwidth * (g.laneOffset < 0 ? 0.2 : 0.8), dheight * 1.05));
            scr.rgb = fill;

            scr.drawShape(sh);
            scr.cmd('pattern');

            sh.outline(thick);
            scr.rgb = line;
            scr.drawShape(sh);

            // do speedo
            scr.rgb = line;

            var sh = speedoShape;
            sh.scale(new Point(1,1) * dwidth * 0.2);
            sh.move(new Point(dwidth * (g.laneOffset < 0 ? 0.325 : 0.675), dheight * 0.875));
            scr.drawShape(sh);

            var sh = speedoShape;
            sh.scale(new Point(1,1) * dwidth * 0.2);
            sh.move(new Point(dwidth * (g.laneOffset < 0 ? 0.1 : 0.9), dheight * 0.875));
            scr.drawShape(sh);

            var speed:Float = user.vel.magnitude / 1000 * 3600;
            speed = mix(-Math.PI * 0.8, Math.PI * 0.8, min(speed/400, 1));
            var sh = speedoNeedle;
            sh.scale(new Point(1,1) * dwidth * 0.2);
            sh.rotate(speed);
            sh.move(new Point(dwidth * (g.laneOffset < 0 ? 0.325 : 0.675), dheight * 0.875));
            scr.rgb = line;
            scr.drawShape(sh);

            var speed:Float = g.frameRate;
            speed = mix(-Math.PI * 0.8, Math.PI * 0.8, min(speed/80, 1));
            var sh = speedoNeedle;
            sh.scale(new Point(1,1) * dwidth * 0.2);
            sh.rotate(speed);
            sh.move(new Point(dwidth * (g.laneOffset < 0 ? 0.1 : 0.9), dheight * 0.875));
            scr.rgb = line;
            scr.drawShape(sh);

            // do steeringwheel
            var sh = steeringWheelShape;
            sh.rotate(user.steerPos * 50);
            sh.scale(new Point(1,1) * dwidth * 0.9);
            sh.move(new Point(dwidth * (g.laneOffset < 0 ? 0.2 : 0.8), dheight * 1.1));
            if (true)
            {
                scr.rgb = line;
                var s2 = sh;
                s2.move(new Point(0, -thick*0.5));
                s2.expand(-thick*0.5);
                sh.expand(thick*0.5);
                scr.rgb = line;
                scr.drawShape(sh);
                if (shadow != fill)
                {
                    scr.rgb = shadow;
                    sh.scale(new Point(1.1,1.3));
                    scr.alpha = 0.25;
                    scr.drawShape(sh);
                    scr.alpha = 1;
                }

                scr.rgb = fill;
                scr.drawShape(s2);
            }
            else
            {
                scr.rgb = fill;
                scr.drawShape(sh);

                sh.outline(thick);
                scr.rgb = line;
                scr.drawShape(sh);
            }
            scr.alpha = 1;

        }

        if (g.blur)
        {
            scr.cmd('blur x3 y3');
        }

        g_frameInterval = mix(g_frameInterval, period, 0.01);

        g.frameRate = 1.0/g_frameInterval;

        if (g.showHelp > 0)
        {
            g.showHelp -= 0.5 * step;
            drawHelp();
        }

        if (g.wireframe)
        {
        
            var t:Color = new Color(0,0,0.5);
            scr.setTint(t, Color.mix(t,1,0.75), 1);
        }
        else
        {
            var fw:Color = 0 * g.fade;
            var fl:Color = g.tint * g.fade;
            var fh:Color = 1 * g.fade;

            if (g.fade < 1)
            {
                g.fade = mix(1, g.fade, 0.4/period); // g.fade = mix(1, g.fade, 0.8/2`period);
            }

            if (g.fade > 1)
            {
                g.fade = 1;
            }

            scr.cmd('tint lo 0 hi 255 #$fw #$fl #$fh');

        }

        // win.paint();
    }
}
