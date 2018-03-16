package js.three;

import js.html.*;

typedef MaterialParameters =
{
	@:optional var name : String;
	@:optional var side : Side;
	@:optional var opacity : Float;
	@:optional var transparent : Bool;
	@:optional var blending : Blending;
	@:optional var blendSrc : haxe.extern.EitherType<BlendingSrcFactor, BlendingDstFactor>;
	@:optional var blendDst : BlendingDstFactor;
	@:optional var blendEquation : BlendingEquation;
	@:optional var blendSrcAlpha : Float;
	@:optional var blendDstAlpha : Float;
	@:optional var blendEquationAlpha : Float;
	@:optional var depthFunc : DepthModes;
	@:optional var depthTest : Bool;
	@:optional var depthWrite : Bool;
	@:optional var colorWrite : Bool;
	@:optional var precision : Float;
	@:optional var polygonOffset : Bool;
	@:optional var polygonOffsetFactor : Float;
	@:optional var polygonOffsetUnits : Float;
	@:optional var alphaTest : Float;
	@:optional var premultipliedAlpha : Bool;
	@:optional var overdraw : Float;
	@:optional var visible : Bool;
	@:optional var fog : Bool;
	@:optional var lights : Bool;
	@:optional var shading : Shading;
	@:optional var vertexColors : Colors;
}