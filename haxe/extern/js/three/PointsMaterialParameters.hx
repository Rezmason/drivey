package js.three;

import js.html.*;

typedef PointsMaterialParameters =
{>MaterialParameters,
	@:optional var color : haxe.extern.EitherType<Int, String>;
	@:optional var map : Texture;
	@:optional var size : Float;
	@:optional var sizeAttenuation : Bool;
}