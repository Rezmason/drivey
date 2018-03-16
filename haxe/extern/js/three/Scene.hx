package js.three;

import js.html.*;

/**
 * Scenes allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras.
 */
@:native("THREE.Scene")
extern class Scene extends Object3D
{
	/**
	 * A fog instance defining the type of fog that affects everything rendered in the scene. Default is null.
	 */
	var fog : IFog;
	/**
	 * If not null, it will force everything in the scene to be rendered with that material. Default is null.
	 */
	var overrideMaterial : Material;
	var autoUpdate : Bool;
	var background : Dynamic;

	/**
	 * Scenes allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras.
	 */
	function new() : Void;
	@:overload(function(?meta:Dynamic):Dynamic{})
	override function toJSON(?meta:{ var geometries : Dynamic; var materials : Dynamic; var textures : Dynamic; var images : Dynamic; }) : Dynamic;
}