package js.three;

import js.html.*;

/**
 * @deprecated THREE.Uint8ClampedAttribute has been removed. Use new THREE.Uint8ClampedBufferAttribute() instead.
 */
@:native("THREE.Uint8ClampedAttribute")
extern class Uint8ClampedAttribute extends BufferAttribute
{
	/**
	 * @deprecated THREE.Uint8ClampedAttribute has been removed. Use new THREE.Uint8ClampedBufferAttribute() instead.
	 */
	@:overload(function(array:Dynamic,itemSize:Float):Void{})
	function new(array:ArrayLike<Float>, itemSize:Float, ?normalized:Bool) : Void;
}