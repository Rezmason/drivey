package js.three;

import js.html.*;

extern interface Renderer
{
	var domElement : CanvasElement;

	function render(scene:Scene, camera:Camera) : Void;
	function setSize(width:Float, height:Float, ?updateStyle:Bool) : Void;
}