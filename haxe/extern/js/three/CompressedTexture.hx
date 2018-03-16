package js.three;

import js.html.*;

@:native("THREE.CompressedTexture")
extern class CompressedTexture extends Texture
{
	//var image : { var width : Float; var height : Float; };

	@:overload(function(mipmaps:Array<ImageData>,width:Float,height:Float,?format:PixelFormat,?type:TextureDataType,?mapping:Mapping,?wrapS:Wrapping,?wrapT:Wrapping,?magFilter:TextureFilter,?minFilter:TextureFilter,?anisotropy:Int,?encoding:TextureEncoding):Void{})
	function new() : Void;
}