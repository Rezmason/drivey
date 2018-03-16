package js.three;

import js.html.*;

@:native("THREE.WebGLRenderTarget")
extern class WebGLRenderTarget extends EventDispatcher
{
	var uuid : String;
	var width : Float;
	var height : Float;
	var scissor : Vector4;
	var scissorTest : Bool;
	var viewport : Vector4;
	var texture : Texture;
	var depthBuffer : Bool;
	var stencilBuffer : Bool;
	var depthTexture : Texture;
	/**
	 * @deprecated Use texture.wrapS instead.
	 */
	var wrapS : Dynamic;
	/**
	 * @deprecated Use texture.wrapT instead.
	 */
	var wrapT : Dynamic;
	/**
	 * @deprecated Use texture.magFilter instead.
	 */
	var magFilter : Dynamic;
	/**
	 * @deprecated Use texture.minFilter instead.
	 */
	var minFilter : Dynamic;
	/**
	 * @deprecated Use texture.anisotropy instead.
	 */
	var anisotropy : Dynamic;
	/**
	 * @deprecated Use texture.offset instead.
	 */
	var offset : Dynamic;
	/**
	 * @deprecated Use texture.repeat instead.
	 */
	var repeat : Dynamic;
	/**
	 * @deprecated Use texture.format instead.
	 */
	var format : Dynamic;
	/**
	 * @deprecated Use texture.type instead.
	 */
	var type : Dynamic;
	/**
	 * @deprecated Use texture.generateMipmaps instead.
	 */
	var generateMipmaps : Dynamic;

	@:overload(function(width:Float,height:Float,?options:WebGLRenderTargetOptions):Void{})
	function new() : Void;
	function setSize(width:Float, height:Float) : Void;
	function clone() : WebGLRenderTarget;
	function copy(source:WebGLRenderTarget) : WebGLRenderTarget;
	function dispose() : Void;
}