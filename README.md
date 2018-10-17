![Drivey screenshot](/screenshot.png?raw=true "Drivey's industrial zone.")

# Drivey.js

This is a 2018 ECMAScript port of the **graphics demo** [Drivey](http://drivey.com), from 2007.

You can see Drivey.js online [here](https://rezmason.github.io/drivey/), or [download it](https://github.com/Rezmason/drivey/archive/master.zip) for offline play.

### Purpose

Driving down the open road elicits nostalgia in some people. A couple of them made old arcade games about driving.
Old driving games triggered nostalgia in [Mark Pursey](https://github.com/MarkPursey), so he made a graphics demo about driving games.
I feel nostalgia for his driving demo, so here we are.

### Controls
#### Touch
You can use any combination of fingers (or the mouse):
- `Up-Down`, adjust the driving speed.
- `Left-right`, turn the steering wheel.
#### Keyboard
- `Up Arrow`, gas.
- `Down Arrow`, brake.
- `Space Bar`, handbrake.
- `Left Arrow`, steer left.
- `Right Arrow`, steer right.
- `Shift and Control keys`, slow down and speed up the demo.
#### 1 Switch
Constantly drives with a slight turn. Click to switch between left turns and right turns.
#### Eye Gaze
Constantly drives straight. The car turns left and right if the mouse is on the far left or far right of the window.
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
- [x] Drivey.js mixtape (see above)
- [x] Procedural automobile generator
- [x] Tablet-friendly UI
- [x] Three camera angles
- [x] One switch support
- [x] Eye gaze support
- [x] Touch screen steering control scheme
- [ ] Optional ambient audio

### History

Back in 2000, JavaScript was a slow, underpowered, interpreted scripting language meant for adding simple behaviors to web pages. Still, it showed enormous potential, and lots of money went into various efforts to make more expressive variations of it. Mark Pursey, Drivey's author, invested his free time and creative energy writing his own variant, which he called [JujuScript](https://web.archive.org/web/20110807170635/http://jujusoft.com/software/jujuscript/index.html).

JujuScript is very similar to JavaScript, but adds strong type support and operator overloading. Furthermore, Pursey embedded a graphics API in JujuScript's interpreter that specializes in composing and rendering text and font-like graphics. When he decided in 2004 (I believe) to make a driving simulator, naturally it had a high legibility and visual fidelity. And he had the foresight to [share the code](https://web.archive.org/web/20160313145032/http://www.jujusoft.com/download/jujuscript-1.0.zip) for free.

Unfortunately JujuScript's launcher is a Windows-only executable (which [runs very well](https://appdb.winehq.org/objectManager.php?sClass=application&iId=8828) under wine), and isn't open source. Its "2.5D" graphics API is also undocumented. To expand its reach, break its dependency on 2000s-era Windows APIs and boost its [bus factor](https://en.wikipedia.org/wiki/Bus_factor), it made sense to convert the Drivey demo to a more broadly adopted platform (ie. *the web*).

In the intervening decades, JavaScript (technically ECMAScript 6+) has matured into a robust, expressive language, bolstered by a thriving ecosystem. It did take a while to get there, but its momentum has also increased at the same time. The advent of WebGL and Three.js marked the introduction of a common hardware-accelerated graphics pipeline to the world's most widespread platform.

As of October 2018, **Drivey.js** is not yet feature complete; already, though, it ties the long-term fate of the demo to the long-term fate of the web. [The old Windows demo is still online](http://drivey.com), in the meantime, and is still notable for its unique approach to rendering a 3D scene.

### Technique

Most of the geometry in Drivey and Drivey.js is offset and extruded from a [closed spline](https://threejs.org/docs/#api/en/extras/curves/CatmullRomCurve3) representing the middle of the road. In other words, the demo marches steadily along the road, regularly dropping points along the side, sometimes suspending them in the air. Every solid or dashed line, every wire and pole, is generated in this way, and the level generates them anew every time you visit. There are very few exceptions, such as the clouds and buildings in the City level. The cars are also custom made every time Drivey launches, but with a different process. Read through the source code for more information.
