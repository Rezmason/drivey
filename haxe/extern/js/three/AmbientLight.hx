package js.three;

import js.html.*;

/**
 * This light's color gets applied to all the objects in the scene globally.
 * 
 * # example
 *     var light = new THREE.AmbientLight( 0x404040 ); // soft white light
 *     scene.add( light );
 * 
 * @source https://github.com/mrdoob/three.js/blob/master/src/lights/AmbientLight.js
 */
@:native("THREE.AmbientLight")
extern class AmbientLight extends Light
{
	//var castShadow : Bool;

	/**
	 * This light's color gets applied to all the objects in the scene globally.
	 * 
	 * # example
	 *     var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	 *     scene.add( light );
	 * 
	 * @source https://github.com/mrdoob/three.js/blob/master/src/lights/AmbientLight.js
	 */
	@:overload(function(?hex:haxe.extern.EitherType<Float,String>,?intensity:Float):Void{})
	function new() : Void;
}