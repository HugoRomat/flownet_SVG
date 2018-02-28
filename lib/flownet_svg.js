

/*
function startTransitionFPS(link, FPS){

  frame = 0
  dashOffset = Number(link.attr("stroke-dashoffset"))
  patternArray = link.attr("stroke-dasharray").split(",")
  offset = patternArray.map(x => Number(x)).reduce((a, b) => a + b, 0)
  offsetMinusFrequency = offset //- Number(patternArray[patternArray.length-1])

  interpol = d3.interpolateNumber(0+dashOffset, offset+adjust )

  speed = 0
  link.each(function(d){ speed = d.speed })
  duration = computeSpeed( Number(speed), offsetMinusFrequency)

  animation_interval = window.setInterval(function(){
    frame++
    console.log(frame, link.attr('id'), animation_interval);
    link.attr('stroke-dashoffset', interpol(frame/(FPS*duration)))

    if ( frame >= 500){
      window.clearInterval(this)
      return;
    }
  },1000 / FPS);


  function fpsTransition(link, delay, step, limit, start, offset, adjust){
    if ( step === limit){
      link.transition()
        .delay(delay)
        .duration(0)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', offset+adjust)
        .on('start', function() {
          fpsTransition(link, delay, 0, limit, start - offset, offset - offset, adjust)
        })
    }else{
      link.transition()
        .delay(delay)
        .duration(0)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', (start+adjust)+(((offset+adjust)-(start+adjust))/limit)*step)
        .on('start', function() {
          fpsTransition(link, delay, step+2, limit, start, offset, adjust)
        })
    }
  }

  function motionDash(start, offset, adjust) {
    link.attr('stroke-dashoffset', start+adjust)

    count = Math.floor((duration/1000)*FPS)
    fpsTransition(link, duration/count, 1, count, start, offset, adjust)
    fpsTransition(link, duration/count, 2, count, start, offset, adjust)
  }
  motionDash(0, -offset, dashOffset)
}*/


/*
function startTransitionSVG(link){
  dashOffset = Number(link.attr("stroke-dashoffset"))
  patternArray = link.attr("stroke-dasharray").split(",")
  offset = patternArray.map(x => Number(x)).reduce((a, b) => a + b, 0)
  offsetMinusFrequency = offset //- Number(patternArray[patternArray.length-1])

  function fpsTransition(link, delay, step, limit, start, offset, adjust){
    if ( step === limit){
      link.transition()
        .delay(delay)
        .duration(0)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', offset+adjust)
        .on('end', function() {
          motionDash(start - offset, offset - offset, adjust);
        })
    }else{
      link.transition()
        .delay(delay)
        .duration(0)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', (start+adjust)+(((offset+adjust)-(start+adjust))/limit)*step)
        .on('end', function() {
          fpsTransition(link, delay, step+1, limit, start, offset, adjust)
        })
    }
  }

  function motionDash(start, offset, adjust) {
    link.attr('stroke-dashoffset', start+adjust)
    speed = 0
    link.each(function(d){ speed = d.speed })
    duration = computeSpeed( Number(speed), offsetMinusFrequency)
    count = Math.floor((duration/1000)*FPS)
    fpsTransition(link, duration/count, 1, count, start, offset, adjust)
  }
  motionDash(0, -offset, dashOffset)
}
*/


/*
function startTransitionSVG(link){
  dashOffset = Number(link.attr("stroke-dashoffset"))
  patternArray = link.attr("stroke-dasharray").split(",")
  offset = patternArray.map(x => Number(x)).reduce((a, b) => a + b, 0)
  offsetMinusFrequency = offset //- Number(patternArray[patternArray.length-1])
  function motionDash(start, offset, adjust) {
    link.attr('stroke-dashoffset', start+adjust)
      .transition()
        .duration(function(d){
          return computeSpeed(d.speed, offsetMinusFrequency)
        })
        .ease(d3.easeLinear)
        .attrTween('stroke-dashoffset', function(){
            return function(t){
              console.log(t);
              return d3.interpolateNumber( start+adjust, offset+adjust)(t)
            }
        })
        .on('end', function() {
          motionDash(start - offset, offset - offset, adjust);
        });
  }
  motionDash(0, -offset, dashOffset)
}

*/

/************************************************************************************************************************************/
/***************************************************  CREATE AND SELECTION  *********************************************************/

function flownet_svg_graph(id, svg){
    this.groupGraph = d3.select(svg).append('g').attr('id', id)
    this.groupGraph.append('g').attr('id', 'links')
    this.groupGraph.append('g').attr('id', 'nodes')

    this.FPS = "auto"

    //this.modeOfSelection = "none"
    //this.selection = null
}

flownet_svg_graph.prototype.graph = function(graph){
  this.links(graph.links)
  this.nodes(graph.nodes)
  return this
} //OK
flownet_svg_graph.prototype.links = function(data){
  this.groupGraph.select("#links").selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('id', function(d,i){
      if ( d.id ) return "link_"+d.id
      else d.id = "link_"+i
      return "link_"+i
    })
    .each(function(d){
      d3.select(this).append('path')
        .attr('id', function(d,i){
          if ( d.id ) return "edge_"+d.id
          else d.id = "edge_"+i
          return "edge_"+i
        })
        .attr('fill', 'none')

      d3.select(this).append('path')
        .attr('id', function(d,i){
          if ( d.id ) return "particules_"+d.id
          else d.id = "particules_"+d.id
          return "particule_"+i
        })
        .attr('fill', 'none')
        .attr('gate', 'none')
        .each(function(d){ d.previousDashOffset = 0})
    })
  this.modeOfSelection = "none"
  return this
} //OK
flownet_svg_graph.prototype.nodes = function(nodes){
  this.groupGraph.select('#nodes').selectAll('circle')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('id', function(d,i){
        if ( d.id ) return "node_"+d.id
        else d.id = "node_"+i
        return "node_"+i
      })
  this.modeOfSelection = "none"
  return this
} //OK

/*
flownet_svg_graph.prototype.filter = function(...filtersIdsArrayofIds){
  if ( this.modeOfSelection === "nodes") this.selection = this.groupGraph.select("#nodes").selectAll('*')
  else if ( this.modeOfSelection === "links") this.selection = this.groupGraph.select("#links").selectAll('*')
  else if ( this.modeOfSelection === "nodes") return

  this.selection = this.selection.filter(function(d,index){
      for (let i = 0; i < filtersIdsArrayofIds.length; i++) {
        if ( filtersIdsArrayofIds[i].isArray ){
          for (var j = 0; j < filtersIdsArrayofIds[i].length; j++) { if(filtersIdsArrayofIds[i][j] === d.id) return true }
        }else if (typeof(filtersIdsArrayofIds[i]) === 'function'){
          if (filtersIdsArrayofIds[i](d,index)) return true
        }else{
          if(filtersIdsArrayofIds[i] === "*") return true
          if(filtersIdsArrayofIds[i] === d.id) return true
        }
      }
      return false
    })
    return this
}
*/

/************************************************************************************************************************************/
/***************************************************  NODE  *************************************************************************/

flownet_svg_graph.prototype.nodes_properties = function(property, value, filter){
  function convertNodePropertyToSVG(property){
    switch (property) {
      case "id":
          return "id"
        break;
      case "class":
          return "class"
        break;
      case "color":
          return "fill"
        break;
      case "size":
          return "r"
        break;
      case "x":
          return "cx"
        break;
      case "y":
          return "cy"
        break;
      default:
        return undefined
    }
  } //OK
  svgProp = convertNodePropertyToSVG(property)
  if ( !svgProp ){
    this.groupGraph.select("#nodes").selectAll('*')
      .filter( function(d,i){
        if ( !filter ) return true
        if (typeof(filter) === 'function') return filter(d,i)
        else return filter
      })
      .style(property, value)
  }else{
    this.groupGraph.select("#nodes").selectAll('*')
      .filter( function(d,i){
        if ( !filter ) return true
        if (typeof(filter) === 'function') return filter(d,i)
        else return filter
      })
      .attr(svgProp, value)
  }
  return this
}
flownet_svg_graph.prototype.nodes_behaviors = function(on, callback, filter){
  this.groupGraph.select("#nodes").selectAll('*')
    .filter( function(d,i){
      if ( !filter ) return true
      if (typeof(filter) === 'function') return filter(d,i)
      else return filter
    })
    .on(on, callback)
  return this
}

/************************************************************************************************************************************/
/***************************************************  LINK **************************************************************************/
function interpolateLink(interpolation){
  lineFunction =  d3.line()
                  .x(function(d) { return d.x; })
                  .y(function(d) { return d.y; })

  switch (interpolation) {
    case "linear":
      lineFunction.curve(d3.curveLinear)
      break;
    case "stepBefore":
      lineFunction.curve(d3.curveStepBefore)
      break;
    case "stepAfter":
      lineFunction.curve(d3.curveStepAfter)
      break;
    case "basis":
      lineFunction.curve(d3.curveBasis)
      break;
    case "basis-open":
      lineFunction.curve(d3.curveBasisOpen)
      break;
    case "bundle":
      lineFunction.curve(d3.curveBundle)
      break;
    case "cardinal-open":
      lineFunction.curve(d3.curveCardinalOpen)
      break;
    case "cardinal":
      lineFunction.curve(d3.curveCardinal)
      break;
    case "natural":
      lineFunction.curve(d3.curveNatural)
      break;
    default:
      lineFunction.curve(d3.curveLinear)
  }
  return lineFunction;
}
function updateLinkPoints(link){
  d3.select(link).selectAll('path')
    .attr('d', function(d) {
      return interpolateLink(d3.select(link).attr('interpolation'))(JSON.parse(d3.select(link).attr('points')))
    })

}
flownet_svg_graph.prototype.links_properties = function(property, value, filter){
  function convertLinkPropertyToSVG(property){ //OK
    switch (property) {
      case "visibility":
          return "visibility"
          break;
      case "points":
          return "points"
          break;
      case "color":
          return "stroke"
        break;
      case "interpolation":
          return "d"
        break;
      case "size":
          return "stroke-width"
        break;
      default:
    }
  }
  if (property === "interpolation"){
    this.groupGraph.select("#links").selectAll('g')
      .filter( function(d,i){
        if ( !filter ) return true
        if (typeof(filter) === 'function') return filter(d,i)
        else return filter
      })
      .attr("interpolation", function(d){
        if (typeof(value) === 'function'){
          return value(d)
        }
        return value
      })
      .selectAll('path')
      .attr(convertLinkPropertyToSVG(property), function(d){
        return interpolateLink( (typeof(value) === 'function'? value(d) : value))(d.points)
      })
  }else if (property === "points"){
      this.groupGraph.select("#links").selectAll('g')
        .filter( function(d,i){
          if ( !filter ) return true
          if (typeof(filter) === 'function') return filter(d,i)
          else return filter
        })
        .attr("points", function(d){
          if (typeof(value) === 'function'){
            return JSON.stringify(value(d))
          }
          return JSON.stringify(value)
        })
        .each(function(d){ updateLinkPoints(this) })
  }else if (property === "visibility"){
    this.groupGraph.select("#links").selectAll('g')
      .filter( function(d,i){
        if ( !filter ) return true
        if (typeof(filter) === 'function') return filter(d,i)
        else return filter
      })
      .attr(convertLinkPropertyToSVG(property), value)
  }else{
    this.groupGraph.select("#links").selectAll('*')
    .filter( function(d,i){
      if ( !filter ) return true
      if (typeof(filter) === 'function') return filter(d,i)
      else return filter
    })
    .filter(function(d){ return this.getAttribute('id').includes('edge'); })
    .attr(convertLinkPropertyToSVG(property), value)
  }
  return this
}
flownet_svg_graph.prototype.links_behaviors = function(on, callback, filter){
  this.groupGraph.select("#links").selectAll('*')
    .filter( function(d,i){
      if ( !this.getAttribute('id').includes('edge') ) return false
      if ( !filter ) return true
      if (typeof(filter) === 'function') return filter(d,i)
      else return filter
    })
    .on(on, callback)
  return this
}

/************************************************************************************************************************************/
/*************************************************** GATE ***************************************************************************/

function cutPathForGate(link, edge, particule, gate, offset){
  dotListBeforeCut = []
  dotListAfterCut = []
  switchDot = gate.position-offset
  switchDuplicate = false
  for (var i = 0; i < 41; i++) {
    dot = particule.getPointAtLength( (particule.getTotalLength()/40)*i );
    if ( (particule.getTotalLength()/40)*i < switchDot ) dotListBeforeCut.push({x:dot.x, y:dot.y})
    else{
      if ( !switchDuplicate ){
        switchDuplicate = true
        switchCoordinate = particule.getPointAtLength(switchDot)
        dotListBeforeCut.push({x:switchCoordinate.x, y:switchCoordinate.y})
        dotListAfterCut.push({x:switchCoordinate.x, y:switchCoordinate.y})
      }
      dotListAfterCut.push({x:dot.x, y:dot.y})
    }
  }

  curve = d3.select(link).attr("interpolation")
  interp = interpolateLink(curve)
  /*d3.select(edge).attr('d', function(){
    return interp(dotListBeforeCut)
  })*/
  d3.select(particule).attr('d', function(){
    return interp(dotListBeforeCut)
  })
  /*
  nextElelment = particule.nextSibling
  d3.select(link).insert('path', nextElelment? nextElelment.getAttribute('id'):nextElelment )
    .attr('id',function(d){ return "edge_x"})
    .attr('fill', 'none')
    .attr('d', function(d){ return interp(dotListAfterCut) })
    .attr('stroke', edge.getAttribute('stroke') )
    .attr('stroke-width', edge.getAttribute('stroke-width'))
    */
  //newParticule = document.createElement('path')
  nextElelment = particule.nextSibling
  console.log(nextElelment? nextElelment.getAttribute('id'):null);
  newParticule = d3.select(link).insert('path', nextElelment? "#"+nextElelment.getAttribute('id'):null )
    .attr('id',function(d){ return "particules_x"})
    .attr('gate', gate.type)
    .attr('fill', 'none')
    .attr('d', function(d){ return interp(dotListAfterCut) })
    .attr('stroke', function(d){
      if ( gate.type === "color" ) return gate.newValue
      else return particule.getAttribute('stroke')
    })
    .attr('stroke-width', function(d){
      if ( gate.type === "height" ) return gate.newValue
      else return particule.getAttribute('stroke-width')
    })
    .attr("stroke-dasharray", particule.getAttribute('stroke-dasharray') )
    .attr('stroke-dashoffset', function(d){
      previousDashOffset = Number(particule.getAttribute('stroke-dashoffset'))
      d.previousDashOffset = (particule.getTotalLength()+previousDashOffset) % (particule.getAttribute('stroke-dasharray').split(',').reduce((a, b) => Number(a) + Number(b), 0))
      return (particule.getTotalLength()+previousDashOffset) % (particule.getAttribute('stroke-dasharray').split(',').reduce((a, b) => Number(a) + Number(b), 0));
    })

    d3.select(link).selectAll('path').attr('id', function(d,i){
      if ( i === 0 ) {
        return this.getAttribute('id')
      }else{
        return "particules_"+i
      }
    })

    indexOfParticule = -1
    for (var i = 1; i < link.childNodes.length; i++) { if (link.childNodes[i].getAttribute('id') === particule.getAttribute('id')) indexOfParticule = i}
    //console.log(link.childNodes[indexOfParticule], link.childNodes[indexOfParticule+1] , link.childNodes[indexOfParticule+2] );
    if (indexOfParticule === -1 || indexOfParticule+2 >= link.childNodes.length ) return
    propagateGate(link.childNodes[indexOfParticule+2], gate)


}
function propagateGate(link, gate){
  console.log( link.getAttribute('gate') , gate.type );
  if ( link.getAttribute('gate') === gate.type) return

  if ( gate.type === "color") link.setAttribute('stroke', gate.newValue)
  else if (gate.type === "height") link.setAttribute('stroke-width', gate.newValue)

  if (link.nextSibling === null) return
  propagateGate(link.nextSibling, gate)
}
function addGates(link, gate){
  total_length = link.childNodes[0].getTotalLength()
  offset = 0
  gate.position = convertUnitToPathPostion(gate.position, total_length)

  for (var i = 1; i < link.childNodes.length; i++) {
    //console.log(  gate.position , offset , offset+link.childNodes[i].getTotalLength()   );
    if ( gate.position > offset && gate.position < offset+link.childNodes[i].getTotalLength() ){
      cutPathForGate(link, link.childNodes[0], link.childNodes[i], gate, offset )
      return
    }
    offset += link.childNodes[i].getTotalLength()
  }
  console.log("FAIL can't place gate");
}
function convertUnitToPathPostion(unit, lenght){
  if ( unit.includes('%')){
    value = parseFloat(unit)
    if ( value > 100 ) return lenght
    if ( value < 0) return 0
    return (lenght/100)*value
  }else if ( unit.includes('px')){
    value = parseFloat(unit)
    if ( value > lenght ) return lenght
    if ( value < 0) return 0
    return value
  }else{
    value = parseFloat(unit)
    return value
  }
}
flownet_svg_graph.prototype.link_add_gate = function(type, newValue, position){
  if (type === "color"){
    this.groupGraph.select("#links").selectAll('g').each(function(){
      actualGate = this.getAttribute('gate')
      dataBind = null
      d3.select(this).select('path').each(function(d){ dataBind = d})
      nval = (typeof(newValue) === 'function'? newValue(dataBind) : newValue)
      npos = (typeof(position) === 'function'? position(dataBind) : position)
      this.setAttribute('gate', (actualGate === null? "" : actualGate+"--")+JSON.stringify({type:type,newValue:nval,position:npos}))
      addGates(this, {type:type,newValue:nval,position:npos})
    })
  }else if (type === "height"){
      this.groupGraph.select("#links").selectAll('g').each(function(){
        actualGate = this.getAttribute('gate')
        dataBind = null
        d3.select(this).select('path').each(function(d){ dataBind = d})
        nval = (typeof(newValue) === 'function'? newValue(dataBind) : newValue)
        npos = (typeof(position) === 'function'? position(dataBind) : position)
        this.setAttribute('gate', (actualGate === null? "" : actualGate+"--")+JSON.stringify({type:type,newValue:nval,position:npos}))
        addGates(this, {type:type,newValue:nval,position:npos})
      })
    }
  return this
}

/************************************************************************************************************************************/
/***************************************************  PARTICLE  *********************************************************************/

function computeParticleRender(motionModel, d){
  switch (motionModel) {
    case "none":
      if ( d.frequency && d.pattern && d.width){
        switch (d.patternType) {
          case "absolute":
            newPattern = [d.width]
            for (var i = 0; i < d.pattern.length; i++) { newPattern.push(d.pattern[i]);newPattern.push(d.width)}
            newPattern.push(d.frequency)
            return newPattern
            break;
          case "weight":
            total = d.pattern.reduce((a, b) => a + b, 0);
            adjust = d.width/total
            return d.pattern.map(x => x*adjust).concat(d.frequency)
            break;
          default:
            total = d.pattern.reduce((a, b) => a + b, 0);
            adjust = d.width/total
            return d.pattern.map(x => x*adjust).concat(d.frequency)
          }
      }else if ( d.frequency && d.width){
        return [d.width, d.frequency]
      }else if ( d.pattern && d.width){
        switch (d.patternType) {
          case "absolute":
            newPattern = [d.width]
            for (var i = 0; i < d.pattern.length; i++) { newPattern.push(d.pattern[i]);newPattern.push(d.width)}
            newPattern.push(0)
            return newPattern
            break;
          case "weight":
            total = d.pattern.reduce((a, b) => a + b, 0);
            adjust = d.width/total
            return d.pattern.map(x => x*adjust).concat(0)
            break;
          default:
            total = d.pattern.reduce((a, b) => a + b, 0);
            adjust = d.width/total
            return d.pattern.map(x => x*adjust).concat(0)
        }
      }
      return []
      break;

    case "frequencyToWidth":
        if ( d.frequency && d.pattern){
          switch (d.patternType) {
            case "absolute":
              newPattern = [d.frequency]
              for (var i = 0; i < d.pattern.length; i++) { newPattern.push(d.pattern[i]);newPattern.push(d.frequency)}
              newPattern.push(d.frequency)
              return newPattern
              break;
            case "weight":
              total = d.pattern.reduce((a, b) => a + b, 0);
              adjust = d.frequency/total
              return d.pattern.map(x => x*adjust).concat(d.frequency)
              break;
            default:
              total = d.pattern.reduce((a, b) => a + b, 0);
              adjust = d.frequency/total
              return d.pattern.map(x => x*adjust).concat(d.frequency)
          }
        }else if ( d.frequency){
          return [d.frequency, d.frequency]
        }
        return []
      break;

    case "widthToFrequency":
        if ( d.width && d.pattern){
          switch (d.patternType) {
            case "absolute":
              newPattern = [d.width]
              for (var i = 0; i < d.pattern.length; i++) { newPattern.push(d.pattern[i]);newPattern.push(d.width)}
              newPattern.push(d.width)
              return newPattern
              break;
            case "weight":
              total = d.pattern.reduce((a, b) => a + b, 0);
              adjust = d.width/total
              return d.pattern.map(x => x*adjust).concat(d.width)
              break;
            default:
              total = d.pattern.reduce((a, b) => a + b, 0);
              adjust = d.width/total
              return d.pattern.map(x => x*adjust).concat(d.width)
          }
        }else if ( d.width){
          return [d.width, d.width]
        }
        return []
      break;


    case "physical":
      console.log("physical", d.width, d.speed, d.frequency);
      if ( d.frequency && d.speed){
        space = (d.speed/d.frequency)
        if ( d.pattern ){
          if ( d.patternType === "absolute"){
            spaceArray = []
            indexSpaceArray = 0
            for (var i = 0; i < space; i++) { spaceArray.push(0)}
            for (var i = 0; i < d.width; i++) {
              if ( indexSpaceArray === spaceArray.length) return [d.width,0]
              spaceArray[indexSpaceArray] = 1
              indexSpaceArray +=1
            }
            for (var i = 0; i < d.pattern.length; i++) {
              indexSpaceArray = (indexSpaceArray + d.pattern[i])%space
              for (var j = 0; j < d.width; j++) {
                spaceArray[indexSpaceArray] = 1
                indexSpaceArray +=1
              }
            }

            newPattern = []
            count = 1
            for (var i = 1; i < spaceArray.length; i++) {
              if (spaceArray[i] != spaceArray[i-1]) {
                newPattern.push(count)
                count = 1
              }
              else count += 1
            }
            newPattern.push(count)
            if (spaceArray[spaceArray.length-1] === 1) newPattern.push(0)
            console.log(space);
            console.log(newPattern);
            return newPattern
          }else if ( d.patternType === "weight"){
            total = d.pattern.reduce((a, b) => a + b, 0);
            adjust = d.width/total
            newPattern = d.pattern.map(x => x*adjust)
            if ( space-d.width > 0) return newPattern.concat(space-d.width)
            else{
              spaceArray = []
              indexSpaceArray = 0
              for (var i = 0; i < space; i++) { spaceArray.push(0)}
              for (var i = 0; i < newPattern.length; i++) {
                if ( i % 2 === 0){
                  for (var j = 0; j < newPattern[i]; j++) {
                    spaceArray[indexSpaceArray] = 1
                    indexSpaceArray +=1
                  }
                }else{
                  indexSpaceArray += newPattern[i]
                }
                indexSpaceArray = (indexSpaceArray)%space
              }
              newPattern = []
              count = 1
              for (var i = 1; i < spaceArray.length; i++) {
                if (spaceArray[i] != spaceArray[i-1]) {
                  newPattern.push(count)
                  count = 1
                }
                else count += 1
              }
              newPattern.push(count)
              if (spaceArray[spaceArray.length-1] === 1) newPattern.push(0)
              console.log(space);
              console.log(newPattern);
              return newPattern
            }
          }
        }else{
          space = space-d.width
          if ( space < 0 ) space = 0
          return [d.width,space]
        }
      }
      return []
      break;


    default:
      if ( d.frequency && d.pattern && d.width){
        switch (d.patternType) {
          case "absolute":
            newPattern = [d.width]
            for (var i = 0; i < d.pattern.length; i++) { newPattern.push(d.pattern[i]);newPattern.push(d.width)}
            newPattern.push(d.frequency)
            return newPattern
            break;
          case "weight":
            total = d.pattern.reduce((a, b) => a + b, 0);
            adjust = d.width/total
            return d.pattern.map(x => x*adjust).concat(d.frequency)
            break;
          default:
            total = d.pattern.reduce((a, b) => a + b, 0);
            adjust = d.width/total
            return d.pattern.map(x => x*adjust).concat(d.frequency)
          }
      }else if ( d.frequency && d.width){
        return [d.width, d.frequency]
      }else if ( d.pattern && d.width){
        switch (d.patternType) {
          case "absolute":
            newPattern = [d.width]
            for (var i = 0; i < d.pattern.length; i++) { newPattern.push(d.pattern[i]);newPattern.push(d.width)}
            newPattern.push(0)
            return newPattern
            break;
          case "weight":
            total = d.pattern.reduce((a, b) => a + b, 0);
            adjust = d.width/total
            return d.pattern.map(x => x*adjust).concat(0)
            break;
          default:
            total = d.pattern.reduce((a, b) => a + b, 0);
            adjust = d.width/total
            return d.pattern.map(x => x*adjust).concat(0)
        }
      }
      return []
  }
}
flownet_svg_graph.prototype.particule_properties = function(property, value, filter){
  switch (property) {
    case "frequencyModele":
      this.groupGraph.select("#links").selectAll('*')
        .filter( function(d,i){
          if ( !filter ) return true
          if (typeof(filter) === 'function') return filter(d,i)
          else return filter
        })
        .filter(function(d){ return this.getAttribute('id').includes('particule'); })
        .attr("frequencyModele", value)
        .attr("stroke-dasharray", function(d){
          return computeParticleRender(this.getAttribute('frequencyModele'),d)
        })
      break;


    case "frequency":
      this.groupGraph.select("#links").selectAll('*')
        .filter( function(d,i){
          if ( !filter ) return true
          if (typeof(filter) === 'function') return filter(d,i)
          else return filter
        })
        .filter(function(d){ return this.getAttribute('id').includes('particule'); })
        .each(function(d){
          d.frequency = (typeof(value) === 'function'? value(d) : value)
        })
        .attr("stroke-dasharray", function(d){
          return computeParticleRender(this.getAttribute('frequencyModele'),d)
        })
      break;

    case "patternType":
      this.groupGraph.select("#links").selectAll('*')
        .filter( function(d,i){
          if ( !filter ) return true
          if (typeof(filter) === 'function') return filter(d,i)
          else return filter
        })
        .filter(function(d){ return this.getAttribute('id').includes('particule'); })
        .each(function(d){
          d.patternType = (typeof(value) === 'function'? value(d) : value)
        })
        .attr("stroke-dasharray", function(d){
          return computeParticleRender(this.getAttribute('frequencyModele'),d)
        })
      break;

      case "pattern":
        this.groupGraph.select("#links").selectAll('*')
          .filter( function(d,i){
            if ( !filter ) return true
            if (typeof(filter) === 'function') return filter(d,i)
            else return filter
          })
          .filter(function(d){ return this.getAttribute('id').includes('particule'); })
          .each(function(d){
            d.pattern = (typeof(value) === 'function'? value(d) : value)
          })
          .attr("stroke-dasharray", function(d){
            return computeParticleRender(this.getAttribute('frequencyModele'),d)
          })
        break;

        this.groupGraph.select("#links").selectAll('*')
        .filter( function(d,i){
          if ( !filter ) return true
          if (typeof(filter) === 'function') return filter(d,i)
          else return filter
        })
          .filter(function(d){ return this.getAttribute('id').includes('particule'); })
          .each(function(d){
            d.pattern = (typeof(value) === 'function'? value(d) : value)
          })
          .attr("stroke-dasharray", function(d){
            return  computeParticleRender(this.getAttribute('frequencyModele'),d)
          })
        break;

        case "speed":
        this.groupGraph.select("#links").selectAll('*')
          .filter( function(d,i){
            if ( !filter ) return true
            if (typeof(filter) === 'function') return filter(d,i)
            else return filter
          })
          .filter(function(d){ return this.getAttribute('id').includes('particule'); })
          .each(function(d){
            d.speed = (typeof(value) === 'function'? value(d) : value)
          })
          .attr("stroke-dasharray", function(d){
            return  computeParticleRender(this.getAttribute('frequencyModele'),d)
          })
          break;


    case "color":
      this.groupGraph.select("#links").selectAll('*')
        .filter( function(d,i){
          if ( !filter ) return true
          if (typeof(filter) === 'function') return filter(d,i)
          else return filter
        })
        .filter(function(d){ return this.getAttribute('id').includes('particule'); })
        .attr("stroke", value)
      break;


    case "width":
      this.groupGraph.select("#links").selectAll('*')
        .filter( function(d,i){
          if ( !filter ) return true
          if (typeof(filter) === 'function') return filter(d,i)
          else return filter
        })
        .filter(function(d){ return this.getAttribute('id').includes('particule'); })
        .each(function(d){
          d.width = (typeof(value) === 'function'? value(d) : value)
        })
        .attr("stroke-dasharray", function(d){
          return computeParticleRender(this.getAttribute('frequencyModele'),d)
        })
      break;


    case "height":
      this.groupGraph.select("#links").selectAll('*')
        .filter( function(d,i){
          if ( !filter ) return true
          if (typeof(filter) === 'function') return filter(d,i)
          else return filter
        })
        .filter(function(d){ return this.getAttribute('id').includes('particule'); })
        .attr("stroke-width", value)
      break;
    default:

  }
  return this
}
flownet_svg_graph.prototype.particule_behaviors = function(on, callback, filter){
  this.groupGraph.select("#links").selectAll('*')
    .filter( function(d,i){
      if ( !this.getAttribute('id').includes('particule') ) return false
      if ( !filter ) return true
      if (typeof(filter) === 'function') return filter(d,i)
      else return filter
    })
    .on(on, callback)
  return this
}
  /*
  flownet_svg_graph.prototype.motion_model = function(model){
    switch (model) {
      case "perceptual":
        this.motionModel = this.perceptualModel
        break;
      case "hybrid":
        this.motionModel = this.hybridModel
        break;
      case "physical":
        this.motionModel = this.physicalModel
        break;
      default:
        this.motionModel = this.perceptualModel
    }
    return this
  }
  flownet_svg_graph.prototype.motion_model_properties = function(property, value){
    console.log();
    if ( this.motionModel.opts[property] ) this.motionModel.opts[property] = value
    return this
  }
  */

/************************************************************************************************************************************/
/***************************************************  ANIMATION  ********************************************************************/

function computeSpeed(speed, offset){
  return (1000*offset)/speed
}
function startTransitionFPS(link, FPS){
  dashOffset = Number(link.attr("stroke-dashoffset"))
  patternArray = link.attr("stroke-dasharray").split(",")
  offset = patternArray.map(x => Number(x)).reduce((a, b) => a + b, 0)
  offsetMinusFrequency = offset //- Number(patternArray[patternArray.length-1])

  function fpsTransition(link, delay, step, limit, start, offset, adjust){
    if ( step === limit){
      link.transition()
        .delay(delay)
        .duration(0)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', offset+adjust)
        .on('start', function() {
          fpsTransition(link, delay, 0, limit, start - offset, offset - offset, adjust)
        })
    }else{
      link.transition()
        .delay(delay)
        .duration(0)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', (start+adjust)+(((offset+adjust)-(start+adjust))/limit)*step)
        .on('start', function() {
          fpsTransition(link, delay, step+2, limit, start, offset, adjust)
        })
    }
  }

  function motionDash(start, offset, adjust) {
    link.attr('stroke-dashoffset', start+adjust)
    speed = 0
    link.each(function(d){ speed = d.speed })
    duration = computeSpeed( Number(speed), offsetMinusFrequency)
    count = Math.floor((duration/1000)*FPS)
    fpsTransition(link, duration/count, 1, count, start, offset, adjust)
    fpsTransition(link, duration/count, 2, count, start, offset, adjust)
  }
  motionDash(0, -offset, dashOffset)
}
function startTransitionSVG(link){
  dashOffset = Number(link.attr("stroke-dashoffset"))
  patternArray = link.attr("stroke-dasharray").split(",")
  offset = patternArray.map(x => Number(x)).reduce((a, b) => a + b, 0)
  offsetMinusFrequency = offset //- Number(patternArray[patternArray.length-1])
  function motionDash(start, offset, adjust) {
    link.attr('stroke-dashoffset', start+adjust)
      .transition()
        .duration(function(d){
          return computeSpeed(d.speed, offsetMinusFrequency)
        })
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', offset+adjust)
        .on('end', function() {
          motionDash(start - offset, offset - offset, adjust);
        });
  }
  motionDash(0, -offset, dashOffset)
}
flownet_svg_graph.prototype.fps = function(value){
  this.FPS = value
  return this
} //OK
flownet_svg_graph.prototype.start = function(){
    var FPS = this.FPS
    if ( FPS === "auto"){
      this.groupGraph.selectAll('path')
        .filter(function(d){ return this.getAttribute('id').includes('particules'); })
        .each(function(d){
          startTransitionSVG(d3.select(this))
        })
    }else{
      this.groupGraph.selectAll('path')
        .filter(function(d){ return this.getAttribute('id').includes('particules'); })
        .each(function(d){
          startTransitionFPS(d3.select(this), FPS )
        })
    }
    return this
} //OK
flownet_svg_graph.prototype.stop = function(){
  this.groupGraph.selectAll('path')
    .filter(function(d){ return this.getAttribute('id').includes('particules'); })
    .interrupt()
  return this
} //OK
flownet_svg_graph.prototype.reset = function(){
  this.groupGraph.select("#links").selectAll('*')
    .filter(function(d){ return this.getAttribute('id').includes('particule'); })
    .interrupt()

  this.groupGraph.select("#links").selectAll('*')
    .filter(function(d){ return this.getAttribute('id').includes('particule'); })
    .attr("stroke-dashoffset", function(d){
      return d.previousDashOffset
    })

  var FPS = this.FPS
  if ( FPS === "auto"){
    this.groupGraph.selectAll('path')
      .filter(function(d){ return this.getAttribute('id').includes('particules'); })
      .each(function(d){
        startTransitionSVG(d3.select(this))
      })
  }else{
    this.groupGraph.selectAll('path')
      .filter(function(d){ return this.getAttribute('id').includes('particules'); })
      .each(function(d){
        startTransitionFPS(d3.select(this), FPS )
      })
  }
  return this
} //OK
