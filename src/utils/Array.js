import { getValue } from './object';

/**
 * Finds maximum value in array (not necessarily "first" one)
 * @memberOf fabric.util.array
 * @param {Array} array Array to iterate over
 * @param {String} byProperty
 * @return {*}
 */
export function max (array, byProperty) {
  return find(array, byProperty, function(value1, value2) {
    return value1 >= value2;
  });
}

/**
 * Finds minimum value in array (not necessarily "first" one)
 * @memberOf fabric.util.array
 * @param {Array} array Array to iterate over
 * @param {String} byProperty
 * @return {*}
 */
export function min (array, byProperty) {
  return find(array, byProperty, function(value1, value2) {
    return value1 < value2;
  });
}

export function find(array, byProperty, condition) {
  if (!array || array.length === 0) {
    return;
  }

  let i = array.length - 1,
      result = byProperty ? getValue(array[i], byProperty) : array[i];
  if (byProperty) {
    while (i--) {
      if (condition(getValue(array[i], byProperty), result)) {
        result = getValue(array[i], byProperty);
      }
    }
  }
  else {
    while (i--) {
      if (condition(array[i], result)) {
        result = array[i];
      }
    }
  }
  return result;
}
