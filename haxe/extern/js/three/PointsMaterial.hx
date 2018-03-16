package js.three;

import js.html.*;

@:native("THREE.PointsMaterial")
extern class PointsMaterial extends Material
{
	var color : Color;
	var map : Texture;
	var size : Float;
	var sizeAttenuation : Bool;

	@:overload(function(?parameters:PointsMaterialParameters):Void{})
	function new() : Void;
	@:overload(function(parameters:PointsMaterialParameters):Void{})
	override function setValues(parameters:MaterialParameters) : Void;
}