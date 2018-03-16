package js.three;

import js.html.*;

@:native("THREE.WebGLColorBuffer")
extern class WebGLColorBuffer
{
	function new(gl:Dynamic, state:Dynamic) : Void;
	function setMask(colorMask:Float) : Void;
	function setLocked(lock:Bool) : Void;
	function setClear(r:Float, g:Float, b:Float, a:Float) : Void;
	function reset() : Void;
}