package js.three;

import js.html.*;

/**
 * Abstract base class for lights.
 */
@:native("THREE.Light")
extern class Light extends Object3D
{
	var color : Color;
	var intensity : Float;
	//var receiveShadow : Bool;
	var shadow : LightShadow;
	/**
	 * @deprecated Use shadow.camera.fov instead.
	 */
	var shadowCameraFov : Dynamic;
	/**
	 * @deprecated Use shadow.camera.left instead.
	 */
	var shadowCameraLeft : Dynamic;
	/**
	 * @deprecated Use shadow.camera.right instead.
	 */
	var shadowCameraRight : Dynamic;
	/**
	 * @deprecated Use shadow.camera.top instead.
	 */
	var shadowCameraTop : Dynamic;
	/**
	 * @deprecated Use shadow.camera.bottom instead.
	 */
	var shadowCameraBottom : Dynamic;
	/**
	 * @deprecated Use shadow.camera.near instead.
	 */
	var shadowCameraNear : Dynamic;
	/**
	 * @deprecated Use shadow.camera.far instead.
	 */
	var shadowCameraFar : Dynamic;
	/**
	 * @deprecated Use shadow.bias instead.
	 */
	var shadowBias : Dynamic;
	/**
	 * @deprecated Use shadow.mapSize.width instead.
	 */
	var shadowMapWidth : Dynamic;
	/**
	 * @deprecated Use shadow.mapSize.height instead.
	 */
	var shadowMapHeight : Dynamic;

	/**
	 * Abstract base class for lights.
	 */
	@:overload(function(?hex:haxe.extern.EitherType<Float,String>,?intensity:Float):Void{})
	function new() : Void;
}