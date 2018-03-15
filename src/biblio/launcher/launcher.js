import * as d3 from 'd3';
import * as animationBib from '../svg_graph/animation.js'

export function startTransitionSVG_fire(link, full, delay, step) {
  let patternArray = link.attr('stroke-dasharray').split(',').map(x => Number(x));
  let lengthOfLastPart = patternArray[patternArray.length - 1];

  patternArray = [0, 0].concat(patternArray);

  link.transition()
    .delay(delay)
    .duration(function (d) {
      return animationBib.computeSpeed(Number(link.attr('speed')), lengthOfLastPart);
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
export function computeInteractiveParticleRender(speed, actualPattern, pattern, total_length, actualDashOffset) {
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
