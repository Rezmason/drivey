package js.three;

import js.html.*;

@:native("THREE.WebGLState")
extern class WebGLState
{
	var buffers : { var color : WebGLColorBuffer; var depth : WebGLDepthBuffer; var stencil : WebGLStencilBuffer; };

	function new(gl:Dynamic, extensions:Dynamic, paramThreeToGL:haxe.Constraints.Function) : Void;
	function init() : Void;
	function initAttributes() : Void;
	function enableAttribute(attribute:String) : Void;
	function enableAttributeAndDivisor(attribute:String, meshPerAttribute:Dynamic, extension:Dynamic) : Void;
	function disableUnusedAttributes() : Void;
	function enable(id:String) : Void;
	function disable(id:String) : Void;
	function getCompressedTextureFormats() : Array<Dynamic>;
	function setBlending(blending:Float, blendEquation:Float, blendSrc:Float, blendDst:Float, blendEquationAlpha:Float, blendSrcAlpha:Float, blendDstAlpha:Float) : Void;
	function setColorWrite(colorWrite:Float) : Void;
	function setDepthTest(depthTest:Float) : Void;
	function setDepthWrite(depthWrite:Float) : Void;
	function setDepthFunc(depthFunc:haxe.Constraints.Function) : Void;
	function setStencilTest(stencilTest:Bool) : Void;
	function setStencilWrite(stencilWrite:Dynamic) : Void;
	function setStencilFunc(stencilFunc:haxe.Constraints.Function, stencilRef:Dynamic, stencilMask:Float) : Void;
	function setStencilOp(stencilFail:Dynamic, stencilZFail:Dynamic, stencilZPass:Dynamic) : Void;
	function setFlipSided(flipSided:Float) : Void;
	function setCullFace(cullFace:CullFace) : Void;
	function setLineWidth(width:Float) : Void;
	function setPolygonOffset(polygonoffset:Float, factor:Float, units:Float) : Void;
	function setScissorTest(scissorTest:Bool) : Void;
	function getScissorTest() : Bool;
	function activeTexture(webglSlot:Dynamic) : Void;
	function bindTexture(webglType:Dynamic, webglTexture:Dynamic) : Void;
	function compressedTexImage2D() : Void;
	function texImage2D() : Void;
	function clearColor(r:Float, g:Float, b:Float, a:Float) : Void;
	function clearDepth(depth:Float) : Void;
	function clearStencil(stencil:Dynamic) : Void;
	function scissor(scissor:Dynamic) : Void;
	function viewport(viewport:Dynamic) : Void;
	function reset() : Void;
}