package js.three;

import js.html.*;

@:native("THREE.WebGLShader")
extern class WebGLShader
{
	function new(gl:Dynamic, type:String, string:String) : Void;
}