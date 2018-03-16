package js.three;

import js.html.*;

@:native("THREE.Math")
extern class Math
{
	static var DEG2RAD(default, null) : Float;
	static var RAD2DEG(default, null) : Float;

	static function generateUUID() : String;
	/**
	 * Clamps the x to be between a and b.
	 */
	static function clamp(value:Float, min:Float, max:Float) : Float;
	static function euclideanModulo(n:Int, m:Float) : Float;
	/**
	 * Linear mapping of x from range [a1, a2] to range [b1, b2].
	 */
	static function mapLinear(x:Float, a1:Float, a2:Float, b1:Float, b2:Float) : Float;
	static function smoothstep(x:Float, min:Float, max:Float) : Float;
	static function smootherstep(x:Float, min:Float, max:Float) : Float;
	/**
	 * Random float from 0 to 1 with 16 bits of randomness.
	 * Standard Math.random() creates repetitive patterns when applied over larger space.
	 * @deprecated Use Math.random()
	 */
	static function random16() : Float;
	/**
	 * Random integer from low to high interval.
	 */
	static function randInt(low:Float, high:Float) : Float;
	/**
	 * Random float from low to high interval.
	 */
	static function randFloat(low:Float, high:Float) : Float;
	/**
	 * Random float from - range / 2 to range / 2 interval.
	 */
	static function randFloatSpread(range:Float) : Float;
	static function degToRad(degrees:Float) : Float;
	static function radToDeg(radians:Float) : Float;
	static function isPowerOfTwo(value:Float) : Bool;
	static function nearestPowerOfTwo(value:Float) : Float;
	static function nextPowerOfTwo(value:Float) : Float;
}