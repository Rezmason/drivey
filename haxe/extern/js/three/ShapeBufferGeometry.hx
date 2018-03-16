package js.three;

import js.html.*;

@:native("THREE.ShapeBufferGeometry")
extern class ShapeBufferGeometry extends BufferGeometry
{
    @:overload(function(shapes:haxe.extern.EitherType<Shape, Array<Shape>>, ?curveSegments:Int):Void{})
	@:overload(function():Void{})
	function new() : Void;
}
