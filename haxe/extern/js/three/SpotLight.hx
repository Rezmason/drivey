package js.three;

import js.html.*;

/**
 * A point light that can cast shadow in one direction.
 */
@:native("THREE.SpotLight")
extern class SpotLight extends Light
{
	/**
	 * Spotlight focus points at target.position.
	 * Default position — (0,0,0).
	 */
	var target : Object3D;
	/**
	 * Light's intensity.
	 * Default — 1.0.
	 */
	//var intensity : Float;
	/**
	 * If non-zero, light will attenuate linearly from maximum intensity at light position down to zero at distance.
	 * Default — 0.0.
	 */
	var distance : Float;
	var angle : Float;
	/**
	 * Rapidity of the falloff of light from its target direction.
	 * Default — 10.0.
	 */
	var exponent : Float;
	var decay : Float;
	//var shadow : SpotLightShadow;
	var power : Float;
	var penumbra : Float;

	/**
	 * A point light that can cast shadow in one direction.
	 */
	@:overload(function(?hex:haxe.extern.EitherType<Float,String>,?intensity:Float,?distance:Float,?angle:Float,?exponent:Float,?decay:Float):Void{})
	function new() : Void;
}