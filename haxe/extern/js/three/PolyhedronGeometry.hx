package js.three;

import js.html.*;

@:native("THREE.PolyhedronGeometry")
extern class PolyhedronGeometry extends Geometry
{
	var parameters : { var vertices : Array<Vector3>; var faces : Array<Face3>; var radius : Float; var detail : Float; };
	//var boundingSphere : Sphere;

	@:overload(function(vertices:Array<Vector3>,faces:Array<Face3>,?radius:Float,?detail:Float):Void{})
	function new() : Void;
}