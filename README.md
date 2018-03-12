# flownet_SVG


**flownet**  is a JavaScript library for visualizing data using particles flow.
With this library, you will be able to construct network visualisation with animated particles by matching data with the attribute of your network, ie the nodes, links and particles.
This is the SVG version of flownet, it exist also a [webgl version.](https://github.com/HugoRomat/flownet_WEBGL)

## Resources

* [Wiki]()
* [API](https://github.com/HugoRomat/flownet_SVG/blob/master/API.md)
* [Examples]()
* [Gallery]()

## Example

The first example shows a basic template of a flownet_SVG graph using a JSON that contain data used in the graph. First a "flownetGraph" is created with the id:"example" and nodes and links are created according to the data that are bind to them. Then several properties like color, size... are set up for the nodes, link and particles. Finally the particles are set to motion using start().

```js
data = {
  nodes:[{id:"n0", size:20}, {id:"n1", size:10}],
  links:[{id:"l0", points:[{x:100, y:100}, {x:200, y:200}, {x:300, y:100}], speed:100, frequency:1 }]
}
flownetGraph = flownet_SVG.graph("example", SVG)
    .nodes(data.nodes)
    .links(data.links)

    .nodes_properties("id", function(d,i){ return d.id})
    .nodes_properties("color", "black")
    .nodes_properties("size", function(d,i){ return d.size})

    .links_properties("id", function(d,i){ return d.id})
    .links_properties("points", function(d,i){ return d.points})
    .links_properties("interpolation", "cardinal")
    .links_properties("color", "#dddddd")
    .links_properties("size", 9)

    .particule_properties("color", "black")
    .particule_properties("height", 4)
    .particule_properties("speed", function(d,i){ return d.speed})
    .particule_properties("frequency", function(d,i){ return d.frequency})
    .particule_properties("pattern", [10])

    .start()
```

The second example shows the creation and utilisation of a flownet_SVG particle launcher. First a launcher is created on the links with the id:"l0" then a particle is created and its properties are setting up. Once ready the particle is stock using the load_particule() function and fire when the fire_particule() is invoke.

```js
special_Particle = { id:"p0", speed:200, pattern:[20,4,20] }]
}
launcher = flownetGraph.particule_launcher("l0")

            .prepare_particule()
            .particule_properties("id", function(d,i){ return d.id})
            .particule_properties("pattern", function(d,i){ return d.pattern})
            .particule_properties("speed", function(d,i){ return d.speed})
            .particule_properties("color", "blue")
            .particule_properties("height", 6)  

            .load_particule()

            .fire_particule()
```
