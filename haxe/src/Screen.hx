import js.Browser;
import js.html.Element;
import js.html.KeyboardEvent;

import js.three.Object3D;
import js.three.Group;
import js.three.PerspectiveCamera;
import js.three.OrthographicCamera;
import js.three.Scene;
import js.three.WebGLRenderer;
import js.three.WebGLRenderer;
import js.three.MeshBasicMaterial;

using Lambda;

class Screen {

    public var width(get, never):UInt;
    public var height(get, never):UInt;
    public var useOrtho:Bool = false;

    public var downscale:UInt = 1;
    public var wireframe(default, set):Bool = false;

    var element:Element;
    public var camera(default, null):PerspectiveCamera;
    public var orthoCamera(default, null):OrthographicCamera;
    public var scene(default, null):Scene;
    var renderer:WebGLRenderer;
    var messageBox:Element;

    var keysDown:Map<String, Bool> = new Map();
    var keysHit:Map<String, Bool> = new Map();

    var renderListeners:Array<Void->Void> = [];

    var messageOpacities:Map<Element, Float> = new Map();

    public function new() {
        element = Browser.document.createElement( 'div' );
        Browser.document.body.appendChild( element );

        scene = new Scene();
        camera = new PerspectiveCamera( 90, 1, 0.001, 100000 );
        camera.rotation.order = 'YZX';
        scene.add(camera);
        orthoCamera = new OrthographicCamera(0, 0, 0, 0, 1, 100000000);
        scene.add(orthoCamera);
        renderer = new WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( Browser.window.devicePixelRatio );
        Browser.window.addEventListener( 'resize', onWindowResize, false );
        onWindowResize();

        element.appendChild(renderer.domElement);
        renderer.domElement.id = 'renderer';

        messageBox = Browser.document.createElement( 'div' );
        messageBox.id = 'messageBox';
        Browser.document.body.appendChild(messageBox);

        Browser.document.addEventListener('keydown', onKeyDown);
        Browser.document.addEventListener('keyup', onKeyUp);

        var win:Dynamic = Browser.window;
    //     win.renderer = renderer;

        animate();
    }

    function onWindowResize() {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        var aspect = width / height;
        orthoCamera.left   = -100 * aspect / 2;
        orthoCamera.right  =  100 * aspect / 2;
        orthoCamera.top    =  100 / 2;
        orthoCamera.bottom = -100 / 2;
        orthoCamera.updateProjectionMatrix();

        renderer.setSize( width / downscale, height / downscale );
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
    }

    function animate() {
        untyped __js__('requestAnimationFrame({0})', animate);
        for (listener in renderListeners) listener();
        render();
        for (message in messageOpacities.keys()) {
            messageOpacities[message] *= 0.975;
            if (messageOpacities[message] < 0.005) {
                messageOpacities.remove(message);
                (cast message).remove();
            } else {
                message.style.opacity = Std.string(messageOpacities[message]);
            }
        }
        for (key in keysHit.keys()) keysHit.remove(key);

    }

    function render() {
        renderer.render( scene, useOrtho ? orthoCamera : camera );
    }

    function onKeyDown(event:KeyboardEvent) {
        var code = (cast event).code;
        //if (code == 'KeyR' && (event.metaKey || event.ctrlKey)) return;
        //event.preventDefault();
        if (!isKeyDown(code)) keysHit[code] = true;
        keysDown[code] = true;
    }

    function onKeyUp(event:KeyboardEvent) {
        //event.preventDefault();
        keysDown.remove((cast event).code);
    }

    public function isKeyDown(code):Bool {
        return keysDown.get(code) == true;
    }

    public function isKeyHit(code):Bool {
        return keysHit.get(code) == true;
    }

    public function addRenderListener(func:Void->Void) {
        if (!renderListeners.has(func)) {
            renderListeners.push(func);
        }
    }

    inline function get_width() {
        return Browser.window.innerWidth;
    }

    inline function get_height() {
        return Browser.window.innerHeight;
    }

    function set_wireframe(val:Bool):Bool {
        /*
        if (wireframe != val) {
            wireframe = val;
            for (material in basicMaterialsByHex) {
                material.wireframe = wireframe;
            }
        }
        trace(wireframe);
        return wireframe;
        */
        // TODO
        return val;
    }
}
