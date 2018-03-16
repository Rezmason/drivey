package js.three;

import js.html.*;

@:native("THREE.MeshLambertMaterial")
extern class MeshLambertMaterial extends Material
{
	var color : Color;
	var emissive : Color;
	var emissiveIntensity : Float;
	var emissiveMap : Texture;
	var map : Texture;
	var lighhtMap : Texture;
	var lightMapIntensity : Float;
	var aoMap : Texture;
	var aoMapIntensity : Float;
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

	@:overload(function(?parameters:MeshLambertMaterialParameters):Void{})
	function new() : Void;
	@:overload(function(parameters:MeshLambertMaterialParameters):Void{})
	override function setValues(parameters:MaterialParameters) : Void;
}