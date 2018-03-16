package js.three;

import js.html.*;

@:native("THREE.MorphBlendMesh")
extern class MorphBlendMesh extends Mesh
{
	var animationsMap : Dynamic<MorphBlendMeshAnimation>;
	var animationsList : Array<MorphBlendMeshAnimation>;

	@:overload(function(geometry:Geometry,material:Material):Void{})
	function new() : Void;
	function createAnimation(name:String, start:Int, end:Int, fps:Float) : Void;
	function autoCreateAnimations(fps:Float) : Void;
	function setAnimationDirectionForward(name:String) : Void;
	function setAnimationDirectionBackward(name:String) : Void;
	function setAnimationFPS(name:String, fps:Float) : Void;
	function setAnimationDuration(name:String, duration:Float) : Void;
	function setAnimationWeight(name:String, weight:Float) : Void;
	function setAnimationTime(name:String, time:Float) : Void;
	function getAnimationTime(name:String) : Float;
	function getAnimationDuration(name:String) : Float;
	function playAnimation(name:String) : Void;
	function stopAnimation(name:String) : Void;
	function update(delta:Float) : Void;
}