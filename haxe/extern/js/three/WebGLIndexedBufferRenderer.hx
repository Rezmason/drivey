package js.three;

import js.html.*;

@:native("THREE.WebGLIndexedBufferRenderer")
extern class WebGLIndexedBufferRenderer
{
	function new(gl:js.html.webgl.RenderingContext, properties:Dynamic, info:Dynamic) : Void;
	function setMode(value:Dynamic) : Void;
	function setIndex(index:Dynamic) : Void;
	function render(start:Dynamic, count:Int) : Void;
	function renderInstances(geometry:Dynamic, start:Dynamic, count:Int) : Void;
}