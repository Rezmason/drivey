package js.three;

import js.html.*;

@:native("THREE.RenderPass")
extern class RenderPass
{
	var scene : Scene;
	var camera : Camera;
	var overrideMaterial : Material;
	var clearColor : haxe.extern.EitherType<Color, haxe.extern.EitherType<String, Float>>;
	var clearAlpha : Float;
	var oldClearColor : Color;
	var oldClearAlpha : Float;
	var enabled : Bool;
	var clear : Bool;
	var needsSwap : Bool;

	function new(scene:Scene, camera:Camera, ?overrideMaterial:Material, ?clearColor:haxe.extern.EitherType<Color, haxe.extern.EitherType<String, Float>>, ?clearAlpha:Float) : Void;
	function render(renderer:WebGLRenderer, writeBuffer:WebGLRenderTarget, readBuffer:WebGLRenderTarget, delta:Float) : Void;
}