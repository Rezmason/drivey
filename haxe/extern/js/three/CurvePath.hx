package js.three;

import js.html.*;

@:native("THREE.CurvePath")
extern class CurvePath<T:Vector> extends Curve<T>
{
	var curves : Array<Curve<T>>;
	var autoClose : Bool;

	function new() : Void;
	function add(curve:Curve<T>) : Void;
	function checkConnection() : Bool;
	function closePath() : Void;
	override function getPoint(t:Float) : T;
	override function getLength() : Float;
	override function updateArcLengths() : Void;
	function getCurveLengths() : Array<Float>;
	override function getSpacedPoints(?divisions:Int) : Array<T>;
	override function getPoints(?divisions:Int) : Array<T>;
	function createPointsGeometry(divisions:Int) : Geometry;
	function createSpacedPointsGeometry(divisions:Int) : Geometry;
	function createGeometry(points:Array<T>) : Geometry;
}