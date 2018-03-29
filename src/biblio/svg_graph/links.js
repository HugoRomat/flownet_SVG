import * as d3 from 'd3';

export function interpolateLink(interpolation) {
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

export function updateLinkPoints(source,link, target) {
  if ( !source.attr('cx') || !source.attr('cy') || !target.attr('cx') || !target.attr('cy') ) return
  let start = [{x:source.attr('cx'), y:source.attr('cy')}]
  let end = [{x:target.attr('cx'), y:target.attr('cy')}]

  d3.select(link).selectAll('path')
    .attr('d', function (d) {
      let points = start
      if ( JSON.parse(d3.select(link).attr('points')) ) points = points.concat(JSON.parse(d3.select(link).attr('points')))
      return interpolateLink(d3.select(link).attr('interpolation'))(points.concat(end));
    });
}
