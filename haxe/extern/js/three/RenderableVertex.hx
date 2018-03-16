package js.three;

import js.html.*;

@:native("THREE.RenderableVertex")
extern class RenderableVertex
{
	var position : Vector3;
	var positionWorld : Vector3;
	var positionScreen : Vector4;
	var visible : Bool;

	function new() : Void;
	function copy(vertex:RenderableVertex) : Void;
}