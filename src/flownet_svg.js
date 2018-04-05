import * as d3 from 'd3';
import * as animationBib from './biblio/svg_graph/animation.js'
import * as nodesBib from './biblio/svg_graph/nodes.js'
import * as linksBib from './biblio/svg_graph/links.js'
import * as particulesBib from './biblio/svg_graph/particules.js'
import {flownet_svg_subgraph} from './subgraph_svg.js'
import {particule_launcher} from './particle_launcher.js'

export function graph(id, svg){
  let newGraph = new flownet_svg_graph(id, svg)
  return newGraph;
}

/** ********************************************************************************************/
/** *************************************************  CREATE AND SELECTION  *******************/

function flownet_svg_graph(svg) {
    if (!svg) console.warn('SVG invalid');
    this.groupGraph = d3.select(svg).append('g');
    this.groupGraph.append('g').attr('id', 'links');
    this.groupGraph.select("#links").append('g').attr('id', 'edges')
    this.groupGraph.select("#links").append('g').attr('id', 'particules')
    this.groupGraph.append('g').attr('id', 'nodes');
    this.filter = null;
    this.FPS = 'auto';
}

flownet_svg_graph.prototype.graph = function (graph) {
  this.links(graph.links);
  this.nodes(graph.nodes);
  return this;
};
flownet_svg_graph.prototype.links = function (data) {
  this.groupGraph.select('#edges').selectAll("newData")
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
  this.groupGraph.select('#particules').selectAll("newData")
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
  console.log(this.groupGraph);
  this.groupGraph.select('#nodes').selectAll('newData')
    .data(nodes)
    .enter()
    .append('g')
    .attr('id', function (d, i) {
      if (d.id) return 'node_' + d.id;
      return 'node_' + i;
    })
    .each(function(){
      d3.select(this).append('circle')
        .attr('id', function (d, i) {
            if (d.id) return 'cirlce_' + d.id;
            return 'cirlce_' + i;
        })
        d3.select(this).append('text')
          .attr('id', function (d, i) {
              if (d.id) return 'label_' + d.id;
              return 'label_' + i;
          })
    })
  return this;
}; // OK
flownet_svg_graph.prototype.select = function(id){
  let nodes = this.groupGraph.select('#nodes').selectAll("g")
    .filter( function(){ return this.getAttribute("id").split('_')[1] === id})
  let edges = this.groupGraph.select('#links').select("#edges").selectAll("g")
    .filter( function(){ return this.getAttribute("id").split('_')[1] === id})
  let particles = this.groupGraph.select('#links').select("#particules").selectAll("g")
    .filter( function(){ return ( this.getAttribute("id").split('_')[1] === id && this.getAttribute("id").split('_')[0] === "link")})

  return new flownet_svg_subgraph(nodes,edges,particles)
}
flownet_svg_graph.prototype.selectAll = function(){
  let nodes = this.groupGraph.select('#nodes').selectAll("g")
  let edges = this.groupGraph.select('#links').select("#edges").selectAll("g")
  let particles = this.groupGraph.select('#links').select("#particules").selectAll("g")

  return new flownet_svg_subgraph(nodes,edges,particles)
}

/** **********************************************************************************************************************************/
/** *************************************************  NODE  *************************************************************************/

flownet_svg_graph.prototype.force_layout = function (delay, center) {
  var that = this

  this.simulation = d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(-200).distanceMin(50).distanceMax(500))
      .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(200))
      if (typeof center !== 'undefined') this.simulation.force("center", d3.forceCenter(center.x, center.y))
      else this.simulation.force("center", d3.forceCenter(0,0))

  this.simulation.nodes(this.groupGraph.select('#nodes').selectAll('g').data())

  setTimeout(function(){
    that.node_properties('x', function(d, i){  return d.x})
      .node_properties('y', function(d, i){  return d.y})
      .node_properties('label_x', function(d, i){  return d.x+10})
      .node_properties('label_y', function(d, i){  return d.y-10})
  }, delay);
  return that
}
flownet_svg_graph.prototype.node_properties = function (property, value) {
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
  }
  function convertLabelPropertyToSVG(property) {
      switch (property) {
        case 'text':
          return 'text';
          break;
        case 'font':
          return 'font-family';
          break;
        case 'size':
          return 'font-size';
          break;
        case 'color':
          return 'fill';
          break;
        case 'x':
          return 'x';
          break;
        case 'y':
          return 'y';
          break;
        default:
          return undefined;
      }
  }
  let that = this
  if( property.split("_")[0] === "label" ){
    let svgProp = convertLabelPropertyToSVG(property.split("_")[1]);
    let filter = this.filter;
    if (!svgProp) {
      return
    } else {
      if ( svgProp === "text"){
        this.groupGraph.select('#nodes').selectAll('text')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .text(value);
      }else{
        this.groupGraph.select('#nodes').selectAll('text')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .attr(svgProp, value);
      }
    }
  }else{
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
        .attr(svgProp, value)
      if ( svgProp === "cx" || svgProp === "cy"){
        this.groupGraph.select('#links').selectAll('g')
          .filter(function () {
            return (this.getAttribute('id') && this.getAttribute('id').split('_')[0] === 'link');
          })
          .each(function (d) { linksBib.updateLinkPoints(that.groupGraph.select("#nodes").select("#node_"+d.source),
                                                          this,
                                                          that.groupGraph.select("#nodes").select("#node_"+d.target)); });
      }
    }
  }
  return this;
};

/** **********************************************************************************************************************************/
/** *************************************************  LINK **************************************************************************/

flownet_svg_graph.prototype.link_properties = function (property, value) {
  let that = this
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
      .each(function (d) { linksBib.updateLinkPoints(that.groupGraph.select("#nodes").select("#node_"+d.source),
                                                      this,
                                                      that.groupGraph.select("#nodes").select("#node_"+d.target)); });

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
      .each(function (d) { linksBib.updateLinkPoints(that.groupGraph.select("#nodes").select("#node_"+d.source),
                                                      this,
                                                      that.groupGraph.select("#nodes").select("#node_"+d.target)); });

  } else if (property === 'visibility') {
    this.groupGraph.select('#links').selectAll('g')
      .filter(function (d, i) {
        if (!filter) return true;
        if (typeof (filter) === 'function') return filter(d, i);
        return filter;
      })
      .filter(function (d) { return this.getAttribute('id').includes('edge'); })
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
/** *************************************************  PARTICLE  *********************************************************************/

flownet_svg_graph.prototype.particules = function (property, value) {
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
          return particulesBib.computeParticleRender(this.getAttribute('computationalMethod'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('visual_pattern'));
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
          return particulesBib.spacingToFrequency(Number(this.getAttribute('spacing')), Number(this.getAttribute('speed')));
        })
        .attr('lastModify', 'spacing')
        .attr('stroke-dasharray', function (d) {
          return particulesBib.computeParticleRender(this.getAttribute('lastModify'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('visual_pattern'));
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
          return particulesBib.frequencyToSpacing(Number(this.getAttribute('frequency')), Number(this.getAttribute('speed')));
        })
        .attr('lastModify', 'frequency')
        .attr('stroke-dasharray', function (d) {
          return particulesBib.computeParticleRender(this.getAttribute('lastModify'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('visual_pattern'));
        });
      break;

    case 'visual_pattern':
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
            res.push({id: this.getAttribute('id'), visual_pattern: this.getAttribute('visual_pattern')});
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
        .attr('visual_pattern', function (d) {
          return (typeof (value) === 'function' ? value(d) : value);
        })
        .attr('stroke-dasharray', function (d) {
          if (this.getAttribute('lastModify') === 'spacing') {
            this.setAttribute('frequency', particulesBib.spacingToFrequency(Number(this.getAttribute('spacing')), Number(this.getAttribute('speed'))));
          } else if (this.getAttribute('lastModify') === 'frequency') {
            this.setAttribute('spacing', particulesBib.frequencyToSpacing(Number(this.getAttribute('frequency')), Number(this.getAttribute('speed'))));
          }
          return particulesBib.computeParticleRender(this.getAttribute('lastModify'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('visual_pattern'));
        });
      break;

  case 'visual_pattern':
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
          res.push({id: this.getAttribute('id'), visual_pattern: this.getAttribute('visual_pattern')});
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
      .attr('visual_pattern', function (d) {
        return (typeof (value) === 'function' ? value(d) : value);
      })
      .attr('stroke-dasharray', function (d) {
        if (this.getAttribute('lastModify') === 'spacing') {
          this.setAttribute('frequency', particulesBib.spacingToFrequency(Number(this.getAttribute('spacing')), Number(this.getAttribute('speed'))));
        } else if (this.getAttribute('lastModify') === 'frequency') {
          this.setAttribute('spacing', particulesBib.frequencyToSpacing(Number(this.getAttribute('frequency')), Number(this.getAttribute('speed'))));
        }
        return particulesBib.computeParticleRender(this.getAttribute('lastModify'), this.getAttribute('frequency'),
          this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('visual_pattern'));
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
            this.setAttribute('frequency', particulesBib.spacingToFrequency(Number(this.getAttribute('spacing')), Number(this.getAttribute('speed'))));
          } else if (this.getAttribute('lastModify') === 'frequency') {
            this.setAttribute('spacing', particulesBib.frequencyToSpacing(Number(this.getAttribute('frequency')), Number(this.getAttribute('speed'))));
          }
          console.log(this.getAttribute('lastModify'), this.getAttribute('frequency'), this.getAttribute('spacing'));
          return particulesBib.computeParticleRender(this.getAttribute('lastModify'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('visual_pattern'));
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

      case 'visibility':
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
              res.push({id: this.getAttribute('id'), visibility: this.getAttribute('visibility')});
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
          .attr('visibility', value);
        break;
    default:

  }
  return this;
};

/** **********************************************************************************************************************************/
/** *************************************************  ANIMATION  ********************************************************************/

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
        animationBib.startTransitionSVG(d3.select(this));
      });
  } else {
    this.groupGraph.select('#links').selectAll('g').select('g').selectAll('path')
      .filter(function (d) { return this.getAttribute('id').includes('particules'); })
      .each(function (d) {
        animationBib.startTransitionFPS(d3.select(this), FPS);
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
    return this
};

/** **********************************************************************************************************************************/
/** *************************************************  PARTICULE LAUNCHER  ***********************************************************/

flownet_svg_graph.prototype.particule_launcher = function (idLink) {
  console.log(this.groupGraph.select('#links').select('#particules').select('#link_' + idLink).selectAll('g'));
  var numberLauncher = this.groupGraph.select('#links').select('#particules').select('#link_' + idLink).selectAll('g')
    .filter(function () { return this.getAttribute('id').includes('particuleLauncher');}).size();

  this.groupGraph.select('#links').select('#particules').select('#link_' + idLink).append('g').attr('id', 'particuleLauncher' + numberLauncher + '_link_' + idLink);
  return new particule_launcher(this.groupGraph.select('#links').select('#particules').select('#link_' + idLink).select('#mainPath_' + idLink).select('path').attr('id'), '#particuleLauncher' + numberLauncher + '_link_' + idLink);
};
