package js.three.propertyBinding;

import js.html.*;

@:native("THREE.PropertyBinding.Composite")
extern class Composite
{
	function new(targetGroup:Dynamic, path:Dynamic, ?parsedPath:Dynamic) : Void;
	function getValue(array:Dynamic, offset:Float) : Dynamic;
	function setValue(array:Dynamic, offset:Float) : Void;
	function bind() : Void;
	function unbind() : Void;
}