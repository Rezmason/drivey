package js.three;

import js.html.*;

@:native("THREE.PropertyBinding")
extern class PropertyBinding
{
	var path : String;
	var parsedPath : Dynamic;
	var node : Dynamic;
	var rootNode : Dynamic;
	var BindingType : Dynamic<Float>;
	var Versioning : Dynamic<Float>;
	var GetterByBindingType : Array<haxe.Constraints.Function>;
	var SetterByBindingTypeAndVersioning : Array<Array<haxe.Constraints.Function>>;

	function new(rootNode:Dynamic, path:String, ?parsedPath:Dynamic) : Void;
	function getValue(targetArray:Dynamic, offset:Float) : Dynamic;
	function setValue(sourceArray:Dynamic, offset:Float) : Void;
	function bind() : Void;
	function unbind() : Void;
	static function create(root:Dynamic, path:Dynamic, ?parsedPath:Dynamic) : haxe.extern.EitherType<PropertyBinding, js.three.propertyBinding.Composite>;
	static function parseTrackName(trackName:String) : Dynamic;
	static function findNode(root:Dynamic, nodeName:String) : Dynamic;
}