package js.three;

import js.html.*;

/**
 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/DirectGeometry.js">src/core/DirectGeometry.js</a>
 */
@:native("THREE.DirectGeometry")
extern class DirectGeometry extends EventDispatcher
{
	var id : Int;
	var uuid : String;
	var name : String;
	var type : String;
	var indices : Array<Float>;
	var vertices : Array<Vector3>;
	var normals : Array<Vector3>;
	var colors : Array<Color>;
	var uvs : Array<Vector2>;
	var uvs2 : Array<Vector2>;
	var groups : Array<{ var start : Float; var materialIndex : Float; }>;
	var morphTargets : Array<MorphTarget>;
	var skinWeights : Array<Float>;
	var skinIndices : Array<Float>;
	var boundingBox : Box3;
	var boundingSphere : Sphere;
	var verticesNeedUpdate : Bool;
	var normalsNeedUpdate : Bool;
	var colorsNeedUpdate : Bool;
	var uvsNeedUpdate : Bool;
	var groupsNeedUpdate : Bool;

	/**
	 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/DirectGeometry.js">src/core/DirectGeometry.js</a>
	 */
	function new() : Void;
	function computeBoundingBox() : Void;
	function computeBoundingSphere() : Void;
	function computeGroups(geometry:Geometry) : Void;
	function fromGeometry(geometry:Geometry) : DirectGeometry;
	function dispose() : Void;
	override function addEventListener(type:String, listener:Event->Void) : Void;
	override function hasEventListener(type:String, listener:Event->Void) : Void;
	override function removeEventListener(type:String, listener:Event->Void) : Void;
	override function dispatchEvent(event:{ var type : String; }) : Void;
}