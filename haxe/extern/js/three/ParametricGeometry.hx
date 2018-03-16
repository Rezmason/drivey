package js.three;

import js.html.*;

@:native("THREE.ParametricGeometry")
extern class ParametricGeometry extends Geometry
{
	var parameters : { var func : Float->Float->Vector3; var slices : Float; var stacks : Float; };

	@:overload(function(func:Float->Float->Vector3,slices:Float,stacks:Float):Void{})
	function new() : Void;
}