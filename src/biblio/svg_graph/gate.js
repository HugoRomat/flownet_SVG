
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

/*
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
*/
