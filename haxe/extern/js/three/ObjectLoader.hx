package js.three;

import js.html.*;

@:native("THREE.ObjectLoader")
extern class ObjectLoader
{
	var manager : LoadingManager;
	var texturePass : String;
	var crossOrigin : String;

	function new(?manager:LoadingManager) : Void;
	function load(url:String, ?onLoad:Object3D->Void, ?onProgress:ProgressEvent->Void, ?onError:haxe.extern.EitherType<Error, ErrorEvent>->Void) : Void;
	function setTexturePath(value:String) : Void;
	function setCrossOrigin(crossOrigin:String) : Void;
	function parse<T:Object3D>(json:Dynamic, ?onLoad:Object3D->Void) : T;
	function parseGeometries(json:Dynamic) : Array<Dynamic>;
	function parseMaterials(json:Dynamic, textures:Array<Texture>) : Array<Material>;
	function parseAnimations(json:Dynamic) : Array<AnimationClip>;
	function parseImages(json:Dynamic, onLoad:Void->Void) : Array<Dynamic>;
	function parseTextures(json:Dynamic, images:Dynamic) : Array<Texture>;
	function parseObject<T:Object3D>(data:Dynamic, geometries:Array<Dynamic>, materials:Array<Material>) : T;
}