package js.three;

import js.html.*;

@:native("THREE.TextGeometry")
extern class TextGeometry extends ExtrudeGeometry
{
	var parameters : { var font : Font; var size : Float; var height : Float; var curveSegments : Float; var bevelEnabled : Bool; var bevelThickness : Float; var bevelSize : Float; };

	@:overload(function(text:String,?parameters:TextGeometryParameters):Void{})
	function new() : Void;
}