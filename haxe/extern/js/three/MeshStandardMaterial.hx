package js.three;

import js.html.*;

@:native("THREE.MeshStandardMaterial")
extern class MeshStandardMaterial extends Material
{
	var defines : Dynamic;
	var color : Color;
	var roughness : Float;
	var metalness : Float;
	var map : Texture;
	var lighhtMap : Texture;
	var lightMapIntensity : Float;
	var aoMap : Texture;
	var aoMapIntensity : Float;
	var emissive : Color;
	var emissiveIntensity : Float;
	var emissiveMap : Texture;
	var bumpMap : Texture;
	var bumpScale : Float;
	var normalMap : Texture;
	var normalScale : Float;
	var displacementMap : Texture;
	var displacementScale : Float;
	var displacementBias : Float;
	var roughnessMap : Texture;
	var metalnessMap : Texture;
	var alphaMap : Texture;
	var envMap : Texture;
	var envMapIntensity : Float;
	var refractionRatio : Float;
	var wireframe : Bool;
	var wireframeLinewidth : Float;
	var skinning : Bool;
	var morphTargets : Bool;
	var morphNormals : Bool;

	@:overload(function(?parameters:MeshStandardMaterialParameters):Void{})
	function new() : Void;
	@:overload(function(parameters:MeshStandardMaterialParameters):Void{})
	override function setValues(parameters:MaterialParameters) : Void;
}