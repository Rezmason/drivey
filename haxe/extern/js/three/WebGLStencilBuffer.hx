package js.three;

import js.html.*;

@:native("THREE.WebGLStencilBuffer")
extern class WebGLStencilBuffer
{
	function new(gl:Dynamic, state:Dynamic) : Void;
	function setTest(stencilTest:Bool) : Void;
	function sertMask(stencilMask:Float) : Void;
	function setFunc(stencilFunc:haxe.Constraints.Function, stencilRef:Dynamic, stencilMask:Float) : Void;
	function setOp(stencilFail:Dynamic, stencilZFail:Dynamic, stencilZPass:Dynamic) : Void;
	function setLocked(lock:Bool) : Void;
	function setClear(stencil:Dynamic) : Void;
	function reset() : Void;
}