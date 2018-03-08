# flownet_SVG: API Reference

## Graph creation

```js
flownetGraph = flownet_SVG.graph("name_of_graph", SVG)
```

### Nodes

```js
var graph = { nodes:[ {"property":"value"} ] }
var flownetGraph = flownet_SVG.graph("name_of_graph", SVG)
    .nodes(graph.nodes)
    .nodes_properties('property', function(d, i){ return d.property })
```

### Links

```js
var graph = { links:[ {"property":"value"} ]}
var flownetGraph = flownet_SVG.graph("name_of_graph", SVG)
    .links_properties('property', function(d, i){ return d.property })
```

### Particules

```js
var graph = {links:[ {"property":"value"} ]}
var flownetGraph = flownet_SVG.graph("name_of_graph", SVG)
    .particule_properties("property", function(d,i){ return d.property})
```

## Graph animation

```js
var flownetGraph = flownet_SVG.graph("name_of_graph", SVG)
    .start()
    .stop()
    .reset()
```

## Particles launcher

```js
launcher = flownetGraph.particule_launcher("id_link")
    .prepare_particule()
    .particule_properties("property","value")
    .load_particule()
    .fire_particule()
```
### Prepare

#### Properties

### Load

### Fire
