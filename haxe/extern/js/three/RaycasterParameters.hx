package js.three;

import js.html.*;

typedef RaycasterParameters =
{
	@:optional var Mesh : Dynamic;
	@:optional var Line : Dynamic;
	@:optional var LOD : Dynamic;
	@:optional var Points : { var threshold : Float; };
	@:optional var Sprite : Dynamic;
}