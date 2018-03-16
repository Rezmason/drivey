package js.three;

import js.html.*;

@:native("THREE.FirstPersonControls")
extern class FirstPersonControls
{
	var object : Object3D;
	var target : Vector3;
	var domElement : haxe.extern.EitherType<CanvasElement, HTMLDocument>;
	var enabled : Bool;
	var movementSpeed : Float;
	var lookSpeed : Float;
	var noFly : Bool;
	var lookVertical : Bool;
	var autoForward : Bool;
	var activeLook : Bool;
	var heightSpeed : Bool;
	var heightCoef : Float;
	var heightMin : Float;
	var heightMax : Float;
	var constrainVertical : Bool;
	var verticalMin : Float;
	var verticalMax : Float;
	var autoSpeedFactor : Float;
	var mouseX : Float;
	var mouseY : Float;
	var lat : Float;
	var lon : Float;
	var phi : Float;
	var theta : Float;
	var moveForward : Bool;
	var moveBackward : Bool;
	var moveLeft : Bool;
	var moveRight : Bool;
	var freeze : Bool;
	var mouseDragOn : Bool;

	function new(object:Camera, ?domElement:js.html.Element) : Void;
	function update(delta:Float) : Void;
	function dispose() : Void;
}