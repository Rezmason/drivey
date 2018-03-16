package js.three;

import js.html.*;

@:native("THREE.RingGeometry")
extern class RingGeometry extends Geometry
{
	var parameters : { var innerRadius : Float; var outerRadius : Float; var thetaSegments : Float; var phiSegments : Float; var thetaStart : Float; var thetaLength : Float; };

	@:overload(function(?innerRadius:Float,?outerRadius:Float,?thetaSegments:Float,?phiSegments:Float,?thetaStart:Float,?thetaLength:Float):Void{})
	function new() : Void;
}