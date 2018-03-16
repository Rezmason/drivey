package js.three;

import js.html.*;

@:native("THREE.EffectComposer")
extern class EffectComposer
{
	var renderTarget1 : WebGLRenderTarget;
	var renderTarget2 : WebGLRenderTarget;
	var writeBuffer : WebGLRenderTarget;
	var readBuffer : WebGLRenderTarget;
	var passes : Array<Dynamic>;
	var copyPass : ShaderPass;

	function new(renderer:WebGLRenderer, ?renderTarget:WebGLRenderTarget) : Void;
	function swapBuffers() : Void;
	function addPass(pass:Dynamic) : Void;
	function insertPass(pass:Dynamic, index:Int) : Void;
	function render(?delta:Float) : Void;
	function reset(?renderTarget:WebGLRenderTarget) : Void;
	function setSize(width:Float, height:Float) : Void;
}