package js.three;

import js.html.*;

@:native("THREE.LOD")
extern class LOD extends Object3D
{
	var levels : Array<Dynamic>;
	/**
	 * @deprecated
	 */
	var objects : Array<Dynamic>;

	function new() : Void;
	function addLevel(object:Object3D, ?distance:Float) : Void;
	function getObjectForDistance(distance:Float) : Object3D;
	override function raycast(raycaster:Raycaster, intersects:Dynamic) : Void;
	function update(camera:Camera) : Void;
	@:overload(function(meta:Dynamic):Dynamic{})
	override function toJSON(?meta:{ var geometries : Dynamic; var materials : Dynamic; var textures : Dynamic; var images : Dynamic; }) : Dynamic;
}