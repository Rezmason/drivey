package js.three;

import js.html.*;

@:native("THREE.SpotLightHelper")
extern class SpotLightHelper extends Object3D
{
	var light : Light;

	@:overload(function(light:Light):Void{})
	function new() : Void;
	function dispose() : Void;
	function update() : Void;
}