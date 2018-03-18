package js.three;

import js.html.*;

@:native("THREE.CatmullRomCurve3")
extern class CatmullRomCurve3 extends Curve<Vector3>
{
	var points : Array<Vector3>;
    var curveType : String;
    var closed : Bool;

	function new(?points:Array<Vector3>, ?closed:Bool, ?curveType:String, ?tension:Float ) : Void;
	override function getPoint(t:Float) : Vector3;
}
