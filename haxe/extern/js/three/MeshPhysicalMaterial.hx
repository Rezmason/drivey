package js.three;

import js.html.*;

@:native("THREE.MeshPhysicalMaterial")
extern class MeshPhysicalMaterial extends MeshStandardMaterial
{
	//var defines : Dynamic;
	var reflectivity : Float;
	var clearCoat : Float;
	var clearCoatRoughness : Float;

	@:overload(function(parameters:MeshPhysicalMaterialParameters):Void{})
	function new() : Void;
}