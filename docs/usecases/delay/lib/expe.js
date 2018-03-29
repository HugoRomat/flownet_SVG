
function d3_graph(nodes_tab, links_tab){
    //console.log("HEEEEEEEYYYY JE SUIS LA ")
    /**************** D3 PART ***************/
    var self = this;
    this.width = 500,
    this.height = 500;
    this.x_offset = 250;
    this.y_offset = 250;

    // var node_array = [{"x":50, "y":100}, {"x":10, "y":20}, {"x":50, "y":3}];
    // var edge_array = [{"source":0, "target":1},{"source":0, "target":2}]
    // var my_projection = d3.geo.mercator()
    //                 .scale(500)
    //                 .translate([800,100]);

    this.node_array = nodes_tab;
    this.edge_array = links_tab;
    console.log("TABSSS", nodes_tab, links_tab)


    this.force = d3.layout.force()
        .gravity(0.05)
        .distance(100)
        .charge(-100)
        .size([this.width, this.height]);

    this.force
      .nodes(this.node_array)
      .links(this.edge_array)
      .start();

    this.svg = d3.select("body").append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

    this.link = this.svg.selectAll(".links")
        .data(this.edge_array)
      .enter().append("svg:path")
        .attr("class", "links")
        .attr("id", function(d) { return "link"+d.id;})
      //.on("mouseover", function(d){d3.select(this).style("stroke", "red");    self.mouse_over_links(d)})

    //console.log(this.link)
    this.node = this.svg.selectAll(".node")
      .data(this.node_array)
    .enter().append("circle")
      .attr("class", "node")
      .attr("fill", "rgb(255, 127, 0)")
      .attr("r", 10)
      .attr("cx", function(d) { console.log(d.x);return (d.x + self.x_offset);})
      .attr("cy", function(d) { return (d.y + self.y_offset );})

    // Define the div for the tooltip
    // this.div = d3.select("body").append("div")
    //  .attr("class", "tooltip")
    //  .style("opacity", 1)
    //  .on("keydown", function() { self.validate_textarea();});
    this.div = d3.select("body").selectAll(".tooltip")
        .data(this.edge_array)
    .enter().append("div")
        .attr("class", "tooltip")
        //.on("keydown", function() { self.validate_textarea();})
        .html(function(d, i) {return "<textarea class='tooltip_text' id=tooltip"+d.id+">"+ self.edge_array[d.id].rank + "</textarea>"})
        //.html(function(d, i) {"<textarea></textarea>" })
        .on("keydown", function(d) { self.validate_textarea("tooltip"+d.id, d);})

        .style("left", function(d, i) {
            var path = draw_curve((d.source.x+self.x_offset), d.source.y +self.y_offset, (d.target.x+self.x_offset), d.target.y+self.y_offset);
            return ((path[2].x-path[0].x)/2) + 500 +path[0].x + "px";
        })
        .style("top", function(d, i) {
            var path = draw_curve((d.source.x+self.x_offset), d.source.y +self.y_offset, (d.target.x+self.x_offset), d.target.y+self.y_offset);
            return ((path[2].y-path[0].y)/2)  +path[0].y + "px";
        })
     //    .style("top", function(d) { return (d.source.y - 28) + "px"})




      // var link = svg.selectAll(".link")
      //     .data(edge_array)
      //   .enter().append("line")
      //     .attr("class", "link");
      //The line SVG Path we draw


    this.force.on("tick", function() {
        //self.link.attr("d", function(d) { return draw_curve((d.source.x+self.x_offset), d.source.y +self.y_offset, (d.target.x+self.x_offset), d.target.y+self.y_offset);});
        self.link.attr("d", function(d) {
            var path = draw_curve((d.source.x+self.x_offset), d.source.y +self.y_offset, (d.target.x+self.x_offset), d.target.y+self.y_offset);
            return "M" + path[0].x + "," + path[0].y + "Q" + path[1].x + "," + path[1].y +" " + path[2].x + "," + path[2].y;
        });
        self.force.stop();
    });
}


d3_graph.prototype.validate_textarea = function(id, d){
    //console.log(d3.event.keyCode)
    //if (d3.event.keyCode == 13){
    var value = $("#"+id).val();
    console.log(id, value)
    //var edge = d3.select("#tooltip").attr("tooltip_edge");
    this.edge_array[d.id].rank = value;
    console.log(this.edge_array);
    //}
}





function draw_curve(Ax, Ay, Bx, By) {

    //console.log(Ax, Ay, Bx, By)
    M = get_distance(Ax, Ay, Bx, By) / 4;
    var signe = -1;
    if ( Ax<Bx ){signe = 1;}
    if ( Ay>By ){signe *= -1;}
    M *= signe;
    // side is either 1 or -1 depending on which side you want the curve to be on.
    // Find midpoint J
    var Jx = Ax + (Bx - Ax) / 2
    var Jy = Ay + (By - Ay) / 2

    // We need a and b to find theta, and we need to know the sign of each to make sure that the orientation is correct.
    var a = Bx - Ax
    var asign = (a < 0 ? -1 : 1)
    var b = By - Ay
    var bsign = (b < 0 ? -1 : 1)
    var theta = Math.atan(b / a)

    // Find the point that's perpendicular to J on side
    var costheta = asign * Math.cos(theta)
    var sintheta = asign * Math.sin(theta)

    // Find c and d
    var c = M * sintheta
    var d = M * costheta

    // Use c and d to find Kx and Ky
    var Kx = Jx - c
    var Ky = Jy + d

    return [{"x":Ax,"y": Ay}, {"x":Kx, "y":Ky}, {"x":Bx, "y":By}]
    //return "M" + Ax + "," + Ay +
    //       "Q" + Kx + "," + Ky +
     //      " " + Bx + "," + By
}
/* Get the distance between two points */
function get_distance(x1, y1, x2, y2){
    var a = x1 - x2
    var b = y1 - y2

    var c = Math.sqrt( a*a + b*b );
    //console.log(c)
    return c;
}
