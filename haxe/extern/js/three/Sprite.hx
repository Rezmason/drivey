package js.three;

import js.html.*;

@:native("THREE.Sprite")
extern class Sprite extends Object3D
{
	var geometry : BufferGeometry;
	var material : SpriteMaterial;

	@:overload(function(?material:Material):Void{})
	function new() : Void;
	override function raycast(raycaster:Raycaster, intersects:Dynamic) : Void;
}