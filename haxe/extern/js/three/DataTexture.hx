package js.three;

import js.html.*;

@:native("THREE.DataTexture")
extern class DataTexture extends Texture
{
	//var image : ImageData;

	@:overload(function(data:haxe.extern.EitherType<ArrayBuffer,haxe.extern.EitherType<Int8Array,haxe.extern.EitherType<Uint8Array,haxe.extern.EitherType<Uint8ClampedArray,haxe.extern.EitherType<Int16Array,haxe.extern.EitherType<Uint16Array,haxe.extern.EitherType<Int32Array,haxe.extern.EitherType<Uint32Array,haxe.extern.EitherType<Float32Array,Float64Array>>>>>>>>>,width:Float,height:Float,format:PixelFormat,type:TextureDataType,mapping:Mapping,wrapS:Wrapping,wrapT:Wrapping,magFilter:TextureFilter,minFilter:TextureFilter,?anisotropy:Int,?encoding:TextureEncoding):Void{})
	function new() : Void;
}