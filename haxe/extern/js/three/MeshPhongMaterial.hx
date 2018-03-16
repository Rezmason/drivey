package js.three;

import js.html.*;

@:native("THREE.MeshPhongMaterial")
extern class MeshPhongMaterial extends Material
{
	var color : Color;
	var specular : Color;
	var shininess : Float;
	var map : Texture;
	var lightMap : Texture;
	var lightMapIntensity : Float;
	var aoMap : Texture;
	var aoMapIntensity : Float;
	var emissive : Color;
	var emissiveIntensity : Float;
	var emissiveMap : Texture;
	var bumpMap : Texture;
	var bumpScale : Float;
	var normalMap : Texture;
	var normalScale : Vector2;
	var displacementMap : Texture;
	var displacementScale : Float;
	var displacementBias : Float;
	var specularMap : Texture;
	var alphaMap : Texture;
	var envMap : Texture;
	var combine : Combine;
	var reflectivity : Float;
	var refractionRatio : Float;
	var wireframe : Bool;
	var wireframeLinewidth : Float;
	var wireframeLinecap : String;
	var wireframeLinejoin : String;
	var skinning : Bool;
	var morphTargets : Bool;
	var morphNormals : Bool;
	/**
	 * @deprecated
	 */
	var metal : Bool;

	@:overload(function(?parameters:MeshPhongMaterialParameters):Void{})
	function new() : Void;
	@:overload(function(parameters:MeshPhongMaterialParameters):Void{})
	override function setValues(parameters:MaterialParameters) : Void;
}