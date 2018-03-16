package js.three;

import js.html.*;

extern interface IFog
{
	var name : String;
	var color : Color;

	function clone() : IFog;
	function toJSON() : Dynamic;
}