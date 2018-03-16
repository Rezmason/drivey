package js.three;

import js.html.*;

@:native("THREE.CubeTextureLoader")
extern class CubeTextureLoader
{
	var manager : LoadingManager;
	var corssOrigin : String;
	var path : String;

	function new(?manager:LoadingManager) : Void;
	function load(urls:Array<String>, ?onLoad:CubeTexture->Void, ?onProgress:ProgressEvent->Void, ?onError:ErrorEvent->Void) : Void;
	function setCrossOrigin(crossOrigin:String) : CubeTextureLoader;
	function setPath(path:String) : CubeTextureLoader;
}