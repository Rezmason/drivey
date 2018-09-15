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
import js.three.WebGLRenderer;
import js.three.MeshBasicMaterial;

using Lambda;

class Screen {

    public var width(get, never):UInt;
    public var height(get, never):UInt;
    public var bg(get, set):Color;
    public var useOrtho:Bool = false;

    var baseColor:Color;
    var lowColor:Color;
    var highColor:Color;

    public var downscale:UInt = 1;
    public var antialias:Bool = true;
    public var wireframe(default, set):Bool = false;

    var element:Element;
    public var camera(default, null):PerspectiveCamera;
    public var orthoCamera(default, null):OrthographicCamera;
    public var scene(default, null):Scene;
    var renderer:WebGLRenderer;
    var messageBox:Element;
    var levelContentIDs:Array<String> = [];
    var levelContents:Group;
    var entities:Group;

    var basicMaterialsByHex:Map<Int, MeshBasicMaterial> = new Map();

    var keysDown:Map<String, Bool> = new Map();
    var keysHit:Map<String, Bool> = new Map();

    var renderListeners:Array<Void->Void> = [];

    var messageOpacities:Map<Element, Float> = new Map();

    public function new() {
        element = Browser.document.createElement( 'div' );
        Browser.document.body.appendChild( element );

        scene = new Scene();
        camera = new PerspectiveCamera( 50, 1, 0.001, 100000 );
        camera.rotation.order = 'YZX';
        scene.add(camera);
        orthoCamera = new OrthographicCamera(0, 0, 0, 0, 1, 100000);
        scene.add(orthoCamera);
        levelContents = new Group();
        scene.add(levelContents);
        entities = new Group();
        scene.add(entities);
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

    public function addEntity(object:Object3D) {
        if (object.parent != entities) {
            entities.add(object);
        }
    }

    public function addLevelContent(object:Object3D, id:String) {
        if (object.parent != levelContents) {
            levelContents.add(object);
            levelContentIDs.push(id);
        }
    }

    public function drawLevel(level:Level) {
        for (object in levelContents.children) levelContents.remove(object);

        var nextTrace = levelContentIDs.join('\n');
        if (lastTrace != nextTrace) {
            trace(nextTrace);
            lastTrace = nextTrace;
        }
        levelContentIDs = [];

        for (form in level.forms)
        {
            // form.bake();
            // addLevelContent(form.object, form.id);
        }
    }

    public function drawForm(form:Form) {
        // form.bake();
        // addEntity(form.object);
    }

    var lastTrace = '';

    public function clear() {
        for (object in entities.children) entities.remove(object);
        // trace(haxe.CallStack.toString(haxe.CallStack.callStack()));
    }

    public function cmd(s) {
        // TODO
    }

    public function setTint(fw:Color, fLow:Color, fHigh:Color) {
        baseColor = fw;
        lowColor = fLow;
        highColor = fHigh;
        // TODO: add these as global uniforms for tinted materials
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
            while (messageBox.firstChild != null) {
                messageOpacities.remove(cast messageBox.firstChild);
                (cast messageBox.firstChild).remove();
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

    public function adjustPerspectiveCamera(pitch:Float, roll:Float, yaw:Float, zoom:Float, pointBackwards:Bool):Void {
        camera.rotation.set(
            pitch,
            0,// yaw,
            roll
        );
        // TODO: some of the above angles may not be necessary, if camera is attached to a rotating object, ie. a car
        // TODO: pointBackwards
        camera.zoom = 1 / zoom;
        camera.updateProjectionMatrix();

        orthoCamera.zoom = 1 / zoom;
        orthoCamera.updateProjectionMatrix();
    }

    public function getMaterial(colorHex:Int):MeshBasicMaterial {
        if (!basicMaterialsByHex.exists(colorHex)) {
            basicMaterialsByHex.set(colorHex, new MeshBasicMaterial({color:colorHex}));
        }
        return basicMaterialsByHex[colorHex];
    }

    function set_wireframe(val:Bool):Bool {
        if (wireframe != val) {
            wireframe = val;
            for (material in basicMaterialsByHex) {
                material.wireframe = wireframe;
            }
        }
        trace(wireframe);
        return wireframe;
    }
}
