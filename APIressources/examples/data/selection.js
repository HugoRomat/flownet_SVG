
var selection = {
  code: "\n"+
    "/******************** I GRAPH and DATA ***********************************/ \n"+
    "/******************** II NODE PROPERTIES *********************************/ \n"+
    "/******************** III LINK PROPERTIES ********************************/ \n"+
    "/******************** IV PARTICLE PROPERTIES *****************************/ \n"+
    "\n"+
    "/******************** NEW CODE *******************************************/ \n"+
    " let toremove = flownetGraph.selectAll()"+"\n"+
    "   .filters(function(d,i){ return (String(d.id).includes('node4') "+"\n"+
    "       || String(d.id).includes('link4')) })"+"\n"+
    "   .remove()"+"\n"+
    "\n"+
    " let tochangecolor = flownetGraph.selectAll()"+"\n"+
    "   .filters(function(d,i){ return (String(d.id).includes('link0') "+"\n"+
    "       || String(d.id).includes('link1')) })"+"\n"+
    "   .links_properties('color', 'skyblue')"+"\n",

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


        .particule_properties('color', function(d,i){ return d.colorParticule})
        .particule_properties('height', function(d,i){ return d.heightParticule})
        .particule_properties('frequency',function(d,i){ return d.frequencyParticule})
        .particule_properties('pattern', function(d,i){ return d.patternParticule})
        .particule_properties('speed', function(d,i){ return d.speedParticule})

        let toremove = flownetGraph.selectAll()
              .filters(function(d,i){ return (String(d.id).includes('node4') || String(d.id).includes('link4')) })
              .remove()

        let tochangecolor = flownetGraph.selectAll()
              .filters(function(d,i){ return (String(d.id).includes('link0') || String(d.id).includes('link1')) })
              .links_properties("color", "skyblue")
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
        .attr('stroke-dasharray', [4,4])
        .attr('stroke', "#000000")
        .attr('stroke-width', 2)
    }

    d3.select(svg).select('text')
      .attr("x", 147)
      .attr("y", 40)
      .attr("fill", "white")
      .text("Selection")

    function trans(){
        reset()
        d3.select('#circle0')
          .transition()
          .duration(2000)
          .attr("fill", "#555555")
        d3.select('#circle3')
          .transition()
          .duration(2000)
          .attr("fill", "#555555")
        d3.select('#circle2')
          .transition()
          .duration(2000)
          .attr("fill", "#555555")
        d3.select('#circle5')
          .transition()
          .duration(2000)
          .attr("fill", "#555555")
        d3.select('#edge0')
          .transition()
          .duration(2000)
          .attr("stroke", "#555555")
        d3.select('#edge2')
          .transition()
          .duration(2000)
          .attr("stroke", "#555555")
          .transition()
          .duration(2000)
          .on('end', function(){
            trans()
          })
    }
    reset()

  }

}
