package js.three;

import js.html.*;

/**
 * Materials describe the appearance of objects. They are defined in a (mostly) renderer-independent way, so you don't have to rewrite materials if you decide to use a different renderer.
 */
@:native("THREE.Material")
extern class Material extends EventDispatcher
{
	/**
	 * Unique number of this material instance.
	 */
	var id : Int;
	var uuid : String;
	/**
	 * Material name. Default is an empty string.
	 */
	var name : String;
	var type : String;
	/**
	 * Defines which of the face sides will be rendered - front, back or both.
	 * Default is THREE.FrontSide. Other options are THREE.BackSide and THREE.DoubleSide.
	 */
	var side : Side;
	/**
	 * Opacity. Default is 1.
	 */
	var opacity : Float;
	/**
	 * Defines whether this material is transparent. This has an effect on rendering, as transparent objects need an special treatment, and are rendered after the opaque (i.e. non transparent) objects. For a working example of this behaviour, check the {@link WebGLRenderer} code.
	 * Default is false.
	 */
	var transparent : Bool;
	/**
	 * Which blending to use when displaying objects with this material. Default is {@link NormalBlending}.
	 */
	var blending : Blending;
	/**
	 * Blending source. It's one of the blending mode constants defined in Three.js. Default is {@link SrcAlphaFactor}.
	 */
	var blendSrc : haxe.extern.EitherType<BlendingSrcFactor, BlendingDstFactor>;
	/**
	 * Blending destination. It's one of the blending mode constants defined in Three.js. Default is {@link OneMinusSrcAlphaFactor}.
	 */
	var blendDst : BlendingDstFactor;
	/**
	 * Blending equation to use when applying blending. It's one of the constants defined in Three.js. Default is AddEquation.
	 */
	var blendEquation : BlendingEquation;
	var blendSrcAlpha : Float;
	var blendDstAlpha : Float;
	var blendEquationAlpha : Float;
	var depthFunc : DepthModes;
	/**
	 * Whether to have depth test enabled when rendering this material. Default is true.
	 */
	var depthTest : Bool;
	/**
	 * Whether rendering this material has any effect on the depth buffer. Default is true.
	 * When drawing 2D overlays it can be useful to disable the depth writing in order to layer several things together without creating z-index artifacts.
	 */
	var depthWrite : Bool;
	var clippingPlanes : Dynamic;
	var clipShadows : Bool;
	var colorWrite : Bool;
	var precision : Dynamic;
	/**
	 * Whether to use polygon offset. Default is false. This corresponds to the POLYGON_OFFSET_FILL WebGL feature.
	 */
	var polygonOffset : Bool;
	/**
	 * Sets the polygon offset factor. Default is 0.
	 */
	var polygonOffsetFactor : Float;
	/**
	 * Sets the polygon offset units. Default is 0.
	 */
	var polygonOffsetUnits : Float;
	/**
	 * Sets the alpha value to be used when running an alpha test. Default is 0.
	 */
	var alphaTest : Float;
	var premultipliedAlpha : Bool;
	/**
	 * Enables/disables overdraw. If greater than zero, polygons are drawn slightly bigger in order to fix antialiasing gaps when using the CanvasRenderer. Default is 0.
	 */
	var overdraw : Float;
	/**
	 * Defines whether this material is visible. Default is true.
	 */
	var visible : Bool;
	/**
	 * Specifies that the material needs to be updated, WebGL wise. Set it to true if you made changes that need to be reflected in WebGL.
	 * This property is automatically set to true when instancing a new material.
	 */
	var needsUpdate : Bool;
	var fog : Bool;
	var lights : Bool;
	var shading : Shading;
	var vertexColors : Colors;
	/**
	 * @deprecated
	 */
	var warpRGB : Color;

	/**
	 * Materials describe the appearance of objects. They are defined in a (mostly) renderer-independent way, so you don't have to rewrite materials if you decide to use a different renderer.
	 */
	function new() : Void;
	function setValues(parameters:MaterialParameters) : Void;
	function toJSON(?meta:Dynamic) : Dynamic;
	function clone() : Material;
	function copy(source:Material) : Material;
	function update() : Void;
	function dispose() : Void;
}