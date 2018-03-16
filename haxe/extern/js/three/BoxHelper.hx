package js.three;

import js.html.*;

@:native("THREE.BoxHelper")
extern class BoxHelper extends LineSegments
{
	@:overload(function(?object:Object3D,?color:Color):Void{})
	function new() : Void;
	function update(?object:Object3D) : Void;
}