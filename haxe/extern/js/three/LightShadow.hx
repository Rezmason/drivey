package js.three;

import js.html.*;

@:native("THREE.LightShadow")
extern class LightShadow
{
	var camera : Camera;
	var bias : Float;
	var radius : Float;
	var mapSize : Vector2;
	var map : RenderTarget;
	var matrix : Matrix4;

	function new(camera:Camera) : Void;
	function copy(source:LightShadow) : LightShadow;
	function clone(?recursive:Bool) : LightShadow;
	function toJSON() : Dynamic;
}