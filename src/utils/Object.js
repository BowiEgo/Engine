export function getValue(object, key) {
  let keysArray = key.split('.');
  let value = object;

  for (let i = 0, len = keysArray.length; i < len; i++) {
    value = value[keysArray[i]];
    if (value === undefined) {
      console.error(`can't find object value ${key}`);
      return;
    }
  }

  return value;
}

export function applyProps(object, baseProps, props) {
  Object.keys(baseProps).forEach((key) => {
    object[key] = props[key] || baseProps[key];
  });
}
