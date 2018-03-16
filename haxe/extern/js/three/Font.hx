package js.three;

import js.html.*;

@:native("THREE.Font")
extern class Font
{
	var data : String;

	function new(jsondata:String) : Void;
	function generateShapes(text:String, size:Float, divisions:Int) : Array<Dynamic>;
}