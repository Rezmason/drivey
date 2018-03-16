package js.three;

import js.html.*;

@:native("THREE.AnimationObjectGroup")
extern class AnimationObjectGroup
{
	var uuid : String;
	var stats : { var bindingsPerObject : Float; var objects : { var total : Float; var inUse : Float; }; };

	function new(args:Array<Dynamic>) : Void;
	function add(args:Array<Dynamic>) : Void;
	function remove(args:Array<Dynamic>) : Void;
	function uncache(args:Array<Dynamic>) : Void;
}