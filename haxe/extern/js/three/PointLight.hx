package js.three;

import js.html.*;

/**
 * Affects objects using {@link MeshLambertMaterial} or {@link MeshPhongMaterial}.
 * 
 * @example
 * var light = new THREE.PointLight( 0xff0000, 1, 100 );
 * light.position.set( 50, 50, 50 );
 * scene.add( light );
 */
@:native("THREE.PointLight")
extern class PointLight extends Light
{
	//var intensity : Float;
	/**
	 * If non-zero, light will attenuate linearly from maximum intensity at light position down to zero at distance.
	 * Default — 0.0.
	 */
	var distance : Float;
	var decay : Float;
	//var shadow : LightShadow;
	var power : Float;

	/**
	 * Affects objects using {@link MeshLambertMaterial} or {@link MeshPhongMaterial}.
	 * 
	 * @example
	 * var light = new THREE.PointLight( 0xff0000, 1, 100 );
	 * light.position.set( 50, 50, 50 );
	 * scene.add( light );
	 */
	@:overload(function(?hex:haxe.extern.EitherType<Float,String>,?intensity:Float,?distance:Float,?decay:Float):Void{})
	function new() : Void;
}