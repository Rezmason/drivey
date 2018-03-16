package js.three;

import js.html.*;

/**
 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/InstancedBufferGeometry.js">src/core/InstancedBufferGeometry.js</a>
 */
@:native("THREE.InstancedBufferGeometry")
extern class InstancedBufferGeometry extends BufferGeometry
{
	//var groups : Array<{ var start : Float; var count : Float; var instances : Float; }>;
	var maxInstancedCount : Float;

	/**
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/InstancedBufferGeometry.js">src/core/InstancedBufferGeometry.js</a>
	 */
	function new() : Void;
	@:overload(function(start:Float,count:Int,instances:Float):Void{})
	override function addGroup(start:Float, count:Int, ?materialIndex:Float) : Void;
}