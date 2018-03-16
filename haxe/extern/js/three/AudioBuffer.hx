package js.three;

import js.html.*;

@:native("THREE.AudioBuffer")
extern class AudioBuffer
{
	var context : Dynamic;
	var ready : Bool;
	var readyCallbacks : Array<haxe.Constraints.Function>;

	function new(context:Dynamic) : Void;
	function load(file:String) : AudioBuffer;
	function onReady(callback:haxe.Constraints.Function) : Void;
}