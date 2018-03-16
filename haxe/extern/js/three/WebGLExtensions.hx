package js.three;

import js.html.*;

@:native("THREE.WebGLExtensions")
extern class WebGLExtensions
{
	function new(gl:js.html.webgl.RenderingContext) : Void;
	function get(name:String) : Dynamic;
}