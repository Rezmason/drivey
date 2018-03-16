package js.three;

import js.html.*;

@:native("THREE.CameraHelper")
extern class CameraHelper extends LineSegments
{
	var camera : Camera;
	var pointMap : Dynamic<Array<Float>>;

	@:overload(function(camera:Camera):Void{})
	function new() : Void;
	function update() : Void;
}