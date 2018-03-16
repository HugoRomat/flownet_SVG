
var launcher = {
  code: "\n"+
    "/******************** I GRAPH and DATA ***********************************/ \n"+
    "/******************** II NODE PROPERTIES *********************************/ \n"+
    "/******************** III LINK PROPERTIES *********************************/ \n"+
    "\n"+
    "/******************** NEW CODE *******************************************/ \n"+
    "function fire(canon){"+"\n"+
    "  canon.prepare_particule()"+"\n"+
    "  .particule_properties('id',0)"+"\n"+
    "  .particule_properties('height', 2.5)"+"\n"+
    "  .particule_properties('color','black')"+"\n"+
    "  .particule_properties('pattern', [6])"+"\n"+
    "  .particule_properties('speed', 300)"+"\n"+
    "  .particule_properties('delay', 1000 )"+"\n"+
    "  .on_start(function(){ })"+"\n"+
    "  .on_end(function(){ fire(canon) })"+"\n"+
    "  .load_particule()"+"\n"+
    "  .fire_particule()"+"\n"+
    "}"+"\n"+
    "\n"+
    "fire(flownetGraph.particule_launcher('link0'))"+"\n"+
    "fire(flownetGraph.particule_launcher('link1'))"+"\n"+
    "fire(flownetGraph.particule_launcher('link2'))"+"\n"+
    "fire(flownetGraph.particule_launcher('link3'))"+"\n"+
    "fire(flownetGraph.particule_launcher('link4'))"+"\n"+
    "fire(flownetGraph.particule_launcher('link5'))"+"\n",

  graph: function(){
      var data =
      {
        nodes:[
          {color:'black', size:10, id:"node0"},
          {color:'black', size:10, id:"node1"},
          {color:'black', size:10, id:"node2"},
          {color:'black', size:10, id:"node3"},
          {color:'black', size:10, id:"node4"},
          {color:'black', size:10, id:"node5"},
          {x:500, y:500, color:'black', size:10, id:"node6"},
        ],
        links:[
          {id:"link0", points:[], interpolation:'basis', colorLink:'lightGrey',
          sizeLink:8, colorParticule:'black', heightParticule:3,
          patternParticule:[5], frequencyParticule:3, speedParticule:150},

          {id:"link1", points:[], interpolation:'basis', colorLink:'lightGrey',
          sizeLink:8, colorParticule:'black', heightParticule:3,
          patternParticule:[5], frequencyParticule:3, speedParticule:150},

          {id:"link2", points:[], interpolation:'basis', colorLink:'lightGrey',
          sizeLink:8, colorParticule:'black', heightParticule:3,
          patternParticule:[5], frequencyParticule:3, speedParticule:150},

          {id:"link3", points:[], interpolation:'basis', colorLink:'lightGrey',
          sizeLink:8, colorParticule:'black', heightParticule:3,
          patternParticule:[5], frequencyParticule:3, speedParticule:150},

          {id:"link4", points:[], interpolation:'basis', colorLink:'lightGrey',
          sizeLink:8, colorParticule:'black', heightParticule:3,
          patternParticule:[5], frequencyParticule:3, speedParticule:150},

          {id:"link5", points:[], interpolation:'basis', colorLink:'lightGrey',
          sizeLink:8, colorParticule:'black', heightParticule:3,
          patternParticule:[5], frequencyParticule:3, speedParticule:150}
        ]
      }

      var numberCenter = 6
      var circle = []
      for (var i = 0; i < numberCenter; i++) {
        angle = ((2*Math.PI)/numberCenter) * i
        let cx = 500 + 300 * Math.cos(angle)
        let cy = 500 + 300 * Math.sin(angle)
        data.nodes[i].x = cx
        data.nodes[i].y = cy
        circle.push({x:cx, y:cy})
      }
      var innerCircle1 = []
      for (var i = 0; i < numberCenter; i++) {
        angle = ((2*Math.PI)/numberCenter) * (i+1)
        let cx = 500 + 200 * Math.cos(angle)
        let cy = 500 + 200 * Math.sin(angle)
        innerCircle1.push({x:cx, y:cy})
      }
      var innerCircle2 = []
      for (var i = 0; i < numberCenter; i++) {
        angle = ((2*Math.PI)/numberCenter) * (i+2)
        let cx = 500 + 100 * Math.cos(angle)
        let cy = 500 + 100 * Math.sin(angle)
        innerCircle2.push({x:cx, y:cy})
        data.links[i].points = [circle[i],innerCircle1[i], innerCircle2[i], {x:500,y:500}]
      }

      d3.select('#flownetDiv').append("svg")
        .attr('id', "canvas")
        .attr('width', 1000)
        .attr("height", 1000)
        .attr('transform', 'translate(' + (d3.select('#flownetDiv')._groups[0][0].clientWidth-1000)/2 + ',' + (d3.select('#flownetDiv')._groups[0][0].clientHeight-1000)/2 + ')'+
        'scale(' + d3.select('#flownetDiv')._groups[0][0].clientWidth/1000 + ',' + d3.select('#flownetDiv')._groups[0][0].clientHeight/1000 + ')')

      var flownetGraph = flownet_SVG.graph('creation', document.getElementById('canvas'))
        //.graph(graph)
        .nodes(data.nodes)
        .links(data.links)

        .nodes_properties('x', function(d, i){  return d.x})
        .nodes_properties('y', function(d, i){  return d.y})
        .nodes_properties('color', function(d, i){ return d.color})
        .nodes_properties('size', function(d, i){  return d.size})

        .nodes_properties('label_text', function(d, i){  if(i === 6) return ""; else return 'id:'+d.id})
        .nodes_properties('label_size', 16)
        .nodes_properties('label_x', function(d, i){  return d.x+10})
        .nodes_properties('label_y', function(d, i){  return d.y-10})
        .nodes_properties('label_font', 'arial')
        .nodes_properties('label_color', 'black')

        .links_properties('points', function(d,i){ return d.points})
        .links_properties('interpolation', function(d,i){ return d.interpolation})
        .links_properties('color', function(d,i){ return d.colorLink})
        .links_properties('size', function(d,i){ return d.sizeLink})

        function fire(canon){
          canon.prepare_particule()
          .particule_properties("id",0)
          .particule_properties("height", 2.5)
          .particule_properties("color","black")
          .particule_properties("pattern", [6])
          .particule_properties("speed", 300)
          .particule_properties("delay", 1000 )
          .on_start(function(){ })
          .on_end(function(){ fire(canon) })
          .load_particule()
          .fire_particule()
        }
        fire(flownetGraph.particule_launcher("link0"))
        fire(flownetGraph.particule_launcher("link1"))
        fire(flownetGraph.particule_launcher("link2"))
        fire(flownetGraph.particule_launcher("link3"))
        fire(flownetGraph.particule_launcher("link4"))
        fire(flownetGraph.particule_launcher("link5"))
        //.start()
    },

    miniature: function(svg){
      d3.select(svg).on("mouseenter", function(){
        trans()
      })
      d3.select(svg).on("mouseleave", function(){
        reset()
      })

      var circle = []
      for (var i = 0; i < 6; i++) {
        angle = ((2*Math.PI)/6) * i
        let cx = 147 + 40 * Math.cos(angle)
        let cy = 115 + 40 * Math.sin(angle)
        circle.push({x:cx, y:cy})
      }

      function reset(){
        d3.select(svg).select('g').selectAll('*').transition().remove()
        d3.select(svg).select('g').remove()
        d3.select(svg).append('g').selectAll('circle')
          .data(circle)
          .enter()
          .append('circle')
          .attr('id', function(d,i){ return 'circle'+i})
          .attr("cx", function(d){ return d.x})
          .attr("cy", function(d){ return d.y})
          .attr("fill", "white")
          .attr("r", 4)
        d3.select(svg).select('g').selectAll('line')
          .data([{n1:circle[0], n2:circle[3]},{n1:circle[1], n2:circle[4]},{n1:circle[2], n2:circle[5]}])
          .enter()
          .append('line')
          .attr('id', function(d,i){ return 'edge'+i})
          .attr('x1', function(d){ return d.n1.x})
          .attr('y1', function(d){ return d.n1.y})
          .attr('x2', function(d){ return d.n2.x})
          .attr('y2', function(d){ return d.n2.y})
          .attr('stroke', "#dddddd")
          .attr('stroke-width', 4)
        d3.select(svg).select('g').selectAll('none')
          .data([{n1:circle[0], n2:circle[3]},{n1:circle[1], n2:circle[4]},{n1:circle[2], n2:circle[5]}])
          .enter()
          .append('line')
          .attr('id', function(d,i){ return 'particle'+i})
          .attr('x1', function(d){ return d.n1.x})
          .attr('y1', function(d){ return d.n1.y})
          .attr('x2', function(d){ return d.n2.x})
          .attr('y2', function(d){ return d.n2.y})
          .attr('stroke-dasharray', [4,120])
          .attr('stroke', "#000000")
          .attr('stroke-width', 2)
      }

      d3.select(svg).select('text')
        .attr("x", 147)
        .attr("y", 40)
        .attr("fill", "white")
        .text("Particle launcher")

      function trans(){
          reset()

          d3.select(svg).selectAll('line').filter(function(d){ return this.getAttribute('id').includes('particle')})
            .attr('stroke-dashoffset', 0)
            .transition()
            .duration(6000)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', -120)
            .on('end', function(){
              trans()
            })
      }
      reset()

    }

}
