package drivey;

typedef ThreeVector3 = js.three.Vector3;

class Vector3Axes {
    public static var X_AXIS:ThreeVector3 = new ThreeVector3(1, 0, 0);
    public static var Y_AXIS:ThreeVector3 = new ThreeVector3(1, 0, 0);
    public static var Z_AXIS:ThreeVector3 = new ThreeVector3(1, 0, 0);
}

@:forward(x, y, z) abstract Vector3(ThreeVector3) {
    inline function unwrap():ThreeVector3 return this;
    static inline function wrap(v:js.three.Vector):Vector3 return cast v;
    public inline function new(x:Float = 0, y:Float = 0, z:Float = 0) this = new ThreeVector3(x, y, z);
    public inline function set(x:Float, y:Float, z:Float) this.set(x, y, z);
    public function rotateX(amount:Float):Vector3 return wrap(this.applyAxisAngle(Vector3Axes.X_AXIS, amount));
    public function rotateY(amount:Float):Vector3 return wrap(this.applyAxisAngle(Vector3Axes.Y_AXIS, amount));
    public function rotateZ(amount:Float):Vector3 return wrap(this.applyAxisAngle(Vector3Axes.Z_AXIS, amount));
    @:from static inline function fromPoint(value:Vector2):Vector3 return new Vector3(value.x, value.y);
    @:to inline function toPoint():Vector2 return new Vector2(this.x, this.y);
    public inline function clone():Vector3 return wrap(this.clone());
    @:op(A * B) static inline function multiplyScalar(a:Vector3, b:Float):Vector3 return wrap(a.unwrap().clone().multiplyScalar(b));
    @:op(A / B) static inline function divideScalar(a:Vector3, b:Float):Vector3 return wrap(a.unwrap().clone().divideScalar(b));
    @:op(A + B) static inline function add(a:Vector3, b:Vector3):Vector3 return wrap(a.unwrap().clone().add(b.unwrap()));
    @:op(A - B) static inline function sub(a:Vector3, b:Vector3):Vector3 return wrap(a.unwrap().clone().sub(b.unwrap()));
    @:op(-A) static inline function invert(a:Vector3):Vector3 return wrap(a.unwrap().clone().negate());
    @:op(!A) static inline function normalize(a:Vector3):Vector3 return wrap(a.unwrap().clone().normalize());
    public inline static function lerp(a:Vector3, b:Vector3, t:Float):Vector3 return wrap((new ThreeVector3()).lerpVectors(a.unwrap(), b.unwrap(), t));
    public inline function length():Float return this.length();
    @:op(A ^ B) static inline function dot(a:Vector3, b:Vector3):Float return a.unwrap().clone().dot(b.unwrap());
    @:op(A * B) static inline function cross(a:Vector3, b:Vector3):Vector3 return wrap((new ThreeVector3()).crossVectors(a.unwrap(), b.unwrap()));
}
