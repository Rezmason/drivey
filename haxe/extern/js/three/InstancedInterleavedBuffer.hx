package js.three;

import js.html.*;

/**
 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/InstancedInterleavedBuffer.js">src/core/InstancedInterleavedBuffer.js</a>
 */
@:native("THREE.InstancedInterleavedBuffer")
extern class InstancedInterleavedBuffer extends InterleavedBuffer
{
	var meshPerAttribute : Float;

	/**
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/InstancedInterleavedBuffer.js">src/core/InstancedInterleavedBuffer.js</a>
	 */
	@:overload(function(array:ArrayLike<Float>,stride:Float,?meshPerAttribute:Float):Void{})
	function new(array:ArrayLike<Float>, stride:Float) : Void;
}