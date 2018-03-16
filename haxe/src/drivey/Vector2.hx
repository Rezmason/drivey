package drivey;

typedef ThreeVector2 = js.three.Vector2;

@:forward(x, y) abstract Vector2(ThreeVector2) {
    inline function unwrap():ThreeVector2 return this;
    static inline function wrap(v:js.three.Vector):Vector2 return cast v;

    public inline function new(x:Float = 0, y:Float = 0) this = new ThreeVector2(x, y);
    public inline function getAngle():Float return this.angle();
    @:op(A * B) static inline function multiplyScalar(a:Vector2, b:Float):Vector2 return wrap(a.unwrap().clone().multiplyScalar(b));
    @:op(A / B) static inline function divideScalar(a:Vector2, b:Float):Vector2 return wrap(a.unwrap().clone().divideScalar(b));
    @:op(A + B) static inline function add(a:Vector2, b:Vector2):Vector2 return wrap(a.unwrap().clone().add(b.unwrap()));
    @:op(A - B) static inline function sub(a:Vector2, b:Vector2):Vector2 return wrap(a.unwrap().clone().sub(b.unwrap()));
    @:op(-A) static inline function invert(a:Vector2):Vector2 return wrap(a.unwrap().clone().negate());
    @:op(!A) static inline function normalize(a:Vector2):Vector2 return wrap(a.unwrap().clone().normalize());
    public inline static function lerp(a:Vector2, b:Vector2, t:Float):Vector2 return wrap((new ThreeVector2()).lerpVectors(a.unwrap(), b.unwrap(), t));
    public inline function length():Float return this.length();
}
