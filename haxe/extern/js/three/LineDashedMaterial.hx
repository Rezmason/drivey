package js.three;

import js.html.*;

@:native("THREE.LineDashedMaterial")
extern class LineDashedMaterial extends Material
{
	var color : Color;
	var linewidth : Float;
	var scale : Float;
	var dashSize : Float;
	var gapSize : Float;

	@:overload(function(?parameters:LineDashedMaterialParameters):Void{})
	function new() : Void;
	@:overload(function(parameters:LineDashedMaterialParameters):Void{})
	override function setValues(parameters:MaterialParameters) : Void;
}