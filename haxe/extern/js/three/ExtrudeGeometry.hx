package js.three;

import js.html.*;

@:native("THREE.ExtrudeGeometry")
extern class ExtrudeGeometry extends Geometry
{
	var WorldUVGenerator : { function generateTopUV(geometry:Geometry, indexA:Float, indexB:Float, indexC:Float) : Array<Vector2>; function generateSideWallUV(geometry:Geometry, indexA:Float, indexB:Float, indexC:Float, indexD:Float) : Array<Vector2>; };

	@:overload(function(?shape:Shape,?options:Dynamic):Void{})
	@:overload(function():Void{})
	function new() : Void;
	@:overload(function(?shapes:Array<Shape>,?options:Dynamic):Void{})
	function addShapeList(shapes:Array<Shape>, ?options:Dynamic) : Void;
	function addShape(shape:Shape, ?options:Dynamic) : Void;
}