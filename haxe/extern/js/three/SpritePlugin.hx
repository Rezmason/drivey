package js.three;

import js.html.*;

@:native("THREE.SpritePlugin")
extern class SpritePlugin
{
	function new(renderer:WebGLRenderer, sprites:Array<Dynamic>) : Void;
	function render(scene:Scene, camera:Camera, viewportWidth:Float, viewportHeight:Float) : Void;
}