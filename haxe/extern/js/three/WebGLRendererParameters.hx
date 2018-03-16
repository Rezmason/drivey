package js.three;

import js.html.*;

typedef WebGLRendererParameters =
{
	/**
	 * A Canvas where the renderer draws its output.
	 */
	@:optional var canvas : CanvasElement;
	/**
	 * shader precision. Can be "highp", "mediump" or "lowp".
	 */
	@:optional var precision : String;
	/**
	 * default is true.
	 */
	@:optional var alpha : Bool;
	/**
	 * default is true.
	 */
	@:optional var premultipliedAlpha : Bool;
	/**
	 * default is false.
	 */
	@:optional var antialias : Bool;
	/**
	 * default is true.
	 */
	@:optional var stencil : Bool;
	/**
	 * default is false.
	 */
	@:optional var preserveDrawingBuffer : Bool;
	/**
	 * default is 0x000000.
	 */
	@:optional var clearColor : Float;
	/**
	 * default is 0.
	 */
	@:optional var clearAlpha : Float;
	@:optional var devicePixelRatio : Float;
	/**
	 * default is false.
	 */
	@:optional var logarithmicDepthBuffer : Bool;
}