package js.three;

import js.html.*;

@:native("THREE.CylinderGeometry")
extern class CylinderGeometry extends Geometry
{
	var parameters : { var radiusTop : Float; var radiusBottom : Float; var height : Float; var radialSegments : Float; var heightSegments : Float; var openEnded : Bool; var thetaStart : Float; var thetaLength : Float; };

	@:overload(function(?radiusTop:Float,?radiusBottom:Float,?height:Float,?radiusSegments:Int,?heightSegments:Int,?openEnded:Bool,?thetaStart:Float,?thetaLength:Float):Void{})
	function new() : Void;
}