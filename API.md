# flownet_SVG: API Reference

## Graph creation

```js
flownetGraph = flownet_SVG.graph("name_of_graph", SVG)
```

### Nodes

```js
flownetGraph.nodes([{...},{...}...])
```
```js
flownetGraph.nodes_properties('property', function(d, i){ return d.property })
```
#### Properties
* x
* y
* color
* size

### Links

```js
flownetGraph.links([{...},{...}...])
```

```js
flownetGraph.links_properties('property', function(d, i){ return d.property })
```

#### Properties
* points
* interpolation
* color
* size

### Particules

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
### Prepare and properties
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
