package js.three;

import js.html.*;

@:native("THREE.ShapeGeometry")
extern class ShapeGeometry extends Geometry
{
	@:overload(function(shape:haxe.extern.EitherType<Shape, Array<Shape>>,?options:Dynamic):Void{})
	@:overload(function():Void{})
	function new() : Void;
	@:overload(function(shapes:Array<Shape>,?options:Dynamic):Void{})
	function addShapeList(shapes:Array<Shape>, options:Dynamic) : ShapeGeometry;
	function addShape(shape:Shape, ?options:Dynamic) : Void;
}

@:native("THREE.ShapeBufferGeometry")
extern class ShapeBufferGeometry extends Geometry
{
    @:overload(function(shape:haxe.extern.EitherType<Shape, Array<Shape>>,?options:Dynamic):Void{})
    @:overload(function():Void{})
    function new() : Void;
    @:overload(function(shapes:Array<Shape>,?options:Dynamic):Void{})
    function addShapeList(shapes:Array<Shape>, options:Dynamic) : ShapeBufferGeometry;
    function addShape(shape:Shape, ?options:Dynamic) : Void;
}
