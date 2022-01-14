/* eslint-disable */
// Grabbed from the underscore.js source code (https://github.com/jashkenas/underscore/blob/master/underscore.js#L691)
export function range(start: any, stop: any, step?: any): any {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;
  
    const length: number = Math.max(Math.ceil((stop - start) / step), 0);
    const rangeVar: any[] = Array(length);
  
    for (let idx = 0; idx < length; idx++ , start += step) {
      rangeVar[idx] = start;
    }
  
    return rangeVar;
  }
  
  