package drivey;

typedef ThreeShape = js.three.Shape;

class Form {

    public var rgb:Color = 1;
    public var alpha:Float = 1;
    public var height:Float = 0;
    public var extrude:Float = 0;
    public var length(get, never):UInt;
    public var id(default, null):String;
    
    public function new(id:String) this.id = id;

    public function addSplineCurve(points:Array<Vector2>, closed:Bool) { /* TODO */ }
    public function addPolyLine(points:Array<Vector2>, closed:Bool) { /* TODO */ }
    
    public function clone(id:String):Form { return new Form(id); /* TODO */ }
    public function merge(otherForm:Form) { /* TODO */ }
    public function expand(amount:Float) { /* TODO */ }
    public function scale(xy:Vector2) { /* TODO */ }
    public function scaleUniform(amount:Float) { /* TODO */ }
    public function move(xy:Vector2) { /* TODO */ }
    public function rotate(amount:Float) { /* TODO */ }
    public function makeCircle(xy:Vector2, radius:Float) { /* TODO */ }
    public function makeUnit() { /* TODO */ }
    public function getRect():Rect { return new Rect(); /* TODO */ }
    public function recenter() move(-getRect().center);

    public function invert() { /* Probably reverses the drawing order of the vertices, etc */ }
    public function outline(thickness:Float) { /* TODO */ }
    public function getPoint(t:Float):Vector2 { return new Vector2(); /* TODO */ }
    public function getNormal(t:Float):Vector2 { return new Vector2(); /* TODO */ }
    public function getTangent(t:Float):Vector2 { return new Vector2(); /* TODO */ }
    public function getNearest(to:Vector2):Float { /* approx[Utils.minDistSquaredIndex(approx, xy)]; */ return 0; /* TODO */ }
    public function getNearestPoint(xy:Vector2):Vector2 { /* approx[Utils.minDistSquaredIndex(approx, xy)]; */ return new Vector2(); /* TODO */ }
    public function resetTransform() { /* TODO */ }
    
    function get_length() { return 0; /* TODO */ }

    public function boxFit()
    {
        var rc:Rect = getRect();
        if (rc.isEmpty()) {
            return;
        }

        move(-rc.lo);
        var scaleBy = rc.hi - rc.lo;

        if (scaleBy.x > 0) {
            scaleBy.x = 1.0/scaleBy.x;
        }

        if (scaleBy.y > 0) {
            scaleBy.y = 1.0/scaleBy.y;
        }

        scale(scaleBy);
    }
}
