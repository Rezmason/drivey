package js.three;

import js.html.*;

@:native("THREE.BoxBufferGeometry")
extern class BoxBufferGeometry extends BufferGeometry
{
	var parameters : { var width : Float; var height : Float; var depth : Float; var widthSegments : Float; var heightSegments : Float; var depthSegments : Float; };

	@:overload(function(width:Float,height:Float,depth:Float,?widthSegments:Float,?heightSegments:Int,?depthSegments:Float):Void{})
	function new() : Void;
}