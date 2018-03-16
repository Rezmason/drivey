package js.three;

import js.html.*;

@:native("THREE.WebGLBufferRenderer")
extern class WebGLBufferRenderer
{
	function new(_gl:js.html.webgl.RenderingContext, extensions:Dynamic, _infoRender:Dynamic) : Void;
	function setMode(value:Dynamic) : Void;
	function render(start:Dynamic, count:Int) : Void;
	function renderInstances(geometry:Dynamic) : Void;
}