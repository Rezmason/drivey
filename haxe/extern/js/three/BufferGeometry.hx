package js.three;

import js.html.*;

/**
 * This is a superefficent class for geometries because it saves all data in buffers.
 * It reduces memory costs and cpu cycles. But it is not as easy to work with because of all the nessecary buffer calculations.
 * It is mainly interesting when working with static objects.
 * 
 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/BufferGeometry.js">src/core/BufferGeometry.js</a>
 */
@:native("THREE.BufferGeometry")
extern class BufferGeometry extends EventDispatcher
{
	var MaxIndex : Float;
	/**
	 * Unique number of this buffergeometry instance
	 */
	var id : Int;
	var uuid : String;
	var name : String;
	var type : String;
	var index : BufferAttribute;
	var attributes : haxe.extern.EitherType<BufferAttribute, Array<InterleavedBufferAttribute>>;
	var morphAttributes : Dynamic;
	var groups : Array<{ var start : Float; var count : Float; @:optional var materialIndex : Float; }>;
	var boundingBox : Box3;
	var boundingSphere : Sphere;
	var drawRange : { var start : Float; var count : Float; };
	/**
	 * @deprecated
	 */
	var drawcalls : Dynamic;
	var offsets : Dynamic;

	/**
	 * This is a superefficent class for geometries because it saves all data in buffers.
	 * It reduces memory costs and cpu cycles. But it is not as easy to work with because of all the nessecary buffer calculations.
	 * It is mainly interesting when working with static objects.
	 * 
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/BufferGeometry.js">src/core/BufferGeometry.js</a>
	 */
	function new() : Void;
	function getIndex() : BufferAttribute;
	function setIndex(index:BufferAttribute) : Void;
	@:overload(function(name:Dynamic, array:Dynamic, itemSize:Dynamic):Dynamic{})
	function addAttribute(name:String, attribute:haxe.extern.EitherType<BufferAttribute, InterleavedBufferAttribute>) : BufferGeometry;
	function getAttribute(name:String) : haxe.extern.EitherType<BufferAttribute, InterleavedBufferAttribute>;
	function removeAttribute(name:String) : BufferGeometry;
	function addGroup(start:Float, count:Int, ?materialIndex:Float) : Void;
	function clearGroups() : Void;
	function setDrawRange(start:Float, count:Int) : Void;
	/**
	 * Bakes matrix transform directly into vertex coordinates.
	 */
	function applyMatrix(matrix:Matrix4) : BufferGeometry;
	function rotateX(angle:Float) : BufferGeometry;
	function rotateY(angle:Float) : BufferGeometry;
	function rotateZ(angle:Float) : BufferGeometry;
	function translate(x:Float, y:Float, z:Float) : BufferGeometry;
	function scale(x:Float, y:Float, z:Float) : BufferGeometry;
	function lookAt(v:Vector3) : Void;
	function center() : Vector3;
	function setFromObject(object:Object3D) : BufferGeometry;
	function setFromPoints(points:Array<Vector>) : BufferGeometry;
	function updateFromObject(object:Object3D) : Void;
	function fromGeometry(geometry:Geometry, ?settings:Dynamic) : BufferGeometry;
	function fromDirectGeometry(geometry:DirectGeometry) : BufferGeometry;
	/**
	 * Computes bounding box of the geometry, updating Geometry.boundingBox attribute.
	 * Bounding boxes aren't computed by default. They need to be explicitly computed, otherwise they are null.
	 */
	function computeBoundingBox() : Void;
	/**
	 * Computes bounding sphere of the geometry, updating Geometry.boundingSphere attribute.
	 * Bounding spheres aren't' computed by default. They need to be explicitly computed, otherwise they are null.
	 */
	function computeBoundingSphere() : Void;
	/**
	 * Computes vertex normals by averaging face normals.
	 */
	function computeVertexNormals() : Void;
	function merge(geometry:BufferGeometry, offset:Float) : BufferGeometry;
	function normalizeNormals() : Void;
	function toNonIndexed() : BufferGeometry;
	function toJSON() : Dynamic;
	function clone() : BufferGeometry;
	function copy(source:BufferGeometry) : BufferGeometry;
	/**
	 * Disposes the object from memory.
	 * You need to call this when you want the bufferGeometry removed while the application is running.
	 */
	function dispose() : Void;
	function addIndex(index:Dynamic) : Void;
	function addDrawCall(start:Dynamic, count:Dynamic, ?indexOffset:Dynamic) : Void;
	function clearDrawCalls() : Void;
}
