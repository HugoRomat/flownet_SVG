# flownet_SVG: API

## Summary

* flownetGraph.select(id)
* flownetGraph.filter(fun)
* flownetGraph.addLinks(data_Links)
* flownetGraph.removeLinks(data_Links)
* flownetGraph.addData(data_Links)
* flownetGraph.removeData(data_Links)

* <a href="#graph"> flownet_SVG.graph(id,svg)</a>
* <a href="#nodes"> flownetGraph.nodes(data_Nodes)</a>
* <a href="#links"> flownetGraph.links(data_Links)</a>
* <a href="#node_property"> flownetGraph.nodes_properties("property", "value")</a>
* <a href="#link_property"> flownetGraph.links_properties("property", "value")</a>
* <a href="#particule_property"> flownetGraph.particule_properties("property", "value")</a>

### Graph animation

* <a href="#animation_delay"> flownetGraph.delay("value")</a>
* <a href="#animation_fps"> flownetGraph.fps("value")</a>
* <a href="#animation_start"> flownetGraph.start()</a>
* <a href="#animation_stop"> flownetGraph.stop()</a>
* <a href="#animation_reset"> flownetGraph.reset()</a>


### Particles launcher

* <a href="#launcher_prepare_particule"> launcher.prepare_particule()</a>
* <a href="#launcher_particule_properties"> launcher.particule_properties("property","value")</a>
* <a href="#launcher_onStart"> launcher.on_start(function(){})</a>
* <a href="#launcher_onEnd"> launcher.on_end(function(){})</a>
* <a href="#launcher_load"> launcher.load()</a>
* <a href="#launcher_unload" > launcher.unload("id_particle")</a>
* <a href="#launcher_fire_particule"> launcher.fire_particule()</a>

## Graph creation

```js
data = {
  nodes:[{id:0},{id:1}],
  links:[{id:0}]
}
flownetGraph = flownet_SVG.graph("name_of_graph", SVG)
    .nodes(data.nodes)
    .links(data.links)
```
<a href="#graph" name="graph">#</a> flownet_SVG.**graph(id,svg)**

Construct a new graph tag by an "id" in the specified svg using flownet_SVG.

<a href="#nodes" name="nodes">#</a> flownetGraph.**nodes(data_Nodes)**

Fill the graph previously created with **nodes** according to the number of Object in the array (data_Nodes= [ {  }, {  } ] ).

<a href="#links" name="links">#</a> flownetGraph.**links(data_Links)**

Fill the graph previously created with **links** according to the number of Object in the array (data_Links= [ {  }, {  } ] ).


## Nodes

```js
flownetGraph.nodes_properties("property", "value")
flownetGraph.nodes_properties("property", function(d,i){ return "value"})
flownetGraph.nodes_properties("property", function(d,i){ return d.value})
```
<a href="#node_property" name="node_property">#</a> flownetGraph.**nodes_properties("property", "value")**

Set-up the specified property for each node in the graph according to the specified value. Like shown in the example above,
it is possible to pass a constant value or a function taking for parameters: **d** to access data bind to the node, **i** for the
position of the nodes in the nested selection (like d3).

#### Properties
* x: The position of the node on the horizontal axis of the canvas ( (0,0) => top left corner).
* y: The position of the node on the vertical axis of the canvas ( (0,0) => top left corner).
* color: The color of the node supported by several color encoding (hsl, rgb...)
* size: The size of the node coresponding to its radius.

## Links

```js
flownetGraph.links_properties("property", function(d,i){ return d.value})
flownetGraph.links_properties("property", function(d,i){ return d.value})
flownetGraph.links_properties("property", function(d,i){ return d.value})
```
<a href="#link_property" name="link_property">#</a> flownetGraph.**links_properties("property", "value")**

Set-up the specified property for each link in the graph according to the specified value. Like shown in the example above,
it is possible to pass a constant value or a function taking for parameters: **d** to access data bind to the node, **i** for the
position of the nodes in the nested selection (like d3).

#### Properties
* points: The collection of points that will be used to create the link. This must be an array of of two or more objects like: { x:n, y:m } .
* interpolation: The interpolation that will be used to modify the visual aspect of the link. Users can feed the function one of the following value: basis,
 cardinal, stepBefore, linear or can feed the function with a custom interpolation function taking an array of points as arguments.

  <img src="https://github.com/HugoRomat/flownet_SVG/blob/master/APIressources/interpolation/curveLinear.png" width="380" height="200">
  <img src="https://github.com/HugoRomat/flownet_SVG/blob/master/APIressources/interpolation/curveBasis.png" width="380" height="200">
  <img src="https://github.com/HugoRomat/flownet_SVG/blob/master/APIressources/interpolation/curveCardinal.png" width="380" height="200">
  <img src="https://github.com/HugoRomat/flownet_SVG/blob/master/APIressources/interpolation/curveStepBefore.png" width="380" height="200">
* color: The color of the particles supported by several color encoding (hsl, rgb...)
* size: The size of the link.

## Particules

```js
flownetGraph.particule_properties("property", "value")
flownetGraph.particule_properties("property", function(d,i){ return "value"})
flownetGraph.particule_properties("property", function(d,i){ return d.value})
```
<a href="#particule_property" name="particule_property">#</a> flownetGraph.**particule_properties("property", "value")**

Set-up the specified property for each link in the graph according to the specified value. Like shown in the example above,
it is possible to pass a constant value or a function taking for parameters: **d** to access data bind to the node, **i** for the
position of the nodes in the nested selection (like d3).

#### Basic properties
* color: The color of the particles supported by several color encoding (hsl, rgb...).
* height: The height of the particule inside the link.
<img src="https://github.com/HugoRomat/flownet_SVG/blob/master/APIressources/particule_height/height.png" width="900" height="120">
* pattern: How the paticles will appear on the link, this is used to create groups of particles that can have different lenghts and different space between them. This must be an array of number that contains an odd number of element.
<img src="https://github.com/HugoRomat/flownet_SVG/blob/master/APIressources/pattern/pattern.png" width="900" height="120">

#### Motion properties
* speed: The speed at which particles move, it is expressed in px/s.
* frequency: Represent the number of pattern of paticles that are fire each seconds. This is used with the speed in order to compute the space between two pattern and so the frequency is concurent with the spacing and automatically update this last using the rules: spacing = speed/frequency.
<img src="https://github.com/HugoRomat/flownet_SVG/blob/master/APIressources/frequency_speed/frequencySpeed.png" width="900" height="250">
* spacing: Represent the space between two patterns of paticles that are fire each seconds. This value is concurent with the frequency and automatically update the frequency value using the rules: frequency = speed/spacing. Contrary to the frequency the spacing is independent of speed.
<img src="https://github.com/HugoRomat/flownet_SVG/blob/master/APIressources/spacing/spacing.png" width="800" height="120">

## Graph animation

```js
flownetGraph.delay("value")
flownetGraph.fps("value")
flownetGraph.start()
flownetGraph.stop()
flownetGraph.reset()
```
<a href="#animation_delay" name="animation_delay">#</a> flownetGraph.**delay("value")**

Set a delay to the animation that will be take into account when calling "flownetGraph.start()"

<a href="#animation_fps" name="animation_fps">#</a> flownetGraph.**fps("value")**

Change the fps of the animation in order to ease CPU loading, there are two possible value:
* "auto": choice by default, let d3.js the control of the animation.
* Integer: the fps of the animation will be fix at the integer value, for a good fluidity/CPU loading ratio it is recommended to fix it at 40.

<a href="#animation_start" name="animation_start">#</a> flownetGraph.**start()**

Launch all the particles that are in the graph, the algorithm used by flownet depends of the fps setting. This does not take into account particles in launcher<a></a>, for a better comprehension of the animation: <a></a>

<a href="#animation_stop" name="animation_stop">#</a> flownetGraph.**stop()**

Stop all the transition in the graph. This does not take into account particles in launcher<a></a>, for a better comprehension of the animation: <a></a>

<a href="#animation_reset" name="animation_reset">#</a> flownetGraph.**reset()**

Reset all the transition in the graph. This does not take into account particles in launcher<a></a>, for a better comprehension of the animation: <a></a>


## Particles launcher
A launcher is used to fire several particules manually, it is based on three steps: Prepare/Load/Fire that are describe below. It can be load with several particles, each of them having their own properties.

```js
launcher = flownetGraph.particule_launcher("id_link")
launcher.prepare_particule() // Create one new particle
launcher.particule_properties("property","value")
launcher.on_start(function(){})
launcher.on_end(function(){})
launcher.load_particule()
launcher.fire_particule()
```
#### launcher.particule_launcher("id_link")
Create a particles launcher on the link that possess the specified id. Particles fired by the launcher will follow the link in the same direction as the basic particles.

### Prepare and set-up properties

<a href="#launcher_prepare_particule" name="launcher_prepare_particule">#</a> launcher.**prepare_particule()**

Create "empty" particles waiting to be set up. Without argument only one "empty" particle will be created, but by passing an array of object to the function this will create several "empty" particles with their respective data bind to them.

<a href="#launcher_particule_properties" name="launcher_particule_properties">#</a> launcher.**particule_properties("property","value")**

Set up the different properties of the <a>"empty" particule</a> that will be take into account when they will be launched.
* id: Set an id to the particle, important in order to interact with it with some function.
* pattern: How the paticles will appear on the link, this is used to create groups of particles that can have different lenghts and different space between them. This must be an array of number that contains an odd number of element.
* speed: The speed at which particles move, it is expressed in px/s.
* delay: The time that must elapse between the "fire_particule()" invoke and the beginning of the motion of the particle.
* color: The color of the particles supported by several color encoding (hsl, rgb...).
* height: The height of the particule.

<a href="#launcher_onStart" name="launcher_onStart">#</a> launcher**.on_start(function(){})**

Bind a function to the particle that will be invoke when the particle is shot, so when the delay is elapdes if the particle got one.

<a href="#launcher_onEnd" name="launcher_onEnd">#</a> launcher.**on_end(function(){})**

Bind a function to the particle that will be invoke when the particle is destroyed, so when the particle has reached the end of the link and has fully disapear.

### Load

<a href="#launcher_load" name="launcher_load">#</a> launcher.**load()**

Load the particles that were being prepared in the launcher, when the "fire_particule()" command is invoke only the particles that are load are shot.

<a href="#launcher_unload" name="launcher_unload">#</a> unloaded_particle = launcher.**unload("id_particle")**

Remove from the launcher the particle that have the specified "id". Return an object containing:
* The data that were bind to the particle (null if none).
* The properties that were associated to the particle.

### Fire

<a href="#launcher_fire_particule" name="launcher_fire_particule">#</a> launcher.**fire_particule()**

Start the animation of all the particle that were loaded using ".load()". Once invoke all the particles shot are stock until another "fire_particule()" is invoke.
