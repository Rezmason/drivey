package js.three;

import js.html.*;

@:native("THREE.EditorControls")
extern class EditorControls extends EventDispatcher
{
	var enabled : Bool;
	var center : Vector3;

	@:overload(function(object:Camera,?domElement:js.html.Element):Void{})
	function new() : Void;
	function focus(target:Object3D, frame:Bool) : Void;
	function pan(delta:Vector3) : Void;
	function zoom(delta:Vector3) : Void;
	function rotate(delta:Vector3) : Void;
	function dispose() : Void;
}