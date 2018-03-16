package js.three;

import js.html.*;

@:native("THREE.Audio")
extern class Audio extends Object3D
{
	//var type : String;
	var context : js.html.audio.AudioContext;
	var source : js.html.audio.AudioBufferSourceNode;
	var gain : js.html.audio.GainNode;
	var autoplay : Bool;
	var startTime : Float;
	var playbackRate : Float;
	var hasPlaybackControl : Bool;
	var isPlaying : Bool;
	var sourceType : String;
	var filters : Array<Dynamic>;

	@:overload(function(listener:AudioListener):Void{})
	function new() : Void;
	function getOutput() : js.html.audio.GainNode;
	function setNodeSource(audioNode:js.html.audio.AudioBufferSourceNode) : Audio;
	function setBuffer(audioBuffer:AudioBuffer) : Audio;
	function play() : Audio;
	function pause() : Audio;
	function stop() : Audio;
	function connect() : Audio;
	function disconnect() : Audio;
	function getFilters() : Array<Dynamic>;
	@:overload(function(filter:Dynamic):Audio{})
	function setFilter(value:Array<Dynamic>) : Audio;
	function getFilter() : Dynamic;
	function setPlaybackRate(value:Float) : Audio;
	function getPlaybackRate() : Float;
	function onEnded() : Void;
	function getLoop() : Bool;
	function setLoop(value:Bool) : Void;
	function getVolume() : Float;
	function setVolume(value:Float) : Audio;
	/**
	 * @deprecated Use AudioLoader instead.
	 */
	function load(file:String) : Audio;
}