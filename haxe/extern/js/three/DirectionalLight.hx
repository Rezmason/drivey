package js.three;

import js.html.*;

/**
 * Affects objects using MeshLambertMaterial or MeshPhongMaterial.
 * 
 * @example
 * // White directional light at half intensity shining from the top.
 * var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
 * directionalLight.position.set( 0, 1, 0 );
 * scene.add( directionalLight );
 * 
 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/lights/DirectionalLight.js">src/lights/DirectionalLight.js</a>
 */
@:native("THREE.DirectionalLight")
extern class DirectionalLight extends Light
{
	/**
	 * Target used for shadow camera orientation.
	 */
	var target : Object3D;
	/**
	 * Light's intensity.
	 * Default — 1.0.
	 */
	//var intensity : Float;
	//var shadow : LightShadow;

	/**
	 * Affects objects using MeshLambertMaterial or MeshPhongMaterial.
	 * 
	 * @example
	 * // White directional light at half intensity shining from the top.
	 * var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	 * directionalLight.position.set( 0, 1, 0 );
	 * scene.add( directionalLight );
	 * 
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/lights/DirectionalLight.js">src/lights/DirectionalLight.js</a>
	 */
	@:overload(function(?hex:haxe.extern.EitherType<Float,String>,?intensity:Float):Void{})
	function new() : Void;
}