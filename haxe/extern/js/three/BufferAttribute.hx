package js.three;

import js.html.*;

/**
 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/BufferAttribute.js">src/core/BufferAttribute.js</a>
 */
@:native("THREE.BufferAttribute")
extern class BufferAttribute
{
	var uuid : String;
	var array : ArrayLike<Float>;
	var itemSize : Float;
	var dynamic_(get, null) : Bool;
	inline function get_dynamic_() : Bool return (cast this)[cast 'dynamic'];
	var updateRange : { var offset : Float; var count : Float; };
	var version : Float;
	var normalized : Bool;
	var needsUpdate : Bool;
	var count : Int;
	/**
	 * @deprecated Use count instead.
	 */
	var length : Float;

	/**
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/BufferAttribute.js">src/core/BufferAttribute.js</a>
	 */
	function new(array:ArrayLike<Float>, itemSize:Float, ?normalized:Bool) : Void;
	function setDynamic(dynamic_:Bool) : BufferAttribute;
	function clone() : BufferAttribute;
	function copy(source:BufferAttribute) : BufferAttribute;
	function copyAt(index1:Float, attribute:BufferAttribute, index2:Float) : BufferAttribute;
	function copyArray(array:ArrayLike<Float>) : BufferAttribute;
	function copyColorsArray(colors:Array<{ var r : Float; var g : Float; var b : Float; }>) : BufferAttribute;
	function copyIndicesArray(indices:Array<{ var a : Float; var b : Float; var c : Float; }>) : BufferAttribute;
	function copyVector2sArray(vectors:Array<{ var x : Float; var y : Float; }>) : BufferAttribute;
	function copyVector3sArray(vectors:Array<{ var x : Float; var y : Float; var z : Float; }>) : BufferAttribute;
	function copyVector4sArray(vectors:Array<{ var x : Float; var y : Float; var z : Float; var w : Float; }>) : BufferAttribute;
	function set(value:ArrayLike<Float>, ?offset:Float) : BufferAttribute;
	function getX(index:Int) : Float;
	function setX(index:Int, x:Float) : BufferAttribute;
	function getY(index:Int) : Float;
	function setY(index:Int, y:Float) : BufferAttribute;
	function getZ(index:Int) : Float;
	function setZ(index:Int, z:Float) : BufferAttribute;
	function getW(index:Int) : Float;
	function setW(index:Int, z:Float) : BufferAttribute;
	function setXY(index:Int, x:Float, y:Float) : BufferAttribute;
	function setXYZ(index:Int, x:Float, y:Float, z:Float) : BufferAttribute;
	function setXYZW(index:Int, x:Float, y:Float, z:Float, w:Float) : BufferAttribute;
}