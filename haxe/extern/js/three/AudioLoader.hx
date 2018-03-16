package js.three;

import js.html.*;

@:native("THREE.AudioLoader")
extern class AudioLoader
{
	function new(?manager:LoadingManager) : Void;
	function load(url:String, onLoad:haxe.Constraints.Function, onPrgress:haxe.Constraints.Function, onError:haxe.Constraints.Function) : Void;
}