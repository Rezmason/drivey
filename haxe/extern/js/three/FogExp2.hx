package js.three;

import js.html.*;

/**
 * This class contains the parameters that define linear fog, i.e., that grows exponentially denser with the distance.
 */
@:native("THREE.FogExp2")
extern class FogExp2
	implements IFog
{
	var name : String;
	var color : Color;
	/**
	 * Defines how fast the fog will grow dense.
	 * Default is 0.00025.
	 */
	var density : Float;

	/**
	 * This class contains the parameters that define linear fog, i.e., that grows exponentially denser with the distance.
	 */
	function new(hex:haxe.extern.EitherType<Float, String>, ?density:Float) : Void;
	@:overload(function():FogExp2{})
	function clone() : IFog;
	function toJSON() : Dynamic;
}