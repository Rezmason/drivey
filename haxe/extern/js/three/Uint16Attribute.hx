package js.three;

import js.html.*;

/**
 * @deprecated THREE.Uint16Attribute has been removed. Use new THREE.Uint16BufferAttribute() instead.
 */
@:native("THREE.Uint16Attribute")
extern class Uint16Attribute extends BufferAttribute
{
	/**
	 * @deprecated THREE.Uint16Attribute has been removed. Use new THREE.Uint16BufferAttribute() instead.
	 */
	@:overload(function(array:Dynamic,itemSize:Float):Void{})
	function new(array:ArrayLike<Float>, itemSize:Float, ?normalized:Bool) : Void;
}