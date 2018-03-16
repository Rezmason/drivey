package js.three;

import js.html.*;

@:native("THREE.LensFlarePlugin")
extern class LensFlarePlugin
{
	function new(renderer:WebGLRenderer, flares:Array<Dynamic>) : Void;
	function render(scene:Scene, camera:Camera, viewportWidth:Float, viewportHeight:Float) : Void;
}