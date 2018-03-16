package js.three;

import js.html.*;

extern interface Matrix
{
	/**
	 * Float32Array with matrix values.
	 */
	var elements : Float32Array;

	/**
	 * identity():T;
	 */
	function identity() : Matrix;
	/**
	 * copy(m:T):T;
	 */
	function copy(m:Matrix) : Matrix;
	/**
	 * multiplyScalar(s:number):T;
	 */
	function multiplyScalar(s:Float) : Matrix;
	function determinant() : Float;
	/**
	 * getInverse(matrix:T, throwOnInvertible?:boolean):T;
	 */
	function getInverse(matrix:Matrix, ?throwOnInvertible:Bool) : Matrix;
	/**
	 * transpose():T;
	 */
	function transpose() : Matrix;
	/**
	 * clone():T;
	 */
	function clone() : Matrix;
}