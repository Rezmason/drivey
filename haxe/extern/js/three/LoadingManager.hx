package js.three;

import js.html.*;

/**
 * Handles and keeps track of loaded and pending data.
 */
@:native("THREE.LoadingManager")
extern class LoadingManager
{
	var onStart : Void->Void;
	/**
	 * Will be called when load starts.
	 * The default is a function with empty body.
	 */
	var onLoad : Void->Void;
	/**
	 * Will be called while load progresses.
	 * The default is a function with empty body.
	 */
	var onProgress : Dynamic->Float->Float->Void;
	/**
	 * Will be called when each element in the scene completes loading.
	 * The default is a function with empty body.
	 */
	var onError : Void->Void;

	/**
	 * Handles and keeps track of loaded and pending data.
	 */
	function new(?onLoad:Void->Void, ?onProgress:String->Float->Float->Void, ?onError:Void->Void) : Void;
	function itemStart(url:String) : Void;
	function itemEnd(url:String) : Void;
	function itemError(url:String) : Void;
}