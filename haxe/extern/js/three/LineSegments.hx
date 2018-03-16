package js.three;

import js.html.*;

@:native("THREE.LineSegments")
extern class LineSegments extends Line
{
	@:overload(function(?geometry:haxe.extern.EitherType<Geometry,BufferGeometry>,?material:haxe.extern.EitherType<LineDashedMaterial,haxe.extern.EitherType<LineBasicMaterial,ShaderMaterial>>,?mode:Float):Void{})
	function new() : Void;
}