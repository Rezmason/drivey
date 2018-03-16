package js.three;

import js.html.*;

@:native("THREE.WebGLDepthBuffer")
extern class WebGLDepthBuffer
{
	function new(gl:Dynamic, state:Dynamic) : Void;
	function setTest(depthTest:Bool) : Void;
	function sertMask(depthMask:Float) : Void;
	function setFunc(depthFunc:haxe.Constraints.Function) : Void;
	function setLocked(lock:Bool) : Void;
	function setClear(depth:Dynamic) : Void;
	function reset() : Void;
}