package drivey;

import drivey.ThreeUtils.*;

typedef ThreeShapePath = js.three.ShapePath;
typedef ThreeGroup = js.three.Group;

class Form {

    var shapePath:ThreeShapePath;

    public inline static var DIVISIONS:UInt = 250;

    public var object:ThreeGroup;
    public var rgb:Color = 1;
    public var alpha:Float = 1;
    public var height:Float = 0;
    public var extrude:Float = 0;
    public var id(default, null):String;

    public function new(id:String) {
        this.id = id;
        object = new ThreeGroup();
        shapePath = new ThreeShapePath();
    }

    public function clone(id:String):Form {
        var copy:Form = new Form(id);
        copy.rgb = rgb;
        copy.alpha = alpha;
        copy.height = height;
        copy.extrude = extrude;
        return copy;
    }

    public function merge(otherForm:Form) {
        // TODO
    }

    public function expand(amount:Float) {
        // TODO
    }

    public function applyScale(x:Float, y:Float) {
        // TODO
    }

    public function applyTranslation(x:Float, y:Float) {
        // TODO
    }

    public function addCircle(x:Float, y:Float, radius:Float) {
        shapePath.subPaths.push(makeCirclePath(x, y, radius));
    }
    public function addRectangle(x:Float, y:Float, width:Float, height:Float) {
        shapePath.subPaths.push(makePolygonPath(cast [
            new Vector2(x, y),
            new Vector2(x + width, y),
            new Vector2(x + width, y + height),
            new Vector2(x, y + height)
        ]));
    }
    public function addPolygonPath(points:Array<Vector2>) {
        shapePath.subPaths.push(makePolygonPath(cast points));
    }
}
