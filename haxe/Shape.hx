package ;

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
        addVertex(new Point(x, y));
    }

    public function addVertex(xy:Point) {
        // TODO
    }

    public function addControlXY(x:Float, y:Float) {
        addControl(new Point(x, y));
    }

    public function addControl(xy:Point) {
        // TODO
    }

    public function closePath() {
        // TODO
    }

    public function clone():Shape {
        return null; // TODO
    }

    public function merge(otherShape:Shape) {
        // TODO
    }

    public function expand(amount:Float) {
        // TODO
    }

    public function scale(xy:Point) {
        // TODO
    }

    public function scaleUniform(amount:Float) {
        // TODO
    }

    public function move(xy:Point) {
        // TODO
    }

    public function rotate(amount:Float) {
        // TODO
    }

    public function project(vo:Vector, vx:Vector, vy:Vector, vz:Vector = null) {
        // TODO
    }

    public function getPath(index:UInt):Path {
        return null; // TODO
    }

    public function hasPaths():Bool {
        return false; // TODO
    }

    public function makeCircle(xy:Point, radius:Float) {
        // TODO
    }

    public function makeUnit() {
        // TODO
    }

    public function getRect():Rect {
        return null; // TODO
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

    public function getNearestPoint(xy:Point):Point {
        return null; // TODO
    }

    public function invert() {
        // Probably reverses the drawing order of the vertices, etc
    }

    public function outline(thickness:Float) {
        // TODO
    }
}
