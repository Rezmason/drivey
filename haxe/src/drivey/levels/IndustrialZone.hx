package drivey.levels;

import drivey.Utils.*;

class IndustrialZone extends Level {
    
    override function build() {
        name = 'The Industrial Zone';
        tint = new Color(0.7, 0.4, 0.1);

        skyHigh = 0.15;
        skyLow = 1.0;
        skyGradient = 0.25;

        ground = 0.05;
        var lines:Color = 0.6;
        var obc:Color = ground;

        // far off buildings
        if (true)
        {
            // very tall things
            
            var sh = addLayer('industrialTallThingA');
            sh.rgb = 1;
            sh.height = 62;
            sh.extrude = 2;
            sh.merge(makeRoadLine('tallThing1', roadPath, 300, 0.5, 0, 250));
            sh.merge(makeRoadLine('tallThing2', roadPath, 320, 0.75, 0, 250));

            if (true)
            {
                var layer = addLayer('industrialTallThingB');
                layer.rgb = obc;
                layer.height = 60;
                layer.extrude = 60;
                layer.merge(makeRoadLine('tallthing3', roadPath, 300, 0.5, 0, 250));
                layer.merge(makeRoadLine('tallthing4', roadPath, 320, 0.75, 0, 250));
                layer.merge(makeRoadLine('tallthing5', roadPath, 400, 8, 0, 240));
                layer.merge(makeRoadLine('tallthing6', roadPath, 500, 8, 0, 240));
            }

            // medium buildings
            var layer = addLayer('industrialMediumThings');
            layer.rgb = obc;
            layer.height = 12;
            layer.extrude = 12;
            layer.merge(makeRoadLine('mediumThing1', roadPath, -80, 20, -40, 60));
            layer.merge(makeRoadLine('mediumThing2', roadPath, 180, 50, -40, 30));
            layer.merge(makeRoadLine('mediumThing3', roadPath, 300, 50, -20, 20));

            layer.merge(makeRoadLine('mediumThing4', roadPath, -100, 8, 0, 200));
            layer.merge(makeRoadLine('mediumThing5', roadPath, -60, 8, 0, 1500));
            layer.merge(makeRoadLine('mediumThing6', roadPath, 100, 8, 0, 140));
            layer.merge(makeRoadLine('mediumThing7', roadPath, 120, 8, 0, 220));
        }

        // do white lines
        if (true)
        {
            var sh = addLayer('industrialWhiteLines');
            sh.rgb = lines;
            sh.merge(makeRoadLine('industrialWhiteLine1', roadPath, -3.5, 0.15, 60, 2));
            sh.merge(makeRoadLine('industrialWhiteLine2', roadPath, 3.5, 0.15, 60, 2));
            sh.merge(makeRoadLine('industrialWhiteLine3', roadPath, -0.15, 0.125, -4, 6));
            sh.merge(makeRoadLine('industrialWhiteLine4', roadPath, 0.125, 0.125, 60, 0));

            // do crossings
            if (true)
            {
                
                var sh = addLayer('industrialCrossing');
                sh.rgb = ground;
                sh.merge(makeRoadLine('industrialCrossingBase', roadPath, 0, 1, -2, 200));
                sh.expand(1);

                
                var sh = addLayer('industrialCrossingLines');
                sh.rgb = lines;
                for (i in 0...6)
                {
                    var width = 6.0 / 6 * 0.5;
                    sh.merge(makeRoadLine('industrialCrossingLine$i', roadPath, i * 2 * width - 3 + width, width, -2, 200));
                }
            }
        }

        // street lights
        if (true)
        {
            var left = 80;
            var right = 80;
            var thick = 0.2;
            var tall = 15;

            
            var sh = addLayer('industrialStreetLight1');
            sh.rgb = obc;
            sh.height = tall + thick;
            sh.extrude = thick;
            sh.merge(makeRoadLine('industrialStreetLight1', roadPath, -5.6, 5, thick, left));

            
            var sh = addLayer('industrialStreetLight2');
            sh.rgb = obc;
            sh.height = tall;
            sh.extrude = tall;
            sh.merge(makeRoadLine('industrialStreetLight2', roadPath, -8, thick, thick, left));
            wallsForm.merge(sh);

            
            var sh = addLayer('industrialStreetLight3');
            sh.rgb = 1;
            sh.height = tall;
            sh.extrude = thick*2;
            sh.merge(makeRoadLine('industrialStreetLight3', roadPath, -4, 2, thick, left));
        }

        // overpasses
        if (true)
        {
            var depth = 8;
            var spacing = 300;
            var highwayAbove = roadPath.clone('highwayAbove');
            highwayAbove.scale(new Vector2(1,1.5));

            var sh = addLayer('industrialOverpassA');
            sh.rgb = obc;
            sh.height = 12;
            sh.extrude = 2;
            sh.merge(makeRoadLine('industrialOverpass1', highwayAbove, 0, 162, -depth, spacing));
            sh.scale(new Vector2(1,1/1.5));

            
            var sh = addLayer('industrialOverpassB');
            sh.rgb = obc;
            sh.height = 10;
            sh.extrude = 10;
            sh.merge(makeRoadLine('industrialOverpass2', highwayAbove, -100, 42, -depth, spacing));
            sh.merge(makeRoadLine('industrialOverpass3', highwayAbove, -40, 2, -depth, spacing));
            sh.merge(makeRoadLine('industrialOverpass4', highwayAbove, -10, 2, -depth, spacing));
            sh.merge(makeRoadLine('industrialOverpass5', highwayAbove, 10, 2, -depth, spacing));
            sh.merge(makeRoadLine('industrialOverpass6', highwayAbove, 40, 2, -depth, spacing));
            sh.merge(makeRoadLine('industrialOverpass7', highwayAbove, 200, 242, -depth, spacing));
            sh.scale(new Vector2(1,1/1.5));

            var wall:Form = makeRoadLine('industrialWall1', highwayAbove, -10, 2, -depth, spacing);
            wall.merge(makeRoadLine('industrialWall2', highwayAbove, 10, 2, -depth, spacing));
            wall.scale(new Vector2(1,1/1.5));
            wallsForm.merge(wall);
        }

        // various poles
        if (true)
        {
            var sh = addLayer('industrialPoles');
            sh.rgb = obc;

            sh.height = 12;
            sh.extrude = 12;
            sh.merge(makeRoadLine('industrialPole1', roadPath, -30, 0.25, 0, 90));

            sh.merge(makeRoadLine('industrialPole2', roadPath, -40, 0.25, 0, 110));
            sh.merge(makeRoadLine('industrialPole3', roadPath, 60, 0.25, 0, 60));

            sh.merge(makeRoadLine('industrialPole4', roadPath, -50, 0.25, 0, 60));
            sh.merge(makeRoadLine('industrialPole5', roadPath, -20, 0.125, 0, 100));
            sh.merge(makeRoadLine('industrialPole6', roadPath, 20, 0.25, 0, 45));
            sh.merge(makeRoadLine('industrialPole7', roadPath, 50, 0.125, 0, 50));
            sh.merge(makeRoadLine('industrialPole8', roadPath, 70, 0.25, 0, 75));

            // knobs
            
            var sh = addLayer('industrialKnobs');
            sh.rgb = obc;
            sh.height = 13;
            sh.extrude = 1;
            sh.merge(makeRoadLine('industrialKnob1', roadPath, -40, 1, 0, 110));
            sh.merge(makeRoadLine('industrialKnob2', roadPath, 60, 1, 0, 60));

            // wires
            
            var sh = addLayer('industrialWires');
            sh.rgb = obc;
            sh.height = 11.25;
            sh.extrude = 0.025;

            sh.merge(makeRoadLine('industrialWire1', roadPath, -50, 0.025, -60, 0));
            sh.merge(makeRoadLine('industrialWire2', roadPath, -20, 0.025, -100, 0));
            sh.merge(makeRoadLine('industrialWire3', roadPath, 20, 0.025, -45, 0));
            sh.merge(makeRoadLine('industrialWire4', roadPath, 50, 0.025, -50, 0));
            sh.merge(makeRoadLine('industrialWire5', roadPath, 70, 0.025, -75, 0));
        }
        // fencing
        if (true)
        {
            var tall = 5;
            var spacing = 30;
            var dist = 25;

            
            var sh = addLayer('industrialFenceA');
            sh.rgb = obc;
            sh.height = tall;
            sh.extrude = tall;

            sh.merge(makeRoadLine('industrialFence1', roadPath, -dist, 0.1, 0, spacing));
            sh.merge(makeRoadLine('industrialFence2', roadPath, dist, 0.1, 0, spacing));

            
            var sh = addLayer('industrialFenceB');
            sh.rgb = obc;
            sh.height = tall-0.5;
            sh.extrude = 0.1;

            sh.merge(makeRoadLine('industrialFence3', roadPath, -dist, 0.1, -spacing, 0));
            sh.merge(makeRoadLine('industrialFence4', roadPath, dist, 0.1, -spacing, 0));

            
            var sh = addLayer('industrialFenceC');
            sh.rgb = obc;
            sh.alpha = 0.25;
            sh.height = tall - 0.6;
            sh.extrude = tall - 0.6;

            sh.merge(makeRoadLine('industrialFence5', roadPath, -dist, 0.1, -spacing, 0));
            sh.merge(makeRoadLine('industrialFence6', roadPath, dist, 0.1, -spacing, 0));
            wallsForm.merge(sh);
        }
    }
}
