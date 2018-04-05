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
        layer.merge(drawRoadLine(new Form('tunnelTarmac'), roadPath, 0, 7, 30, 0));

        var layer = addLayer('tunnelWhiteLines');
        layer.rgb = whiteLines;
        layer.merge(drawRoadLine(new Form('tunnelWhiteLines1'), roadPath, -3.5, 0.2, 30, 2));
        layer.merge(drawRoadLine(new Form('tunnelWhiteLines2'), roadPath, 3.5, 0.2, 30, 2));
        layer.merge(drawRoadLine(new Form('tunnelWhiteLines3'), roadPath, -0.15, 0.15, -4, 8));

        // do yellow lines
        var layer = addLayer('tunnelYellowLines');
        layer.rgb = yellowLines;
        layer.merge(drawRoadLine(new Form('tunnelYellowLines'), roadPath, 0.125, 0.125, 30, 0));

        // do crossings
        if (true)
        {
            var layer = addLayer('tunnelCrossing');
            layer.rgb = tarmac;
            layer.merge(drawRoadLine(new Form('tunnelCrossing'), roadPath, 0, 1, -2, 200));
            layer.expand(1);

            var layer = addLayer('tunnelCrossingLines');
            layer.rgb = whiteLines;
            for (i in 0...6)
            {
                var width = 6.0 / 6 * 0.5;
                layer.merge(drawRoadLine(new Form('tunnelCrossingLine$i'), roadPath, i * 2 * width - 3 + width, width, -2, 200));
            }
        }

        // do lights
        if (true)
        {
            var layer = addLayer('tunnelLights');
            layer.rgb = lightColor;

            layer.height = 4;
            layer.extrude = 0.1;
            layer.merge(drawRoadLine(new Form('tunnelLight1'), roadPath, -4, 0.1, -4, 6));
            layer.merge(drawRoadLine(new Form('tunnelLight2'), roadPath, 4, 0.1, -4, 6));
        }

        if (true)   // walls
        {
            var layer:Form = addLayer('tunnelWall1');
            layer.rgb = skyLow;

            layer.height = 4;
            layer.extrude = 4;
            layer.merge(drawRoadLine(new Form('tunnelWall1Left'), roadPath, -5, 0.4, 100, 0));
            layer.merge(drawRoadLine(new Form('tunnelWall1Right'), roadPath, 5, 0.4, 100, 0));

            var layer:Form = addLayer('tunnelWall2');
            layer.rgb = skyLow;
            layer.height = 0;
            layer.extrude = -4;
            layer.merge(drawRoadLine(new Form('tunnelWall2Left'), roadPath, -5, 0.4, 200, 0));
            layer.merge(drawRoadLine(new Form('tunnelWall2Right'), roadPath, 5, 0.4, 200, 0));
        }
    }
}
