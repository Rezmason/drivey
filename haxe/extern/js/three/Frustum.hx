package js.three;

import js.html.*;

/**
 * Frustums are used to determine what is inside the camera's field of view. They help speed up the rendering process.
 */
@:native("THREE.Frustum")
extern class Frustum
{
	/**
	 * Array of 6 vectors.
	 */
	var planes : Array<Plane>;

	/**
	 * Frustums are used to determine what is inside the camera's field of view. They help speed up the rendering process.
	 */
	function new(?p0:Plane, ?p1:Plane, ?p2:Plane, ?p3:Plane, ?p4:Plane, ?p5:Plane) : Void;
	function set(?p0:Float, ?p1:Float, ?p2:Float, ?p3:Float, ?p4:Float, ?p5:Float) : Frustum;
	function clone() : Frustum;
	function copy(frustum:Frustum) : Frustum;
	function setFromMatrix(m:Matrix4) : Frustum;
	@:overload(function(sprite:Sprite):Bool{})
	function intersectsObject(object:Object3D) : Bool;
	function intersectsSphere(sphere:Sphere) : Bool;
	function intersectsBox(box:Box3) : Bool;
	function containsPoint(point:Vector3) : Bool;
}