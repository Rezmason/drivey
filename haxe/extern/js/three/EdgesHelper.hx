package js.three;

import js.html.*;

@:native("THREE.EdgesHelper")
extern class EdgesHelper extends LineSegments
{
	@:overload(function(object:Object3D,?hex:Int,?thresholdAngle:Float):Void{})
	function new() : Void;
}