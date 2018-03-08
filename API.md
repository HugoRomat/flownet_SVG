# flownet_SVG: API Reference

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
* color: The color of the node supporting several color encoding (hsl, rgb...)
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
* interpolation: The interpolation that will be used to modify the visual aspect of the link.
  <img src="" width="250" height="250">
  <img src="" width="250" height="250">
  <img src="" width="250" height="250">
  <img src="" width="250" height="250">
* color: The color of the link supporting several color encoding (hsl, rgb...)
* size: The size of the link.

## Particules

```js
flownetGraph.particule_properties("property", "value")
flownetGraph.particule_properties("property", function(d,i){ return "value"})
flownetGraph.particule_properties("property", function(d,i){ return d.value})
```

#### Basic properties
* color
* height
* pattern
#### Motion properties
* frequency
* spacing
* speed

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
