package js.three;

import js.html.*;

/**
 * An extensible curve object which contains methods for interpolation
 * class Curve&lt;T extends Vector&gt;
 */
@:native("THREE.Curve")
extern class Curve<T:Vector>
{
	/**
	 * Returns a vector for point t of the curve where t is between 0 and 1
	 * getPoint(t: number): T;
	 */
	function getPoint(t:Float) : T;
	/**
	 * Returns a vector for point at relative position in curve according to arc length
	 * getPointAt(u: number): T;
	 */
	function getPointAt(u:Float) : T;
	/**
	 * Get sequence of points using getPoint( t )
	 * getPoints(divisions?: number): T[];
	 */
	function getPoints(?divisions:Int) : Array<T>;
	/**
	 * Get sequence of equi-spaced points using getPointAt( u )
	 * getSpacedPoints(divisions?: number): T[];
	 */
	function getSpacedPoints(?divisions:Int) : Array<T>;
	/**
	 * Get total curve arc length
	 */
	function getLength() : Float;
	/**
	 * Get list of cumulative segment lengths
	 */
	function getLengths(?divisions:Int) : Array<Float>;
	/**
	 * Update the cumlative segment distance cache
	 */
	function updateArcLengths() : Void;
	/**
	 * Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equi distance
	 */
	function getUtoTmapping(u:Float, distance:Float) : Float;
	/**
	 * Returns a unit vector tangent at t. If the subclassed curve do not implement its tangent derivation, 2 points a small delta apart will be used to find its gradient which seems to give a reasonable approximation
	 * getTangent(t: number): T;
	 */
	function getTangent(t:Float) : T;
	/**
	 * Returns tangent at equidistance point u on the curve
	 * getTangentAt(u: number): T;
	 */
	function getTangentAt(u:Float) : T;
	/**
	 * @deprecated since r84.
	 */
	static function create(constructorFunc:haxe.Constraints.Function, getPointFunc:haxe.Constraints.Function) : haxe.Constraints.Function;
}