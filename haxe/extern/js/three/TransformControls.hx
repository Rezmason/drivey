package js.three;

import js.html.*;

@:native("THREE.TransformControls")
extern class TransformControls extends Object3D
{
	var object : Object3D;

	@:overload(function(object:Camera,?domElement:js.html.Element):Void{})
	function new() : Void;
	function update() : Void;
	function detach() : Void;
	function attach(object:Object3D) : Void;
	function getMode() : String;
	function setMode(mode:String) : Void;
	function setSnap(snap:Dynamic) : Void;
	function setSize(size:Float) : Void;
	function setSpace(space:String) : Void;
}