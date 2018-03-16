package js.three;

import js.html.*;

@:native("THREE.WebGLProgram")
extern class WebGLProgram
{
	var id : Int;
	var code : String;
	var usedTimes : Float;
	var program : Dynamic;
	var vertexShader : WebGLShader;
	var fragmentShader : WebGLShader;
	/**
	 * @deprecated Use getUniforms() instead.
	 */
	var uniforms : Dynamic;
	/**
	 * @deprecated Use getAttributes() instead.
	 */
	var attributes : Dynamic;

	function new(renderer:WebGLRenderer, code:String, material:ShaderMaterial, parameters:WebGLRendererParameters) : Void;
	function getUniforms() : WebGLUniforms;
	function getAttributes() : Dynamic;
	function destroy() : Void;
}