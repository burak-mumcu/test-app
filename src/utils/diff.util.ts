/**
 * Response diff utility for comparing two responses
 */

export interface DiffResult {
  added: string[];
  removed: string[];
  modified: string[];
  unchanged: string[];
}

/**
 * Deep diff between two objects
 */
export function diffObjects(obj1: any, obj2: any, path: string = ''): DiffResult {
  const result: DiffResult = {
    added: [],
    removed: [],
    modified: [],
    unchanged: []
  };

  if (obj1 === obj2) {
    result.unchanged.push(path || 'root');
    return result;
  }

  if (obj1 === null || obj1 === undefined) {
    result.added.push(path || 'root');
    return result;
  }

  if (obj2 === null || obj2 === undefined) {
    result.removed.push(path || 'root');
    return result;
  }

  if (typeof obj1 !== typeof obj2) {
    result.modified.push(path || 'root');
    return result;
  }

  if (typeof obj1 !== 'object' || Array.isArray(obj1) || Array.isArray(obj2)) {
    if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
      result.modified.push(path || 'root');
    } else {
      result.unchanged.push(path || 'root');
    }
    return result;
  }

  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  for (const key of allKeys) {
    const newPath = path ? `${path}.${key}` : key;
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (!(key in obj1)) {
      result.added.push(newPath);
    } else if (!(key in obj2)) {
      result.removed.push(newPath);
    } else {
      const subDiff = diffObjects(val1, val2, newPath);
      result.added.push(...subDiff.added);
      result.removed.push(...subDiff.removed);
      result.modified.push(...subDiff.modified);
      result.unchanged.push(...subDiff.unchanged);
    }
  }

  return result;
}

/**
 * Compare two JSON strings
 */
export function diffJSON(json1: string, json2: string): DiffResult {
  try {
    const obj1 = JSON.parse(json1);
    const obj2 = JSON.parse(json2);
    return diffObjects(obj1, obj2);
  } catch {
    // If not valid JSON, compare as strings
    return {
      added: json1 !== json2 ? ['response'] : [],
      removed: [],
      modified: json1 !== json2 ? ['response'] : [],
      unchanged: json1 === json2 ? ['response'] : []
    };
  }
}

