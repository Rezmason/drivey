package js.three;

import js.html.*;

@:native("THREE.SkeletonHelper")
extern class SkeletonHelper extends LineSegments
{
	var bones : Array<Bone>;
	var root : Object3D;

	@:overload(function(bone:Object3D):Void{})
	function new() : Void;
	function getBoneList(object:Object3D) : Array<Bone>;
	function update() : Void;
}