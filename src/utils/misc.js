import Point from '../geometry/Vertice';

const PiBy2 = Math.PI / 2;

/**
 * Calculate the cos of an angle, avoiding returning floats for known results
 * @static
 * @memberOf fabric.util
 * @param {Number} angle the angle in radians or in degree
 * @return {Number}
 */
export function cos(angle) {
  if (angle === 0) {
    return 1;
  }
  if (angle < 0) {
    // cos(a) = cos(-a)
    angle = -angle;
  }
  let angleSlice = angle / PiBy2;
  switch (angleSlice) {
    case 1:
    case 3:
      return 0;
    case 2:
      return -1;
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
export function sin(angle) {
  if (angle === 0) {
    return 0;
  }
  let angleSlice = angle / PiBy2,
    sign = 1;
  if (angle < 0) {
    // sin(-a) = -sin(a)
    sign = -1;
  }
  switch (angleSlice) {
    case 1:
      return sign;
    case 2:
      return 0;
    case 3:
      return -sign;
  }
  return Math.sin(angle);
}

export function transformPoint(p, t, ignoreOffset) {
  if (ignoreOffset) {
    return new Point(t[0] * p.x + t[2] * p.y, t[1] * p.x + t[3] * p.y);
  }
  return new Point(
    t[0] * p.x + t[2] * p.y + t[4],
    t[1] * p.x + t[3] * p.y + t[5]
  );
}

export function invertTransform(t) {
  let a = 1 / (t[0] * t[3] - t[1] * t[2]),
    r = [a * t[3], -a * t[1], -a * t[2], a * t[0]],
    o = transformPoint({ x: t[4], y: t[5] }, r, true);

  r[4] = -o.x;
  r[5] = -o.y;
  return r;
}
