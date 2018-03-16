package js.three;

import js.html.*;

@:native("THREE.StereoCamera")
extern class StereoCamera extends Camera
{
	var aspect : Float;
	var eyeSep : Float;
	var cameraL : PerspectiveCamera;
	var cameraR : PerspectiveCamera;

	function new() : Void;
	function update(camera:PerspectiveCamera) : Void;
}