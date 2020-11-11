export function extend(obj, deep) {
  let argsStart, deepClone;

  if (typeof deep === 'boolean') {
    argsStart = 2;
    deepClone = deep;
  } else {
    argsStart = 1;
    deepClone = true;
  }

  for (let i = argsStart; i < arguments.length; i++) {
    let source = arguments[i];

    if (source) {
      for (let prop in source) {
        if (deepClone && source[prop] && source[prop].constructor === Object) {
          if (!obj[prop] || obj[prop].constructor === Object) {
            obj[prop] = obj[prop] || {};
            extend(obj[prop], deepClone, source[prop]);
          } else {
            obj[prop] = source[prop];
          }
        } else {
          obj[prop] = source[prop];
        }
      }
    }
  }

  return obj;
}

export function clone(obj, deep) {
  return extend({}, deep, obj);
}

export function keys(obj) {
  if (Object.keys) return Object.keys(obj);

  // avoid hasOwnProperty for performance
  let keys = [];
  for (let key in obj) keys.push(key);
  return keys;
}

export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

export function isPlainObject(obj) {
  return !!obj && obj.constructor === Object;
}

export function isFunction(obj) {
  return typeof obj === 'function';
}
