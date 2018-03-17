package drivey;

class Shape {

    public var rgb:Color = 1;
    public var alpha:Float = 1;
    public var height:Float = 0;
    public var extrude:Float = 0;

    public function new() {
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

    public function addControlXY(x:Float, y:Float) {
        addControl(new Vector2(x, y));
    }

    public function addControl(xy:Vector2) {
        // TODO
    }

    public function closePath() {
        // TODO
    }

    public function clone():Shape {
        return new Shape(); // TODO
    }

    public function merge(otherShape:Shape) {
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

    public function getPath(index:UInt):Path {
        return new Path(); // TODO
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

    public function getNearestPoint(xy:Vector2):Vector2 {
        return new Vector2(); // TODO
    }

    public function invert() {
        // Probably reverses the drawing order of the vertices, etc
    }

    public function outline(thickness:Float) {
        // TODO
    }
}
