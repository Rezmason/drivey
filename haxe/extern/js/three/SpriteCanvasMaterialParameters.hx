package js.three;

import js.html.*;

typedef SpriteCanvasMaterialParameters =
{>MaterialParameters,
	@:optional var color : Float;
	@:optional var program : CanvasRenderingContext2D->Color->Void;
}