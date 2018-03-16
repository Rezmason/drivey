package js.three;

import js.html.*;

extern interface Vector
{
	function setComponent(index:Int, value:Float) : Void;
	function getComponent(index:Int) : Float;
	/**
	 * copy(v:T):T;
	 */
	function copy(v:Vector) : Vector;
	/**
	 * add(v:T):T;
	 */
	function add(v:Vector) : Vector;
	/**
	 * addVectors(a:T, b:T):T;
	 */
	function addVectors(a:Vector, b:Vector) : Vector;
	/**
	 * sub(v:T):T;
	 */
	function sub(v:Vector) : Vector;
	/**
	 * subVectors(a:T, b:T):T;
	 */
	function subVectors(a:Vector, b:Vector) : Vector;
	/**
	 * multiplyScalar(s:number):T;
	 */
	function multiplyScalar(s:Float) : Vector;
	/**
	 * divideScalar(s:number):T;
	 */
	function divideScalar(s:Float) : Vector;
	/**
	 * negate():T;
	 */
	function negate() : Vector;
	/**
	 * dot(v:T):T;
	 */
	function dot(v:Vector) : Float;
	/**
	 * lengthSq():number;
	 */
	function lengthSq() : Float;
	/**
	 * length():number;
	 */
	function length() : Float;
	/**
	 * normalize():T;
	 */
	function normalize() : Vector;
	/**
	 * NOTE: Vector4 doesn't have the property.
	 * 
	 * distanceTo(v:T):number;
	 */
	function distanceTo(v:Vector) : Float;
	/**
	 * NOTE: Vector4 doesn't have the property.
	 * 
	 * distanceToSquared(v:T):number;
	 */
	function distanceToSquared(v:Vector) : Float;
	/**
	 * setLength(l:number):T;
	 */
	function setLength(l:Float) : Vector;
	/**
	 * lerp(v:T, alpha:number):T;
	 */
	function lerp(v:Vector, alpha:Float) : Vector;
	/**
	 * equals(v:T):boolean;
	 */
	function equals(v:Vector) : Bool;
	/**
	 * clone():T;
	 */
	function clone() : Vector;
}