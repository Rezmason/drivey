package js.three;

import js.html.*;

@:native("THREE.BufferGeometryLoader")
extern class BufferGeometryLoader
{
	var manager : LoadingManager;

	function new(?manager:LoadingManager) : Void;
	function load(url:String, onLoad:BufferGeometry->Void, ?onProgress:Dynamic->Void, ?onError:Dynamic->Void) : Void;
	function parse(json:Dynamic) : BufferGeometry;
}