# flownet: SVG version


**flownet**  is a JavaScript library for visualizing data using particles flow.
With this library, you will be able to construct network visualisation with animated particles by matching data with the attribute of your network, ie the nodes, links and particles.
This is the SVG version of flownet, it exist also a [webgl version.](https://github.com/HugoRomat/flownet_WEBGL)

## Resources

* [Wiki]()
* [API](https://github.com/HugoRomat/flownet_SVG/blob/master/API.md)
* [Live Examples]()
* [Gallery]()

## Quick template of a flownet graph

The first example shows a basic template of a flownet graph using a JSON that contain data used in the graph. First a "flownet.graph" is created taking into parameter the svg's id in which it will be displayed Next nodes and links are created according to the data that are bind to them using the corresponding nodes()/links() function. Then users set up several properties like color, size... for the nodes, link and particles. Finally the particles are set to motion using start().

```js
data = {
  nodes:[{id:"node0", size:20}, {id:"node1", size:10}],
  links:[{id:"link0", source: "n0", target:"n1", speed:100, frequency:1, pattern:[0.0,0.3] }]
}
flownetGraph = flownet.graph("#SVGid")
    .nodes(data.nodes)
    .links(data.links)

    .node_properties("id", function(d,i){ return d.id})
    .node_properties("color", "black")
    .node_properties("size", function(d,i){ return d.size})

    .link_properties("id", function(d,i){ return d.id})
    .link_properties("interpolation", "cardinal")
    .link_properties("color", "#dddddd")
    .link_properties("size", 9)

    .particles("color", "black")
    .particles("height", 3)
    .particles("size", 8)
    .particles("speed", function(d,i){ return d.speed})
    .particles("frequency", function(d,i){ return d.frequency})
    .particles("pattern", function(d,i){ return d.pattern})

    .start()
```

The second example shows the creation and utilisation of a flownet_SVG particle launcher. First a launcher is created on the links with the id:"l0" then a particle is created and its properties are setting up. Once ready the particle is stock using the load_particule() function and fire when the fire_particule() is invoke.

```js
special_Particle = { id:"particle", speed:200, pattern:[20] }]
}
launcher = flownetGraph.particule_launcher("link0")
    .prepare_particule()
    .particule_properties("id", function(d,i){ return d.id})
    .particule_properties("pattern", function(d,i){ return d.pattern})
    .particule_properties("speed", function(d,i){ return d.speed})
    .particule_properties("color", "blue")
    .particule_properties("height", 6)  

    .load_particule()

    .fire_particule()
```
