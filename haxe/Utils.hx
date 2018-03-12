package ;

class Utils {
    public static function min(a:Float, b:Float) { if (a < b) return a; return b; }
    public static function max(a:Float, b:Float) { if (b < a) return a; return b; }
    public static function mix(a:Float, b:Float, t:Float) { return a*(1-t) + b*t; }
    public static function abs(a:Float) { if (a < 0) return -a; return a; }
    public static function sign(a:Float) { if (a < 0) return -1; return 1; }
    
    public static function bar(a:Float):Float {
        return 0; // TODO
    }

    public static function m2w(p:Point) { return new Vector(p.x, 0, p.y); }
    public static function w2m(p:Vector) { return new Point(p.x, p.z); }
}
