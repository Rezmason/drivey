package js.three;

import js.html.*;

/**
 * 3D vector.
 * 
 * @example
 * var a = new THREE.Vector3( 1, 0, 0 );
 * var b = new THREE.Vector3( 0, 1, 0 );
 * var c = new THREE.Vector3();
 * c.crossVectors( a, b );
 * 
 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/math/Vector3.js">src/math/Vector3.js</a>
 * 
 * ( class Vector3 implements Vector<Vector3> )
 */
@:native("THREE.Vector3")
extern class Vector3
	implements Vector
{
	var x : Float;
	var y : Float;
	var z : Float;

	/**
	 * 3D vector.
	 * 
	 * @example
	 * var a = new THREE.Vector3( 1, 0, 0 );
	 * var b = new THREE.Vector3( 0, 1, 0 );
	 * var c = new THREE.Vector3();
	 * c.crossVectors( a, b );
	 * 
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/math/Vector3.js">src/math/Vector3.js</a>
	 * 
	 * ( class Vector3 implements Vector<Vector3> )
	 */
	function new(?x:Float, ?y:Float, ?z:Float) : Void;
	/**
	 * Sets value of this vector.
	 */
	function set(x:Float, y:Float, z:Float) : Vector3;
	/**
	 * Sets all values of this vector.
	 */
	function setScalar(scalar:Float) : Vector3;
	/**
	 * Sets x value of this vector.
	 */
	function setX(x:Float) : Vector3;
	/**
	 * Sets y value of this vector.
	 */
	function setY(y:Float) : Vector3;
	/**
	 * Sets z value of this vector.
	 */
	function setZ(z:Float) : Vector3;
	function setComponent(index:Int, value:Float) : Void;
	function getComponent(index:Int) : Float;
	/**
	 * Clones this vector.
	 */
	@:overload(function():Vector3{})
	function clone() : Vector;
	/**
	 * Copies value of v to this vector.
	 */
	@:overload(function(v:Vector3):Vector3{})
	function copy(v:Vector) : Vector;
	/**
	 * Adds v to this vector.
	 */
	@:overload(function(a:Vector3):Vector3{})
	function add(v:Vector) : Vector;
	function addScalar(s:Float) : Vector3;
	function addScaledVector(v:Vector3, s:Float) : Vector3;
	/**
	 * Sets this vector to a + b.
	 */
	@:overload(function(a:Vector3,b:Vector3):Vector3{})
	function addVectors(a:Vector, b:Vector) : Vector;
	/**
	 * Subtracts v from this vector.
	 */
	@:overload(function(a:Vector3):Vector3{})
	function sub(v:Vector) : Vector;
	function subScalar(s:Float) : Vector3;
	/**
	 * Sets this vector to a - b.
	 */
	@:overload(function(a:Vector3,b:Vector3):Vector3{})
	function subVectors(a:Vector, b:Vector) : Vector;
	function multiply(v:Vector3) : Vector3;
	/**
	 * Multiplies this vector by scalar s.
	 */
	@:overload(function(s:Float):Vector3{})
	function multiplyScalar(s:Float) : Vector;
	function multiplyVectors(a:Vector3, b:Vector3) : Vector3;
	function applyEuler(euler:Euler) : Vector3;
	function applyAxisAngle(axis:Vector3, angle:Float) : Vector3;
	function applyMatrix3(m:Matrix3) : Vector3;
	function applyMatrix4(m:Matrix4) : Vector3;
	function applyQuaternion(q:Quaternion) : Vector3;
	function project(camrea:Camera) : Vector3;
	function unproject(camera:Camera) : Vector3;
	function transformDirection(m:Matrix4) : Vector3;
	function divide(v:Vector3) : Vector3;
	/**
	 * Divides this vector by scalar s.
	 * Set vector to ( 0, 0, 0 ) if s == 0.
	 */
	@:overload(function(s:Float):Vector3{})
	function divideScalar(s:Float) : Vector;
	function min(v:Vector3) : Vector3;
	function max(v:Vector3) : Vector3;
	function clamp(min:Vector3, max:Vector3) : Vector3;
	function clampScalar(min:Float, max:Float) : Vector3;
	function clampLength(min:Float, max:Float) : Vector3;
	function floor() : Vector3;
	function ceil() : Vector3;
	function round() : Vector3;
	function roundToZero() : Vector3;
	/**
	 * Inverts this vector.
	 */
	@:overload(function():Vector3{})
	function negate() : Vector;
	/**
	 * Computes dot product of this vector and v.
	 */
	@:overload(function(v:Vector3):Float{})
	function dot(v:Vector) : Float;
	/**
	 * Computes squared length of this vector.
	 */
	function lengthSq() : Float;
	/**
	 * Computes length of this vector.
	 */
	function length() : Float;
	/**
	 * Computes Manhattan length of this vector.
	 * http://en.wikipedia.org/wiki/Taxicab_geometry
	 */
	function lengthManhattan() : Float;
	/**
	 * Normalizes this vector.
	 */
	@:overload(function():Vector3{})
	function normalize() : Vector;
	/**
	 * Normalizes this vector and multiplies it by l.
	 */
	@:overload(function(l:Float):Vector3{})
	function setLength(l:Float) : Vector;
	@:overload(function(v:Vector3,alpha:Float):Vector3{})
	function lerp(v:Vector, alpha:Float) : Vector;
	function lerpVectors(v1:Vector3, v2:Vector3, alpha:Float) : Vector3;
	/**
	 * Sets this vector to cross product of itself and v.
	 */
	function cross(a:Vector3) : Vector3;
	/**
	 * Sets this vector to cross product of a and b.
	 */
	function crossVectors(a:Vector3, b:Vector3) : Vector3;
	function projectOnVector(v:Vector3) : Vector3;
	function projectOnPlane(planeNormal:Vector3) : Vector3;
	function reflect(vector:Vector3) : Vector3;
	function angleTo(v:Vector3) : Float;
	/**
	 * Computes distance of this vector to v.
	 */
	@:overload(function(v:Vector3):Float{})
	function distanceTo(v:Vector) : Float;
	/**
	 * Computes squared distance of this vector to v.
	 */
	@:overload(function(v:Vector3):Float{})
	function distanceToSquared(v:Vector) : Float;
	function distanceToManhattan(v:Vector3) : Float;
	function setFromSpherical(s:Spherical) : Vector3;
	function setFromMatrixPosition(m:Matrix4) : Vector3;
	function setFromMatrixScale(m:Matrix4) : Vector3;
	function setFromMatrixColumn(matrix:Matrix4, index:Int) : Vector3;
	/**
	 * Checks for strict equality of this vector and v.
	 */
	@:overload(function(v:Vector3):Bool{})
	function equals(v:Vector) : Bool;
	function fromArray(xyz:Array<Float>, ?offset:Float) : Vector3;
	function toArray(?xyz:Array<Float>, ?offset:Float) : Array<Float>;
	function fromBufferAttribute(attribute:BufferAttribute, index:Int, ?offset:Float) : Vector3;
	/**
	 * @deprecated
	 */
	function getPositionFromMatrix(m:Matrix4) : Vector3;
	function getScaleFromMatrix(m:Matrix4) : Vector3;
	function getColumnFromMatrix(index:Int, matrix:Matrix4) : Vector3;
}