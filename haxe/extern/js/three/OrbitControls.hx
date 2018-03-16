package js.three;

import js.html.*;

@:native("THREE.OrbitControls")
extern class OrbitControls
{
	var object : Camera;
	var domElement : haxe.extern.EitherType<js.html.Element, HTMLDocument>;
	var enabled : Bool;
	var target : Vector3;
	var center : Vector3;
	var enableZoom : Bool;
	var zoomSpeed : Float;
	var minDistance : Float;
	var maxDistance : Float;
	var enableRotate : Bool;
	var rotateSpeed : Float;
	var enablePan : Bool;
	var keyPanSpeed : Float;
	var autoRotate : Bool;
	var autoRotateSpeed : Float;
	var minPolarAngle : Float;
	var maxPolarAngle : Float;
	var minAzimuthAngle : Float;
	var maxAzimuthAngle : Float;
	var enableKeys : Bool;
	var keys : { var LEFT : Float; var UP : Float; var RIGHT : Float; var BOTTOM : Float; };
	var mouseButtons : { var ORBIT : MOUSE; var ZOOM : MOUSE; var PAN : MOUSE; };
	var enableDamping : Bool;
	var dampingFactor : Float;

	function new(object:Camera, ?domElement:js.html.Element) : Void;
	function rotateLeft(?angle:Float) : Void;
	function rotateUp(?angle:Float) : Void;
	function panLeft(?distance:Float) : Void;
	function panUp(?distance:Float) : Void;
	function pan(deltaX:Float, deltaY:Float) : Void;
	function dollyIn(dollyScale:Float) : Void;
	function dollyOut(dollyScale:Float) : Void;
	function update() : Void;
	function reset() : Void;
	function dispose() : Void;
	function getPolarAngle() : Float;
	function getAzimuthalAngle() : Float;
	function addEventListener(type:String, listener:Dynamic->Void) : Void;
	function hasEventListener(type:String, listener:Dynamic->Void) : Void;
	function removeEventListener(type:String, listener:Dynamic->Void) : Void;
	function dispatchEvent(event:{ var type : String; var target : Dynamic; }) : Void;
}