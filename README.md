# Drivey

This is a 2018 ECMAScript port of the [graphics demo "Drivey" from 2007](http://drivey.com).

## [Try it online here](https://rezmason.github.io/drivey/)
#### [Hear the mixtape here](https://open.spotify.com/user/rezmason/playlist/4ukrs3cTKjTbLoFcxqssXi?si=0y3WoBw1TMyUzK8F9WMbLw)

### Purpose

Driving down the open road elicits nostalgia in some people. A couple of them made old arcade games about driving.  
Old driving games triggered nostalgia in [Mark Pursey](https://github.com/MarkPursey), so he made a graphics demo about driving games.  
I feel nostalgia for his driving demo, so here we are.

### Original features

- [x] Stylized 3D Rendering
- [x] Four levels: Deep Dark Night, Tunnel, City and Industrial Zone
- [x] Simulated self-driving car with optional manual control
- [x] NPC cars
- [x] Rear view
- [x] Optional simulated dashboard
- [x] Support for driving on the left and on the right
- [ ] Collision detection
- [ ] Custom color palette control
- [ ] Engine revving audio support
- [ ] ~Steering wheel peripheral support~
- [ ] ~Wireframe mode~

### New features
- [x] Runs right in the browser, on any computer
- [x] Three new levels: Cliffside Beach, Warp Gate and Spectre (inspired by [Craig Fryar](https://www.youtube.com/watch?v=b0X74Oe80tg))
- [x] Drivey mixtape (see below)
- [x] Procedural automobile generator
- [x] Tablet-friendly UI
- [x] Three camera angles
- [ ] One switch support
- [ ] Eye gaze support
- [ ] Optional ambient audio
- [ ] Touch screen steering control scheme

### History

Back in 2001, JavaScript was a slow, underpowered, interpreted scripting language meant for adding simple behaviors to web pages. Still, it showed enormous potential, and lots of money went into various efforts to make more expressive variations of it. Mark Pursey, Drivey's original author, invested his free time and creative energy writing his own variant, which he called JujuScript.

JujuScript is very similar to JavaScript, but adds strong type support and operator overloading. Furthermore, Pursey embedded a graphics API in JujuScript's interpreter that specializes in composing and rendering text and font-like graphics. When he decided in 2004 (I believe) to make a driving simulator, naturally it had a high legibility and visual fidelity. And he had the foresight to share the code for free.

Unfortunately JusuScript's launcher is a Windows-only executable (which [runs very well](https://appdb.winehq.org/objectManager.php?sClass=application&iId=8828) under wine), and isn't open source. Its "2.5D" graphics API is also undocumented. To expand its reach, break its dependency on 2000s-era Windows APIs and boost its [bus factor](https://en.wikipedia.org/wiki/Bus_factor), it made sense to convert the Drivey demo to a more broadly adopted platform (ie. *the web*). 

In the intervening decades, JavaScript (technically ECMAScript 6+) has matured into a robust, expressive language, bolstered by a thriving ecosystem. It did take a while to get there, but its momentum has also increased at the same time. The advent of WebGL and Three.js marked the introduction of a common hardware-accelerated graphics pipeline to the world's most widespread platform.

As of October 2018, Drivey on the web is not yet feature complete; already, though, it ties the long-term fate of the demo to the long-term fate of the web. [The old Windows demo is still online](http://drivey.com), in the meantime, and is still notable for its unique approach to rendering a 3D scene.

### Technique

Most of the geometry in Drivey is offset and extruded from a [closed spline](https://threejs.org/docs/#api/en/extras/curves/CatmullRomCurve3) representing the middle of the road. In other words, the demo marches steadily along the road, regularly dropping points along the side, sometimes suspending them in the air. Every solid or dashed line, every wire and pole, is generated in this way, and the level generates them anew every time you visit. There are very few exceptions, such as the clouds and buildings in the City level. The cars are also custom made every time Drivey launches, but with a different process. Read through the source code for more information.
