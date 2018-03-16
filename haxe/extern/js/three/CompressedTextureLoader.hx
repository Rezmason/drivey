package js.three;

import js.html.*;

@:native("THREE.CompressedTextureLoader")
extern class CompressedTextureLoader
{
	var manager : LoadingManager;
	var path : String;

	function new(?manager:LoadingManager) : Void;
	function load(url:String, onLoad:CompressedTexture->Void, ?onProgress:ProgressEvent->Void, ?onError:ErrorEvent->Void) : Void;
	function setPath(path:String) : CompressedTextureLoader;
}