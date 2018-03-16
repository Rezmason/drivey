package js.three;

import js.html.*;

@:native("THREE.GeometryUtils")
extern class GeometryUtils
{
	/**
	 * @deprecated Use geometry.merge( geometry2, matrix, materialIndexOffset ).
	 */
	static function merge(geometry1:Dynamic, geometry2:Dynamic, materialIndexOffset:Dynamic) : Dynamic;
	/**
	 * @deprecated Use geometry.center().
	 */
	static function center(geometry:Dynamic) : Dynamic;
}