package js.three;

import js.html.*;

@:native("THREE.WebGLProperties")
extern class WebGLProperties
{
	function new() : Void;
	function get(object:Dynamic) : Dynamic;
	function delete(object:Dynamic) : Void;
	function clear() : Void;
}