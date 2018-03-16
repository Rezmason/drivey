package js.three;

import js.html.*;

@:native("THREE.Octree")
extern class Octree
{
	function new(?parameters:Dynamic) : Void;
	function update() : Void;
	function add(object:Dynamic, ?options:Dynamic) : Dynamic;
	function addDeferred(object:Dynamic, ?options:Dynamic) : Dynamic;
	function addObjectData(object:Dynamic, part:Dynamic) : Dynamic;
	function remove(object:Dynamic) : Dynamic;
	function extend(octree:Octree) : Dynamic;
	function rebuild() : Dynamic;
	function updateObject(object:Dynamic) : Dynamic;
	function search(position:Vector3, radius:Float, organizeByObject:Bool, direction:Vector3) : Dynamic;
	function setRoot(root:Dynamic) : Dynamic;
	function getDepthEnd() : Float;
	function getNodeCountEnd() : Float;
	function getObjectCountEnd() : Float;
	function toConsole() : Dynamic;
}