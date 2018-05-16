import * as d3 from 'd3';

export function frequencyToSpacing(freq, speed) {
  return speed / freq;
}
export function spacingToFrequency(spacing, speed) {
  return speed / spacing;
}
export function computeParticleRender(method, freq, spacing, speed, visupattern, pattern, size) {
  var issues = false;
  var textIssues = '';
  var newPattern = null;
  var newSpeed = null;
  var newFrequency = null;
  var newSize = null;
  var newSpacing = null;

  console.log("method", "freq", "spacing", "speed", "visupattern", "pattern", "size");
  console.log(method, freq, spacing, speed, visupattern, pattern, size);

  switch (method) {
    case 'Speed-Frequency-RelativePattern':
      {
        if (!speed) { textIssues += ' Speed information missing.'; issues = true; }
        if (!freq || Number(freq)<=0) { textIssues += ' Frequency information missing.'; issues = true; }
        if (!pattern) { textIssues += ' Pattern information missing.'; issues = true; }
        if (!size) { textIssues += ' Size information missing.'; issues = true; }
        if (issues) { console.warn(textIssues); return [];}

         newPattern = JSON.parse('[' + pattern + ']');
         newSpeed = Number(speed);
         newFrequency = Number(freq);
         newSize = Number(size);
         newSpacing = frequencyToSpacing(newFrequency, newSpeed);

         let spaceArray = [];

         for (var i = 0; i < newSpacing; i++) { spaceArray.push(0);}
         for (var i = 0; i < newPattern.length; i++) {
           let index = parseInt(newSpacing*newPattern[i]);
           console.log( index, newPattern[i]);
           for (var j = index; j < index+newSize; j++) {
             spaceArray[j%newSpacing] = 1
           }
         }

         newPattern = [];
         let count = 1;
         console.log(spaceArray);
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
      }
      break;

    case 'Speed-Frequency-AbsolutePattern':
      {
        if (!speed) { textIssues += ' Speed information missing.'; issues = true; }
        if (!freq || Number(freq)<=0) { textIssues += ' Frequency information missing.'; issues = true; }
        if (!visupattern) { textIssues += ' VisualPattern information missing.'; issues = true; }
        if (issues) { console.warn(textIssues); return [];}

        newPattern = JSON.parse('[' + visupattern + ']');
        newSpeed = Number(speed);
         newFrequency = Number(freq);
         newSpacing = frequencyToSpacing(newFrequency, newSpeed);

         let spaceArray = [];
         let lastIndex = 0
         for (var i = 0; i < newSpacing; i++) { spaceArray.push(0);}

         for (var i = 0; i < newPattern.length; i++) {
           for (var j=0; j < newPattern[i]; j++) {
             if (i % 2 === 0) {
               spaceArray[lastIndex%newSpacing] = 1
             }
             lastIndex += 1
           }
         }

         newPattern = [];
         let count = 1;
         console.log(spaceArray);
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
       }
      break;
    case 'Speed-Spacing-RelativePattern':
      {
        if (!speed) { textIssues += ' Speed information missing.'; issues = true; }
        if (!spacing ) { textIssues += ' Spacing information missing.'; issues = true; }
        if (!pattern) { textIssues += ' Pattern information missing.'; issues = true; }
        if (!size) { textIssues += ' Size information missing.'; issues = true; }
        if (issues) { console.warn(textIssues); return [];}

         newPattern = JSON.parse('[' + pattern + ']');
         newSize = Number(size);
         newSpeed = Number(speed);
         newSpacing = Number(spacing);

         let spaceArray = [];

         for (var i = 0; i < newSpacing; i++) { spaceArray.push(0);}
         for (var i = 0; i < newPattern.length; i++) {
           let index = parseInt(newSpacing*newPattern[i]);
           console.log( index, newPattern[i]);
           for (var j = index; j < index+newSize; j++) {
             spaceArray[j%newSpacing] = 1
           }
         }

         newPattern = [];
         let count = 1;
         console.log(spaceArray);
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
      }
      break;
    case 'Speed-Spacing-AbsolutePattern':
      {
        if (!speed) { textIssues += ' Speed information missing.'; issues = true; }
        if (!spacing ) { textIssues += ' Frequency information missing.'; issues = true; }
        if (!visupattern) { textIssues += ' VisualPattern information missing.'; issues = true; }
        if (issues) { console.warn(textIssues); return [];}

        newPattern = JSON.parse('[' + visupattern + ']');
        newSpeed = Number(speed);
        newSpacing = Number(spacing);

         let spaceArray = [];
         let lastIndex = 0
         for (var i = 0; i < newSpacing; i++) { spaceArray.push(0);}

         for (var i = 0; i < newPattern.length; i++) {
           for (var j=0; j < newPattern[i]; j++) {
             if (i % 2 === 0) {
               spaceArray[lastIndex%newSpacing] = 1
             }
             lastIndex += 1
           }
         }

         newPattern = [];
         let count = 1;
         console.log(spaceArray);
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
       }
      break;
    default:
      {
       console.warn("No method specified, 'Speed-Frequency-RelativePattern' by default")
       if (!speed) { textIssues += ' Speed information missing.'; issues = true; }
       if (!freq || Number(freq)<=0) { textIssues += ' Frequency information missing.'; issues = true; }
       if (!pattern) { textIssues += ' Pattern information missing.'; issues = true; }
       if (!size) { textIssues += ' Size information missing.'; issues = true; }
       if (issues) { console.warn(textIssues); return [];}

        newPattern = JSON.parse('[' + pattern + ']');
        newSpeed = Number(speed);
        newFrequency = Number(freq);
        newSize = Number(size);
        newSpacing = frequencyToSpacing(newFrequency, newSpeed);

        let spaceArray = [];

        for (var i = 0; i < newSpacing; i++) { spaceArray.push(0);}
        for (var i = 0; i < newPattern.length; i++) {
          let index = parseInt(newSpacing*newPattern[i]);
          console.log( index, newPattern[i]);
          for (var j = index; j < index+newSize; j++) {
            spaceArray[j%newSpacing] = 1
          }
        }

        newPattern = [];
        let count = 1;
        console.log(spaceArray);
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
      }

      /*
      if ( lastModify === "frequency"){
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
        console.log(spaceArray);
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
      }else if ( lastModify === "spacing"){
        newPattern.push(newSpacing)
        return newPattern
      }else{
        return []
      }
      */

  }
}
