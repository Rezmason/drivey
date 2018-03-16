package js.three;

import js.html.*;

@:native("THREE.CircleGeometry")
extern class CircleGeometry extends Geometry
{
	var parameters : { var radius : Float; var segments : Float; var thetaStart : Float; var thetaLength : Float; };

	@:overload(function(?radius:Float,?segments:Int,?thetaStart:Float,?thetaLength:Float):Void{})
	function new() : Void;
}