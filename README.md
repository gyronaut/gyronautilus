gyronautilus
============

Code for gyronautilus.com website - experiments with javascript, html, interactive art hosting, etc.

Current State
-----------------
+ Hit Regions: 
+ + (semi-implemented) Shapes that represent distinct interactive areas are drawn in distinct colors on an invisible "hit-regions" canvas.  This allows for event functions to check the color on this invisible canvas and immediately know what interactive region of the image they're in.
+ Deer Animation: 
+ + On clicking the deer, the color "drains" toward the center hole in the deer.  Click again, and a bird flies out of the hole, and the color "fills" the deer back up. the drain/fill animation consists of 2 images (a completely full deer and a completely empty deer), and uses clipping regions to create a 7 frame animation.  The bird consists of 2 pre-cropped initial frames, then a loop of 5 frames that continues until the bird reaches the edge of the canvas.
+ Sky Interaction:  
+ + On clicking the sky, the exposed corrugation toggles between being painted and just being cardboard.

Future Goals
-----------------
+ Finish Hit Regions: 
+ + Define every part of the image that will be interactive as a distinct color on the hit-regions canvas
+ Implement Sky animation: 
+ + Final goal for the sky animation is to have the toggled change "radiate out" from the initial hexagonal "cell" that the user clicked. This requires each cell to properly be added to the hit region, and to generalize the animation function enough that it will handle the animatino regardless of where the user clicks.
+ User intuition: 
+ + If not every part of a painting is interactive, figure out a (subtle?) way to let the user know what parts can be interacted with.  Possible ideas: have all sideways text be a light gray, and on mousing over a part of the image that can be interacted with, one of the texts will get darker and be brought to the front.
