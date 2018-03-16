package js.three;

import js.html.*;

@:native("THREE.LensFlare")
extern class LensFlare extends Object3D
{
	var lensFlares : Array<LensFlareProperty>;
	var positionScreen : Vector3;
	var customUpdateCallback : LensFlare->Void;

	@:overload(function(?texture:Texture,?size:Float,?distance:Float,?blending:Blending,?color:Color):Void{})
	function new() : Void;
	@:overload(function(object:Object3D):Void{})
	override function add(object:Object3D) : Void;
	@:overload(function(texture:Texture,?size:Float,?distance:Float,?blending:Blending,?color:Color):Void{})
	function updateLensFlares() : Void;
}