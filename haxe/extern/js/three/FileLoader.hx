package js.three;

import js.html.*;

@:native("THREE.FileLoader")
extern class FileLoader
{
	var manager : LoadingManager;
	var mimeType : MimeType;
	var path : String;
	var responseType : String;
	var withCredentials : String;

	function new(?manager:LoadingManager) : Void;
	function load(url:String, ?onLoad:String->Void, ?onProgress:ProgressEvent->Void, ?onError:ErrorEvent->Void) : Dynamic;
	function setMimeType(mimeType:MimeType) : FileLoader;
	function setPath(path:String) : FileLoader;
	function setResponseType(responseType:String) : FileLoader;
	function setWithCredentials(value:String) : FileLoader;
}