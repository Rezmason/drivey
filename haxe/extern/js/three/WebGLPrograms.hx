package js.three;

import js.html.*;

@:native("THREE.WebGLPrograms")
extern class WebGLPrograms
{
	var programs : Array<Dynamic>;

	function new(renderer:WebGLRenderer, capabilities:Dynamic) : Void;
	function getParameters(material:ShaderMaterial, lights:Dynamic, fog:Dynamic, nClipPlanes:Float, object:Dynamic) : Dynamic;
	function getProgramCode(material:ShaderMaterial, parameters:Dynamic) : String;
	function acquireProgram(material:ShaderMaterial, parameters:Dynamic, code:String) : WebGLProgram;
	function releaseProgram(program:WebGLProgram) : Void;
}