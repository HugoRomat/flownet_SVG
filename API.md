# flownet_SVG: API

## Summary
#### flownet_SVG.graph(id,svg)
#### flownetGraph.nodes(data_Nodes)
#### flownetGraph.links(data_Links)
#### flownetGraph.nodes_properties("property", "value")
#### flownetGraph.links_properties("property", "value")

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
#### flownet_SVG.graph(id,svg)

Construct a new graph tag by an "id" in the specified svg using flownet_SVG.

#### flownetGraph.nodes(data_Nodes)

Fill the graph previously created with **nodes** according to the number of Object in the array (data_Nodes= [ {  }, {  } ] ).

#### flownetGraph.links(data_Links)

Fill the graph previously created with **links** according to the number of Object in the array (data_Links= [ {  }, {  } ] ).


## Nodes

```js
flownetGraph.nodes_properties("property", "value")
flownetGraph.nodes_properties("property", function(d,i){ return "value"})
flownetGraph.nodes_properties("property", function(d,i){ return d.value})
```
#### flownetGraph.nodes_properties("property", "value")

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
#### flownetGraph.links_properties("property", "value")

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
#### flownetGraph.particule_properties("property", "value")

Set-up the specified property for each link in the graph according to the specified value. Like shown in the example above,
it is possible to pass a constant value or a function taking for parameters: **d** to access data bind to the node, **i** for the
position of the nodes in the nested selection (like d3).

#### Basic properties
* color: The color of the particles supported by several color encoding (hsl, rgb...).
* height: The height of the particule inside the link.
<img src="https://github.com/HugoRomat/flownet_SVG/blob/master/APIressources/particule_height/height.png" width="800" height="50">
* pattern: How the paticles will appear on the link, this is used to create groups of particles that can have different lenghts and different space between them. This must be an array of number that contains an odd number of element.
<img src="https://github.com/HugoRomat/flownet_SVG/blob/master/APIressources/pattern/pattern.png" width="800" height="50">
#### Motion properties
* speed: The speed at which particles move, it is expressed in px/s.
* frequency: Represent the number of pattern of paticles that are fire each seconds. This is used with the speed in order to compute the space between two pattern and so the frequency is concurent with the spacing and automatically update this last using the rules: spacing = speed/frequency.
<img src="https://github.com/HugoRomat/flownet_SVG/blob/master/APIressources/frequency_speed/frequencySpeed.png" width="800" height="50">
* spacing: Represent the space between two patterns of paticles that are fire each seconds. This value is concurent with the frequency and automatically update the frequency value using the rules: frequency = speed/spacing. Contrary to the frequency the spacing is independent of speed.
<img src="" width="800" height="50">

## Graph animation

```js
flownetGraph.delay("value")
```

```js
flownetGraph.fps("value")
```

```js
flownetGraph.start()
```

```js
flownetGraph.stop()
```

```js
flownetGraph.reset()
```

## Particles launcher

```js
launcher = flownetGraph.particule_launcher("id_link")
```
### Prepare and set-up properties
```js
launcher.prepare_particule()
```

```js
launcher.particule_properties("property","value")
```
```js
launcher.on_start(function(){})
```
```js
launcher.on_end(function(){})
```

### Load

```js
launcher.load_particule()
```

### Fire

```js
launcher.fire_particule()
```
