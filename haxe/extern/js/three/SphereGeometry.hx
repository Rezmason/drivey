package js.three;

import js.html.*;

/**
 * A class for generating sphere geometries
 */
@:native("THREE.SphereGeometry")
extern class SphereGeometry extends Geometry
{
	var parameters : { var radius : Float; var widthSegments : Float; var heightSegments : Float; var phiStart : Float; var phiLength : Float; var thetaStart : Float; var thetaLength : Float; };

	/**
	 * A class for generating sphere geometries
	 */
	@:overload(function(radius:Float,?widthSegments:Float,?heightSegments:Int,?phiStart:Float,?phiLength:Float,?thetaStart:Float,?thetaLength:Float):Void{})
	function new() : Void;
}