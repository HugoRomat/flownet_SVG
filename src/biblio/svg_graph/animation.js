import * as d3 from 'd3';

export function computeSpeed(speed, offset) {
  return (1000 * offset) / speed;
}

export function startTransitionFPS(link, FPS) {
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

export function startTransitionSVG(link) {
  console.log('startTransitionSVG');
  let dashOffset = Number(link.attr('stroke-dashoffset'));
  console.log(link.attr('stroke-dasharray'));
  let patternArray = link.attr('stroke-dasharray').split(',');
  let offset = patternArray.map(x => Number(x)).reduce((a, b) => a + b, 0);
  let offsetMinusFrequency = offset; // - Number(patternArray[patternArray.length-1])
  console.log(dashOffset, patternArray, offset);
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
