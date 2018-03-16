package js.three;

import js.html.*;

@:native("THREE.SphereBufferGeometry")
extern class SphereBufferGeometry extends BufferGeometry
{
	var parameters : { var radius : Float; var widthSegments : Float; var heightSegments : Float; var phiStart : Float; var phiLength : Float; var thetaStart : Float; var thetaLength : Float; };

	@:overload(function(radius:Float,?widthSegments:Float,?heightSegments:Int,?phiStart:Float,?phiLength:Float,?thetaStart:Float,?thetaLength:Float):Void{})
	function new() : Void;
}