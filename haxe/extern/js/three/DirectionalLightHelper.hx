package js.three;

import js.html.*;

@:native("THREE.DirectionalLightHelper")
extern class DirectionalLightHelper extends Object3D
{
	var light : Light;
	var lightPlane : Line;

	@:overload(function(light:Light,?size:Float):Void{})
	function new() : Void;
	function dispose() : Void;
	function update() : Void;
}