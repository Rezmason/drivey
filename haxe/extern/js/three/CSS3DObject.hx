package js.three;

import js.html.*;

@:native("THREE.CSS3DObject")
extern class CSS3DObject extends Object3D
{
	var element : Dynamic;

	@:overload(function(element:Dynamic):Void{})
	function new() : Void;
}