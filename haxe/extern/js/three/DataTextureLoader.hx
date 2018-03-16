package js.three;

import js.html.*;

@:native("THREE.DataTextureLoader")
extern class DataTextureLoader
{
	var manager : LoadingManager;

	function new(?manager:LoadingManager) : Void;
	function load(url:String, onLoad:DataTexture->Void, ?onProgress:ProgressEvent->Void, ?onError:ErrorEvent->Void) : Void;
}