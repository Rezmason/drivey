package js.three;

import js.html.*;

/**
 * 2D vector.
 * 
 * ( class Vector2 implements Vector<Vector2> )
 */
@:native("THREE.Vector2")
extern class Vector2
	implements Vector
{
	var x : Float;
	var y : Float;
	var width : Float;
	var height : Float;

	/**
	 * 2D vector.
	 * 
	 * ( class Vector2 implements Vector<Vector2> )
	 */
	function new(?x:Float, ?y:Float) : Void;
	/**
	 * Sets value of this vector.
	 */
	function set(x:Float, y:Float) : Vector2;
	function setScalar(scalar:Float) : Vector2;
	/**
	 * Sets X component of this vector.
	 */
	function setX(x:Float) : Vector2;
	/**
	 * Sets Y component of this vector.
	 */
	function setY(y:Float) : Vector2;
	/**
	 * Sets a component of this vector.
	 */
	function setComponent(index:Int, value:Float) : Void;
	/**
	 * Gets a component of this vector.
	 */
	function getComponent(index:Int) : Float;
	/**
	 * Clones this vector.
	 */
	@:overload(function():Vector2{})
	function clone() : Vector;
	/**
	 * Copies value of v to this vector.
	 */
	@:overload(function(v:Vector2):Vector2{})
	function copy(v:Vector) : Vector;
	/**
	 * Adds v to this vector.
	 */
	@:overload(function(v:Vector2):Vector2{})
	function add(v:Vector) : Vector;
	/**
	 * Sets this vector to a + b.
	 */
	function addScalar(s:Float) : Vector2;
	@:overload(function(a:Vector2,b:Vector2):Vector2{})
	function addVectors(a:Vector, b:Vector) : Vector;
	function addScaledVector(v:Vector2, s:Float) : Vector2;
	/**
	 * Subtracts v from this vector.
	 */
	@:overload(function(v:Vector2):Vector2{})
	function sub(v:Vector) : Vector;
	/**
	 * Sets this vector to a - b.
	 */
	@:overload(function(a:Vector2,b:Vector2):Vector2{})
	function subVectors(a:Vector, b:Vector) : Vector;
	function multiply(v:Vector2) : Vector2;
	/**
	 * Multiplies this vector by scalar s.
	 */
	@:overload(function(scalar:Float):Vector2{})
	function multiplyScalar(s:Float) : Vector;
	function divide(v:Vector2) : Vector2;
	/**
	 * Divides this vector by scalar s.
	 * Set vector to ( 0, 0 ) if s == 0.
	 */
	@:overload(function(s:Float):Vector2{})
	function divideScalar(s:Float) : Vector;
	function min(v:Vector2) : Vector2;
	function max(v:Vector2) : Vector2;
	function clamp(min:Vector2, max:Vector2) : Vector2;
	function clampScalar(min:Float, max:Float) : Vector2;
	function clampLength(min:Float, max:Float) : Vector2;
	function floor() : Vector2;
	function ceil() : Vector2;
	function round() : Vector2;
	function roundToZero() : Vector2;
	/**
	 * Inverts this vector.
	 */
	@:overload(function():Vector2{})
	function negate() : Vector;
	/**
	 * Computes dot product of this vector and v.
	 */
	@:overload(function(v:Vector2):Float{})
	function dot(v:Vector) : Float;
	/**
	 * Computes squared length of this vector.
	 */
	function lengthSq() : Float;
	/**
	 * Computes length of this vector.
	 */
	function length() : Float;
	function lengthManhattan() : Float;
	/**
	 * Normalizes this vector.
	 */
	@:overload(function():Vector2{})
	function normalize() : Vector;
	/**
	 * computes the angle in radians with respect to the positive x-axis
	 */
	function angle() : Float;
	/**
	 * Computes distance of this vector to v.
	 */
	@:overload(function(v:Vector2):Float{})
	function distanceTo(v:Vector) : Float;
	/**
	 * Computes squared distance of this vector to v.
	 */
	@:overload(function(v:Vector2):Float{})
	function distanceToSquared(v:Vector) : Float;
	function distanceToManhattan(v:Vector2) : Float;
	/**
	 * Normalizes this vector and multiplies it by l.
	 */
	@:overload(function(length:Float):Vector2{})
	function setLength(l:Float) : Vector;
	@:overload(function(v:Vector2,alpha:Float):Vector2{})
	function lerp(v:Vector, alpha:Float) : Vector;
	function lerpVectors(v1:Vector2, v2:Vector2, alpha:Float) : Vector2;
	/**
	 * Checks for strict equality of this vector and v.
	 */
	@:overload(function(v:Vector2):Bool{})
	function equals(v:Vector) : Bool;
	function fromArray(xy:Array<Float>, ?offset:Float) : Vector2;
	function toArray(?xy:Array<Float>, ?offset:Float) : Array<Float>;
	function fromBufferAttribute(attribute:BufferAttribute, index:Int, ?offset:Float) : Vector2;
	function rotateAround(center:Vector2, angle:Float) : Vector2;
}