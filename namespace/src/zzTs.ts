namespace zz.ts {
  /**
   * Iterates through 'array' by index and performs the callback on each element of array until the callback
   * returns a truthy value, then returns that value.
   * If no such value is found, the callback is applied to each element of array and undefined is returned.
   */
  export function forEach<T, U>(
    array: readonly T[] | undefined,
    callback: (element: T, index: number) => U | undefined
  ): U | undefined {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        const result = callback(array[i], i);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  }

  /**
   * Like `forEach`, but iterates in reverse order.
   */
  export function forEachRight<T, U>(
    array: readonly T[] | undefined,
    callback: (element: T, index: number) => U | undefined
  ): U | undefined {
    if (array) {
      for (let i = array.length - 1; i >= 0; i--) {
        const result = callback(array[i], i);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  }

  export function zipWith<T, U, V>(
    arrayA: readonly T[],
    arrayB: readonly U[],
    callback: (a: T, b: U, index: number) => V
  ): V[] {
    const result: V[] = [];
    for (let i = 0; i < arrayA.length; i++) {
      result.push(callback(arrayA[i], arrayB[i], i));
    }
    return result;
  }
  export function zipToMap<K, V>(
    keys: readonly K[],
    values: readonly V[]
  ): Map<K, V> {
    const map = new Map<K, V>();
    for (let i = 0; i < keys.length; ++i) {
      map.set(keys[i], values[i]);
    }
    return map;
  }

  /**
   * Creates a new array with `element` interspersed in between each element of `input`
   * if there is more than 1 value in `input`. Otherwise, returns the existing array.
   */
  export function intersperse<T>(input: T[], element: T): T[] {
    if (input.length <= 1) {
      return input;
    }
    const result: T[] = [];
    for (let i = 0, n = input.length; i < n; i++) {
      if (i) result.push(element);
      result.push(input[i]);
    }
    return result;
  }

  export function countWhere<T>(
    array: readonly T[],
    predicate: (x: T, i: number) => boolean
  ): number {
    let count = 0;
    if (array) {
      for (let i = 0; i < array.length; i++) {
        const v = array[i];
        if (predicate(v, i)) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Tests whether a value is an array.
   */
  export function isArray(value: any): value is readonly {}[] {
    return Array.isArray ? Array.isArray(value) : value instanceof Array;
  }

  /**
   * Gets the actual offset into an array for a relative offset. Negative offsets indicate a
   * position offset from the end of the array.
   */
  function toOffset(array: readonly any[], offset: number) {
    return offset < 0 ? array.length + offset : offset;
  }

  /**
   * Appends a range of value to an array, returning the array.
   *
   * @param to The array to which `value` is to be appended. If `to` is `undefined`, a new array
   * is created if `value` was appended.
   * @param from The values to append to the array. If `from` is `undefined`, nothing is
   * appended. If an element of `from` is `undefined`, that element is not appended.
   * @param start The offset in `from` at which to start copying values.
   * @param end The offset in `from` at which to stop copying values (non-inclusive).
   */
  export function addRange<T>(
    to: T[],
    from: readonly T[] | undefined,
    start?: number,
    end?: number
  ): T[];
  export function addRange<T>(
    to: T[] | undefined,
    from: readonly T[] | undefined,
    start?: number,
    end?: number
  ): T[] | undefined;
  export function addRange<T>(
    to: T[] | undefined,
    from: readonly T[] | undefined,
    start?: number,
    end?: number
  ): T[] | undefined {
    if (from === undefined || from.length === 0) return to;
    if (to === undefined) return from.slice(start, end);
    start = start === undefined ? 0 : toOffset(from, start);
    end = end === undefined ? from.length : toOffset(from, end);
    for (let i = start; i < end && i < from.length; i++) {
      if (from[i] !== undefined) {
        to.push(from[i]);
      }
    }
    return to;
  }

  /**
   * Flattens an array containing a mix of array or non-array elements.
   *
   * @param array The array to flatten.
   */
  export function flatten<T>(
    array: T[][] | readonly (T | readonly T[] | undefined)[]
  ): T[] {
    const result = [];
    for (const v of array) {
      if (v) {
        if (isArray(v)) {
          addRange(result, v);
        } else {
          result.push(v);
        }
      }
    }
    return result;
  }

  /**
   * Compacts an array, removing any falsey elements.
   */
  export function compact<T>(
    array: (T | undefined | null | false | 0 | '')[]
  ): T[];
  export function compact<T>(
    array: readonly (T | undefined | null | false | 0 | '')[]
  ): readonly T[];
  // ESLint thinks these can be combined with the above - they cannot; they'd produce higher-priority inferences and prevent the falsey types from being stripped
  export function compact<T>(array: T[]): T[]; // eslint-disable-line @typescript-eslint/unified-signatures
  export function compact<T>(array: readonly T[]): readonly T[]; // eslint-disable-line @typescript-eslint/unified-signatures
  export function compact<T>(array: T[]): T[] {
    let result: T[] | undefined;
    if (array) {
      for (let i = 0; i < array.length; i++) {
        const v = array[i];
        if (result || !v) {
          if (!result) {
            result = array.slice(0, i);
          }
          if (v) {
            result.push(v);
          }
        }
      }
    }
    return result || array;
  }

  /**
   * Returns the first element of an array if non-empty, `undefined` otherwise.
   */
  export function firstOrUndefined<T>(array: readonly T[]): T | undefined {
    return array.length === 0 ? undefined : array[0];
  }

  /**
   * Returns the last element of an array if non-empty, `undefined` otherwise.
   */
  export function lastOrUndefined<T>(array: readonly T[]): T | undefined {
    return array.length === 0 ? undefined : array[array.length - 1];
  }

  /**
   * Returns the element at a specific offset in an array if non-empty, `undefined` otherwise.
   * A negative offset indicates the element should be retrieved from the end of the array.
   */
  export function elementAt<T>(
    array: readonly T[] | undefined,
    offset: number
  ): T | undefined {
    if (array) {
      offset = toOffset(array, offset);
      if (offset < array.length) {
        return array[offset];
      }
    }
    return undefined;
  }
}
window.zz = zz;