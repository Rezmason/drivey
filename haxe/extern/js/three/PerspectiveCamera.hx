package js.three;

import js.html.*;

/**
 * Camera with perspective projection.
 * 
 * # example
 *     var camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
 *     scene.add( camera );
 * 
 * @source https://github.com/mrdoob/three.js/blob/master/src/cameras/PerspectiveCamera.js
 */
@:native("THREE.PerspectiveCamera")
extern class PerspectiveCamera extends Camera
{
	var zoom : Float;
	/**
	 * Camera frustum vertical field of view, from bottom to top of view, in degrees.
	 */
	var fov : Float;
	/**
	 * Camera frustum aspect ratio, window width divided by window height.
	 */
	var aspect : Float;
	/**
	 * Camera frustum near plane.
	 */
	var near : Float;
	/**
	 * Camera frustum far plane.
	 */
	var far : Float;
	var focus : Float;
	var view : { var fullWidth : Float; var fullHeight : Float; var offsetX : Float; var offsetY : Float; var width : Float; var height : Float; };
	var filmGauge : Float;
	var filmOffset : Float;

	/**
	 * Camera with perspective projection.
	 * 
	 * # example
	 *     var camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
	 *     scene.add( camera );
	 * 
	 * @source https://github.com/mrdoob/three.js/blob/master/src/cameras/PerspectiveCamera.js
	 */
	@:overload(function(?fov:Float,?aspect:Float,?near:Float,?far:Float):Void{})
	function new() : Void;
	function setFocalLength(focalLength:Float) : Void;
	function getFocalLength() : Float;
	function getEffectiveFOV() : Float;
	function getFilmWidth() : Float;
	function getFilmHeight() : Float;
	/**
	 * Sets an offset in a larger frustum. This is useful for multi-window or multi-monitor/multi-machine setups.
	 * For example, if you have 3x2 monitors and each monitor is 1920x1080 and the monitors are in grid like this:
	 * 
	 *     +---+---+---+
	 *     | A | B | C |
	 *     +---+---+---+
	 *     | D | E | F |
	 *     +---+---+---+
	 * 
	 * then for each monitor you would call it like this:
	 * 
	 *     var w = 1920;
	 *     var h = 1080;
	 *     var fullWidth = w * 3;
	 *     var fullHeight = h * 2;
	 * 
	 *     // A
	 *     camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
	 *     // B
	 *     camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
	 *     // C
	 *     camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
	 *     // D
	 *     camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
	 *     // E
	 *     camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
	 *     // F
	 *     camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h ); Note there is no reason monitors have to be the same size or in a grid.
	 */
	function setViewOffset(fullWidth:Float, fullHeight:Float, x:Float, y:Float, width:Float, height:Float) : Void;
	function clearViewOffset() : Void;
	/**
	 * Updates the camera projection matrix. Must be called after change of parameters.
	 */
	function updateProjectionMatrix() : Void;
	@:overload(function(?meta:Dynamic):Dynamic{})
	override function toJSON(?meta:{ var geometries : Dynamic; var materials : Dynamic; var textures : Dynamic; var images : Dynamic; }) : Dynamic;
	/**
	 * @deprecated
	 */
	function setLens(focalLength:Float, ?frameHeight:Float) : Void;
	
	override function clone(?recursive:Bool) : PerspectiveCamera;
}