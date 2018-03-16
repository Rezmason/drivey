package js.three;

import js.html.*;

@:native("THREE.ShapePath")
extern class ShapePath
{
	var subPaths : Array<Dynamic>;
	var currentPath : Dynamic;

	function new() : Void;
	function moveTo(x:Float, y:Float) : Void;
	function lineTo(x:Float, y:Float) : Void;
	function quadraticCurveTo(aCPx:Float, aCPy:Float, aX:Float, aY:Float) : Void;
	function bezierCurveTo(aCP1x:Float, aCP1y:Float, aCP2x:Float, aCP2y:Float, aX:Float, aY:Float) : Void;
	function splineThru(pts:Array<Vector2>) : Void;
	function toShapes(isCCW:Bool, noHoles:Dynamic) : Array<Shape>;
}