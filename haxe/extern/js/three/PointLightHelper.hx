package js.three;

import js.html.*;

@:native("THREE.PointLightHelper")
extern class PointLightHelper extends Object3D
{
	var light : Light;

	@:overload(function(light:Light,sphereSize:Float):Void{})
	function new() : Void;
	function dispose() : Void;
	function update() : Void;
}