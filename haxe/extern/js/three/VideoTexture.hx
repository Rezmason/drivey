package js.three;

import js.html.*;

@:native("THREE.VideoTexture")
extern class VideoTexture extends Texture
{
	@:overload(function(video:VideoElement,?mapping:Mapping,?wrapS:Wrapping,?wrapT:Wrapping,?magFilter:TextureFilter,?minFilter:TextureFilter,?format:PixelFormat,?type:TextureDataType,?anisotropy:Int):Void{})
	function new() : Void;
}