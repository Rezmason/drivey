package ;

@:forward(x, y) abstract Point({x:Float, y:Float}) {
    public var magnitude(get, never):Float;
    public inline function new(x:Float = 0, y:Float = 0) this = {x:x, y:y};
    public inline function getAngle():Float return Math.atan2(this.y, this.x);
    @:op(A * B) static inline function scalarMultiply(a:Point, b:Float):Point return new Point(a.x * b, a.y * b);
    @:op(A / B) static inline function scalarDivide(a:Point, b:Float):Point return scalarMultiply(a, 1 / b);
    @:op(A + B) static inline function add(a:Point, b:Point):Point return new Point(a.x + b.x, a.y + b.y);
    @:op(A - B) static inline function subtract(a:Point, b:Point):Point return new Point(a.x - b.x, a.y - b.y);
    @:op(-A) static inline function invert(a:Point):Point return new Point(-a.x, -a.y);
    public inline static function mix(a:Point, b:Point, t:Float) return a*(1-t) + b*t;
    inline function get_magnitude():Float return Math.sqrt(this.x * this.x + this.y * this.y);
    @:op(!A) static inline function normalize(a:Point):Point {
        var mag = a.magnitude;
        return new Point(a.x / mag, a.y / mag);
    }
}
