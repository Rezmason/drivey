package js.three;

import js.html.*;

@:native("THREE.Cache")
extern class Cache
{
	static var enabled : Bool;
	static var files : Dynamic;

	static function add(key:String, file:Dynamic) : Void;
	static function get(key:String) : Dynamic;
	static function remove(key:String) : Void;
	static function clear() : Void;
}