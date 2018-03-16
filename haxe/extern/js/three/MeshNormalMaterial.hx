package js.three;

import js.html.*;

@:native("THREE.MeshNormalMaterial")
extern class MeshNormalMaterial extends Material
{
	var wireframe : Bool;
	var wireframeLinewidth : Float;
	var morphTargets : Bool;

	@:overload(function(?parameters:MeshNormalMaterialParameters):Void{})
	function new() : Void;
	@:overload(function(parameters:MeshNormalMaterialParameters):Void{})
	override function setValues(parameters:MaterialParameters) : Void;
}