www.gyronautilus.com
====================

Code for gyronautilus.com website - experiments with javascript, html canvas, interactive art hosting, etc.

Current State
-----------------
###Doe Painting (temporarily untitled)###
+ **Hit Regions:**
  + Shapes that represent distinct interactive areas are drawn in distinct colors on an invisible "hit-regions" canvas.  This allows for event functions to check the color on this invisible canvas and immediately know what interactive region of the image they're in.
+ **Deer Animation:**
  + On clicking the deer, the color "drains" toward the center hole in the deer.  Click again, and a bird flies out of the hole, and the color "fills" the deer back up. the drain/fill animation consists of 2 images (a completely full deer and a completely empty deer), and uses clipping regions to create a 7 frame animation.  The bird consists of 2 pre-cropped initial frames, then a loop of 5 frames that continues until the bird reaches the edge of the canvas.
+ **Sky Animation:**
  + On clicking the sky, the exposed corrugation toggles between being painted and just being cardboard. This toggle first affects the initial cell that was clicked, then radiates outward to the cells around it, running for some fixed number of frames.
  + If you shift-click a cell, then that particular cell will change, but the rest of the sky will not (note: the state of each cell is not currently tracked, so the cell will change to the opposite of the sky state, not toggle back and forth).
+ **Layered Text:**
  + On mousing over a part of the painting, a distinct block of text is brought to the foreground amongst several stacked text blocks.  This is accomplished solely through CSS (no javascript), and is more just a test of what's possible.

###Bird Painting###
+ Only an unfinished place-holder

###Rabbit Painting###
+ Only an unfinished place-holder

###Navigation###
+ Arrows
  + Can use the arrows to scroll through the different paintings. They are made "active/inactive" depending on the current image.

Future Goals
-----------------
###Doe Painting###
+ **Correct Hit Regions:**
  + Certain portions on the left hand side of the sky are still not properly sectioned out, and don't respond properly
+ **Finish/Polish Sky animation:**
  + The left part of the sky still doesn't properly animate, because the fact that the hexagonal grid doesn't continue properly behind the deer changes the way that region needs to be handled, which I haven't done yet.
+ **More animation options:** 
  + Using just the animation functions that are now defined, figure out new ways to use those animations.
  + *Ideas:* 
    + ctrl-click could cause different results.
    + shift-clicking the deer could change the behaviour (maybe bird comes out on color drain if you shift click?)
    + "supernova" - if the user types in the word "supernova", the sky animation could be staggered/layered/"rippled" in a chaotic way (similarly with the deer).

###Other Images###
+ **Transitions**
  + Play around with adding transition animations that would take the viewer from one painting to the next (utilizing some sort of continuous element - the bird maybe?).  Could keep the basic structure of the page the same, just "shift the view" of the canvas over to one side (could also change the surrounding area - new text layers, something else entirely, etc.
+ **Navigation**
  + Add a grid/row of squares that can be clicked on to move directly to a different image.
  + Allow arrow keys to also scroll through images (left and right arrows)
  + Fix the way the Doe image defines the "sky" region, so that what parts are interactive can be properly reset between images.
###Misc. Ideas###
+ **Constant animations:**
  + look into having some sort of constant animation running in the background (for another piece, maybe leaves/grass blowing in the wind). Think about how to keep a constant background animation going while still having interactive, dynamic changes happening at arbitrary times (possibly through having several overlapping canvas elements being simultaneously drawn to).
