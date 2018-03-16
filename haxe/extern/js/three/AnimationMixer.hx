package js.three;

import js.html.*;

@:native("THREE.AnimationMixer")
extern class AnimationMixer extends EventDispatcher
{
	var time : Float;
	var timeScale : Float;

	@:overload(function(root:Dynamic):Void{})
	function new() : Void;
	function clipAction(clip:AnimationClip, ?root:Dynamic) : AnimationAction;
	function existingAction(clip:AnimationClip, ?root:Dynamic) : AnimationAction;
	function stopAllAction(clip:AnimationClip, ?root:Dynamic) : AnimationMixer;
	function update(deltaTime:Float) : AnimationMixer;
	function getRoot() : Dynamic;
	function uncacheClip(clip:AnimationClip) : Void;
	function uncacheRoot(root:Dynamic) : Void;
	function uncacheAction(clip:AnimationClip, ?root:Dynamic) : Void;
}