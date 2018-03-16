package js.three;

import js.html.*;

/**
 * Projects points between spaces.
 */
@:native("THREE.Projector")
extern class Projector
{
	/**
	 * Projects points between spaces.
	 */
	function new() : Void;
	function projectVector(vector:Vector3, camera:Camera) : Vector3;
	function unprojectVector(vector:Vector3, camera:Camera) : Vector3;
	/**
	 * Transforms a 3D scene object into 2D render data that can be rendered in a screen with your renderer of choice, projecting and clipping things out according to the used camera.
	 * If the scene were a real scene, this method would be the equivalent of taking a picture with the camera (and developing the film would be the next step, using a Renderer).
	 */
	function projectScene(scene:Scene, camera:Camera, sortObjects:Bool, ?sortElements:Bool) : { var objects : Array<Object3D>; var sprites : Array<Object3D>; var lights : Array<Light>; var elements : Array<Face3>; };
}