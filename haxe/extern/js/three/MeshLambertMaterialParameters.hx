package js.three;

import js.html.*;

typedef MeshLambertMaterialParameters =
{>MaterialParameters,
	@:optional var color : haxe.extern.EitherType<Int, String>;
	@:optional var emissive : haxe.extern.EitherType<Float, String>;
	@:optional var emissiveIntensity : Float;
	@:optional var emissiveMap : Texture;
	@:optional var map : Texture;
	@:optional var lighhtMap : Texture;
	@:optional var lightMapIntensity : Float;
	@:optional var aoMap : Texture;
	@:optional var aoMapIntensity : Float;
	@:optional var specularMap : Texture;
	@:optional var alphaMap : Texture;
	@:optional var envMap : Texture;
	@:optional var combine : Combine;
	@:optional var reflectivity : Float;
	@:optional var refractionRatio : Float;
	@:optional var wireframe : Bool;
	@:optional var wireframeLinewidth : Float;
	@:optional var wireframeLinecap : String;
	@:optional var wireframeLinejoin : String;
	@:optional var skinning : Bool;
	@:optional var morphTargets : Bool;
	@:optional var morphNormals : Bool;
}