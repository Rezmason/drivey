package js.three;

import js.html.*;

@:native("THREE.TubeBufferGeometry")
extern class TubeBufferGeometry extends BufferGeometry
{
	var parameters : { var path : Curve<Vector3>; var segments : Float; var radius : Float; var radialSegments : Float; var closed : Bool; };
	var tangents : Array<Vector3>;
	var normals : Array<Vector3>;
	var binormals : Array<Vector3>;

	@:overload(function(path:Curve<Vector3>,?segments:Int,?radius:Float,?radiusSegments:Int,?closed:Bool):Void{})
	function new() : Void;
}