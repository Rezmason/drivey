package drivey;

import haxe.Timer;
import drivey.levels.*;

import drivey.Utils.*;

class Drivey {

    static function main() new Drivey();

    var auto:Bool = true;
    var center:Vector2 = new Vector2(0.5, 0.3);
    var collisions:Bool = true;
    var cycle:Bool = false;
    var fade:Float = 0.0;
    var frameRate:Float = 1.0;
    var showSkyGradient:Bool = true;
    var laneOffset:Float = -2.5; // north american
    var laneSpacing:Int = 4;
    var noAA:Bool = false;
    var rearView:Bool = false;
    var levelID:Int = 3;
    var showDashboard:Bool = true;
    var timeSlice:Float = 0.05;
    var tint:Color = new Color(0.2, 0.3, 0.8); // colors for palette tinting
    var xfunc:Bool = true;
    var zoom:Float = 0.6;

    var appname = 'DRIVEY (graphic test)';
    var version = '0.15';
    var copyright = '¬© 2005 Mark Pursey';
    var level:Level;
    var levels:Array<Level>;
    var scr:Screen = new Screen();
    var user:Car = new Car();
    var other:Array<Car> = [];
    var message:String;
    var tt:Float = 0;
    var g_lastTime:Float = 0;
    var g_lastStep:Float = 0.05;
    var g_zoom:Float = 1;

    var speedoForm:Form;
    var speedoNeedle:Form;
    var steeringWheelForm:Form;

    var g_startTime:Float;
    var g_frameInterval:Float;
    var lastTime:Float;
    var lastStep:Float;
    var lastJoyX:Float;
    var timer:Timer;
    var finishTime:Float;
    
    function new() {

        Playground.run(scr);

        scr.showMessage([
            'DRIVEY',
            'hypnotic motorway simulation',
            '',
            'original © 2007 Mark Pursey',
            'retreaded for the web by @rezmason',
            '',
            '[ 1 ] for keyboard shortcuts',
        ].join('\n'), false);

        levels = [];
        levels.push(new Tunnel());
        levels.push(new City());
        levels.push(new IndustrialZone());
        levels.push(new DeepDarkNight());

        speedoForm = makeSpeedoForm();
        speedoNeedle = makeSpeedoNeedle();
        steeringWheelForm = makeSteeringWheelForm();
        g_startTime = Timer.stamp();
        g_frameInterval = 0.01;

        lastTime = g_startTime;
        lastStep = 0;
        lastJoyX = 0;

        setLevel(3);
        update();
        scr.addRenderListener(update);

        finishTime = Timer.stamp();
    }

    function makeSpeedoForm():Form {
        var speedoForm:Form = new Form('speedoForm');
        speedoForm.makeCircle(new Vector2(0,0), 0.5);
        speedoForm.outline(0.025);

        var dash:Form = new Form('dash');
        dash.addPolyLine([
            new Vector2(-0.01,-0.49),
            new Vector2(0.01,-0.49),
            new Vector2(0.01,-0.44),
            new Vector2(-0.01,-0.44),
        ], true);
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
        speedoNeedle.addPolyLine([
            new Vector2(-0.02,0.1),
            new Vector2(-0.005,-0.4),
            new Vector2(0.005,-0.4),
            new Vector2(0.02,0.1),
        ], true);
        return speedoNeedle;
    }

    function makeSteeringWheelForm():Form {
        var steeringWheelForm:Form = new Form('steeringWheel');
        steeringWheelForm.makeCircle(new Vector2(0,0), 0.5);
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

    function addNPCCar()
    {
        var npcCar = new Car();
        other.push(npcCar);
        npcCar.roadDir = (other.length & 1 != 0) ? -1 : 1;
        placeCar(npcCar, level.roadPath, Math.random());
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

    function resetWorld()
    {
        scr.clear();
        auto = true;
        placeCar(user, level.roadPath, 0);
        other = [];
    }

    function setLevel(index:Int)
    {
        levelID = (levelID + 1) % 4;
        level = levels[levelID];
        tint = level.tint.clone();
        resetWorld();
        scr.showMessage('Now driving through: ${level.name}', false);
    }

    // main loop
    function update()
    {
        if (scr.isKeyHit('Digit1'))
        {
            scr.showMessage([
                '[home]: return to road',
                'W,A,S,D / arrow keys: speed and steering control',
                '1: toggle help',
                '2: toggle wireframe',
                '3: toggle dashboard',
                '4: rear view',
                '5: toggle (awful) manual steer',
                '6: toggle (awful) collision detection',
                '7: toggle sky gradient',
                '8: switch driving side',
                // '9: save configuration',
                '0: toggle orthographic camera',
                // 'F11: toggle fullscreen',
                'G: greyscale palette',
                'H: random palette',
                'K: toggle palette cycling',
                'N / M: adjust view angle',
                'V / B: adjust brightness',
                'C: add other cars',
                'Q: switch environment type',
                '[ctrl]: super fast',
                '[shift]: super slow',
            ].join('\n'), true, 6);
        }
        if (scr.isKeyHit('Digit7'))
        {
            showSkyGradient = !showSkyGradient;
            scr.showMessage('sky gradient ' + (showSkyGradient ? 'on': 'off'), true);
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
        if (scr.isKeyHit('Digit8'))
        {
            laneOffset = -laneOffset;
            scr.showMessage('driving style: ' + (laneOffset < 0 ? 'North American': 'Australian'), true);
        }
        if (scr.isKeyHit('Digit6'))
        {
            collisions = !collisions;
            scr.showMessage('collision detection ' + (collisions ? 'on (crappy)': 'off'), true);
        }
        if (scr.isKeyHit('Digit5'))
        {
            auto = !auto;
            scr.showMessage(auto ? 'automatic steer' : 'manual steer', true);
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
            scr.showMessage('palette cycle ' + (cycle ? 'on' : 'off' ), true);
        }
        if (scr.isKeyHit('Digit3'))
        {
            showDashboard = !showDashboard;
            scr.showMessage('dashboard ' + (showDashboard ? 'on' : 'off' ), true);
        }
        if (scr.isKeyHit('KeyQ'))
        {
            setLevel((levelID + 1) % 4);
            user.init();
            lastTime = Timer.stamp();
        }
        if (scr.isKeyHit('Digit0'))
        {
            scr.useOrtho = !scr.useOrtho;
            scr.showMessage('orthographic camera ' + (scr.useOrtho ? 'on' : 'off' ), true);
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
        if (scr.isKeyHit('Digit2'))
        {
            scr.wireframe = !scr.wireframe;
            scr.showMessage('wireframe ' + (scr.wireframe ? 'on' : 'off'), true);
        }

        if (scr.isKeyHit('Digit4')) {
            rearView = !rearView;
            scr.showMessage('rear view ' + (rearView ? 'on' : 'off'), true);
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
            placeCar(user, level.roadPath, 0);
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
                autoDrive(user, level.roadPath);
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
                autoDrive(o, level.roadPath);
                o.advance(step);
                if (collisions)
                {
                    user.collideWithCar(o);
                }
            }

            if (collisions)
            {
                user.collideWithForm(level.wallsForm);
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

        scr.adjustPerspectiveCamera(-user.pitch * Math.PI, user.tilt * Math.PI, user.angle, zoom, rearView);

        // TODO: skybox
        // TODO: skybox.visible = !scr.useOrtho && !scr.wireframe;
        // TODO: skybox.material.vertexColors = cast (showSkyGradient ? 2 : 0);

        scr.drawLevel(level);

        var carBodiesTop:Form = new Form('carBodiesTop');
        var carBodiesBottom:Form = new Form('carBodiesBottom');
        var cars:Form = new Form('cars');
        var lights:Form = new Form('lights');
        var lightPaths:Form = new Form('lightPaths');

        if (scr.useOrtho) {
            scr.drawForm(user.form);
        }

        for (car in other) {
            scr.drawForm(car.form);
        }

        if (!scr.useOrtho && showDashboard && !rearView)    // draw dashboard
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

        if (scr.wireframe)
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
