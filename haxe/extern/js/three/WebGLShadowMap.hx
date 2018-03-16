package js.three;

import js.html.*;

@:native("THREE.WebGLShadowMap")
extern class WebGLShadowMap
{
	var enabled : Bool;
	var autoUpdate : Bool;
	var needsUpdate : Bool;
	var type : ShadowMapType;
	var renderReverseSided : Bool;
	var renderSingleSided : Bool;
	/**
	 * @deprecated
	 */
	var cullFace : Dynamic;

	function new(_renderer:Renderer, _lights:Array<Dynamic>, _objects:Array<Dynamic>, capabilities:Dynamic) : Void;
	function render(scene:Scene, camera:Camera) : Void;
}