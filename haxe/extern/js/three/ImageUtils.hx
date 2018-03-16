package js.three;

import js.html.*;

@:native("THREE.ImageUtils")
extern class ImageUtils
{
	static var crossOrigin : String;

	static function loadTexture(url:String, mapping:Mapping, onLoad:Texture->Void, onError:String->Void) : Texture;
	static function loadTextureCube(array:Array<String>, mapping:Mapping, onLoad:Texture->Void, onError:String->Void) : Texture;
}