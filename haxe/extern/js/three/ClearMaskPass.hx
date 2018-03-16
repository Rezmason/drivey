package js.three;

import js.html.*;

@:native("THREE.ClearMaskPass")
extern class ClearMaskPass
{
	var enabled : Bool;

	function new() : Void;
	function render(renderer:WebGLRenderer, writeBuffer:WebGLRenderTarget, readBuffer:WebGLRenderTarget, delta:Float) : Void;
}