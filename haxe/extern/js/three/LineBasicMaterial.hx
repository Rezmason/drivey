package js.three;

import js.html.*;

@:native("THREE.LineBasicMaterial")
extern class LineBasicMaterial extends Material
{
	var color : Color;
	var linewidth : Float;
	var linecap : String;
	var linejoin : String;

	@:overload(function(?parameters:LineBasicMaterialParameters):Void{})
	function new() : Void;
	@:overload(function(parameters:LineBasicMaterialParameters):Void{})
	override function setValues(parameters:MaterialParameters) : Void;
}