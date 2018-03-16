package js.three;

import js.html.*;

/**
 * @deprecated THREE.Float32Attribute has been removed. Use new THREE.Float32BufferAttribute() instead.
 */
@:native("THREE.Float32Attribute")
extern class Float32Attribute extends BufferAttribute
{
	/**
	 * @deprecated THREE.Float32Attribute has been removed. Use new THREE.Float32BufferAttribute() instead.
	 */
	@:overload(function(array:Dynamic,itemSize:Float):Void{})
	function new(array:ArrayLike<Float>, itemSize:Float, ?normalized:Bool) : Void;
}