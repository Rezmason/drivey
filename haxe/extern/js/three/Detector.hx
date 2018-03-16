package js.three;

import js.html.*;

@:native("THREE.Detector")
extern class Detector
{
	static var canvas : Bool;
	static var webgl : Bool;
	static var workers : Bool;
	static var fileapi : Bool;

	static function getWebGLErrorMessage() : js.html.Element;
	static function addGetWebGLMessage(parameters:{ @:optional var id : String; @:optional var parent : js.html.Element; }) : Void;
}