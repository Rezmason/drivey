package js.three;

import js.html.*;

/**
 * @deprecated THREE.Uint32Attribute has been removed. Use new THREE.Uint32BufferAttribute() instead.
 */
@:native("THREE.Uint32Attribute")
extern class Uint32Attribute extends BufferAttribute
{
	/**
	 * @deprecated THREE.Uint32Attribute has been removed. Use new THREE.Uint32BufferAttribute() instead.
	 */
	@:overload(function(array:Dynamic,itemSize:Float):Void{})
	function new(array:ArrayLike<Float>, itemSize:Float, ?normalized:Bool) : Void;
}