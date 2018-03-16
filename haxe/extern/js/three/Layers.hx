package js.three;

import js.html.*;

@:native("THREE.Layers")
extern class Layers
{
	var mask : Float;

	function new() : Void;
	function set(channel:Float) : Void;
	function enable(channel:Float) : Void;
	function toggle(channel:Float) : Void;
	function disable(channel:Float) : Void;
	function test(layers:Layers) : Bool;
}