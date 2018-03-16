package js.three;

import js.html.*;

/**
 * A loader for loading objects in JSON format.
 */
@:native("THREE.JSONLoader")
extern class JSONLoader extends Loader
{
	var manager : LoadingManager;
	var withCredentials : Bool;

	/**
	 * A loader for loading objects in JSON format.
	 */
	@:overload(function(?manager:LoadingManager):Void{})
	function new() : Void;
	function load(url:String, ?onLoad:Geometry->Array<Material>->Void, ?onProgress:ProgressEvent->Void, ?onError:ErrorEvent->Void) : Void;
	function setTexturePath(value:String) : Void;
	function parse(json:Dynamic, ?texturePath:String) : { var geometry : Geometry; @:optional var materials : Array<Material>; };
}