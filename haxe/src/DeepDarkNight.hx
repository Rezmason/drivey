import js.three.ShapePath;
import js.three.Color;
import ThreeUtils.*;

class DeepDarkNight extends Level
{
    override function build() {
        name = 'The Deep Dark Night';
        tint = new Color(0.7, 0.7, 0.7);
        var roadLineColor = 0.75;

        roadPath.scale(2, 2);

        var nightLinePath = new ShapePath();
        drawRoadLine(roadPath, nightLinePath, 0, 0.2, DASH(4, 10), 0, 1, 1);
        drawRoadLine(roadPath, nightLinePath, -3, 0.15, DASH(30, 2), 0, 1, 10);
        drawRoadLine(roadPath, nightLinePath, 3, 0.15, DASH(30, 2), 0, 1, 10);
        meshes.push(makeMesh(nightLinePath, 0, 1, roadLineColor));

        var nightPostPath = new ShapePath();
        drawRoadLine(roadPath, nightPostPath, -6, 0.2, DASH(0.2, 50), 0, 1, 1);
        drawRoadLine(roadPath, nightPostPath, 6, 0.2, DASH(0.2, 50), 0, 1, 1);

        meshes.push(makeMesh(nightPostPath, 0.6, 1, roadLineColor));

        // scr.setTint(0, 0.6, 1);
    }
}
