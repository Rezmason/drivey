package js.three;

import js.html.*;

@:native("THREE.CatmullRomCurve3")
extern class CatmullRomCurve3 extends Curve<Vector3>
{
	var points : Array<Vector3>;

	function new(?points:Array<Vector3>) : Void;
	override function getPoint(t:Float) : Vector3;
}