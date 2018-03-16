package js.three;

import js.html.*;

typedef MeshDepthMaterialParameters =
{>MaterialParameters,
	@:optional var wireframe : Bool;
	@:optional var wireframeLinewidth : Float;
}