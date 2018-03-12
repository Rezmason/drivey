package ;

@:forward(r, g, b) abstract Color({r:Float, g:Float, b:Float}) {
    public inline function new(r:Float = 0, g:Float = 0, b:Float = 0) this = {r:r, g:g, b:b};
    public inline function brightness():Float return Math.max(this.r, Math.max(this.g, this.b));
    @:from static inline function fromFloat(value:Float):Color return new Color(value, value, value);
    @:op(A * B) static inline function scalarMultiply(a:Color, b:Float):Color return new Color(a.r * b, a.g * b, a.b * b);
    @:op(A+B) static inline function add(a:Color, b:Color) return new Color(a.r + b.r, a.g + b.g, a.b + b.b);
    public inline function clone() return new Color(this.r, this.g, this.b);
    public inline static function mix(a:Color, b:Color, t:Float) { return a*(1-t) + b*t; }
    public inline function toUInt():UInt return (Std.int(this.r * 0xFF) << 16) | (Std.int(this.g * 0xFF) << 8) | (Std.int(this.b * 0xFF) << 0);
}
