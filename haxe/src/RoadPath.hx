import drivey.ThreeUtils.*;

// import js.three.Group;
// import js.three.Path;
// import js.three.ShapePath;
import js.three.Vector2;

// import drivey.ThreeUtils.*;

class RoadPath {

    public inline static var EPSILON:Float = 0.00001;

    public var length(get, never):Float;
    public var curve(default, null):js.three.Path;
    var points:Array<Vector2>;
    var approximation:Array<Vector2>;

    public function new(points:Array<Vector2>) {
        this.points = points;
        curve = makeSplinePath(cast points, true);
    }

    public function clone():RoadPath return new RoadPath(points);
    public function scale(x:Float, y:Float) {
        points = [for (point in points) new Vector2(point.x * x, point.y * y)];
        approximation = null;
        curve = makeSplinePath(cast points, true);
    }

    public function getPoint(t:Float):Vector2 {
        var point = curve.getPoint(t % 1);
        return new Vector2(point.x, point.y);
    }
    public function getNormal(t:Float):Vector2 {
        // var point1 = getPoint(t + 1 - EPSILON);
        // var point2 = getPoint(t + EPSILON);
        // return !(point2 - point1);
        var point = getPoint(t + EPSILON).sub(getPoint(t + 1 - EPSILON));
        return cast point.normalize();
    }
    public function getTangent(t:Float):Vector2 {
        var normal = getNormal(t);
        return new Vector2(-normal.y, normal.x);
    }
    public function getNearest(to:Vector2):Float {
        if (approximation == null) {
            approximation = [for (i in 0...1000) getPoint(i / 1000)];
        }
        return minDistSquaredIndex(approximation, to);
    }

    function get_length() return curve.getLength();
}
