package js.three;

import js.html.*;

@:native("THREE.WebGLUniforms")
extern class WebGLUniforms
{
	var renderer : WebGLRenderer;

	function new(gl:Dynamic, program:WebGLProgram, renderer:WebGLRenderer) : Void;
	function setValue(gl:Dynamic, value:Dynamic, ?renderer:Dynamic) : Void;
	function set(gl:Dynamic, object:Dynamic, name:String) : Void;
	function setOptional(gl:Dynamic, object:Dynamic, name:String) : Void;
	static function upload(gl:Dynamic, seq:Dynamic, values:Array<Dynamic>, renderer:Dynamic) : Void;
	static function seqWithValue(seq:Dynamic, values:Array<Dynamic>) : Array<Dynamic>;
	static function splitDynamic(seq:Dynamic, values:Array<Dynamic>) : Array<Dynamic>;
	static function evalDynamic(seq:Dynamic, values:Array<Dynamic>, object:Dynamic, camera:Dynamic) : Array<Dynamic>;
}