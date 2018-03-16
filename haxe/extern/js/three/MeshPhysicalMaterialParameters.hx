package js.three;

import js.html.*;

typedef MeshPhysicalMaterialParameters =
{>MeshStandardMaterialParameters,
	@:optional var reflectivity : Float;
	@:optional var clearCoat : Float;
	@:optional var clearCoatRoughness : Float;
}