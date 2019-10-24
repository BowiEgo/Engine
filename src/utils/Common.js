export function extend (obj, deep) {
  var argsStart,
    deepClone;

  if (typeof deep === 'boolean') {
    argsStart = 2;
    deepClone = deep;
  } else {
    argsStart = 1;
    deepClone = true;
  }

  for (var i = argsStart; i < arguments.length; i++) {
    var source = arguments[i];

    if (source) {
      for (var prop in source) {
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

export function clone (obj, deep) {
  return extend({}, deep, obj);
}

export function keys (obj) {
  if (Object.keys)
    return Object.keys(obj);

  // avoid hasOwnProperty for performance
  var keys = [];
  for (var key in obj)
    keys.push(key);
  return keys;
}

export function isArray (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

export function isFunction (obj) {
  return typeof obj === 'function';
}
