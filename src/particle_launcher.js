import * as d3 from 'd3';
import * as launcherBib from './biblio/launcher/launcher.js'

export function particles_launcher(ref, id) {
  this.d = ref;
  this.entryPoint = id;
  this.waiting = [];
  this.fired = [];
  this.prepare = [];
}
particles_launcher.prototype.prepare_particles = function (data) {
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
particles_launcher.prototype.particles = function (property, value, gate) {
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
particles_launcher.prototype.on_start = function (fun) {
  if (typeof (fun) !== 'function') throw 'argument must be a function';
  for (var i = 0; i < this.prepare.length; i++) {
    this.prepare[i].onstartfun = fun;
  }
  return this;
};
particles_launcher.prototype.on_end = function (fun) {
  if (typeof (fun) !== 'function') throw 'argument must be a function';
  for (var i = 0; i < this.prepare.length; i++) {
    this.prepare[i].onendfun = fun;
  }
  return this;
};
particles_launcher.prototype.load_particles = function () {
  this.waiting = this.waiting.concat(this.prepare);
  this.prepare = [];
  return this;
};
particles_launcher.prototype.fire_particles = function () {
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
        let res = launcherBib.computeInteractiveParticleRender(this.getAttribute('speed'), this.getAttribute('stroke-dasharray'),
          this.getAttribute('pattern'), this.getTotalLength(), this.getAttribute('stroke-dashoffset'));
        this.setAttribute('numberToDestroy', (res.length / 2));
        let offset = res.reduce((a, b) => a + b, 0) - res[res.length - 1];
        this.setAttribute('stroke-dashoffset', offset);
        res[res.length - 1] += offset;
        return res;
      })
      .each(function (d) {
        launcherBib.startTransitionSVG_fire(d3.select(this), false, Number(this.getAttribute('delay')), 0);
      })
    );
    this.fired.push(this.waiting[i]);
  }
  this.waiting = [];
  return this;
};
