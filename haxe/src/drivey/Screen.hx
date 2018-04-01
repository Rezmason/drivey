package drivey;

import js.Browser;
import js.html.Element;
import js.html.KeyboardEvent;

import js.three.Object3D;
import js.three.Group;
import js.three.PerspectiveCamera;
import js.three.OrthographicCamera;
import js.three.Scene;
import js.three.WebGLRenderer;

using Lambda;

class Screen {

    public var width(get, never):UInt;
    public var height(get, never):UInt;
    public var bg(get, set):Color;

    public var downscale:UInt = 1;
    public var antialias:Bool = true;

    var element:Element;
    public var camera(default, null):PerspectiveCamera;
    public var orthoCamera(default, null):OrthographicCamera;
    public var scene(default, null):Scene;
    var renderer:WebGLRenderer;
    var messageBox:Element;
    var displayList:Group;

    var keysDown:Map<String, Bool> = new Map();
    var keysHit:Map<String, Bool> = new Map();

    var renderListeners:Array<Void->Void> = [];

    var messageOpacities:Map<Element, Float> = new Map();

    public function new() {
        element = Browser.document.createElement( 'div' );
        Browser.document.body.appendChild( element );

        scene = new Scene();
        camera = new PerspectiveCamera( 50, 1, 1, 1000 );
        scene.add(camera);
        orthoCamera = new OrthographicCamera(0, 0, 0, 0, 1, 1000);
        scene.add(orthoCamera);
        displayList = new Group();
        scene.add(displayList);
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
                messageBox.removeChild(message);
            } else {
                message.style.opacity = Std.string(messageOpacities[message]);
            }
        }
        for (key in keysHit.keys()) keysHit.remove(key);
        
    }
    
    function render() {
        renderer.render( scene, false ? orthoCamera : camera );
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

    public function drawObject(object:Object3D) {
        if (object.parent != displayList) {
            displayList.add(object);
        }
    }

    public function drawForm(form:Form) {
        // TODO
    }

    public function clear() {
        // TODO
    }

    public function cmd(s) {
        // TODO
    }

    public function setTint(fw:Color, fLow:Color, fHigh:Color) {
        // TODO
    }

    inline function get_width() {
        return Browser.window.innerWidth;
    }

    inline function get_height() {
        return Browser.window.innerHeight;
    }

    inline function get_bg():Color {
        return scene.background;
    }

    inline function set_bg(color:Color):Color {
        scene.background = color;
        return color;
    }

    public function showMessage(msg:String, clear:Bool, seconds:Float = 2)
    {
        if (clear) {
            for (message in messageOpacities.keys()) {
                messageBox.removeChild(message);
                messageOpacities.remove(message);
            }
        }

        var message = Browser.document.createElement('div');
        message.classList.add('message');
        message.innerHTML = ~/[\n\r]/g.replace(msg, '<br>');
        haxe.Timer.delay(function() {
            messageOpacities[message] = 1;
        }, Std.int(1000 * seconds));
        messageBox.appendChild(message);
    }

    public function adjustPerspectiveCamera(pitch:Float, roll:Float, yaw:Float, pointBackwards:Bool):Void {
        // TODO
    }
}
