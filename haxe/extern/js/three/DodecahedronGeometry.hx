package js.three;

import js.html.*;

@:native("THREE.DodecahedronGeometry")
extern class DodecahedronGeometry extends Geometry
{
	var parameters : { var radius : Float; var detail : Float; };

	@:overload(function(radius:Float,detail:Float):Void{})
	function new() : Void;
}