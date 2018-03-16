package js.three;

import js.html.*;

@:native("THREE.OctahedronGeometry")
extern class OctahedronGeometry extends PolyhedronGeometry
{
	@:overload(function(radius:Float,detail:Float):Void{})
	function new() : Void;
}