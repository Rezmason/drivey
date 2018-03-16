package js.three;

import js.html.*;

/**
 * Represents a color. See also {@link ColorUtils}.
 * 
 * @example
 * var color = new THREE.Color( 0xff0000 );
 * 
 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/math/Color.js">src/math/Color.js</a>
 */
@:native("THREE.Color")
extern class Color
{
	/**
	 * Red channel value between 0 and 1. Default is 1.
	 */
	var r : Float;
	/**
	 * Green channel value between 0 and 1. Default is 1.
	 */
	var g : Float;
	/**
	 * Blue channel value between 0 and 1. Default is 1.
	 */
	var b : Float;

	/**
	 * Represents a color. See also {@link ColorUtils}.
	 * 
	 * @example
	 * var color = new THREE.Color( 0xff0000 );
	 * 
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/math/Color.js">src/math/Color.js</a>
	 */
	@:overload(function(?color:String):Void{})
	@:overload(function(?color:Float):Void{})
	@:overload(function(r:Float, g:Float, b:Float):Void{})
	function new(?color:Color) : Void;
	/**
	 * Represents a color. See also {@link ColorUtils}.
	 * 
	 * @example
	 * var color = new THREE.Color( 0xff0000 );
	 * 
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/math/Color.js">src/math/Color.js</a>
	 */
	/**
	 * Represents a color. See also {@link ColorUtils}.
	 * 
	 * @example
	 * var color = new THREE.Color( 0xff0000 );
	 * 
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/math/Color.js">src/math/Color.js</a>
	 */
	/**
	 * Represents a color. See also {@link ColorUtils}.
	 * 
	 * @example
	 * var color = new THREE.Color( 0xff0000 );
	 * 
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/math/Color.js">src/math/Color.js</a>
	 */
	@:overload(function(color:Float):Color{})
	@:overload(function(color:String):Color{})
	function set(color:Color) : Color;
	function setScalar(scalar:Float) : Color;
	function setHex(hex:Int) : Color;
	/**
	 * Sets this color from RGB values.
	 */
	function setRGB(r:Float, g:Float, b:Float) : Color;
	/**
	 * Sets this color from HSL values.
	 * Based on MochiKit implementation by Bob Ippolito.
	 */
	function setHSL(h:Float, s:Float, l:Float) : Color;
	/**
	 * Sets this color from a CSS context style string.
	 */
	function setStyle(style:String) : Color;
	/**
	 * Clones this color.
	 */
	function clone() : Color;
	/**
	 * Copies given color.
	 */
	function copy(color:Color) : Color;
	/**
	 * Copies given color making conversion from gamma to linear space.
	 */
	function copyGammaToLinear(color:Color, ?gammaFactor:Float) : Color;
	/**
	 * Copies given color making conversion from linear to gamma space.
	 */
	function copyLinearToGamma(color:Color, ?gammaFactor:Float) : Color;
	/**
	 * Converts this color from gamma to linear space.
	 */
	function convertGammaToLinear() : Color;
	/**
	 * Converts this color from linear to gamma space.
	 */
	function convertLinearToGamma() : Color;
	/**
	 * Returns the hexadecimal value of this color.
	 */
	function getHex() : Int;
	/**
	 * Returns the string formated hexadecimal value of this color.
	 */
	function getHexString() : String;
	function getHSL() : HSL;
	/**
	 * Returns the value of this color in CSS context style.
	 * Example: rgb(r, g, b)
	 */
	function getStyle() : String;
	function offsetHSL(h:Float, s:Float, l:Float) : Color;
	function add(color:Color) : Color;
	function addColors(color1:Color, color2:Color) : Color;
	function addScalar(s:Float) : Color;
	function sub(color:Color) : Color;
	function multiply(color:Color) : Color;
	function multiplyScalar(s:Float) : Color;
	function lerp(color:Color, alpha:Float) : Color;
	function equals(color:Color) : Bool;
	function fromArray(rgb:Array<Float>, ?offset:Float) : Color;
	function toArray(?array:Array<Float>, ?offset:Float) : Array<Float>;
}