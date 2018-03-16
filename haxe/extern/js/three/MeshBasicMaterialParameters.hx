package js.three;

import js.html.*;

typedef MeshBasicMaterialParameters =
{>MaterialParameters,
	@:optional var color : haxe.extern.EitherType<Int, String>;
	@:optional var opacity : Float;
	@:optional var map : Texture;
	@:optional var aoMap : Texture;
	@:optional var aoMapIntensity : Float;
	@:optional var specularMap : Texture;
	@:optional var alphaMap : Texture;
	@:optional var envMap : Texture;
	@:optional var combine : Combine;
	@:optional var reflectivity : Float;
	@:optional var refractionRatio : Float;
	@:optional var shading : Shading;
	@:optional var wireframe : Bool;
	@:optional var wireframeLinewidth : Float;
	@:optional var wireframeLinecap : String;
	@:optional var wireframeLinejoin : String;
	@:optional var skinning : Bool;
	@:optional var morphTargets : Bool;
}