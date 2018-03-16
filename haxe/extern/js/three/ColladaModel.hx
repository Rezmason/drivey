package js.three;

import js.html.*;

@:native("THREE.ColladaModel")
extern class ColladaModel
{
	var animations : Array<Dynamic>;
	var kinematics : Dynamic;
	var scene : Scene;
	var library : Dynamic;
}