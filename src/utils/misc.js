const PiBy2 = Math.PI / 2;

/**
 * Calculate the cos of an angle, avoiding returning floats for known results
 * @static
 * @memberOf fabric.util
 * @param {Number} angle the angle in radians or in degree
 * @return {Number}
 */
export function cos (angle) {
  if (angle === 0) { return 1; }
  if (angle < 0) {
    // cos(a) = cos(-a)
    angle = -angle;
  }
  var angleSlice = angle / PiBy2;
  switch (angleSlice) {
    case 1: case 3: return 0;
    case 2: return -1;
  }
  return Math.cos(angle);
}

/**
 * Calculate the sin of an angle, avoiding returning floats for known results
 * @static
 * @memberOf fabric.util
 * @param {Number} angle the angle in radians or in degree
 * @return {Number}
 */
export function sin (angle) {
  if (angle === 0) { return 0; }
  var angleSlice = angle / PiBy2, sign = 1;
  if (angle < 0) {
    // sin(-a) = -sin(a)
    sign = -1;
  }
  switch (angleSlice) {
    case 1: return sign;
    case 2: return 0;
    case 3: return -sign;
  }
  return Math.sin(angle);
}
