package js.three;

import js.html.*;

@:native("THREE.BooleanKeyframeTrack")
extern class BooleanKeyframeTrack extends KeyframeTrack
{
	@:overload(function(name:String,times:Array<Dynamic>,values:Array<Dynamic>):Void{})
	function new(name:String, times:Array<Dynamic>, values:Array<Dynamic>, interpolation:InterpolationModes) : Void;
}