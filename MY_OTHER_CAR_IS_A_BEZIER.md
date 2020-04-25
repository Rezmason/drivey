# MY OTHER CAR IS A BÉZIER : the lasting appeal of Drivey
by Rezmason


*Disclaimer: These are the observations and opinions of one person.*

On January 23, 2005, [Andy Baio](https://waxy.org/) shared a link he found to the [original Drivey demo](https://drivey.com); by mid-August, its site got [thoroughly Slashdotted](https://tech.slashdot.org/story/05/08/10/0151200/moody-non-photo-realistic-driving).
Overnight, the side project of an Australian programmer who highly values his privacy was downloaded roughly *eighty thousand times*. Random strangers around the world praised its look and feel, argued over its feature set and swapped proposed mixtapes, as Drivey's humble website strained under the unexpected load.

It really struck a chord with people, and fifteen years on, I'd like to take a moment to overanalyze why.

### A perfect blend

Most people who downloaded Drivey probably didn't stop to read its creator's intentions. So what motivated them to download it, and why'd they like it? Simply put, it was _simple, accessible nostalgia,_ presented through _clean visuals_; each of these attributes appealed to computer users, each was an explicit choice of its creator, and each contributed to its high potency.

Oh, and the Slashdot post included a direct link to the EXE. That probably helped, too.

### Accessible: zero cost, zero cognitive load

The freeware/shareware movement predated Drivey both off- and on-line, but most Internet users still weren't used to seeing programs like it available for free download at the time. Sure, traditional publishers would release limited demos of their software available online, but that was a waiting game as it finished downloading and installing a program that still had limited functionality. Self-hosted online distribution of self-contained software like Drivey was still novel. And by choosing to download an some guy's uncompressed EXE they only heard of through [Slashdot](https://slashdot.org/faq/slashmeta.shtml) or [del.icio.us](https://en.wikipedia.org/wiki/Delicious_(website)), people knew they weren't in store for anything conventional.

Drivey had no installer, setup wizard, menu or tutorial. As soon as you opened it, you were immediately placed on the road, and were already in motion. There was no onscreen interface; tapping random keys, you might discover the basic steering controls, or the unobtrusive help menu, which would offer a list of key mappings and then fade away. Frankly, all of this was optional; immediate distraction-free access to the automotive dreamscape was paramount, and with a file size of 333 KB, the time from clicking the link to running the demo was startlingly brief.

Conveniently, Drivey also ran well under [wine](https://www.winehq.org/), expanding its reach to Linux users.

### Simple: the whole world is an [infinite cyclorama](https://en.wikipedia.org/wiki/Cyclorama_(theater))

Almost all the geometry in a Drivey level is just a copied, nudged, chopped-up segment of the closed loop that defines the road and the cars' route. That curve, and all the objects extrapolated from it, are reproduced computationally every time the level is changed.

In the more complex levels, this trick is very well hidden, since most of the visuals are only barely distinguishable from one another. Drivey was never meant to be an open world, and this was a safe and practical way to position the road geometry in the player's field of view.

A few early commenters questioned this decision: why not expand the driving experience to include more roads, junctions and destinations? Why not build a racetrack with checkpoints, or a map full of fleshed out locations filled with people, and missions, and sidequests, and so on, ad absurdum? Why not turn Drivey into everything it's not?

Drivey's endless loop of the same relaxing scenarios is _why_ it's so playable. It's not a power ballad, it's a short, catchy tune you already know the words to.

### Nostalgia: symbolizing the shared dream

Drivey is essentially the digital version of that Zen-like state of sitting behind the wheel and [not thinking too hard about it](https://en.wikipedia.org/wiki/Automaticity). This is in stark contrast to most driving games, which emphasize player control and reward them for performing tricky maneuvers. The thing is, _none of us actually drive that way._ Instead we buckle up, maybe put on some music, thoughtlessly align ourselves between two stripes of retroreflective paint, and engage our brains' cruise control. We often enjoy that sensation, and Drivey captured it better than anything else.

Not that its creator meant at all to compete with other driving sims— it just had a very different goal. In fact, a good portion of Drivey's web page was used to showcase older driving games that provided inspiration, like [Night Driver](https://en.wikipedia.org/wiki/Night_Driver_(video_game)) and [Speed Freak](https://en.wikipedia.org/wiki/Speed_Freak)— minimalist 2D approximations of the *figure* of a meandering road.

While the creator was nostalgic for these games, the main difference between Drivey and this prior work is that they came from an era when computers weren't able to render realistic driving scenes in the first place— their visuals are creative solutions to overcome platform constraints. On the other hand, Drivey's aesthetics are explicit creative choices, though definitely a product of their time.

### Clean visuals: a booming era of non-photorealistic rendering

The most obviously striking difference between Drivey and everything else out there is its visual style. It leaps out at you from [every](http://web.archive.org/web/20070810131900/http://drivey.com/640/030.gif) [tiny](http://web.archive.org/web/20070720090753/http://drivey.com/img/002.gif) [screenshot](http://web.archive.org/web/20070720090714/http://drivey.com/img/copper.jpg). Its creator refers to it as ["Non Photorealistic Rendering", or NPR](https://en.wikipedia.org/wiki/Non-photorealistic_rendering), which is accurate but imprecise, because Drivey's visual goals and rendering technique were unique among its contemporaries.

NPR and flat, clean vector art really rose in prominence in those early 2000s:

- **The motion graphics industry was undergoing a major revolution**. [Adobe After Effects](https://en.wikipedia.org/wiki/Adobe_After_Effects), one of the most affordable motion graphics packages, grew powerful enough to render non-photorealistic graphics at such a high level of detail and frame rate that creators could finally, comfortably leverage decades of print design history, in dynamic, 2.5D compositions, with the visual fidelity such an aesthetic demands. And stylized designs that translated well from motion graphics _back_ to print grew more prominent. You might remember Apple's ubiquitous [iPod ads](https://en.wikipedia.org/wiki/IPod_advertising#Silhouette_style) from this period, designed by Susan Alinsangan, featuring silhouetted dancers against flat-colored backgrounds.
- **AAA game companies began to embrace NPR in major titles.** Wikipedia lists around 200 "cel-shaded" games released between 1997 and 2006; two noteworthy examples are [Jet Set Radio](https://en.wikipedia.org/wiki/Jet_Set_Radio), which delivered realtime cel shading on the Sony PlayStation's early fixed graphics pipeline, and Nintendo's [The Legend of Zelda: The Wind Waker](https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_The_Wind_Waker), which used conditionally selected color palettes to adapt scenes' highlights and lowlights to the time of day and weather. Relatively few NPR titles made it to the PC, however.
- **The rich web was Flash-driven**. The [Flash plugin](https://en.wikipedia.org/wiki/Adobe_Flash)'s namesake before the mid-2000s was quick-loading vector graphics and animation— and for all the flak it's received, Flash was the main solution back then for making a website that looked the same in every browser. Thus there were loads of popular websites at the time brimming with vector graphics of varying quality, helping to establish a broader visual language.
- **[The Designers Republic.](https://www.thedesignersrepublic.com/) Full stop.** This cutting-edge graphic design studio spent the '90s and '00s singlehandedly cramming an ironic anti-establishment pop futurist vision into the collective unconscious. Their work is eerily familiar to anyone who lived through Y2K, though gamers may know them best for designing the visuals of Psygnosis's [wipEout racing game series](https://en.wikipedia.org/wiki/Wipeout_(series)).
- **Skeumorphism was ramping up in operating systems and causing us visual fatigue.** OSes of the 90s incorporated light and shadow into their user interfaces, but Mac OS X and Windows XP went even further with speculars, drop shadows and other types of physical resemblance. OS UIs wouldn't recover from this trend for at least a decade; in the midst of it, Drivey's abstract approach to rendering gave users an easy escape from textural overload.

The Drivey demo landed in front of this cultural backdrop, but walked its own path through non-photorealism. Early on its creator decided to _render every object as a silhouette_, doing away with any texture and surface detail, giving the player only the suggestion of forms. This moves the emphasis (and most of the responsibility for readibility) to the silhouette outlines— which, had Drivey been built on the 3D engines of the time, would have been too low-polycount to be effective.

Instead, Drivey was built on top of a _custom software renderer_, optimized for drawing screen-size vector graphics with applied perspective. Taking a page from digital typography, its graphical building blocks are [bézier curves](https://en.wikipedia.org/wiki/B%C3%A9zier_curve)– precisely tunable splines that can take any shape, independent of display resolution. That's why in the 2005 Drivey demo, you will never see a polygonal approximation of any smooth surface. To give these shapes height and depth, they were projected into 3D space, then vertically offset upwards and downwards to produce the tops and bottoms of volumes. Finally, Drivey would connect the top and bottom with flat regions of color, filling in the silhouette.

It's important to recognize how advanced this technique was for such a small indie project. It was the secret sauce that provided Drivey the visual clarity necessary to invoke our nostalgia the way it did; every frame was an ensemble of pixel perfect, duotone shadows, just detailed enough to give the illusion of twilit driving.

### This is my exit

The JS port of Drivey does its best to achieve the same goals as the original. There will probably always be room for improvement. But as long as someone sits at their computer and craves the open road, its endless evening landscapes will be waiting here for them.
