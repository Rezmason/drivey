package js.three;

import js.html.*;

@:native("THREE.PlaneGeometry")
extern class PlaneGeometry extends Geometry
{
	var parameters : { var width : Float; var height : Float; var widthSegments : Float; var heightSegments : Float; };

	@:overload(function(width:Float,height:Float,?widthSegments:Float,?heightSegments:Int):Void{})
	function new() : Void;
}