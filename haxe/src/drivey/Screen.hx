package drivey;

import js.Browser;
import js.html.Element;

import js.three.Object3D;
import js.three.PerspectiveCamera;
import js.three.Scene;
import js.three.WebGLRenderer;

using Lambda;

class Screen {

    public var rgb:Color = 1;
    public var alpha:Float = 1;
    public var width(get, never):UInt;
    public var height(get, never):UInt;
    public var bg(get, set):Color;

    var element:Element;
    var camera:PerspectiveCamera;
    var scene:Scene;
    var renderer:WebGLRenderer;

    var renderListeners:Array<Void->Void> = [];

    public function new() {
        element = Browser.document.createElement( 'div' );
        Browser.document.body.appendChild( element );

        scene = new Scene();
        camera = new PerspectiveCamera( 50, width / height, 1, 1000 );
        scene.add( camera );

        renderer = new WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( Browser.window.devicePixelRatio );
        renderer.setSize( width, height );
        
        element.appendChild(renderer.domElement);

        Browser.window.addEventListener( 'resize', onWindowResize, false );
        animate();
    }

    function onWindowResize() {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize( width, height );
    }

    function animate() {
        for (listener in renderListeners) listener();
        render();
        untyped __js__('requestAnimationFrame({0})', animate);
    }
    
    function render() {
        renderer.render( scene, camera );
    }

    public function isKeyDown(code) {
        return false; // TODO
    }

    public function addRenderListener(func:Void->Void) {
        if (!renderListeners.has(func)) {
            renderListeners.push(func);
        }
    }

    public function drawObject(object:Object3D) {
        if (object.parent != scene) {
            scene.add(object);
        }
    }

    public function drawShape(shape:Shape) {
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

    public function print(message) {
        // TODO
    }
}
