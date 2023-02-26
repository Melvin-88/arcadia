export function getObjectDiffs(a: any, b: any): any {
  const diffs = {
    aOld: {},
    bNew: {},
  };

  if (!a || !b) {
    if (b) {
      diffs.bNew = b;
    }
    return diffs;
  }

  for (const key of Object.keys(a)) {
    if (key === 'updateDate') {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[key] !== undefined && b[key] !== a[key]) {
      if (a[key] instanceof Date) {
        if (a[key].getTime() === b[key].getTime()) {
          // eslint-disable-next-line no-continue
          continue;
        }
      }
      if (typeof a[key] === 'object' && !(a[key] instanceof Date)) {
        const nestedDiff = getObjectDiffs(a[key], b[key]);
        if (Object.keys(nestedDiff.aOld).length) {
          diffs.aOld[key] = nestedDiff.aOld;
        }
        if (Object.keys(nestedDiff.bNew).length) {
          diffs.bNew[key] = nestedDiff.bNew;
        }
      } else {
        diffs.aOld[key] = a[key];
        diffs.bNew[key] = b[key];
      }
    }
  }

  return diffs;
}