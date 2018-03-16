package js.three;

import js.html.*;

@:native("THREE.Mesh")
extern class Mesh extends Object3D
{
	var geometry : haxe.extern.EitherType<Geometry, BufferGeometry>;
	var material : Material;
	var drawMode : TrianglesDrawModes;

	@:overload(function(?geometry:haxe.extern.EitherType<Geometry, BufferGeometry>,?material:Material):Void{})
	@:overload(function():Void{})
	function new() : Void;
	function setDrawMode(drawMode:TrianglesDrawModes) : Void;
	function updateMorphTargets() : Void;
	function getMorphTargetIndexByName(name:String) : Float;
	override function raycast(raycaster:Raycaster, intersects:Dynamic) : Void;
}
