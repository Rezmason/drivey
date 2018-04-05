package drivey.levels;

import drivey.Utils.*;

class Tunnel extends Level {
    override function build() {
        name = 'The Tunnel';
        tint = new Color(0.2, 0.7, 0.1);
        skyLow = skyHigh = 0;
        var tarmac = 0.1;
        var whiteLines = 0.8;
        var yellowLines = 0.75;
        var lightColor = 1;

        // do white lines
        var layer = addLayer('tunnelTarmac');
        layer.rgb = tarmac;
        layer.merge(makeRoadLine('tunnelTarmac', roadPath, 0, 7, 30, 0));

        var layer = addLayer('tunnelWhiteLines');
        layer.rgb = whiteLines;
        layer.merge(makeRoadLine('tunnelWhiteLines1', roadPath, -3.5, 0.2, 30, 2));
        layer.merge(makeRoadLine('tunnelWhiteLines2', roadPath, 3.5, 0.2, 30, 2));
        layer.merge(makeRoadLine('tunnelWhiteLines3', roadPath, -0.15, 0.15, -4, 8));

        // do yellow lines
        var layer = addLayer('tunnelYellowLines');
        layer.rgb = yellowLines;
        layer.merge(makeRoadLine('tunnelYellowLines', roadPath, 0.125, 0.125, 30, 0));

        // do crossings
        if (true)
        {
            var layer = addLayer('tunnelCrossing');
            layer.rgb = tarmac;
            layer.merge(makeRoadLine('tunnelCrossing', roadPath, 0, 1, -2, 200));
            layer.expand(1);

            var layer = addLayer('tunnelCrossingLines');
            layer.rgb = whiteLines;
            for (i in 0...6)
            {
                var width = 6.0 / 6 * 0.5;
                layer.merge(makeRoadLine('tunnelCrossingLine$i', roadPath, i * 2 * width - 3 + width, width, -2, 200));
            }
        }

        // do lights
        if (true)
        {
            var layer = addLayer('tunnelLights');
            layer.rgb = lightColor;

            layer.height = 4;
            layer.extrude = 0.1;
            layer.merge(makeRoadLine('tunnelLight1', roadPath, -4, 0.1, -4, 6));
            layer.merge(makeRoadLine('tunnelLight2', roadPath, 4, 0.1, -4, 6));
        }

        if (true)   // walls
        {
            var layer:Form = addLayer('tunnelWall1');
            layer.rgb = skyLow;

            layer.height = 4;
            layer.extrude = 4;
            layer.merge(makeRoadLine('tunnelWall1Left', roadPath, -5, 0.4, 100, 0));
            layer.merge(makeRoadLine('tunnelWall1Right', roadPath, 5, 0.4, 100, 0));

            var layer:Form = addLayer('tunnelWall2');
            layer.rgb = skyLow;
            layer.height = 0;
            layer.extrude = -4;
            layer.merge(makeRoadLine('tunnelWall2Left', roadPath, -5, 0.4, 200, 0));
            layer.merge(makeRoadLine('tunnelWall2Right', roadPath, 5, 0.4, 200, 0));
        }
    }
}
