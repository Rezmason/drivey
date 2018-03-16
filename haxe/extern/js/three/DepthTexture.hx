package js.three;

import js.html.*;

@:native("THREE.DepthTexture")
extern class DepthTexture extends Texture
{
	//var image : { var width : Float; var height : Float; };

	@:overload(function(width:Float,heighht:Float,?type:TextureDataType,?mapping:Mapping,?wrapS:Wrapping,?wrapT:Wrapping,?magFilter:TextureFilter,?minFilter:TextureFilter,?anisotropy:Int):Void{})
	function new() : Void;
}