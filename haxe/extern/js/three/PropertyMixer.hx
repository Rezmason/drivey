package js.three;

import js.html.*;

@:native("THREE.PropertyMixer")
extern class PropertyMixer
{
	var binding : Dynamic;
	var valueSize : Float;
	var buffer : Dynamic;
	var cumulativeWeight : Float;
	var useCount : Float;
	var referenceCount : Float;

	function new(binding:Dynamic, typeName:String, valueSize:Float) : Void;
	function accumulate(accuIndex:Float, weight:Float) : Void;
	function apply(accuIndex:Float) : Void;
	function saveOriginalState() : Void;
	function restoreOriginalState() : Void;
}