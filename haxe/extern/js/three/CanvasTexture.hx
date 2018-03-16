package js.three;

import js.html.*;

@:native("THREE.CanvasTexture")
extern class CanvasTexture extends Texture
{
	@:overload(function(canvas:haxe.extern.EitherType<ImageElement,haxe.extern.EitherType<CanvasElement,VideoElement>>,?mapping:Mapping,?wrapS:Wrapping,?wrapT:Wrapping,?magFilter:TextureFilter,?minFilter:TextureFilter,?format:PixelFormat,?type:TextureDataType,?anisotropy:Int):Void{})
	function new() : Void;
}