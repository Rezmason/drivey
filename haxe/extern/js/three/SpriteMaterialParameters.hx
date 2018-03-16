package js.three;

import js.html.*;

typedef SpriteMaterialParameters =
{>MaterialParameters,
	@:optional var color : haxe.extern.EitherType<Int, String>;
	@:optional var map : Texture;
	@:optional var rotation : Float;
}