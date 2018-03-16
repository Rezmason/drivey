package js.three;

import js.html.*;

@:native("THREE.MeshBasicMaterial")
extern class MeshBasicMaterial extends Material
{
	var color : Color;
	var map : Texture;
	var aoMap : Texture;
	var aoMapIntensity : Float;
	var specularMap : Texture;
	var alphaMap : Texture;
	var envMap : Texture;
	var combine : Combine;
	var reflectivity : Float;
	var refractionRatio : Float;
	//var shading : Shading;
	var wireframe : Bool;
	var wireframeLinewidth : Float;
	var wireframeLinecap : String;
	var wireframeLinejoin : String;
	var skinning : Bool;
	var morphTargets : Bool;

	@:overload(function(?parameters:MeshBasicMaterialParameters):Void{})
	function new() : Void;
	@:overload(function(parameters:MeshBasicMaterialParameters):Void{})
	override function setValues(parameters:MaterialParameters) : Void;
}