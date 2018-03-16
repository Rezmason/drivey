package js.three;

import js.html.*;

@:native("THREE.LatheBufferGeometry")
extern class LatheBufferGeometry extends BufferGeometry
{
	var parameters : { var points : Array<Vector3>; var segments : Float; var phiStart : Float; var phiLength : Float; };

	@:overload(function(points:Array<Vector3>,?segments:Int,?phiStart:Float,?phiLength:Float):Void{})
	function new() : Void;
}