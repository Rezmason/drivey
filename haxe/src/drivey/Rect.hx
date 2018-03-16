package drivey;

class Rect {

    public var hi(get, never):Vector2;
    public var lo(get, never):Vector2;
    public var center(get, never):Vector2;
    public var x:Float;
    public var y:Float;
    public var width:Float;
    public var height:Float;

    public function new(x:Float = 0, y:Float = 0, width:Float = 0, height:Float = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    function get_hi():Vector2 {
        return new Vector2(x + width, y + height);
    }

    function get_lo():Vector2 {
        return new Vector2(x, y);
    }

    function get_center():Vector2 {
        return new Vector2(x + width / 2, y + height / 2);
    }

    public function isEmpty() {
        return width == 0 || height == 0;
    }
}
