package js.three;

import js.html.*;

@:native("THREE.CanvasRenderer")
extern class CanvasRenderer
	implements Renderer
{
	var domElement : CanvasElement;
	var autoClear : Bool;
	var sortObjects : Bool;
	var sortElements : Bool;
	var info : { var render : { var vertices : Float; var faces : Float; }; };

	function new(?parameters:CanvasRendererParameters) : Void;
	function supportsVertexTextures() : Void;
	function setFaceCulling() : Void;
	function getPixelRatio() : Float;
	function setPixelRatio(value:Float) : Void;
	function setSize(width:Float, height:Float, ?updateStyle:Bool) : Void;
	function setViewport(x:Float, y:Float, width:Float, height:Float) : Void;
	function setScissor() : Void;
	function enableScissorTest() : Void;
	function setClearColor(color:haxe.extern.EitherType<Color, haxe.extern.EitherType<String, Float>>, ?opacity:Float) : Void;
	function setClearColorHex(hex:Int, ?alpha:Float) : Void;
	function getClearColor() : Color;
	function getClearAlpha() : Float;
	function getMaxAnisotropy() : Int;
	function clear() : Void;
	function clearColor() : Void;
	function clearDepth() : Void;
	function clearStencil() : Void;
	function render(scene:Scene, camera:Camera) : Void;
}