package js.three;

import js.html.*;

@:native("THREE.CubeTexture")
extern class CubeTexture extends Texture
{
	var images : Dynamic;

	@:overload(function(?images:Array<Dynamic>,?mapping:Mapping,?wrapS:Wrapping,?wrapT:Wrapping,?magFilter:TextureFilter,?minFilter:TextureFilter,?format:PixelFormat,?type:TextureDataType,?anisotropy:Int,?encoding:TextureEncoding):Void{})
	function new() : Void;
}