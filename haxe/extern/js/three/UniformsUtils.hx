package js.three;

import js.html.*;

@:native("THREE.UniformsUtils")
extern class UniformsUtils
{
	static function merge(uniforms:Array<Dynamic>) : Dynamic;
	static function clone(uniforms_src:Dynamic) : Dynamic;
}