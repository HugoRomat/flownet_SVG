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

export function updateLinkPoints(link) {
  d3.select(link).selectAll('path')
    .attr('d', function (d) {
      return interpolateLink(d3.select(link).attr('interpolation'))(JSON.parse(d3.select(link).attr('points')));
    });
}
