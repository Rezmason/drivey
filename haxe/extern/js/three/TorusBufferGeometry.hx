package js.three;

import js.html.*;

@:native("THREE.TorusBufferGeometry")
extern class TorusBufferGeometry extends BufferGeometry
{
	var parameters : { var radius : Float; var tube : Float; var radialSegments : Float; var tubularSegments : Float; var arc : Float; };

	@:overload(function(?radius:Float,?tube:Float,?radialSegments:Int,?tubularSegments:Float,?arc:Float):Void{})
	function new() : Void;
}