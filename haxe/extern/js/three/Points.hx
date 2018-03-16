package js.three;

import js.html.*;

/**
 * A class for displaying particles in the form of variable size points. For example, if using the WebGLRenderer, the particles are displayed using GL_POINTS.
 * 
 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/objects/ParticleSystem.js">src/objects/ParticleSystem.js</a>
 */
@:native("THREE.Points")
extern class Points extends Object3D
{
	/**
	 * An instance of Geometry or BufferGeometry, where each vertex designates the position of a particle in the system.
	 */
	var geometry : haxe.extern.EitherType<Geometry, BufferGeometry>;
	/**
	 * An instance of Material, defining the object's appearance. Default is a PointsMaterial with randomised colour.
	 */
	var material : Material;

	/**
	 * A class for displaying particles in the form of variable size points. For example, if using the WebGLRenderer, the particles are displayed using GL_POINTS.
	 * 
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/objects/ParticleSystem.js">src/objects/ParticleSystem.js</a>
	 */
	@:overload(function(?geometry:haxe.extern.EitherType<Geometry,BufferGeometry>,?material:Material):Void{})
	function new() : Void;
	override function raycast(raycaster:Raycaster, intersects:Dynamic) : Void;
}