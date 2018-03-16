package js.three;

import js.html.*;

/**
 * The WebGL renderer displays your beautifully crafted scenes using WebGL, if your device supports it.
 * This renderer has way better performance than CanvasRenderer.
 * 
 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLRenderer.js">src/renderers/WebGLRenderer.js</a>
 */
@:native("THREE.WebGLRenderer")
extern class WebGLRenderer
	implements Renderer
{
	/**
	 * A Canvas where the renderer draws its output.
	 * This is automatically created by the renderer in the constructor (if not provided already); you just need to add it to your page.
	 */
	var domElement : CanvasElement;
	/**
	 * The HTML5 Canvas's 'webgl' context obtained from the canvas where the renderer will draw.
	 */
	var context : js.html.webgl.RenderingContext;
	/**
	 * Defines whether the renderer should automatically clear its output before rendering.
	 */
	var autoClear : Bool;
	/**
	 * If autoClear is true, defines whether the renderer should clear the color buffer. Default is true.
	 */
	var autoClearColor : Bool;
	/**
	 * If autoClear is true, defines whether the renderer should clear the depth buffer. Default is true.
	 */
	var autoClearDepth : Bool;
	/**
	 * If autoClear is true, defines whether the renderer should clear the stencil buffer. Default is true.
	 */
	var autoClearStencil : Bool;
	/**
	 * Defines whether the renderer should sort objects. Default is true.
	 */
	var sortObjects : Bool;
	var clippingPlanes : Array<Dynamic>;
	var localClippingEnabled : Bool;
	var extensions : WebGLExtensions;
	/**
	 * Default is false.
	 */
	var gammaInput : Bool;
	/**
	 * Default is false.
	 */
	var gammaOutput : Bool;
	var physicallyCorrectLights : Bool;
	var toneMapping : ToneMapping;
	var toneMappingExposure : Float;
	var toneMappingWhitePoint : Float;
	/**
	 * Default is false.
	 */
	var shadowMapDebug : Bool;
	/**
	 * Default is 8.
	 */
	var maxMorphTargets : Float;
	/**
	 * Default is 4.
	 */
	var maxMorphNormals : Float;
	/**
	 * An object with a series of statistical information about the graphics board memory and the rendering process. Useful for debugging or just for the sake of curiosity. The object contains the following fields:
	 */
	var info : { var memory : { var geometries : Float; var textures : Float; }; var render : { var calls : Float; var vertices : Float; var faces : Float; var points : Float; }; var programs : Float; };
	var shadowMap : WebGLShadowMap;
	var pixelRation : Float;
	var capabilities : WebGLCapabilities;
	var properties : WebGLProperties;
	var state : WebGLState;
	var allocTextureUnit : Dynamic;
	/**
	 * @deprecated
	 */
	var gammaFactor : Float;
	var shadowMapEnabled : Bool;
	var shadowMapType : ShadowMapType;
	var shadowMapCullFace : CullFace;

	/**
	 * The WebGL renderer displays your beautifully crafted scenes using WebGL, if your device supports it.
	 * This renderer has way better performance than CanvasRenderer.
	 * 
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLRenderer.js">src/renderers/WebGLRenderer.js</a>
	 */
	function new(?parameters:WebGLRendererParameters) : Void;
	/**
	 * Return the WebGL context.
	 */
	function getContext() : js.html.webgl.RenderingContext;
	function getContextAttributes() : Dynamic;
	function forceContextLoss() : Void;
	function getMaxAnisotropy() : Int;
	function getPrecision() : String;
	function getPixelRatio() : Float;
	function setPixelRatio(value:Float) : Void;
	function getSize() : { var width : Float; var height : Float; };
	/**
	 * Resizes the output canvas to (width, height), and also sets the viewport to fit that size, starting in (0, 0).
	 */
	function setSize(width:Float, height:Float, ?updateStyle:Bool) : Void;
	/**
	 * Sets the viewport to render from (x, y) to (x + width, y + height).
	 */
	function setViewport(?x:Float, ?y:Float, ?width:Float, ?height:Float) : Void;
	/**
	 * Sets the scissor area from (x, y) to (x + width, y + height).
	 */
	function setScissor(x:Float, y:Float, width:Float, height:Float) : Void;
	/**
	 * Enable the scissor test. When this is enabled, only the pixels within the defined scissor area will be affected by further renderer actions.
	 */
	function setScissorTest(enable:Bool) : Void;
	/**
	 * Returns a THREE.Color instance with the current clear color.
	 */
	function getClearColor() : Color;
	/**
	 * Sets the clear color, using color for the color and alpha for the opacity.
	 */
	@:overload(function(color:String, ?alpha:Float):Void{})
	@:overload(function(color:Float, ?alpha:Float):Void{})
	function setClearColor(color:Color, ?alpha:Float) : Void;
	/**
	 * Sets the clear color, using color for the color and alpha for the opacity.
	 */
	/**
	 * Sets the clear color, using color for the color and alpha for the opacity.
	 */
	/**
	 * Returns a float with the current clear alpha. Ranges from 0 to 1.
	 */
	function getClearAlpha() : Float;
	function setClearAlpha(alpha:Float) : Void;
	/**
	 * Tells the renderer to clear its color, depth or stencil drawing buffer(s).
	 * Arguments default to true
	 */
	function clear(?color:Bool, ?depth:Bool, ?stencil:Bool) : Void;
	function clearColor() : Void;
	function clearDepth() : Void;
	function clearStencil() : Void;
	function clearTarget(renderTarget:WebGLRenderTarget, color:Bool, depth:Bool, stencil:Bool) : Void;
	function resetGLState() : Void;
	function dispose() : Void;
	/**
	 * Tells the shadow map plugin to update using the passed scene and camera parameters.
	 */
	function renderBufferImmediate(object:Object3D, program:Dynamic, material:Material) : Void;
	function renderBufferDirect(camera:Camera, fog:Fog, material:Material, geometryGroup:Dynamic, object:Object3D) : Void;
	/**
	 * Render a scene using a camera.
	 * The render is done to the renderTarget (if specified) or to the canvas as usual.
	 * If forceClear is true, the canvas will be cleared before rendering, even if the renderer's autoClear property is false.
	 */
	@:overload(function(scene:Scene,camera:Camera,?renderTarget:RenderTarget,?forceClear:Bool):Void{})
	function render(scene:Scene, camera:Camera) : Void;
	/**
	 * Used for setting the gl frontFace, cullFace states in the GPU, thus enabling/disabling face culling when rendering.
	 * If cullFace is false, culling will be disabled.
	 */
	function setFaceCulling(?cullFace:CullFace, ?frontFace:FrontFaceDirection) : Void;
	/**
	 * @deprecated
	 */
	function setTexture(texture:Texture, slot:Float) : Void;
	function setTexture2D(texture:Texture, slot:Float) : Void;
	function setTextureCube(texture:Texture, slot:Float) : Void;
	function getCurrentRenderTarget() : RenderTarget;
	function setRenderTarget(renderTarget:RenderTarget) : Void;
	function readRenderTargetPixels(renderTarget:RenderTarget, x:Float, y:Float, width:Float, height:Float, buffer:Dynamic) : Void;
	function supportsFloatTextures() : Dynamic;
	function supportsHalfFloatTextures() : Dynamic;
	function supportsStandardDerivatives() : Dynamic;
	function supportsCompressedTextureS3TC() : Dynamic;
	function supportsCompressedTexturePVRTC() : Dynamic;
	function supportsBlendMinMax() : Dynamic;
	function supportsVertexTextures() : Dynamic;
	function supportsInstancedArrays() : Dynamic;
	function enableScissorTest(boolean:Dynamic) : Dynamic;
}