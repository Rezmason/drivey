package js.three;

import js.html.*;

/**
 * Class for loading a texture.
 * Unlike other loaders, this one emits events instead of using predefined callbacks. So if you're interested in getting notified when things happen, you need to add listeners to the object.
 */
@:native("THREE.TextureLoader")
extern class TextureLoader
{
	var manager : LoadingManager;
	var crossOrigin : String;
	var withCredentials : String;
	var path : String;

	/**
	 * Class for loading a texture.
	 * Unlike other loaders, this one emits events instead of using predefined callbacks. So if you're interested in getting notified when things happen, you need to add listeners to the object.
	 */
	function new(?manager:LoadingManager) : Void;
	/**
	 * Begin loading from url
	 */
	function load(url:String, ?onLoad:Texture->Void, ?onProgress:ProgressEvent->Void, ?onError:ErrorEvent->Void) : Texture;
	function setCrossOrigin(crossOrigin:String) : TextureLoader;
	function setWithCredentials(value:String) : TextureLoader;
	function setPath(path:String) : TextureLoader;
}