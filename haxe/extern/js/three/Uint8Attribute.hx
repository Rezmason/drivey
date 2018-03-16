package js.three;

import js.html.*;

/**
 * @deprecated THREE.Uint8Attribute has been removed. Use new THREE.Uint8BufferAttribute() instead.
 */
@:native("THREE.Uint8Attribute")
extern class Uint8Attribute extends BufferAttribute
{
	/**
	 * @deprecated THREE.Uint8Attribute has been removed. Use new THREE.Uint8BufferAttribute() instead.
	 */
	@:overload(function(array:Dynamic,itemSize:Float):Void{})
	function new(array:ArrayLike<Float>, itemSize:Float, ?normalized:Bool) : Void;
}