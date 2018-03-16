package js.three;

import js.html.*;

@:native("THREE.Bone")
extern class Bone extends Object3D
{
	var skin : SkinnedMesh;

	@:overload(function(skin:SkinnedMesh):Void{})
	function new() : Void;
}