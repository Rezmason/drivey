package js.three;

import js.html.*;

@:native("THREE.RawShaderMaterial")
extern class RawShaderMaterial extends ShaderMaterial
{
	@:overload(function(?parameters:ShaderMaterialParameters):Void{})
	function new() : Void;
}