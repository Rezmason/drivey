package ;

class Screen {

    public var rgb:Color = 1;
    public var alpha:Float = 1;
    public var width(get, never):UInt;
    public var height(get, never):UInt;
    public var bg:Color;

    public function new() {
        // TODO
    }

    public function drawShape(shape:Shape) {
        // TODO
    }

    public function clear() {
        // TODO
    }

    public function cmd(s) {
        trace(s); // TODO: replace with gradient calls?
    }

    public function setTint(fw:Color, fLow:Color, fHigh:Color) {
        // TODO
    }

    inline function get_width() {
        return 0; // TODO
    }

    inline function get_height() {
        return 0; // TODO
    }
}
