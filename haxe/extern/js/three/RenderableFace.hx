package js.three;

import js.html.*;

@:native("THREE.RenderableFace")
extern class RenderableFace
{
	var id : Int;
	var v1 : RenderableVertex;
	var v2 : RenderableVertex;
	var v3 : RenderableVertex;
	var normalModel : Vector3;
	var vertexNormalsModel : Array<Vector3>;
	var vertexNormalsLength : Float;
	var color : Color;
	var material : Material;
	var uvs : Array<Array<Vector2>>;
	var z : Float;

	function new() : Void;
}