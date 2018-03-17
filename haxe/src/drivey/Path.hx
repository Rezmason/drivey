package drivey;

class Path {

    public var length(get, never):UInt;
    
    public function new() {
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
        return 0; // TODO
    }

    public function scaleUniform(amount:Float) {
        // TODO
    }

    public function getNearestPoint(xy:Vector2):Vector2 {
        return new Vector2(); // TODO
    }

    public function clone():Path {
        return new Path(); // TODO
    }

    public function scale(xy:Vector2) {
        // TODO
    }

    function get_length() {
        return 0; // TODO
    }
}
