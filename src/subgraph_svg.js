import * as d3 from 'd3';
import * as animationBib from './biblio/svg_graph/animation.js'
import * as nodesBib from './biblio/svg_graph/nodes.js'
import * as linksBib from './biblio/svg_graph/links.js'
import * as particlesBib from './biblio/svg_graph/particles.js'

/** ********************************************************************************************/
/** *************************************************  CREATE AND SELECTION  *******************/

export function flownet_svg_subgraph(nodes, edges, particles) {
    this.nodes = nodes;
    this.edges = edges;
    this.particles_group = particles;

    this.filter = null;
    this.FPS = 'auto';
}

flownet_svg_subgraph.prototype.select = function(id){
  let nodes = this.nodes.filter( function(){ return this.getAttribute("id").split('_')[1] === id})
  let edges = this.edges.filter( function(){ return this.getAttribute("id").split('_')[1] === id})
  let particles = this.particles_group.filter( function(){ return ( this.getAttribute("id").split('_')[1] === id && this.getAttribute("id").split('_')[0] === "link")})

  return new flownet_svg_subgraph(nodes,edges,particles)
}
flownet_svg_subgraph.prototype.selectAll = function(){
  let nodes = this.nodes
  let edges = this.edges
  let particles = this.particles_group

  return new flownet_svg_subgraph(nodes,edges,particles)
}
flownet_svg_subgraph.prototype.filters = function(fun){
  let nodes = this.nodes.filter( function(d,i){ return fun(d,i) } )
  let edges = this.edges.filter( function(d,i){ return fun(d,i) } )
  let particles = this.particles_group.filter( function(d,i){ return fun(d,i) } )

  return new flownet_svg_subgraph(nodes,edges,particles)
}
flownet_svg_subgraph.prototype.remove = function(){
  this.nodes.remove()
  this.edges.remove()
  this.particles_group.remove()
  return this
}

/** **********************************************************************************************************************************/
/** *************************************************  NODE  *************************************************************************/

flownet_svg_subgraph.prototype.node_properties = function (property, value) {
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

  if( property.split("_")[0] === "label" ){
    let svgProp = convertLabelPropertyToSVG(property.split("_")[1]);
    let filter = this.filter;
    if (!svgProp) {
      return
    } else {
      if ( svgProp === "text"){
        this.nodes.selectAll('text')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .text(value);
      }else{
        this.nodes.selectAll('text')
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
      this.nodes.selectAll('*')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .style(property, value);
    } else {
      this.nodes.selectAll('*')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .attr(svgProp, value);
    }
  }
  return this;
};

/** **********************************************************************************************************************************/
/** *************************************************  LINK **************************************************************************/


flownet_svg_subgraph.prototype.link_properties = function (property, value) {
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
    this.edges
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
        let newinterpol = linksBib.interpolateLink((typeof (value) === 'function' ? value(d) : value))(d.points);
        d3.select(this).selectAll('path').attr(convertLinkPropertyToSVG(property), newinterpol);
      });
    this.particles_group
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
        let newinterpol = linksBib.interpolateLink((typeof (value) === 'function' ? value(d) : value))(d.points);
        d3.select(this).selectAll('path').attr(convertLinkPropertyToSVG(property), newinterpol);
      });
  } else if (property === 'points') {
    this.edges
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
      .each(function (d) { linksBib.updateLinkPoints(this); });
    this.particles_group.selectAll('g')
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
      .each(function (d) { linksBib.updateLinkPoints(this); });
  } else if (property === 'visibility') {
    this.edges
      .filter(function (d, i) {
        if (!filter) return true;
        if (typeof (filter) === 'function') return filter(d, i);
        return filter;
      })
      .attr(convertLinkPropertyToSVG(property), value);
  } else {
    this.edges.selectAll('path')
      .filter(function (d, i) {
        if (!filter) return true;
        if (typeof (filter) === 'function') return filter(d, i);
        return filter;
      })
      .attr(convertLinkPropertyToSVG(property), value);
  }
  return this;
};


/** **********************************************************************************************************************************/
/** *************************************************  PARTICLE  *********************************************************************/

flownet_svg_subgraph.prototype.particles = function (property, value) {
  let filter = this.filter;
  switch (property) {
    case 'computationalMethod':
      this.particles_group.selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particle'); })
        .attr('computationalMethod', value)
        .attr('stroke-dasharray', function (d) {
          return particlesBib.computeParticleRender(this.getAttribute('computationalMethod'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('visual_pattern'), this.getAttribute('pattern'),this.getAttribute('size'));
        });
      break;

    case 'spacing':
      if (!value) {
        res = [];
        this.particles_group.selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particle'); })
          .each(function () {
            res.push({id: this.getAttribute('id'), spacing: this.getAttribute('spacing')});
          });
        return res;
      }
      this.particles_group.selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particle'); })
        .attr('spacing', function (d) {
          return (typeof (value) === 'function' ? value(d) : value);
        })
        .attr('stroke-dasharray', function (d) {
          return particlesBib.computeParticleRender(this.getAttribute('computationalMethod'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('visual_pattern'), this.getAttribute('pattern'),this.getAttribute('size'));
        });
      break;

    case 'frequency':
      if (!value) {
        res = [];
        this.particles_group.selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particle'); })
          .each(function () {
            res.push({id: this.getAttribute('id'), frequency: this.getAttribute('frequency')});
          });
        return res;
      }
      this.particles_group.selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particle'); })
        .attr('frequency', function (d) {
          return (typeof (value) === 'function' ? value(d) : value);
        })
        .attr('stroke-dasharray', function (d) {
          return particlesBib.computeParticleRender(this.getAttribute('computationalMethod'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('visual_pattern'), this.getAttribute('pattern'),this.getAttribute('size'));
        });
      break;

    case 'visual_pattern':
      if (!value) {
        res = [];
        this.particles_group.selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particle'); })
          .each(function () {
            res.push({id: this.getAttribute('id'), visual_pattern: this.getAttribute('visual_pattern')});
          });
        return res;
      }
      this.particles_group.selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particle'); })
        .attr('visual_pattern', function (d) {
          return (typeof (value) === 'function' ? value(d) : value);
        })
        .attr('stroke-dasharray', function (d) {
          return particlesBib.computeParticleRender(this.getAttribute('computationalMethod'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('visual_pattern'), this.getAttribute('pattern'),this.getAttribute('size'));
        });
      break;

    case 'pattern':
      if (!value) {
        res = [];
        this.particles_group.selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particle'); })
          .each(function () {
            res.push({id: this.getAttribute('id'), pattern: this.getAttribute('pattern')});
          });
        return res;
      }
      this.particles_group.selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particle'); })
        .attr('pattern', function (d) {
          return (typeof (value) === 'function' ? value(d) : value);
        })
        .attr('stroke-dasharray', function (d) {
          return particlesBib.computeParticleRender(this.getAttribute('computationalMethod'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('visual_pattern'), this.getAttribute('pattern'),this.getAttribute('size'));
        });
        break;

    case 'speed':
      if (!value) {
        res = [];
        this.particles_group.selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particle'); })
          .each(function () {
            res.push({id: this.getAttribute('id'), speed: this.getAttribute('speed')});
          });
        return res;
      }
      this.particles_group.selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particle'); })
        .attr('speed', function (d) {
          return (typeof (value) === 'function' ? value(d) : value);
        })
        .attr('stroke-dasharray', function (d) {
          return particlesBib.computeParticleRender(this.getAttribute('computationalMethod'), this.getAttribute('frequency'),
            this.getAttribute('spacing'), this.getAttribute('speed'), this.getAttribute('visual_pattern'), this.getAttribute('pattern'),this.getAttribute('size'));
        });
      break;

    case 'color':
      if (!value) {
        res = [];
        this.particles_group.selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particle'); })
          .each(function () {
            res.push({id: this.getAttribute('id'), color: this.getAttribute('color')});
          });
        return res;
      }
      this.particles_group.selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particle'); })
        .attr('stroke', value);
      break;

    case 'height':
      if (!value) {
        res = [];
        this.particles_group.selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particle'); })
          .each(function () {
            res.push({id: this.getAttribute('id'), height: this.getAttribute('height')});
          });
        return res;
      }
      this.particles_group.selectAll('path')
        .filter(function (d, i) {
          if (!filter) return true;
          if (typeof (filter) === 'function') return filter(d, i);
          return filter;
        })
        .filter(function (d) { return this.getAttribute('id').includes('particle'); })
        .attr('stroke-width', value);
      break;

      case 'visibility':
        if (!value) {
          res = [];
          this.particles_group.selectAll('path')
            .filter(function (d, i) {
              if (!filter) return true;
              if (typeof (filter) === 'function') return filter(d, i);
              return filter;
            })
            .filter(function (d) { return this.getAttribute('id').includes('particle'); })
            .each(function () {
              res.push({id: this.getAttribute('id'), visibility: this.getAttribute('visibility')});
            });
          return res;
        }
        this.particles_group.selectAll('path')
          .filter(function (d, i) {
            if (!filter) return true;
            if (typeof (filter) === 'function') return filter(d, i);
            return filter;
          })
          .filter(function (d) { return this.getAttribute('id').includes('particle'); })
          .attr('visibility', value);
        break;

    default:

  }
  return this;
};

/** **********************************************************************************************************************************/
/** *************************************************  ANIMATION  ********************************************************************/

flownet_svg_subgraph.prototype.fps = function (value) {
  this.FPS = value;
  return this;
}; // OK
flownet_svg_subgraph.prototype.start = function () {
  var FPS = this.FPS;

  if (FPS === 'auto') {
    this.particles_group.selectAll('path')
      .filter(function (d) { return this.getAttribute('id').includes('particles'); })
      .each(function (d) {
        animationBib.startTransitionSVG(d3.select(this));
      });
  } else {
    this.particles_group.selectAll('path')
      .filter(function (d) { return this.getAttribute('id').includes('particles'); })
      .each(function (d) {
        animationBib.startTransitionFPS(d3.select(this), FPS);
      });
  }
  return this;
}; // OK
flownet_svg_subgraph.prototype.stop = function () {
  this.particles_group.selectAll('path')
    .filter(function (d) { return this.getAttribute('id').includes('particles'); })
    .interrupt();
  return this;
}; // OK
flownet_svg_subgraph.prototype.reset = function () {
  this.particles_group.selectAll('path')
    .filter(function (d) { return this.getAttribute('id').includes('particle'); })
    .interrupt();
  this.particles_group.selectAll('path')
    .filter(function (d) { return this.getAttribute('id').includes('particle'); })
    .attr('stroke-dashoffset', function (d) {
      return d.previousDashOffset;
    });
  return this
};
