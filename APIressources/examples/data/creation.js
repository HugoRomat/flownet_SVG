
var creation = {
  code: "\n"+

    "var graph ="+"\n"+
    "{"+"\n"+
    "  nodes:["+"\n"+
    "    {color:'black', size:10, id:'node0'},"+"\n"+
    "    {color:'black', size:10, id:'node1'},"+"\n"+
    "    {color:'black', size:10, id:'node2'}"+"\n"+
    "  ],"+"\n"+
    "  links:["+"\n"+
    "    {id:'link0', points:[], interpolation:'basis', colorLink:'lightGrey',"+"\n"+
    "    sizeLink:12, colorParticule:'black', heightParticule:3,"+"\n"+
    "    patternParticule:[10], frequencyParticule:1, speedParticule:150},"+"\n"+
    "\n"+
    "    {id:'link1', points:[], interpolation:'basis', colorLink:'lightGrey',"+"\n"+
    "    sizeLink:12, colorParticule:'black', heightParticule:3,"+"\n"+
    "    patternParticule:[10], frequencyParticule:1, speedParticule:150}"+"\n"+
    "  ]"+"\n"+
    "}"+"\n"+
    "\n"+
    "flownetGraph = flownet_SVG.graph('test', document.getElementById('canvas'))"+"\n"+
    "   .nodes(graph.nodes)"+"\n"+
    "   .links(graph.links)"+"\n"+
    "\n"+
    "\n"+
    "                             DOM RESULT:\n"+
    "\n"+
    "\n"+
    "<svg>\n"+
    "   <g id=creation>\n"+
    "       <g id=links>\n"+
    "           <g id=link1></g>\n"+
    "           <g id=link2></g>\n"+
    "       </g>\n"+
    "       <g id=nodes></g>\n"+
    "           <g id=node1></g>\n"+
    "           <g id=node2></g>\n"+
    "           <g id=node3></g>\n"+
    "       </g>\n"+
    "   </g>\n"+
    "</svg>",


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
          sizeLink:12, colorParticule:'black', heightParticule:3,
          patternParticule:[10], frequencyParticule:1, speedParticule:150},

          {id:"link1", points:[], interpolation:'basis', colorLink:'lightGrey',
          sizeLink:12, colorParticule:'black', heightParticule:3,
          patternParticule:[10], frequencyParticule:1, speedParticule:150},

          {id:"link2", points:[], interpolation:'basis', colorLink:'lightGrey',
          sizeLink:12, colorParticule:'black', heightParticule:3,
          patternParticule:[10], frequencyParticule:1, speedParticule:150},

          {id:"link3", points:[], interpolation:'basis', colorLink:'lightGrey',
          sizeLink:12, colorParticule:'black', heightParticule:3,
          patternParticule:[10], frequencyParticule:1, speedParticule:150},

          {id:"link4", points:[], interpolation:'basis', colorLink:'lightGrey',
          sizeLink:12, colorParticule:'black', heightParticule:3,
          patternParticule:[10], frequencyParticule:1, speedParticule:150},

          {id:"link5", points:[], interpolation:'basis', colorLink:'lightGrey',
          sizeLink:12, colorParticule:'black', heightParticule:3,
          patternParticule:[10], frequencyParticule:1, speedParticule:150}
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

      d3.select('#canvas').append("text")
        .attr("x", 500)
        .attr("y", 500)
        .attr("fill", "black")
        .style('font-size', 40)
        .style('text-anchor', 'middle')
        .text("No graph rendering yet")
      d3.select('#canvas').append("text")
        .attr("x", 500)
        .attr("y", 550)
        .attr("fill", "black")
        .style('font-size', 40)
        .style('text-anchor', 'middle')
        .text("Data has been bind to some DOM elements")

        //.start()
    },

  miniature: function(svg){
    d3.select(svg).on("mouseenter", function(){
      trans()
    })
    d3.select(svg).on("mouseleave", function(){
      console.log("leave");
      reset()
    })

    function reset(){
      d3.select(svg).select('g').selectAll('*').transition().remove()
      d3.select(svg).select('g').remove()
      d3.select(svg).append('g').append("text")
        .attr("x", 147)
        .attr("y", 115)
        .attr("fill", "white")
        .style('font-size', 20)
        .style('text-anchor', 'middle')
        .text("{Data Nodes + Links}")
        .attr("opacity", 1)
    }

    d3.select(svg).select('text')
      .attr("x", 147)
      .attr("y", 40)
      .attr("fill", "white")
      .text("Graph and Data")

    function trans(){
      reset()
        d3.select(svg).select('g').select('text').transition()
        .duration(1000)
        .attr("opacity", 0)
        .on('end', function(){
          d3.select(svg).select('g').append("text")
            .attr("x", 147)
            .attr("y", 115)
            .attr("fill", "white")
            .style('font-size', 20)
            .style('text-anchor', 'middle')
            .text("DOM elements")
            .attr("opacity", 0)
            .transition()
            .duration(1000)
            .attr("opacity", 1)
            .transition()
            .duration(2000)
            .on('end', function(){
              d3.select(svg).select('g').remove()
              trans()
            })
/*          var numberCenter = 6
          var nodes= []
          var circle = []
          for (var i = 0; i < numberCenter; i++) {
            angle = ((2*Math.PI)/numberCenter) * i
            let cx = 147 + 40 * Math.cos(angle)
            let cy = 115 + 40 * Math.sin(angle)
            data.nodes[i].x = cx
            data.nodes[i].y = cy
            circle.push({x:cx, y:cy})
          }
          var innerCircle2 = []
          for (var i = 0; i < numberCenter; i++) {
            angle = ((2*Math.PI)/numberCenter) * (i+1)
            let cx = 147 + 20 * Math.cos(angle)
            let cy = 115 + 20 * Math.sin(angle)
            innerCircle2.push({x:cx, y:cy})
            nodes.push({points:[circle[i], innerCircle2[i], {x:147,y:115}]})
          }
*/

        })
    }
    reset()

  }

}
