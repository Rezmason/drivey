package js.three;

import js.html.*;

@:native("THREE.WireframeHelper")
extern class WireframeHelper extends LineSegments
{
	@:overload(function(object:Object3D,?hex:Int):Void{})
	function new() : Void;
}