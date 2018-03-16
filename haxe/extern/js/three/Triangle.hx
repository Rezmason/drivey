package js.three;

import js.html.*;

@:native("THREE.Triangle")
extern class Triangle
{
	var a : Vector3;
	var b : Vector3;
	var c : Vector3;

	function new(?a:Vector3, ?b:Vector3, ?c:Vector3) : Void;
	function set(a:Vector3, b:Vector3, c:Vector3) : Triangle;
	function setFromPointsAndIndices(points:Array<Vector3>, i0:Float, i1:Float, i2:Float) : Triangle;
	function clone() : Triangle;
	function copy(triangle:Triangle) : Triangle;
	function area() : Float;
	function midpoint(?optionalTarget:Vector3) : Vector3;
	function normal(?optionalTarget:Vector3) : Vector3;
	function plane(?optionalTarget:Vector3) : Plane;
	function barycoordFromPoint(point:Vector3, ?optionalTarget:Vector3) : Vector3;
	function containsPoint(point:Vector3) : Bool;
	function closestPointToPoint(point:Vector3, ?optionalTarget:Vector3) : Vector3;
	function equals(triangle:Triangle) : Bool;
	static function normal(a:Vector3, b:Vector3, c:Vector3, ?optionalTarget:Vector3) : Vector3;
	static function barycoordFromPoint(point:Vector3, a:Vector3, b:Vector3, c:Vector3, optionalTarget:Vector3) : Vector3;
	static function containsPoint(point:Vector3, a:Vector3, b:Vector3, c:Vector3) : Bool;
}