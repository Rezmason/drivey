package drivey.levels;

import drivey.Utils.*;

class City extends Level {
    override function build() {
        name = 'The City';
        tint = new Color(0.3, 0.3, 0.7) * 1.5;

        roadPath.scaleUniform(2);

        ground = 0.05;
        var lines:Color = 0.6;
        var obc:Color = ground.clone();

        skyLow = 0.4;
        skyHigh = 0.0;

        if (true)   // sky ?
        {
            var sh = addLayer('cityClouds');
            sh.rgb = (skyLow + skyHigh) * 0.5;
            sh.alpha = 1;
            sh.height = 200;
            for (i in 0...100)
            {
                var sh2:Form = new Form('cloud$i');
                var p = new Vector2(Math.random()-0.5, Math.random()-0.5);
                if (p.length() > 0.5 || p.length() < 0.1) {
                    continue;
                }

                p *= 8000;
                if ((p - sh.getNearestPoint(p)).length() < 200) {
                    continue;
                }

                sh2.makeCircle(p, 500);
                sh.merge(sh2);
            }
            // sh.makeBendy(); // No idea what the hell this is
            sh.scaleUniform(2);
            sh.height *= 2;
        }
        // do bg
        if (false)
        {
            var sh = addLayer('cityBG1');
            sh.rgb = ground;
            sh.height = 50;
            sh.extrude = 50;
            sh.merge(makeRoadLine('cityLine1', roadPath, -200, 15, 0, 200));
            sh.merge(makeRoadLine('cityLine2', roadPath, 200, 15, 0, 150));
            
            // do bg
            
            var sh = addLayer('cityBG2');
            sh.rgb = ground;
            sh.height = 70;
            sh.extrude = 70;
            sh.merge(makeRoadLine('cityLine3', roadPath, -160, 10, -20, 90));
            sh.merge(makeRoadLine('cityLine4', roadPath, 160, 20, -25, 85));
            sh.merge(makeRoadLine('cityLine5', roadPath, 260, 20, -25, 40));

            // do bg
            
            var sh = addLayer('cityBG3');
            sh.rgb = ground;
            sh.height = 40;
            sh.extrude = 40;
            sh.merge(makeRoadLine('cityLine6', roadPath, -80, 20, -25, 150));
            sh.merge(makeRoadLine('cityLine7', roadPath, 80, 20, -20, 200));
            sh.merge(makeRoadLine('cityLine8', roadPath, 300, 20, -40, 100));

            // do bg
            
            var sh = addLayer('cityBG4');
            sh.rgb = ground;
            sh.height = 20;
            sh.extrude = 20;
            sh.merge(makeRoadLine('cityLine9', roadPath, -80, 40, -20, 45));
            sh.merge(makeRoadLine('cityLine10', roadPath, 80, 40, -25, 40));
        }
        else
        {
            var box:Form = new Form('cityBuilding');
            box.makeUnit();
            box.recenter();
            box.scaleUniform(40);

            var l0:Form = new Form('unused layer citySkyline1');
            l0.rgb = obc;
            l0.height = 15;
            l0.extrude = l0.height;
            var l1:Form = addLayer('citySkyline2');
            l1.rgb = obc;
            l1.height = 30;
            l1.extrude = l1.height;
            var l2:Form = addLayer('citySkyline3');
            l2.rgb = obc;
            l2.height = 50;
            l2.extrude = l2.height;
            var l3:Form = addLayer('citySkyline4');
            l3.rgb = obc;
            l3.height = 120;
            l3.extrude = l3.height;

            var radius = 1800;
            for (i in 0...12)
            {
                var x = i * 150 - radius;
                for (j in 0...12)
                {
                    var y = j * 150 - radius;

                    var pos = new Vector2(x+Math.random()*100,y+Math.random()*100);
                    if (pos.length() > radius) {
                        continue;
                    }

                    var pt = roadPath.getNearestPoint(pos);
                    if ((pt - pos).length() < 60) {
                        continue;
                    }

                    var s:Form = box.clone('cityBuilding$i');
                    s.move(pos);
                    if (Math.random() > 0.8) {
                        l0.merge(s);
                    }
                    else if (Math.random() > 0.5) {
                        l1.merge(s);
                    }
                    else if (Math.random() > 0.25) {
                        l2.merge(s);
                    }
                    else {
                        l3.merge(s);
                    }
                }
            }
        }

        
        var sh = addLayer('cityWalls');
        sh.rgb = obc;
        sh.extrude = 10;
        sh.height = 10;
        sh.merge(makeRoadLine('cityWall1', roadPath, -16, 0.2, -0.2, 400));
        sh.merge(makeRoadLine('cityWall2', roadPath, -12, 0.2, -0.2, 400));
        sh.merge(makeRoadLine('cityWall3', roadPath, 12, 0.2, -0.2, 300));
        sh.merge(makeRoadLine('cityWall4', roadPath, 16, 0.2, -0.2, 300));
        wallsForm.merge(sh);
        
        var sh = addLayer('cityLinesA');
        sh.rgb = obc;
        sh.height = 14;
        sh.extrude = 4;
        sh.merge(makeRoadLine('cityLine11', roadPath, -14, 6, -0.2, 400));
        sh.merge(makeRoadLine('cityLine12', roadPath, 14, 6, -0.2, 300));
        
        var sh = addLayer('cityLinesB');
        sh.rgb = lines;
        sh.height = 0;
        sh.merge(makeRoadLine('cityLine13', roadPath, 0, 0.1, 60, 0));
        sh.merge(makeRoadLine('cityLine14', roadPath, 0.2, 0.1, 60, 0));
        sh.merge(makeRoadLine('cityLine15', roadPath, -6, 0.15, 30, 1));
        sh.merge(makeRoadLine('cityLine16', roadPath, 6, 0.15, 30, 1));
        
        var sh = addLayer('cityLinesC');
        sh.height = 0;
        sh.rgb = lines;
        sh.merge(makeRoadLine('cityLine17', roadPath, -3, 0.15, 3, 12));
        sh.merge(makeRoadLine('cityLine18', roadPath, 3, 0.15, 3, 12));
    }
}
