package js.three;

import js.html.*;

/**
 * Abstract base class for cameras. This class should always be inherited when you build a new camera.
 */
@:native("THREE.Camera")
extern class Camera extends Object3D
{
	/**
	 * This is the inverse of matrixWorld. MatrixWorld contains the Matrix which has the world transform of the Camera.
	 */
	var matrixWorldInverse : Matrix4;
	/**
	 * This is the matrix which contains the projection.
	 */
	var projectionMatrix : Matrix4;

	/**
	 * Abstract base class for cameras. This class should always be inherited when you build a new camera.
	 */
	function new() : Void;
	override function getWorldDirection(?optionalTarget:Vector3) : Vector3;
	/**
	 * This make the camera look at the vector position in local space.
	 */
	override function lookAt(vector:Vector3) : Void;
}