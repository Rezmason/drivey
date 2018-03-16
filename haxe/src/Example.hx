import js.Browser;
import js.html.Element;

import js.three.*;
import Math;

class Example
{
    var container:Element;
    var camera:PerspectiveCamera;
    var scene:Scene;
    var renderer:WebGLRenderer;
    var group:Group;
    var targetRotation:Float;
    var targetRotationOnMouseDown:Float;
    var mouseX:Float;
    var mouseXOnMouseDown:Float;
    var windowHalfX:Float;

    public static function run()
    {
        new Example();
    }

    function new() {
        targetRotation = 0;
        targetRotationOnMouseDown = 0;
        mouseX = 0;
        mouseXOnMouseDown = 0;
        windowHalfX = Browser.window.innerWidth / 2;
        
        init();
        var timer = new haxe.Timer(33);
        timer.run = render;
    }

    function init() {
        container = Browser.document.createElement( 'div' );
        Browser.document.body.appendChild( container );
        scene = new Scene();
        scene.background = new Color( 0xf0f0f0 );
        camera = new PerspectiveCamera( 50, Browser.window.innerWidth / Browser.window.innerHeight, 1, 1000 );
        camera.position.set( 0, 0, 500 );
        scene.add( camera );
        var light = new PointLight( 0xffffff, 0.8 );
        camera.add( light );
        group = new Group();
        group.rotation.x = -45;
        scene.add( group );

        function addLineShape( shape:Path, color, x, y) {
            // lines
            shape.autoClose = true;
            var points:Array<Vector> = [for (point in shape.getPoints()) point];
            var spacedPoints:Array<Vector> = [for (point in shape.getSpacedPoints( 50 )) point];
            var geometryPoints:BufferGeometry = new BufferGeometry().setFromPoints( points );
            var geometrySpacedPoints = new BufferGeometry().setFromPoints( spacedPoints );
            // solid line
            var line = new Line( geometryPoints, new LineBasicMaterial( { color: color, linewidth: 3 } ) );
            line.position.set( x, y, 25 );
            group.add( line );
            // line from equidistance sampled points
            var line = new Line( geometrySpacedPoints, new LineBasicMaterial( { color: color, linewidth: 3 } ) );
            line.position.set( x, y, 75 );
            group.add( line );
            // vertices from real points
            var particles = new Points( geometryPoints, new PointsMaterial( { color: color, size: 4 } ) );
            particles.position.set( x, y, 25 );
            group.add( particles );
            // equidistance sampled points
            var particles = new Points( geometrySpacedPoints, new PointsMaterial( { color: color, size: 4 } ) );
            particles.position.set( x, y, 75 );
            group.add( particles );
        }

        function addShape( shape:Shape, extrudeSettings, color, x, y) {
            // flat shape
            var geometry = new ShapeBufferGeometry( shape );
            var mesh = new Mesh( geometry, new MeshBasicMaterial( { wireframe: false, color: color } ) );
            mesh.position.set( x, y, -75 );
            group.add( mesh );
            // extruded shape
            var geometry = new ExtrudeGeometry( shape, extrudeSettings );
            var mesh = new Mesh( geometry, new MeshBasicMaterial( { wireframe: false, color: color } ) );
            mesh.position.set( x, y, -25 );
            group.add( mesh );
            addLineShape( shape, color, x, y);
            if (shape.holes != null) {
                for (hole in shape.holes) {
                    addLineShape( hole, color, x, y);
                }
            }
        }
        
        // California
        var californiaPts = [];
        californiaPts.push( new Vector2( 610, 320 ) );
        californiaPts.push( new Vector2( 450, 300 ) );
        californiaPts.push( new Vector2( 392, 392 ) );
        californiaPts.push( new Vector2( 266, 438 ) );
        californiaPts.push( new Vector2( 190, 570 ) );
        californiaPts.push( new Vector2( 190, 600 ) );
        californiaPts.push( new Vector2( 160, 620 ) );
        californiaPts.push( new Vector2( 160, 650 ) );
        californiaPts.push( new Vector2( 180, 640 ) );
        californiaPts.push( new Vector2( 165, 680 ) );
        californiaPts.push( new Vector2( 150, 670 ) );
        californiaPts.push( new Vector2(  90, 737 ) );
        californiaPts.push( new Vector2(  80, 795 ) );
        californiaPts.push( new Vector2(  50, 835 ) );
        californiaPts.push( new Vector2(  64, 870 ) );
        californiaPts.push( new Vector2(  60, 945 ) );
        californiaPts.push( new Vector2( 300, 945 ) );
        californiaPts.push( new Vector2( 300, 743 ) );
        californiaPts.push( new Vector2( 600, 473 ) );
        californiaPts.push( new Vector2( 626, 425 ) );
        californiaPts.push( new Vector2( 600, 370 ) );
        californiaPts.push( new Vector2( 610, 320 ) );
        for(point in californiaPts) point.multiplyScalar( 0.25 );
        var californiaShape = new Shape( californiaPts );
        // Triangle
        var triangleShape:Shape = new Shape();
        triangleShape.moveTo( 80, 20 );
        triangleShape.lineTo( 40, 80 );
        triangleShape.lineTo( 120, 80 );
        triangleShape.lineTo( 80, 20 ); // close path
        // Heart
        var x = 0, y = 0;
        var heartShape:Shape = new Shape(); // From http://blog.burlock.org/html5/130-paths
        heartShape.moveTo( x + 25, y + 25 );
        heartShape.bezierCurveTo( x + 25, y + 25, x + 20, y, x, y );
        heartShape.bezierCurveTo( x - 30, y, x - 30, y + 35, x - 30, y + 35 );
        heartShape.bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 );
        heartShape.bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 );
        heartShape.bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y );
        heartShape.bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 );
        // Square
        var sqLength = 80;
        var squareShape:Shape = new Shape();
        squareShape.moveTo( 0, 0 );
        squareShape.lineTo( 0, sqLength );
        squareShape.lineTo( sqLength, sqLength );
        squareShape.lineTo( sqLength, 0 );
        squareShape.lineTo( 0, 0 );
        // Rectangle
        var rectLength = 120, rectWidth = 40;
        var rectShape:Shape = new Shape();
        rectShape.moveTo( 0, 0 );
        rectShape.lineTo( 0, rectWidth );
        rectShape.lineTo( rectLength, rectWidth );
        rectShape.lineTo( rectLength, 0 );
        rectShape.lineTo( 0, 0 );
        // Rounded rectangle
        var roundedRectShape:Shape = new Shape();
        ( function roundedRect( ctx, x, y, width, height, radius ) {
            ctx.moveTo( x, y + radius );
            ctx.lineTo( x, y + height - radius );
            ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
            ctx.lineTo( x + width - radius, y + height );
            ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
            ctx.lineTo( x + width, y + radius );
            ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
            ctx.lineTo( x + radius, y );
            ctx.quadraticCurveTo( x, y, x, y + radius );
        } )( roundedRectShape, 0, 0, 50, 50, 20 );
        // Track
        var trackShape:Shape = new Shape();
        trackShape.moveTo( 40, 40 );
        trackShape.lineTo( 40, 160 );
        trackShape.absarc( 60, 160, 20, Math.PI, 0, true );
        trackShape.lineTo( 80, 40 );
        trackShape.absarc( 60, 40, 20, 2 * Math.PI, Math.PI, true );
        // Circle
        var circleRadius = 40;
        var circleShape:Shape = new Shape();
        circleShape.moveTo( 0, circleRadius );
        circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
        circleShape.quadraticCurveTo( circleRadius, -circleRadius, 0, -circleRadius );
        circleShape.quadraticCurveTo( - circleRadius, -circleRadius, -circleRadius, 0 );
        circleShape.quadraticCurveTo( - circleRadius, circleRadius, 0, circleRadius );
        // Fish
        var x = y = 0;
        var fishShape:Shape = new Shape();
        fishShape.moveTo( x, y );
        fishShape.quadraticCurveTo( x + 50, y - 80, x + 90, y - 10 );
        fishShape.quadraticCurveTo( x + 100, y - 10, x + 115, y - 40 );
        fishShape.quadraticCurveTo( x + 115, y, x + 115, y + 40 );
        fishShape.quadraticCurveTo( x + 100, y + 10, x + 90, y + 10 );
        fishShape.quadraticCurveTo( x + 50, y + 80, x, y );
        // Arc circle
        var arcShape:Shape = new Shape();
        arcShape.moveTo( 50, 10 );
        arcShape.absarc( 10, 10, 40, 0, Math.PI * 2, false );
        var holePath = new Path();
        holePath.moveTo( 20, 10 );
        holePath.absarc( 10, 10, 10, 0, Math.PI * 2, true );
        arcShape.holes.push( holePath );
        // Smiley
        var smileyShape:Shape = new Shape();
        smileyShape.moveTo( 80, 40 );
        smileyShape.absarc( 40, 40, 40, 0, Math.PI * 2, false );
        var smileyEye1Path = new Path();
        smileyEye1Path.moveTo( 35, 20 );
        smileyEye1Path.absellipse( 25, 20, 10, 10, 0, Math.PI * 2, true );
        smileyShape.holes.push( smileyEye1Path );
        var smileyEye2Path = new Path();
        smileyEye2Path.moveTo( 65, 20 );
        smileyEye2Path.absarc( 55, 20, 10, 0, Math.PI * 2, true );
        smileyShape.holes.push( smileyEye2Path );
        var smileyMouthPath = new Path();
        smileyMouthPath.moveTo( 20, 40 );
        smileyMouthPath.quadraticCurveTo( 40, 60, 60, 40 );
        smileyMouthPath.bezierCurveTo( 70, 45, 70, 50, 60, 60 );
        smileyMouthPath.quadraticCurveTo( 40, 80, 20, 60 );
        smileyMouthPath.quadraticCurveTo( 5, 50, 20, 40 );
        smileyShape.holes.push( smileyMouthPath );
        // Spline shape
        var splinepts = [];
        splinepts.push( new Vector2( 70, 20 ) );
        splinepts.push( new Vector2( 80, 90 ) );
        splinepts.push( new Vector2( - 30, 70 ) );
        splinepts.push( new Vector2( 0, 0 ) );
        var splineShape:Shape = new Shape();
        splineShape.moveTo( 0, 0 );
        splineShape.splineThru( splinepts );
        var extrudeSettings = { amount: 8, bevelEnabled: false, curveSegments: 12 };
        // addShape( shape, color, x, y);
        addShape( californiaShape,  extrudeSettings, 0xf08000, -3 * 100,  0 * 100);
        addShape( trackShape,       extrudeSettings, 0x008000,  3 * 100,  0 * 100);
        addShape( triangleShape,    extrudeSettings, 0x8080f0, -2 * 100, -2 * 100);
        addShape( roundedRectShape, extrudeSettings, 0x008080, -2 * 100,  0 * 100);
        addShape( squareShape,      extrudeSettings, 0x0040f0, -2 * 100,  2 * 100);
        addShape( heartShape,       extrudeSettings, 0xf00000,  0 * 100, -2 * 100);
        addShape( circleShape,      extrudeSettings, 0x00f000,  0 * 100,  0 * 100);
        addShape( fishShape,        extrudeSettings, 0x404040,  0 * 100,  2 * 100);
        addShape( smileyShape,      extrudeSettings, 0xf000f0,  2 * 100, -2 * 100);
        addShape( arcShape,         extrudeSettings, 0x804000,  2 * 100,  0 * 100);
        addShape( splineShape,      extrudeSettings, 0x808080,  2 * 100,  2 * 100);
        
        renderer = new WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( Browser.window.devicePixelRatio );
        renderer.setSize( Browser.window.innerWidth, Browser.window.innerHeight );
        container.appendChild( renderer.domElement );
        Browser.document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        // Browser.document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        // Browser.document.addEventListener( 'touchmove', onDocumentTouchMove, false );
        
        Browser.window.addEventListener( 'resize', onWindowResize, false );
    }

    function onWindowResize() {
        camera.aspect = Browser.window.innerWidth / Browser.window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( Browser.window.innerWidth, Browser.window.innerHeight );
    }
    
    function onDocumentMouseDown( event ) {
        event.preventDefault();
        Browser.document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        Browser.document.addEventListener( 'mouseup', onDocumentMouseUp, false );
        Browser.document.addEventListener( 'mouseout', onDocumentMouseOut, false );
        mouseXOnMouseDown = event.clientX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;
    }

    function onDocumentMouseMove( event ) {
        mouseX = event.clientX - windowHalfX;
        targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
    }

    function onDocumentMouseUp( event ) {
        Browser.document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        Browser.document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        Browser.document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    }

    function onDocumentMouseOut( event ) {
        Browser.document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        Browser.document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        Browser.document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    }

    /*
    function onDocumentTouchStart( event ) {
        if ( event.touches.length == 1 ) {
            event.preventDefault();
            mouseXOnMouseDown = event.touches[ 0 ].pageY - windowHalfX;
            targetRotationOnMouseDown = targetRotation;
        }
    }

    function onDocumentTouchMove( event ) {
        if ( event.touches.length == 1 ) {
            event.preventDefault();
            mouseX = event.touches[ 0 ].pageY - windowHalfX;
            targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
        }
    }
    */
    
    function render() {
        group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
        renderer.render( scene, camera );
    }
}
