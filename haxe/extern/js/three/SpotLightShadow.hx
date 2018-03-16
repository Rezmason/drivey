package js.three;

import js.html.*;

@:native("THREE.SpotLightShadow")
extern class SpotLightShadow extends LightShadow
{
	function update(light:Light) : Void;
}