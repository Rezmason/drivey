package js.three;

import js.html.*;

/**
 * Triangle face.
 * 
 * # Example
 *     var normal = new THREE.Vector3( 0, 1, 0 );
 *     var color = new THREE.Color( 0xffaa00 );
 *     var face = new THREE.Face3( 0, 1, 2, normal, color, 0 );
 * 
 * @source https://github.com/mrdoob/three.js/blob/master/src/core/Face3.js
 */
@:native("THREE.Face3")
extern class Face3
{
	/**
	 * Vertex A index.
	 */
	var a : Int;
	/**
	 * Vertex B index.
	 */
	var b : Int;
	/**
	 * Vertex C index.
	 */
	var c : Int;
	/**
	 * Face normal.
	 */
	var normal : Vector3;
	/**
	 * Array of 4 vertex normals.
	 */
	var vertexNormals : Array<Vector3>;
	/**
	 * Face color.
	 */
	var color : Color;
	/**
	 * Array of 4 vertex normals.
	 */
	var vertexColors : Array<Color>;
	/**
	 * Material index (points to {@link Geometry.materials}).
	 */
	var materialIndex : Float;

	/**
	 * Triangle face.
	 * 
	 * # Example
	 *     var normal = new THREE.Vector3( 0, 1, 0 );
	 *     var color = new THREE.Color( 0xffaa00 );
	 *     var face = new THREE.Face3( 0, 1, 2, normal, color, 0 );
	 * 
	 * @source https://github.com/mrdoob/three.js/blob/master/src/core/Face3.js
	 */
	@:overload(function(a:Float, b:Float, c:Float, ?normal:Vector3, ?vertexColors:Array<Color>, ?materialIndex:Float):Void{})
	@:overload(function(a:Float, b:Float, c:Float, ?vertexNormals:Array<Vector3>, ?color:Color, ?materialIndex:Float):Void{})
	@:overload(function(a:Float, b:Float, c:Float, ?vertexNormals:Array<Vector3>, ?vertexColors:Array<Color>, ?materialIndex:Float):Void{})
	function new(a:Float, b:Float, c:Float, ?normal:Vector3, ?color:Color, ?materialIndex:Float) : Void;
	/**
	 * Triangle face.
	 * 
	 * # Example
	 *     var normal = new THREE.Vector3( 0, 1, 0 );
	 *     var color = new THREE.Color( 0xffaa00 );
	 *     var face = new THREE.Face3( 0, 1, 2, normal, color, 0 );
	 * 
	 * @source https://github.com/mrdoob/three.js/blob/master/src/core/Face3.js
	 */
	/**
	 * Triangle face.
	 * 
	 * # Example
	 *     var normal = new THREE.Vector3( 0, 1, 0 );
	 *     var color = new THREE.Color( 0xffaa00 );
	 *     var face = new THREE.Face3( 0, 1, 2, normal, color, 0 );
	 * 
	 * @source https://github.com/mrdoob/three.js/blob/master/src/core/Face3.js
	 */
	/**
	 * Triangle face.
	 * 
	 * # Example
	 *     var normal = new THREE.Vector3( 0, 1, 0 );
	 *     var color = new THREE.Color( 0xffaa00 );
	 *     var face = new THREE.Face3( 0, 1, 2, normal, color, 0 );
	 * 
	 * @source https://github.com/mrdoob/three.js/blob/master/src/core/Face3.js
	 */
	function clone() : Face3;
	function copy(source:Face3) : Face3;
}