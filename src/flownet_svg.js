import * as d3 from 'd3';
/** ********************************************************************************************/
/** *************************************************  CREATE AND SELECTION  *******************/

function graph(id, svg){
  let newGraph = new flownet_svg_graph(id, svg)
  return newGraph;
}

function flownet_svg_graph(id, svg) {
  if (!id) console.warn('flowet graph have no id, some function may have unexpected behavior');
  if (!svg) console.warn('SVG invalid');

  this.groupGraph = d3.select(svg).append('g').attr('id', id);
  this.groupGraph.append('g').attr('id', 'links');
  this.groupGraph.append('g').attr('id', 'nodes');
  this.groupGraph.append('g').attr('id', 'fired');
  this.filter = null;
  this.FPS = 'auto';
}

flownet_svg_graph.prototype.graph = function (graph) {
  this.links(graph.links);
  this.nodes(graph.nodes);
  return this;
};
flownet_svg_graph.prototype.links = function (data) {
  this.groupGraph.select('#links').append('g').attr('id', 'edges')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('id', function (d, i) {
      if (d.id) return 'link_' + d.id;
      return 'link_' + i;
    })
    .each(function (d) {
      d3.select(this).append('path')
        .attr('id', function (d, i) {
          if (d.id) return 'edge_' + d.id;
          return 'edge_' + i;
        })
        .attr('fill', 'none');
    });
  this.groupGraph.select('#links').append('g').attr('id', 'particules')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('id', function (d, i) {
      if (d.id) return 'link_' + d.id;
      return 'link_' + i;
    })
    .each(function (d) {
      d3.select(this).append('g').attr('id', 'mainPath_' + d.id)
        .append('path')
        .attr('id', function (d, i) {
          if (d.id) return 'particules_' + d.id;
          return 'particules_' + i;
        })
        .attr('fill', 'none')
        .attr('gate', 'none')
        .each(function (d) { d.previousDashOffset = 0;});
    });
  return this;
};
flownet_svg_graph.prototype.nodes = function (nodes) {
  this.groupGraph.select('#nodes').selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('id', function (d, i) {
      if (d.id) return 'node_' + d.id;
      d.id = 'node_' + i;
      return 'node_' + i;
    });
  return this;
}; // OK

/** **********************************************************************************************************************************/
/** *************************************************  NODE  *************************************************************************/

flownet_svg_graph.prototype.nodes_properties = function (property, value) {
  function convertNodePropertyToSVG(property) {
    switch (property) {
      case 'id':
        return 'id';
        break;
      case 'class':
        return 'class';
        break;
      case 'color':
        return 'fill';
        break;
      case 'size':
        return 'r';
        break;
      case 'x':
        return 'cx';
        break;
      case 'y':
        return 'cy';
        break;
      default:
        return undefined;
    }
  } // OK
  let svgProp = convertNodePropertyToSVG(property);
  let filter = this.filter;
  if (!svgProp) {
    this.groupGraph.select('#nodes').selectAll('*')
      .filter(function (d, i) {
        if (!filter) return true;
        if (typeof (filter) === 'function') return filter(d, i);
        return filter;
      })
      .style(property, value);
  } else {
    this.groupGraph.select('#nodes').selectAll('*')
      .filter(function (d, i) {
        if (!filter) return true;
        if (typeof (filter) === 'function') return filter(d, i);
        return filter;
      })
      .attr(svgProp, value);
  }
  return this;
};

/** **********************************************************************************************************************************/
/** *************************************************  LINK **************************************************************************/

function interpolateLink(interpolation) {
  let lineFunction = d3.line()
    .x(function (d) { return d.x; })
    .y(function (d) { return d.y; });

  switch (interpolation) {
    case 'linear':
      lineFunction.curve(d3.curveLinear);
      break;
    case 'stepBefore':
      lineFunction.curve(d3.curveStepBefore);
      break;
    case 'stepAfter':
      lineFunction.curve(d3.curveStepAfter);
      break;
    case 'basis':
      lineFunction.curve(d3.curveBasis);
      break;
    case 'basis-open':
      lineFunction.curve(d3.curveBasisOpen);
      break;
    case 'bundle':
      lineFunction.curve(d3.curveBundle);
      break;
    case 'cardinal-open':
      lineFunction.curve(d3.curveCardinalOpen);
      break;
    case 'cardinal':
      lineFunction.curve(d3.curveCardinal);
      break;
    case 'natural':
      lineFunction.curve(d3.curveNatural);
      break;
    default:
      lineFunction.curve(d3.curveLinear);
  }
  return lineFunction;
}
function updateLinkPoints(link) {
  d3.select(link).selectAll('path')
    .attr('d', function (d) {
      return interpolateLink(d3.select(link).attr('interpolation'))(JSON.parse(d3.select(link).attr('points')));
    });
}
flownet_svg_graph.prototype.links_properties = function (property, value) {
  function convertLinkPropertyToSVG(property) { // OK
    switch (property) {
      case 'id':
        return 'id';
        break;
      case 'visibility':
        return 'visibility';
        break;
      case 'points':
        return 'points';
        break;
      case 'color':
        return 'stroke';
        break;
      case 'interpolation':
        return 'd';
        break;
      case 'size':
        return 'stroke-width';
        break;
      default:
    }
  }
  let filter = this.filter;
  if (property === 'interpolation') {
    this.groupGraph.select('#links').selectAll('g')
      .filter(function (d) { return this.getAttribute('id').includes('link_');})
      .filter(function (d, i) {
        if (!filter) return true;
        if (typeof (filter) === 'function') return filter(d, i);
        return filter;
      })
      .attr('interpolation', function (d) {
        console.log(d);
        if (typeof (value) === 'function') {
          return value(d);
        }
        return value;
      })
      .each(function (d) {
        let newinterpol = interpolateLink((typeof (value) === 'function' ? value(d) : value))(d.points);
        d3.select(this).selectAll('path').attr(convertLinkPropertyToSVG(property), newinterpol);
      });
  } else if (property === 'points') {
    this.groupGraph.select('#links').selectAll('g')
      .filter(function (d, i) {
        if (!filter) return true;
        if (typeof (filter) === 'function') return filter(d, i);
        return filter;
      })
      .filter(function () {
        return (this.getAttribute('id') && this.getAttribute('id').split('_')[0] === 'link');
      })
      .attr('points', function (d) {
        if (typeof (value) === 'function') {
          return JSON.stringify(value(d));
        }
        return JSON.stringify(value);
      })
      .each(function (d) { updateLinkPoints(this); });
  } else if (property === 'visibility') {
    this.groupGraph.select('#links').selectAll('g')
      .filter(function (d, i) {
        if (!filter) return true;
        if (typeof (filter) === 'function') return filter(d, i);
        return filter;
      })
      .attr(convertLinkPropertyToSVG(property), value);
  } else {
    this.groupGraph.select('#links').selectAll('path')
      .filter(function (d, i) {
        if (!filter) return true;
        if (typeof (filter) === 'function') return filter(d, i);
        return filter;
      })
      .filter(function (d) { return this.getAttribute('id').includes('edge'); })
      .attr(convertLinkPropertyToSVG(property), value);
  }
  return this;
};

/** **********************************************************************************************************************************/
/** ************************************************* GATE ***************************************************************************/

function cutPathForGate(link, edge, particule, gate, offset) {
  dotListBeforeCut = [];
  dotListAfterCut = [];
  switchDot = gate.position - offset;
  switchDuplicate = false;
  for (var i = 0; i < 41; i++) {
    dot = particule.getPointAtLength((particule.getTotalLength() / 40) * i);
    if ((particule.getTotalLength() / 40) * i < switchDot) dotListBeforeCut.push({x: dot.x, y: dot.y});
    else {
      if (!switchDuplicate) {
        switchDuplicate = true;
        switchCoordinate = particule.getPointAtLength(switchDot);
        dotListBeforeCut.push({x: switchCoordinate.x, y: switchCoordinate.y});
        dotListAfterCut.push({x: switchCoordinate.x, y: switchCoordinate.y});
      }
      dotListAfterCut.push({x: dot.x, y: dot.y});
    }
  }

  curve = d3.select(link).attr('interpolation');
  interp = interpolateLink(curve);
  /* d3.select(edge).attr('d', function(){
    return interp(dotListBeforeCut)
  })*/
  d3.select(particule).attr('d', function () {
    return interp(dotListBeforeCut);
  });
  /*
  nextElelment = particule.nextSibling
  d3.select(link).insert('path', nextElelment? nextElelment.getAttribute('id'):nextElelment )
    .attr('id',function(d){ return "edge_x"})
    .attr('fill', 'none')
    .attr('d', function(d){ return interp(dotListAfterCut) })
    .attr('stroke', edge.getAttribute('stroke') )
    .attr('stroke-width', edge.getAttribute('stroke-width'))
    */
  // newParticule = document.createElement('path')
  nextElelment = particule.nextSibling;
  console.log(nextElelment ? nextElelment.getAttribute('id') : null);
  newParticule = d3.select(link).insert('path', nextElelment ? '#' + nextElelment.getAttribute('id') : null)
    .attr('id', function (d) { return 'particules_x';})
    .attr('gate', gate.type)
    .attr('fill', 'none')
    .attr('d', function (d) { return interp(dotListAfterCut); })
    .attr('stroke', function (d) {
      if (gate.type === 'color') return gate.newValue;
      return particule.getAttribute('stroke');
    })
    .attr('stroke-width', function (d) {
      if (gate.type === 'height') return gate.newValue;
      return particule.getAttribute('stroke-width');
    })
    .attr('stroke-dasharray', particule.getAttribute('stroke-dasharray'))
    .attr('stroke-dashoffset', function (d) {
      previousDashOffset = Number(particule.getAttribute('stroke-dashoffset'));
      d.previousDashOffset = (particule.getTotalLength() + previousDashOffset) % (particule.getAttribute('stroke-dasharray').split(',').reduce((a, b) => Number(a) + Number(b), 0));
      return (particule.getTotalLength() + previousDashOffset) % (particule.getAttribute('stroke-dasharray').split(',').reduce((a, b) => Number(a) + Number(b), 0));
    });

  d3.select(link).selectAll('path').attr('id', function (d, i) {
    if (i === 0) {
      return this.getAttribute('id');
    }
    return 'particules_' + i;

  });

  indexOfParticule = -1;
  for (var i = 1; i < link.childNodes.length; i++) { if (link.childNodes[i].getAttribute('id') === particule.getAttribute('id')) indexOfParticule = i;}
  // console.log(link.childNodes[indexOfParticule], link.childNodes[indexOfParticule+1] , link.childNodes[indexOfParticule+2] );
  if (indexOfParticule === -1 || indexOfParticule + 2 >= link.childNodes.length) return;
  propagateGate(link.childNodes[indexOfParticule + 2], gate);

}
function propagateGate(link, gate) {
  console.log(link.getAttribute('gate'), gate.type);
  if (link.getAttribute('gate') === gate.type) return;

  if (gate.type === 'color') link.setAttribute('stroke', gate.newValue);
  else if (gate.type === 'height') link.setAttribute('stroke-width', gate.newValue);

  if (link.nextSibling === null) return;
  propagateGate(link.nextSibling, gate);
}
function addGates(link, gate) {
  total_length = link.childNodes[0].getTotalLength();
  offset = 0;
  gate.position = convertUnitToPathPostion(gate.position, total_length);

  for (var i = 1; i < link.childNodes.length; i++) {
    // console.log(  gate.position , offset , offset+link.childNodes[i].getTotalLength()   );
    if (gate.position > offset && gate.position < offset + link.childNodes[i].getTotalLength()) {
      cutPathForGate(link, link.childNodes[0], link.childNodes[i], gate, offset);
      return;
    }
    offset += link.childNodes[i].getTotalLength();
  }
  console.log("FAIL can't place gate");
}
function convertUnitToPathPostion(unit, lenght) {
  if (unit.includes('%')) {
    value = parseFloat(unit);
    if (value > 100) return lenght;
    if (value < 0) return 0;
    return (lenght / 100) * value;
  } else if (unit.includes('px')) {
    value = parseFloat(unit);
    if (value > lenght) return lenght;
    if (value < 0) return 0;
    return value;
  }
  value = parseFloat(unit);
  return value;

}
flownet_svg_graph.prototype.link_add_gate = function (type, newValue, position) {
  console.warn('gate not ready');
  return;
  filter = this.filter;
  if (type === 'color') {
    this.groupGraph.select('#links').selectAll('g')
      .filter(function (d, i) {
        if (!filter) return true;
        if (typeof (filter) === 'function') return filter(d, i);
        return filter;
      })
      .each(function () {
        actualGate = this.getAttribute('gate');
        dataBind = null;
        d3.select(this).select('path').each(function (d) { dataBind = d;});
        nval = (typeof (newValue) === 'function' ? newValue(dataBind) : newValue);
        npos = (typeof (position) === 'function' ? position(dataBind) : position);
        this.setAttribute('gate', (actualGate === null ? '' : actualGate + '--') + JSON.stringify({type: type, newValue: nval, position: npos}));
        addGates(this, {type: type, newValue: nval, position: npos});
      });
  } else if (type === 'height') {
    this.groupGraph.select('#links').selectAll('g')
      .filter(function (d, i) {
        if (!filter) return true;
        if (typeof (filter) === 'function') return filter(d, i);
        return filter;
      })
      .each(function () {
        actualGate = this.getAttribute('gate');
        dataBind = null;
        d3.select(this).select('path').each(function (d) { dataBind = d;});
        nval = (typeof (newValue) === 'function' ? newValue(dataBind) : newValue);
        npos = (typeof (position) === 'function' ? position(dataBind) : position);
        this.setAttribute('gate', (actualGate === null ? '' : actualGate + '--') + JSON.stringify({type: type, newValue: nval, position: npos}));
        addGates(this, {type: type, newValue: nval, position: npos});
      });
  }
  return this;
};

/** **********************************************************************************************************************************/
/** *************************************************  PARTICLE  *********************************************************************/
function frequencyToSpacing(freq, speed) {
  return speed / freq;
}
function spacingToFrequency(spacing, speed) {
  return speed / spacing;
}

function computeParticleRender(motionModel, freq, spacing, speed, pattern) {
  console.log(motionModel, freq, spacing, speed, pattern);

  let issues = false;
  let textIssues = '';

  if (!spacing) { textIssues += ' Spacing or Frequency information missing.'; issues = true;}
  if (!speed) { textIssues += ' Speed information missing.'; issues = true; }
  if (!pattern) { textIssues += ' Pattern information missing.'; issues = true; }
  if (issues) { console.warn(textIssues); return; }

  let newPattern = JSON.parse('[' + pattern + ']');
  let newSpeed = Number(speed);
  let newSpacing = Number(spacing);
  console.log(newPattern, newSpeed, newSpacing);
  let spaceArray = [];
  let indexSpaceArray = 0;
  for (var i = 0; i < newSpacing; i++) { spaceArray.push(0);}
  for (var i = 0; i < newPattern.length; i++) {
    if (i % 2 === 0) {
      for (var j = 0; j < newPattern[i]; j++) {
        spaceArray[indexSpaceArray] = 1;
        indexSpaceArray += 1;
      }
    } else {
      indexSpaceArray += newPattern[i];
    }
    indexSpaceArray = (indexSpaceArray) % newSpacing;
  }
  newPattern = [];
  let count = 1;
  for (var i = 1; i < spaceArray.length; i++) {
    if (spaceArray[i] != spaceArray[i - 1]) {
      newPattern.push(count);
      count = 1;
    } else count += 1;
  }
  newPattern.push(count);
  if (spaceArray[spaceArray.length - 1] === 1) newPattern.push(0);
  console.log(newPattern);
  return newPattern;

  switch (motionModel) {
    /*
    case "textureBased":
      if (d.frequency && d.pattern){
            total = d.pattern.reduce((a, b) => a + b, 0);
            adjust = d.width/total
            return d.pattern.map(x => x*adjust).concat(d.frequency)

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

    case "physicBased":
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
    */

    default:

      if (d.frequency && d.speed) {
        space = (d.speed / d.frequency);
        if (d.pattern) {
          if (d.patternType === 'absolute') {
            spaceArray = [];
            indexSpaceArray = 0;
            for (var i = 0; i < space; i++) { spaceArray.push(0);}
            for (var i = 0; i < d.width; i++) {
              if (indexSpaceArray === spaceArray.length) return [d.width, 0];
              spaceArray[indexSpaceArray] = 1;
              indexSpaceArray += 1;
            }
            for (var i = 0; i < d.pattern.length; i++) {
              indexSpaceArray = (indexSpaceArray + d.pattern[i]) % space;
              for (var j = 0; j < d.width; j++) {
                spaceArray[indexSpaceArray] = 1;
                indexSpaceArray += 1;
              }
            }

            newPattern = [];
            count = 1;
            for (var i = 1; i < spaceArray.length; i++) {
              if (spaceArray[i] != spaceArray[i - 1]) {
                newPattern.push(count);
                count = 1;
              } else count += 1;
            }
            newPattern.push(count);
            if (spaceArray[spaceArray.length - 1] === 1) newPattern.push(0);
            console.log(space);
            console.log(newPattern);
            return newPattern;
          } else if (d.patternType === 'weight') {
            total = d.pattern.reduce((a, b) => a + b, 0);
            adjust = d.width / total;
            newPattern = d.pattern.map(x => x * adjust);
            if (space - d.width > 0) return newPattern.concat(space - d.width);

            spaceArray = [];
            indexSpaceArray = 0;
            for (var i = 0; i < space; i++) { spaceArray.push(0);}
            for (var i = 0; i < newPattern.length; i++) {
              if (i % 2 === 0) {
                for (var j = 0; j < newPattern[i]; j++) {
                  spaceArray[indexSpaceArray] = 1;
                  indexSpaceArray += 1;
                }
              } else {
                indexSpaceArray += newPattern[i];
              }
              indexSpaceArray = (indexSpaceArray) % space;
            }
            newPattern = [];
            count = 1;
            for (var i = 1; i < spaceArray.length; i++) {
              if (spaceArray[i] != spaceArray[i - 1]) {
                newPattern.push(count);
                count = 1;
              } else count += 1;
            }
            newPattern.push(count);
            if (spaceArray[spaceArray.length - 1] === 1) newPattern.push(0);
            console.log(space);
            console.log(newPattern);
            return newPattern;

          }
        } else {
          space = space - d.width;
          if (space < 0) space = 0;
          return [d.width, space];
        }
      }
      return [];
      break;
  }
}
flownet_svg_graph.prototype.particule_properties = function (property, value) {
  let filter = this.filter;
  switch (property) {
    case 'computationalMethod':
      this.groupGraph.select('#links').selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particule'); })
        .attr('computationalMethod', value)
        .attr('stroke-dasharray', function (d) {
          return computeParticleRender(this.getAttribute('computationalMethod'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('pattern'));
        });
      break;

    case 'spacing':
      if (!value) {
        res = [];
        this.groupGraph.select('#links').selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particule'); })
          .each(function () {
            res.push({id: this.getAttribute('id'), spacing: this.getAttribute('spacing')});
          });
        return res;
      }
      this.groupGraph.select('#links').selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particule'); })
        .attr('spacing', function (d) {
          return (typeof (value) === 'function' ? value(d) : value);
        })
        .attr('frequency', function (d) {
          return spacingToFrequency(Number(this.getAttribute('spacing')), Number(this.getAttribute('speed')));
        })
        .attr('lastModify', 'spacing')
        .attr('stroke-dasharray', function (d) {
          return computeParticleRender(this.getAttribute('computationalMethod'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('pattern'));
        });
      break;

    case 'frequency':
      if (!value) {
        res = [];
        this.groupGraph.select('#links').selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particule'); })
          .each(function () {
            res.push({id: this.getAttribute('id'), frequency: this.getAttribute('frequency')});
          });
        return res;
      }
      this.groupGraph.select('#links').selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particule'); })
        .attr('frequency', function (d) {
          return (typeof (value) === 'function' ? value(d) : value);
        })
        .attr('spacing', function (d) {
          console.log();
          return frequencyToSpacing(Number(this.getAttribute('frequency')), Number(this.getAttribute('speed')));
        })
        .attr('lastModify', 'frequency')
        .attr('stroke-dasharray', function (d) {
          return computeParticleRender(this.getAttribute('computationalMethod'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('pattern'));
        });
      break;

    case 'pattern':
      if (!value) {
        res = [];
        this.groupGraph.select('#links').selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particule'); })
          .each(function () {
            res.push({id: this.getAttribute('id'), pattern: this.getAttribute('pattern')});
          });
        return res;
      }
      this.groupGraph.select('#links').selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particule'); })
        .attr('pattern', function (d) {
          return (typeof (value) === 'function' ? value(d) : value);
        })
        .attr('stroke-dasharray', function (d) {
          if (this.getAttribute('lastModify') === 'spacing') {
            this.setAttribute('frequency', spacingToFrequency(Number(this.getAttribute('spacing')), Number(this.getAttribute('speed'))));
          } else if (this.getAttribute('lastModify') === 'frequency') {
            this.setAttribute('spacing', frequencyToSpacing(Number(this.getAttribute('frequency')), Number(this.getAttribute('speed'))));
          }
          return computeParticleRender(this.getAttribute('computationalMethod'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('pattern'));
        });
      break;

    case 'speed':
      if (!value) {
        res = [];
        this.groupGraph.select('#links').selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particule'); })
          .each(function () {
            res.push({id: this.getAttribute('id'), speed: this.getAttribute('speed')});
          });
        return res;
      }
      this.groupGraph.select('#links').selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particule'); })
        .attr('speed', function (d) {
          return (typeof (value) === 'function' ? value(d) : value);
        })
        .attr('stroke-dasharray', function (d) {
          console.log(this.getAttribute('lastModify'), this.getAttribute('frequency'), this.getAttribute('spacing'));
          if (this.getAttribute('lastModify') === 'spacing') {
            this.setAttribute('frequency', spacingToFrequency(Number(this.getAttribute('spacing')), Number(this.getAttribute('speed'))));
          } else if (this.getAttribute('lastModify') === 'frequency') {
            this.setAttribute('spacing', frequencyToSpacing(Number(this.getAttribute('frequency')), Number(this.getAttribute('speed'))));
          }
          console.log(this.getAttribute('lastModify'), this.getAttribute('frequency'), this.getAttribute('spacing'));
          return computeParticleRender(this.getAttribute('computationalMethod'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('pattern'));
        });
      break;

    case 'color':
      if (!value) {
        res = [];
        this.groupGraph.select('#links').selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particule'); })
          .each(function () {
            res.push({id: this.getAttribute('id'), color: this.getAttribute('color')});
          });
        return res;
      }
      this.groupGraph.select('#links').selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particule'); })
        .attr('stroke', value);
      break;

    case 'height':
      if (!value) {
        res = [];
        this.groupGraph.select('#links').selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particule'); })
          .each(function () {
            res.push({id: this.getAttribute('id'), height: this.getAttribute('height')});
          });
        return res;
      }
      this.groupGraph.select('#links').selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particule'); })
        .attr('stroke-width', value);
      break;
    default:

  }
  return this;
};

/** **********************************************************************************************************************************/
/** *************************************************  ANIMATION  ********************************************************************/

function computeSpeed(speed, offset) {
  return (1000 * offset) / speed;
}
function startTransitionFPS(link, FPS) {
  dashOffset = Number(link.attr('stroke-dashoffset'));
  patternArray = link.attr('stroke-dasharray').split(',');
  offset = patternArray.map(x => Number(x)).reduce((a, b) => a + b, 0);
  offsetMinusFrequency = offset; // - Number(patternArray[patternArray.length-1])

  function fpsTransition(link, delay, step, limit, start, offset, adjust) {
    if (step === limit) {
      link.transition()
        .delay(delay)
        .duration(0)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', offset + adjust)
        .on('start', function () {
          fpsTransition(link, delay, 0, limit, start - offset, offset - offset, adjust);
        });
    } else {
      link.transition()
        .delay(delay)
        .duration(0)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', (start + adjust) + (((offset + adjust) - (start + adjust)) / limit) * step)
        .on('start', function () {
          fpsTransition(link, delay, step + 2, limit, start, offset, adjust);
        });
    }
  }

  function motionDash(start, offset, adjust) {
    link.attr('stroke-dashoffset', start + adjust);
    speed = 0;
    link.each(function (d) { speed = d.speed; });
    duration = computeSpeed(Number(speed), offsetMinusFrequency);
    count = Math.floor((duration / 1000) * FPS);
    fpsTransition(link, duration / count, 1, count, start, offset, adjust);
    fpsTransition(link, duration / count, 2, count, start, offset, adjust);
  }
  motionDash(0, -offset, dashOffset);
}
function startTransitionSVG(link) {
  console.log('startTransitionSVG');
  let dashOffset = Number(link.attr('stroke-dashoffset'));
  let patternArray = link.attr('stroke-dasharray').split(',');
  let offset = patternArray.map(x => Number(x)).reduce((a, b) => a + b, 0);
  let offsetMinusFrequency = offset; // - Number(patternArray[patternArray.length-1])
  function motionDash(start, offset, adjust) {
    link.attr('stroke-dashoffset', start + adjust)
      .transition()
      .duration(function (d) {
        return computeSpeed(Number(this.getAttribute('speed')), offsetMinusFrequency);
      })
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', offset + adjust)
      .on('end', function () {
        motionDash(start - offset, offset - offset, adjust);
      });
  }
  motionDash(0, -offset, dashOffset);
}
flownet_svg_graph.prototype.fps = function (value) {
  this.FPS = value;
  return this;
}; // OK
flownet_svg_graph.prototype.start = function () {
  var FPS = this.FPS;

  if (FPS === 'auto') {
    this.groupGraph.select('#links').select('#particules').selectAll('g').selectAll('path')
      .filter(function (d) { return this.getAttribute('id').includes('particules'); })
      .each(function (d) {
        startTransitionSVG(d3.select(this));
      });
  } else {
    this.groupGraph.select('#links').selectAll('g').select('g').selectAll('path')
      .filter(function (d) { return this.getAttribute('id').includes('particules'); })
      .each(function (d) {
        startTransitionFPS(d3.select(this), FPS);
      });
  }
  return this;
}; // OK
flownet_svg_graph.prototype.stop = function () {
  this.groupGraph.select('#links').selectAll('g').select('g').selectAll('path')
    .filter(function (d) { return this.getAttribute('id').includes('particules'); })
    .interrupt();
  return this;
}; // OK
flownet_svg_graph.prototype.reset = function () {
  this.groupGraph.select('#links').selectAll('path')
    .filter(function (d) { return this.getAttribute('id').includes('particule'); })
    .interrupt();

  this.groupGraph.select('#links').selectAll('path')
    .filter(function (d) { return this.getAttribute('id').includes('particule'); })
    .attr('stroke-dashoffset', function (d) {
      return d.previousDashOffset;
    });
};

/** **********************************************************************************************************************************/
/** *************************************************  PARTICULE LAUNCHER  ***********************************************************/

flownet_svg_graph.prototype.particule_launcher = function (idLink) {
  function startTransitionSVG_fire(link, full, delay, step) {
    let patternArray = link.attr('stroke-dasharray').split(',').map(x => Number(x));
    let lengthOfLastPart = patternArray[patternArray.length - 1];

    patternArray = [0, 0].concat(patternArray);

    link.transition()
      .delay(delay)
      .duration(function (d) {
        return computeSpeed(Number(link.attr('speed')), lengthOfLastPart);
      })
      .ease(d3.easeLinear)
      .attrTween('stroke-dasharray', function (d) {
        let last = d3.interpolate(patternArray[patternArray.length - 1], 0);
        let first = d3.interpolate(0, patternArray[patternArray.length - 1]);

        return function (t) {
          patternArray[1] = first(t);
          patternArray[patternArray.length - 1] = last(t);
          return patternArray;
        };
      })
      .on('start', function (d) {
        console.log(step);
        if (step === 0 && d.onstartfun) d.onstartfun(d.data, 0);
      })
      .on('end', function (d) {
        if (full && full === true) {
          let newArray = link.attr('stroke-dasharray').split(',').map(x => Number(x));
          newArray.splice(newArray.length - 1, 1);
          link.attr('stroke-dasharray', newArray);
          let nbToDestroy = Number(link.attr('numberToDestroy')) - 1;
          link.attr('numberToDestroy', nbToDestroy);
          if (d.onendfun) d.onendfun(d.data, 0);
          if (nbToDestroy <= 0) {d3.select(link._groups[0][0].parentNode).remove();} else startTransitionSVG_fire(link, false, 0, step += 1);
        } else {
          let newArray = link.attr('stroke-dasharray').split(',').map(x => Number(x));
          newArray.splice(newArray.length - 1, 1);
          link.attr('stroke-dasharray', newArray);
          startTransitionSVG_fire(link, true, 0, step += 1);
        }
      });
  }
  function computeInteractiveParticleRender(speed, actualPattern, pattern, total_length, actualDashOffset) {
    actualDashOffset = Math.abs(actualDashOffset);
    let actualDashOffsetCopy = actualDashOffset;
    let toRemove = 0;
    let newPattern = JSON.parse('[' + pattern + ']');
    let newSpeed = Number(speed);
    if (actualPattern === null) {
      let offset = newPattern.map(x => Number(x)).reduce((a, b) => a + b, 0);
      return newPattern.concat(total_length - offset);
    }
    actualPattern = actualPattern.split(',').map(x => Number(x));
    for (var i = actualPattern.length - 1; i >= 0; i--) {
      if (actualPattern[i] - actualDashOffsetCopy > 0) {
        actualPattern[i] = actualPattern[i] - actualDashOffsetCopy;
        break;
      } else {
        actualDashOffsetCopy = Math.abs(actualPattern[i] - actualDashOffsetCopy);
        toRemove += 1;
      }
    }
    actualPattern.splice(actualPattern.length - 1 - toRemove, toRemove);
    actualDashOffset = actualDashOffset - 20;
    if (actualDashOffset < 0) {
      actualPattern[0] += actualDashOffset;
      actualDashOffset = 0;
    }
    particule.setAttribute('stroke-dashoffset', 0);
    console.log([20, actualDashOffset].concat(actualPattern));
    return [20, actualDashOffset].concat(actualPattern);

  }
  function particule_launcher(ref, id) {
    this.d = ref;
    this.entryPoint = id;
    this.waiting = [];
    this.fired = [];
    this.prepare = [];
  }
  particule_launcher.prototype.prepare_particule = function (data) {
    this.prepare = [];
    if (data) {
      for (var i = 0; i < data.length; i++) {
        this.prepare.push({data: data[i], id: 'none', color: [], height: [], speed: [], pattern: [], delay: 0});
      }
    } else {
      this.prepare = [{data: null, id: null, color: [], height: [], speed: [], pattern: null, delay: 0}];
    }
    return this;
  };
  particule_launcher.prototype.particule_properties = function (property, value, gate) {
    if (!value && value !== 0) throw 'value is not defined';
    if (!property) throw 'property is not defined';

    for (var i = 0; i < this.prepare.length; i++) {
      switch (property) {
        case 'id':
          this.prepare[i].id = ((typeof (value) === 'function' ? value(this.prepare[i].data, i) : value));
          break;
        case 'pattern':
          this.prepare[i].pattern = ((typeof (value) === 'function' ? value(this.prepare[i].data, i) : value));
          break;
        case 'speed':
          this.prepare[i].speed.push((typeof (value) === 'function' ? value(this.prepare[i].data, i) : value));
          break;
        case 'delay':
          this.prepare[i].delay = ((typeof (value) === 'function' ? value(this.prepare[i].data, i) : value));
          break;
        case 'color':
          this.prepare[i].color.push((typeof (value) === 'function' ? value(this.prepare[i].data, i) : value));
          break;
        case 'height':
          this.prepare[i].height.push((typeof (value) === 'function' ? value(this.prepare[i].data, i) : value));
          break;
        default:
          console.warn('property is invalid');
      }
    }
    return this;
  };
  particule_launcher.prototype.on_start = function (fun) {
    if (typeof (fun) !== 'function') throw 'argument must be a function';
    for (var i = 0; i < this.prepare.length; i++) {
      this.prepare[i].onstartfun = fun;
    }
    return this;
  };
  particule_launcher.prototype.on_end = function (fun) {
    if (typeof (fun) !== 'function') throw 'argument must be a function';
    for (var i = 0; i < this.prepare.length; i++) {
      this.prepare[i].onendfun = fun;
    }
    return this;
  };
  particule_launcher.prototype.load_particule = function () {
    this.waiting = this.waiting.concat(this.prepare);
    this.prepare = [];
    return this;
  };
  particule_launcher.prototype.fire_particule = function () {
    for (var i = 0; i < this.waiting.length; i++) {
      this.fired.push(d3.select(this.entryPoint).append('g').selectAll('path')
        .data([this.waiting[i]])
        .enter()
        .append('path')
        .attr('id', this.waiting[i].id)
        .attr('fill', 'none')
        .attr('d', d3.select('#' + this.d).attr('d'))
        .attr('stroke', this.waiting[i].color[0])
        .attr('stroke-width', this.waiting[i].height[0])
        .attr('pattern', this.waiting[i].pattern)
        .attr('speed', this.waiting[i].speed[0])
        .attr('delay', this.waiting[i].delay)
        .attr('stroke-dasharray', function (d) {
          let res = computeInteractiveParticleRender(this.getAttribute('speed'), this.getAttribute('stroke-dasharray'),
            this.getAttribute('pattern'), this.getTotalLength(), this.getAttribute('stroke-dashoffset'));
          this.setAttribute('numberToDestroy', (res.length / 2));
          let offset = res.reduce((a, b) => a + b, 0) - res[res.length - 1];
          this.setAttribute('stroke-dashoffset', offset);
          res[res.length - 1] += offset;
          return res;
        })
        .each(function (d) {
          startTransitionSVG_fire(d3.select(this), false, Number(this.getAttribute('delay')), 0);
        })
      );
      this.fired.push(this.waiting[i]);
    }
    this.waiting = [];
    return this;
  };

  console.log(this.groupGraph.select('#links').select('#particules').select('#link_' + idLink).selectAll('g'));
  var numberLauncher = this.groupGraph.select('#links').select('#particules').select('#link_' + idLink).selectAll('g')
    .filter(function () { return this.getAttribute('id').includes('particuleLauncher');}).size();

  this.groupGraph.select('#links').select('#particules').select('#link_' + idLink).append('g').attr('id', 'particuleLauncher' + numberLauncher + '_link_' + idLink);
  return new particule_launcher(this.groupGraph.select('#links').select('#particules').select('#link_' + idLink).select('#mainPath_' + idLink).select('path').attr('id'), '#particuleLauncher' + numberLauncher + '_link_' + idLink);
};

module.exports = {
  graph: graph
};
