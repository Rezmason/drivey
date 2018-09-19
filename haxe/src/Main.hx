import js.Browser;

import drivey.Screen;
import js.three.Group;
import js.three.Mesh;
import js.three.MeshBasicMaterial;
import js.three.Path;
import js.three.ShapePath;
import js.three.Vector2;
import js.three.Vector3;
import js.three.SphereGeometry;
import js.three.PlaneGeometry;
import js.three.Color;

import drivey.ThreeUtils.*;

class Main
{
    var screen:Screen;
    var level:Level;
    var skybox:Group;
    var dashboard:Dashboard;
    var playerCar:Group;
    var player:Group;

    public static function main()
    {
        new drivey.Drivey();
        Browser.document.addEventListener("DOMContentLoaded", function(event) {
            var main = new Main();
        });
    }

    function new() {
        screen = new Screen();
        init();
        screen.addRenderListener(update);
        // screen.bg = new drivey.Color(0.7, 0.4, 0.1);
        screen.bg = new drivey.Color(0.0588, 0.0588, 0.0588);

    }

    function init() {
        TestLevel;
        DeepDarkNight;
        Tunnel;
        City;
        IndustrialZone;
        level = new IndustrialZone();
        dashboard = new Dashboard();
        skybox = new Group();
        var sky = makeSky();
        var ground = makeGround();
        skybox.add(sky);
        skybox.add(ground);
        // sky.material.vertexColors = cast 0;

        playerCar = new Group();
        playerCar.rotation.order = "ZYX";
        player = new Group();
        playerCar.add(player);
        playerCar.add(new Mesh(
            new SphereGeometry(50, 10, 10),
            new MeshBasicMaterial({color: 0x00FF00})
        ));
        playerCar.add(skybox);
        player.add(screen.camera);
        player.add(dashboard.object);
        screen.scene.add(playerCar);

        screen.orthoCamera.position.set(0, 0, 1000000);
        screen.orthoCamera.up = new Vector3(0, 0, 1);
        screen.orthoCamera.zoom = 1/50;
        screen.orthoCamera.updateProjectionMatrix();

        screen.scene.add(level.world);

        silhouette.uniforms.tint = cast { value: level.tint };

        dashboard.object.scale.set(0.0018, 0.0018, 0.001);
    }

    function makeSky() {
        var size = 100000;
        var skyGeom = new SphereGeometry(size, 50, 50, 0, Math.PI * 2, 0, Math.PI / 2);
        for (face in skyGeom.faces) {
            var vertices = [skyGeom.vertices[face.a], skyGeom.vertices[face.b], skyGeom.vertices[face.c]];
            for (i in 0...3) {
                var color = new Color();
                color.setHSL(0, 0, 0.675 * (1 - (vertices[i].y) / size * 1.25));
                face.vertexColors[i] = color;
            }
        }

        var sky = new Mesh(
            skyGeom,
            new MeshBasicMaterial(cast {
                vertexColors: 2, // VertexColors
                side: 1, // BackSide
            })
        );
        // sky.position.z = -size * 2;
        return sky;
    }

    function makeGround() {
        var size = 100000;
        var groundGeom = new PlaneGeometry(size, size);
        var ground = new Mesh(
            groundGeom,
            new MeshBasicMaterial(cast {
                color: new Color(0, 0, 0)
            })
        );
        return ground;
    }

    function makeHeadlightPath() {
        var pts:Array<Vector2> = [
            new Vector2( 0,   0),
            new Vector2(-6,  13),
            new Vector2( 4,  15),
            new Vector2( 0,   0),
        ];

        return makeSplinePath(pts, true);
    }

    var carT:Float = 0;

    function update() {

        var step = 0.0001;
        var simSpeed = 1.0;
        if (screen.isKeyDown('ShiftLeft') || screen.isKeyDown('ShiftRight')) simSpeed = 0.125;
        else if (screen.isKeyDown('ControlLeft') || screen.isKeyDown('ControlRight')) simSpeed = 4;

        // BEGIN FAKE CAR STUFF
        var carSpeed = 6000;
        var roadMidOffset = -1.5;
        var carHeight = 1;
        carT = (carT + (step * simSpeed * carSpeed / level.roadPath.length)) % 1;
        var carPosition = getExtrudedPointAt(level.roadPath.curve, carT, roadMidOffset);
        var nextPosition = getExtrudedPointAt(level.roadPath.curve, (carT + 0.001) % 1, roadMidOffset);
        // END FAKE CAR STUFF

        var angle = Math.atan2(nextPosition.y - carPosition.y, nextPosition.x - carPosition.x) - Math.PI / 2;

        var tilt = diffAngle(angle, playerCar.rotation.z);
        dashboard.wheelRotation = lerpAngle(dashboard.wheelRotation, Math.PI - tilt * 4, 0.1 * simSpeed);

        playerCar.position.set(carPosition.x, carPosition.y, carHeight);
        playerCar.rotation.set(Math.PI * 0.5, 0, lerpAngle(playerCar.rotation.z, angle, 0.05 * simSpeed));
        player.rotation.x = Math.PI * -0.0625;

        screen.camera.rotation.z = lerpAngle(screen.camera.rotation.z, tilt, 0.1 * simSpeed);

        // screen.orthoCamera.lookAt(playerCar.position);

        dashboard.needle1Rotation += step * simSpeed * 100;
        dashboard.needle2Rotation += step * simSpeed * 100;

        if (screen.isKeyHit('KeyC')) {
            if (dashboard.object.parent != null) {
                player.remove(dashboard.object);
            } else {
                player.add(dashboard.object);
            }
        }
        if (screen.isKeyHit('Digit0')) screen.useOrtho = !screen.useOrtho;
        if (screen.isKeyHit('Digit2')) screen.wireframe = !screen.wireframe;
        if (screen.isKeyHit('Digit4')) screen.camera.rotation.y += Math.PI;
    }
}
