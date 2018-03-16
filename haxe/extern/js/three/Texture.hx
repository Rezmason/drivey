package js.three;

import js.html.*;

@:native("THREE.Texture")
extern class Texture extends EventDispatcher
{
	var id : Int;
	var uuid : String;
	var name : String;
	var sourceFile : String;
	var image : Dynamic;
	var mipmaps : Array<ImageData>;
	var mapping : Mapping;
	var wrapS : Wrapping;
	var wrapT : Wrapping;
	var magFilter : TextureFilter;
	var minFilter : TextureFilter;
	var anisotropy : Int;
	var format : PixelFormat;
	var type : TextureDataType;
	var offset : Vector2;
	var repeat : Vector2;
	var generateMipmaps : Bool;
	var premultiplyAlpha : Bool;
	var flipY : Bool;
	var unpackAlignment : Float;
	var encoding : TextureEncoding;
	var version : Float;
	var needsUpdate : Bool;
	var onUpdate : Void->Void;
	var DEFAULT_IMAGE : Dynamic;
	var DEFAULT_MAPPING : Dynamic;

	@:overload(function(?image:haxe.extern.EitherType<ImageElement,haxe.extern.EitherType<CanvasElement,VideoElement>>,?mapping:Mapping,?wrapS:Wrapping,?wrapT:Wrapping,?magFilter:TextureFilter,?minFilter:TextureFilter,?format:PixelFormat,?type:TextureDataType,?anisotropy:Int,?encoding:TextureEncoding):Void{})
	function new() : Void;
	function clone() : Texture;
	function copy(source:Texture) : Texture;
	function toJSON(meta:Dynamic) : Dynamic;
	function dispose() : Void;
	function transformUv(uv:Vector) : Void;
}