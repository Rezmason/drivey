package js.three;

import js.html.*;

@:native("THREE.AudioListener")
extern class AudioListener extends Object3D
{
	//var type : String;
	var context : js.html.audio.AudioContext;
	var gain : js.html.audio.GainNode;

	function new() : Void;
	function getInput() : js.html.audio.GainNode;
	function removeFilter() : Void;
	function setFilter(value:Dynamic) : Void;
	function getFilter() : Dynamic;
	function setMasterVolume(value:Float) : Void;
	function getMasterVolume() : Float;
}