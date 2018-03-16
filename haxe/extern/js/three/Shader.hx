package js.three;

import js.html.*;

extern interface Shader
{
	var uniforms : Dynamic<IUniform>;
	var vertexShader : String;
	var fragmentShader : String;
}