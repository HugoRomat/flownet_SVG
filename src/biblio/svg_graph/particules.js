import * as d3 from 'd3';

export function frequencyToSpacing(freq, speed) {
  return speed / freq;
}
export function spacingToFrequency(spacing, speed) {
  return speed / spacing;
}
export function computeParticleRender(motionModel, freq, spacing, speed, pattern) {
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
