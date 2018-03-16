package js.three;

import js.html.*;

/**
 * Camera with orthographic projection
 * 
 * @example
 * var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
 * scene.add( camera );
 * 
 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/cameras/OrthographicCamera.js">src/cameras/OrthographicCamera.js</a>
 */
@:native("THREE.OrthographicCamera")
extern class OrthographicCamera extends Camera
{
	var zoom : Float;
	var view : { var fullWidth : Float; var fullHeight : Float; var offsetX : Float; var offsetY : Float; var width : Float; var height : Float; };
	/**
	 * Camera frustum left plane.
	 */
	var left : Float;
	/**
	 * Camera frustum right plane.
	 */
	var right : Float;
	/**
	 * Camera frustum top plane.
	 */
	var top : Float;
	/**
	 * Camera frustum bottom plane.
	 */
	var bottom : Float;
	/**
	 * Camera frustum near plane.
	 */
	var near : Float;
	/**
	 * Camera frustum far plane.
	 */
	var far : Float;

	/**
	 * Camera with orthographic projection
	 * 
	 * @example
	 * var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
	 * scene.add( camera );
	 * 
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/cameras/OrthographicCamera.js">src/cameras/OrthographicCamera.js</a>
	 */
	@:overload(function(left:Float,right:Float,top:Float,bottom:Float,?near:Float,?far:Float):Void{})
	function new() : Void;
	/**
	 * Updates the camera projection matrix. Must be called after change of parameters.
	 */
	function updateProjectionMatrix() : Void;
	function setViewOffset(fullWidth:Float, fullHeight:Float, offsetX:Float, offsetY:Float, width:Float, height:Float) : Void;
	function clearViewOffset() : Void;
	@:overload(function(?meta:Dynamic):Dynamic{})
	override function toJSON(?meta:{ var geometries : Dynamic; var materials : Dynamic; var textures : Dynamic; var images : Dynamic; }) : Dynamic;
}