package drivey;

typedef ThreeShape = js.three.Shape;

class Form {

    public var rgb:Color = 1;
    public var alpha:Float = 1;
    public var height:Float = 0;
    public var extrude:Float = 0;
    public var length(get, never):UInt;
    public var id(default, null):String;
    
    public function new(id:String) {
        this.id = id;
        // TODO
    }

    public function init() {
        // TODO
    }

    public function addVertexXY(x:Float, y:Float) {
        addVertex(new Vector2(x, y));
    }

    public function addVertex(xy:Vector2) {
        // TODO
    }

    public function addControl(xy:Vector2) {
        // TODO
    }

    public function addSplineCurve(points:Array<Vector2>, closed:Bool) {
        // TODO
    }

    public function closePath() {
        // TODO
    }

    public function clone(id:String):Form {
        return new Form(id); // TODO
    }

    public function merge(otherForm:Form) {
        // TODO
    }

    public function expand(amount:Float) {
        // TODO
    }

    public function scale(xy:Vector2) {
        // TODO
    }

    public function scaleUniform(amount:Float) {
        // TODO
    }

    public function move(xy:Vector2) {
        // TODO
    }

    public function rotate(amount:Float) {
        // TODO
    }

    public function project(vo:Vector3, vx:Vector3, vy:Vector3, vz:Vector3 = null) {
        // TODO
    }

    public function hasPaths():Bool {
        return false; // TODO
    }

    public function makeCircle(xy:Vector2, radius:Float) {
        // TODO
    }

    public function makeUnit() {
        // TODO
    }

    public function getRect():Rect {
        return new Rect(); // TODO
    }

    public function recenter()
    {
        move(-getRect().center);
    }

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

    public function invert() {
        // Probably reverses the drawing order of the vertices, etc
    }

    public function outline(thickness:Float) {
        // TODO
    }





    public function stepInterval(amount:Float, t:Float):Float {
        return 0; // TODO
    }

    public function getPoint(t:Float):Vector2 {
        return new Vector2(); // TODO
    }

    public function getNormal(t:Float):Vector2 {
        return new Vector2(); // TODO
    }

    public function getTangent(t:Float):Vector2 {
        return new Vector2(); // TODO
    }

    public function getNearest(to:Vector2):Float {
        // approx[Utils.minDistSquaredIndex(approx, xy)];
        return 0; // TODO
    }

    public function getNearestPoint(xy:Vector2):Vector2 {
        // approx[Utils.minDistSquaredIndex(approx, xy)];
        return new Vector2(); // TODO
    }

    function get_length() {
        return 0; // TODO
    }
}
