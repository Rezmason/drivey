package js.three;

import js.html.*;

@:native("THREE.MaterialLoader")
extern class MaterialLoader
{
	var manager : LoadingManager;
	var textures : Dynamic<Texture>;

	function new(?manager:LoadingManager) : Void;
	function load(url:String, onLoad:Material->Void) : Void;
	function setTextures(textures:Dynamic<Texture>) : Void;
	function getTexture(name:String) : Texture;
	function parse(json:Dynamic) : Material;
}