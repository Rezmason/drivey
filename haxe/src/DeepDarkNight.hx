import js.three.ShapePath;
import js.three.Color;
import drivey.ThreeUtils.*;

class DeepDarkNight extends Level
{
    inline static var DIVISIONS = 1000 * 2;

    override function build() {
        name = 'The Deep Dark Night';
        tint = new Color(0.7, 0.7, 0.7);
        var roadLineColor = new Color(0.75, 0.75, 0.75);

        roadPath.scale(2, 2);

        var nightLinePath = new ShapePath();
        drawRoadLine(roadPath, nightLinePath, 0, 0.2, DASH(4, 10), 0, 1, DIVISIONS);
        drawRoadLine(roadPath, nightLinePath, -3, 0.15, DASH(30, 2), 0, 1, DIVISIONS);
        drawRoadLine(roadPath, nightLinePath, 3, 0.15, DASH(30, 2), 0, 1, DIVISIONS);
        world.add(makeMesh(nightLinePath, 0, 1, roadLineColor.getHex()));

        var nightPostPath = new ShapePath();
        drawRoadLine(roadPath, nightPostPath, -6, 0.2, DASH(0.2, 50), 0, 1, DIVISIONS);
        drawRoadLine(roadPath, nightPostPath, 6, 0.2, DASH(0.2, 50), 0, 1, DIVISIONS);

        world.add(makeMesh(nightPostPath, 0.6, 1, roadLineColor.getHex()));

        // scr.setTint(0, 0.6, 1);
    }
}
