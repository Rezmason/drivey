package drivey;

import drivey.Utils.*;

class Car
{
    public var form:Form;

    public var pos:Vector3 = new Vector3();
    public var vel:Vector3 = new Vector3();

    public var lastVel:Vector3 = new Vector3();
    public var lastPos:Vector3 = new Vector3();

    public var angle:Float;

    public var accelerate:Float; // for tilting
    public var brake:Float;

    public var tilt:Float;
    public var pitch:Float;

    public var tiltV:Float;
    public var pitchV:Float;

    public var roadDir:Int;
    public var roadPos:Float;
    public var stepVel:Float;

    public var steer:Float;
    public var steerTo:Float;
    public var steerPos:Float;
    public var steerV:Float;

    public var sliding:Bool;
    public var spin:Float; // only valid while sliding

    public var cruise:Float;

    public function new() {
        form = new Form('car'); // TODO: make car template
        init();
    }

    public function init()
    {
        pos.set(0,1,0);
        vel.set(0,0,0);
        lastVel.set(0,0,0);

        accelerate = 0;
        brake = 0;

        angle = 0;
        
        tilt = 0;
        pitch = 0;

        tiltV = 0;
        pitchV = 0;

        roadPos = 0;
        stepVel = 0;
        roadDir = -1;

        steer = 0;
        steerPos = 0;
        steerTo = 0;
        steerV = 0;

        sliding = false;
        spin = 0;
        cruise = 120 * 1000 / 3600; // 50 kph
    }

    public function collideWithCar(c:Car)
    {
        var pd = pos - c.pos;
        var vd = vel - c.vel;
        var radius = 2.0;

        var dist:Float = pd.length() - radius;
        if (dist < 0)
        {
            if ((vd ^ pd) < 0)  // closing?
            {
                vd = !pd * (vd ^ !pd) * 0.6;
                vel -= vd;
                c.vel += vd;
            }
            var push = !pd * (radius - pd.length());
            pos += push;
            c.pos -= push;
        }
        return dist;
    }

    public function collideWithForm(form:Form):Float
    {
        var nearestPoint = form.getNearestPoint(w2m(pos));
        if (nearestPoint == null) return Math.POSITIVE_INFINITY;
        var pt = m2w(nearestPoint);
        var pd = pt - new Vector3(pos.x,0,pos.z);
        var radius = 1;

        var dist = pd.length() - radius;
        if (dist < 0)   // contact?
        {
            if ((vel ^ pd) > 0) // hitting an obstacle? bounce off it
            {
                vel -= !pd * (vel ^ !pd) * 1.5;
            }
            var push = !pd * (radius - pd.length());
            pos -= push;
        }
        return dist;
    }

    public function dir()
    {
        return new Vector3(0, 0, 1).rotateY(-angle);
    }

    public function advance(t:Float)
    {
        if (t <= 0) {
            return;
        }

        var dir = new Vector3(0, 0, 1).rotateY(-angle);

        var acc = dir * accelerate * 10 + vel * - 0.1;

        var oldSpin = spin;

        var newVel:Vector3 = dir * ((vel+acc*t) ^ dir);
        if (brake >= 0.9) newVel.set(0,0,0);

        if (!sliding && (newVel - vel).length()/t > 750) // maximum acceleration allowable?
        {
            sliding = true;
        }
        else if (sliding && (newVel - vel).length()/t < 50)
        {
            sliding = false;
        }

        if (sliding)
        {
            var friction = !(newVel - vel) * 20;
            vel += friction * t;
        }

        if (!sliding)
        {
            vel = newVel;
        }

        spin = (vel ^ dir) * steerPos * (sliding ? 0.5 : 1.0);
        angle += spin * t;
        pos += vel * t;

        var velDiff = vel - lastVel;

        tiltV += ((tiltV * -0.2) + (velDiff ^ dir.rotateY(Math.PI * -0.5)) * 0.001 / t - tilt) * t * 20;
        tilt += tiltV * t;

        pitchV += ((pitchV * -0.2) + (velDiff ^ dir) * 0.001 / t - pitch) * t * 20;
        pitch += pitchV * t;

        var diff = steerTo-steerPos;

        if (abs(diff) > t * 0.05) {
            diff *= t * 0.05 / abs(diff);
        }

        steerPos += diff;

        var grav = -10;

        pos.y = lastPos.y + lastVel.y * t + 0.5 * grav * t * t;
        vel.y = lastVel.y + grav * t;

        if (pos.y < 1.5)
        {
            pos.y = 1.5;
            vel.y = 0;
        }

        lastVel = vel;
        lastPos = pos;
    }
}
