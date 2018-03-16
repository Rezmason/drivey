package js.three;

import js.html.*;

extern interface WebGLRenderTargetOptions
{
	@:optional var wrapS : Wrapping;
	@:optional var wrapT : Wrapping;
	@:optional var magFilter : TextureFilter;
	@:optional var minFilter : TextureFilter;
	@:optional var format : Int;
	@:optional var type : TextureDataType;
	@:optional var anisotropy : Int;
	@:optional var depthBuffer : Bool;
	@:optional var stencilBuffer : Bool;
}