package js.three;

import js.html.*;

/**
 * ( class Matrix3 implements Matrix&lt;Matrix3&gt; )
 */
@:native("THREE.Matrix3")
extern class Matrix3
	implements Matrix
{
	/**
	 * Float32Array with matrix values.
	 */
	var elements : Float32Array;

	/**
	 * ( class Matrix3 implements Matrix&lt;Matrix3&gt; )
	 */
	function new() : Void;
	function set(n11:Float, n12:Float, n13:Float, n21:Float, n22:Float, n23:Float, n31:Float, n32:Float, n33:Float) : Matrix3;
	@:overload(function():Matrix3{})
	function identity() : Matrix;
	@:overload(function():Matrix3{})
	function clone() : Matrix;
	@:overload(function(m:Matrix3):Matrix3{})
	function copy(m:Matrix) : Matrix;
	function setFromMatrix4(m:Matrix4) : Matrix3;
	function applyToBuffer(buffer:BufferAttribute, ?offset:Float, ?length:Float) : BufferAttribute;
	@:overload(function(s:Float):Matrix3{})
	function multiplyScalar(s:Float) : Matrix;
	function determinant() : Float;
	@:overload(function(matrix:Matrix3,?throwOnDegenerate:Bool):Matrix3{})
	@:overload(function(matrix:Matrix, ?throwOnInvertible:Bool):Matrix{})
	function getInverse(matrix:Matrix, ?throwOnInvertible:Bool) : Matrix;
	/**
	 * Transposes this matrix in place.
	 */
	@:overload(function():Matrix3{})
	function transpose() : Matrix;
	function getNormalMatrix(matrix4:Matrix4) : Matrix3;
	/**
	 * Transposes this matrix into the supplied array r, and returns itself.
	 */
	function transposeIntoArray(r:Array<Float>) : Array<Float>;
	function fromArray(array:Array<Float>, ?offset:Float) : Matrix3;
	function toArray() : Array<Float>;
	/**
	 * @deprecated
	 */
	function multiplyVector3(vector:Vector3) : Dynamic;
	function multiplyVector3Array(a:Dynamic) : Dynamic;
	@:overload(function(matrix:Matrix4,?throwOnDegenerate:Bool):Matrix3{})
	function flattenToArrayOffset(array:Array<Float>, offset:Float) : Array<Float>;
}