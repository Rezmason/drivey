package js.three;

import js.html.*;

@:native("THREE.MeshDepthMaterial")
extern class MeshDepthMaterial extends Material
{
	var wireframe : Bool;
	var wireframeLinewidth : Float;

	@:overload(function(?parameters:MeshDepthMaterialParameters):Void{})
	function new() : Void;
	@:overload(function(parameters:MeshDepthMaterialParameters):Void{})
	override function setValues(parameters:MaterialParameters) : Void;
}