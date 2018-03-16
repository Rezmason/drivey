package drivey;

typedef ThreeColor = js.three.Color;

@:forward(r, g, b) abstract Color(ThreeColor) {
    inline function unwrap():ThreeColor return this;
    static inline function wrap(c:ThreeColor):Color return cast c;
    public inline function new(r:Float = 0, g:Float = 0, b:Float = 0) this = new ThreeColor(r, g, b);
    public inline function brightness():Float return Math.max(this.r, Math.max(this.g, this.b));
    @:from static inline function fromFloat(value:Float):Color return new Color(value, value, value);
    @:op(A * B) static inline function multiplyScalar(a:Color, b:Float):Color return wrap(a.unwrap().clone().multiplyScalar(b));
    @:op(A + B) static inline function add(a:Color, b:Color):Color return wrap(a.unwrap().clone().add(b.unwrap()));
    public inline function clone():Color return wrap(this.clone());
    public inline static function lerp(a:Color, b:Color, t:Float):Color return wrap(a.unwrap().clone().lerp(b.unwrap(), t));
    public inline function getHex():UInt return this.getHex();
}
