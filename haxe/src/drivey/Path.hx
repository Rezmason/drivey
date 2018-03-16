package drivey;

class Path {

    public var length(get, never):UInt;
    
    public function new() {
        // TODO
    }

    public function stepInterval(amount:Float, t:Float):Float {
        return 0; // TODO
    }

    public function getPoint(t:Float):Point {
        return null; // TODO
    }

    public function getNormal(t:Float):Point {
        return null; // TODO
    }

    public function getTangent(t:Float):Point {
        return null; // TODO
    }

    public function getNearest(to:Point):Float {
        return 0; // TODO
    }

    public function scaleUniform(amount:Float) {
        // TODO
    }

    public function getNearestPoint(xy:Point):Point {
        return null; // TODO
    }

    public function clone():Path {
        return null; // TODO
    }

    public function scale(xy:Point) {
        // TODO
    }

    function get_length() {
        return 0; // TODO
    }
}
