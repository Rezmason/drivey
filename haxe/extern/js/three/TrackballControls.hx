package js.three;

import js.html.*;

@:native("THREE.TrackballControls")
extern class TrackballControls extends EventDispatcher
{
	var object : Camera;
	var domElement : js.html.Element;
	var enabled : Bool;
	var screen : { var left : Float; var top : Float; var width : Float; var height : Float; };
	var rotateSpeed : Float;
	var zoomSpeed : Float;
	var panSpeed : Float;
	var noRotate : Bool;
	var noZoom : Bool;
	var noPan : Bool;
	var noRoll : Bool;
	var staticMoving : Bool;
	var dynamicDampingFactor : Float;
	var minDistance : Float;
	var maxDistance : Float;
	var keys : Array<Float>;
	var target : Vector3;
	var position0 : Vector3;
	var target0 : Vector3;
	var up0 : Vector3;

	@:overload(function(object:Camera,?domElement:js.html.Element):Void{})
	function new() : Void;
	function update() : Void;
	function reset() : Void;
	function checkDistances() : Void;
	function zoomCamera() : Void;
	function panCamera() : Void;
	function rotateCamera() : Void;
	function handleResize() : Void;
	function handleEvent(event:Dynamic) : Void;
}