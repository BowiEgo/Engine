import { cos, sin } from './misc';

let arcToSegmentsCache = {};

export function arcToSegments(toX, toY, rx, ry, large, sweep, rotateX) {
  let argsString = Array.prototype.join.call(arguments);
  if (arcToSegmentsCache[argsString]) {
    return arcToSegmentsCache[argsString];
  }

  let PI = Math.PI,
    th = (rotateX * PI) / 180,
    sinTh = sin(th),
    cosTh = cos(th),
    fromX = 0,
    fromY = 0;

  rx = Math.abs(rx);
  ry = Math.abs(ry);

  let px = -cosTh * toX * 0.5 - sinTh * toY * 0.5,
    py = -cosTh * toY * 0.5 + sinTh * toX * 0.5,
    rx2 = rx * rx,
    ry2 = ry * ry,
    py2 = py * py,
    px2 = px * px,
    pl = rx2 * ry2 - rx2 * py2 - ry2 * px2,
    root = 0;

  if (pl < 0) {
    let s = Math.sqrt(1 - pl / (rx2 * ry2));
    rx *= s;
    ry *= s;
  } else {
    root =
      (large === sweep ? -1.0 : 1.0) * Math.sqrt(pl / (rx2 * py2 + ry2 * px2));
  }

  let cx = (root * rx * py) / ry,
    cy = (-root * ry * px) / rx,
    cx1 = cosTh * cx - sinTh * cy + toX * 0.5,
    cy1 = sinTh * cx + cosTh * cy + toY * 0.5,
    mTheta = calcVectorAngle(1, 0, (px - cx) / rx, (py - cy) / ry),
    dtheta = calcVectorAngle(
      (px - cx) / rx,
      (py - cy) / ry,
      (-px - cx) / rx,
      (-py - cy) / ry
    );

  if (sweep === 0 && dtheta > 0) {
    dtheta -= 2 * PI;
  } else if (sweep === 1 && dtheta < 0) {
    dtheta += 2 * PI;
  }

  // Convert into cubic bezier segments <= 90deg
  let segments = Math.ceil(Math.abs((dtheta / PI) * 2)),
    result = [],
    mDelta = dtheta / segments,
    mT =
      ((8 / 3) * Math.sin(mDelta / 4) * Math.sin(mDelta / 4)) /
      Math.sin(mDelta / 2),
    th3 = mTheta + mDelta;

  for (let i = 0; i < segments; i++) {
    result[i] = segmentToBezier(
      mTheta,
      th3,
      cosTh,
      sinTh,
      rx,
      ry,
      cx1,
      cy1,
      mT,
      fromX,
      fromY
    );
    fromX = result[i][4];
    fromY = result[i][5];
    mTheta = th3;
    th3 += mDelta;
  }
  arcToSegmentsCache[argsString] = result;
  return result;
}

function segmentToBezier(
  th2,
  th3,
  cosTh,
  sinTh,
  rx,
  ry,
  cx1,
  cy1,
  mT,
  fromX,
  fromY
) {
  let costh2 = cos(th2),
    sinth2 = sin(th2),
    costh3 = cos(th3),
    sinth3 = sin(th3),
    toX = cosTh * rx * costh3 - sinTh * ry * sinth3 + cx1,
    toY = sinTh * rx * costh3 + cosTh * ry * sinth3 + cy1,
    cp1X = fromX + mT * (-cosTh * rx * sinth2 - sinTh * ry * costh2),
    cp1Y = fromY + mT * (-sinTh * rx * sinth2 + cosTh * ry * costh2),
    cp2X = toX + mT * (cosTh * rx * sinth3 + sinTh * ry * costh3),
    cp2Y = toY + mT * (sinTh * rx * sinth3 - cosTh * ry * costh3);

  return [cp1X, cp1Y, cp2X, cp2Y, toX, toY];
}

function calcVectorAngle(ux, uy, vx, vy) {
  let ta = Math.atan2(uy, ux),
    tb = Math.atan2(vy, vx);
  if (tb >= ta) {
    return tb - ta;
  } else {
    return 2 * Math.PI - (ta - tb);
  }
}

export function getBoundsOfArc(fx, fy, rx, ry, rot, large, sweep, tx, ty) {
  let fromX = 0,
    fromY = 0,
    bound,
    bounds = [],
    segs = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);

  for (let i = 0, len = segs.length; i < len; i++) {
    bound = getBoundsOfCurve(
      fromX,
      fromY,
      segs[i][0],
      segs[i][1],
      segs[i][2],
      segs[i][3],
      segs[i][4],
      segs[i][5]
    );
    bounds.push({ x: bound[0].x + fx, y: bound[0].y + fy });
    bounds.push({ x: bound[1].x + fx, y: bound[1].y + fy });
    fromX = segs[i][4];
    fromY = segs[i][5];
  }
  return bounds;
}

export function getBoundsOfCurve(x0, y0, x1, y1, x2, y2, x3, y3) {
  let sqrt = Math.sqrt,
    min = Math.min,
    max = Math.max,
    abs = Math.abs,
    tvalues = [],
    bounds = [[], []],
    a,
    b,
    c,
    t,
    t1,
    t2,
    b2ac,
    sqrtb2ac;

  b = 6 * x0 - 12 * x1 + 6 * x2;
  a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
  c = 3 * x1 - 3 * x0;

  for (let i = 0; i < 2; ++i) {
    if (i > 0) {
      b = 6 * y0 - 12 * y1 + 6 * y2;
      a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
      c = 3 * y1 - 3 * y0;
    }

    if (abs(a) < 1e-12) {
      if (abs(b) < 1e-12) {
        continue;
      }
      t = -c / b;
      if (0 < t && t < 1) {
        tvalues.push(t);
      }
      continue;
    }
    b2ac = b * b - 4 * c * a;
    if (b2ac < 0) {
      continue;
    }
    sqrtb2ac = sqrt(b2ac);
    t1 = (-b + sqrtb2ac) / (2 * a);
    if (0 < t1 && t1 < 1) {
      tvalues.push(t1);
    }
    t2 = (-b - sqrtb2ac) / (2 * a);
    if (0 < t2 && t2 < 1) {
      tvalues.push(t2);
    }
  }

  let x,
    y,
    j = tvalues.length,
    jlen = j,
    mt;
  while (j--) {
    t = tvalues[j];
    mt = 1 - t;
    x =
      mt * mt * mt * x0 +
      3 * mt * mt * t * x1 +
      3 * mt * t * t * x2 +
      t * t * t * x3;
    bounds[0][j] = x;

    y =
      mt * mt * mt * y0 +
      3 * mt * mt * t * y1 +
      3 * mt * t * t * y2 +
      t * t * t * y3;
    bounds[1][j] = y;
  }

  bounds[0][jlen] = x0;
  bounds[1][jlen] = y0;
  bounds[0][jlen + 1] = x3;
  bounds[1][jlen + 1] = y3;
  let result = [
    {
      x: min.apply(null, bounds[0]),
      y: min.apply(null, bounds[1]),
    },
    {
      x: max.apply(null, bounds[0]),
      y: max.apply(null, bounds[1]),
    },
  ];

  return result;
}
