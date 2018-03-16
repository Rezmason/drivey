package js.three;

import js.html.*;

@:native("THREE.Spherical")
extern class Spherical
{
	var radius : Float;
	var phi : Float;
	var theta : Float;

	function new(?radius:Float, ?phi:Float, ?theta:Float) : Void;
	function set(radius:Float, phi:Float, theta:Float) : Spherical;
	function clone() : Spherical;
	function copy(other:Spherical) : Spherical;
	function makeSafe() : Void;
	function setFromVector3(vec3:Vector3) : Spherical;
}