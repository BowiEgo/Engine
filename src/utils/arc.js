import { cos, sin } from './misc';

let arcToSegmentsCache = {};

export function arcToSegments(toX, toY, rx, ry, large, sweep, rotateX) {
  let argsString = Array.prototype.join.call(arguments);
  if (arcToSegmentsCache[argsString]) {
    return arcToSegmentsCache[argsString];
  }

  let PI = Math.PI, th = rotateX * PI / 180,
    sinTh = sin(th),
    cosTh = cos(th),
    fromX = 0, fromY = 0;

  rx = Math.abs(rx);
  ry = Math.abs(ry);

  let px = -cosTh * toX * 0.5 - sinTh * toY * 0.5,
    py = -cosTh * toY * 0.5 + sinTh * toX * 0.5,
    rx2 = rx * rx, ry2 = ry * ry, py2 = py * py, px2 = px * px,
    pl = rx2 * ry2 - rx2 * py2 - ry2 * px2,
    root = 0;

  if (pl < 0) {
    let s = Math.sqrt(1 - pl / (rx2 * ry2));
    rx *= s;
    ry *= s;
  }
  else {
    root = (large === sweep ? -1.0 : 1.0) *
            Math.sqrt( pl / (rx2 * py2 + ry2 * px2));
  }

  let cx = root * rx * py / ry,
    cy = -root * ry * px / rx,
    cx1 = cosTh * cx - sinTh * cy + toX * 0.5,
    cy1 = sinTh * cx + cosTh * cy + toY * 0.5,
    mTheta = calcVectorAngle(1, 0, (px - cx) / rx, (py - cy) / ry),
    dtheta = calcVectorAngle((px - cx) / rx, (py - cy) / ry, (-px - cx) / rx, (-py - cy) / ry);

  if (sweep === 0 && dtheta > 0) {
    dtheta -= 2 * PI;
  }
  else if (sweep === 1 && dtheta < 0) {
    dtheta += 2 * PI;
  }

  // Convert into cubic bezier segments <= 90deg
  let segments = Math.ceil(Math.abs(dtheta / PI * 2)),
    result = [], mDelta = dtheta / segments,
    mT = 8 / 3 * Math.sin(mDelta / 4) * Math.sin(mDelta / 4) / Math.sin(mDelta / 2),
    th3 = mTheta + mDelta;

  for (let i = 0; i < segments; i++) {
    result[i] = segmentToBezier(mTheta, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY);
    fromX = result[i][4];
    fromY = result[i][5];
    mTheta = th3;
    th3 += mDelta;
  }
  arcToSegmentsCache[argsString] = result;
  return result;
}

function segmentToBezier(th2, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY) {
  let costh2 = cos(th2),
    sinth2 = sin(th2),
    costh3 = cos(th3),
    sinth3 = sin(th3),
    toX = cosTh * rx * costh3 - sinTh * ry * sinth3 + cx1,
    toY = sinTh * rx * costh3 + cosTh * ry * sinth3 + cy1,
    cp1X = fromX + mT * ( -cosTh * rx * sinth2 - sinTh * ry * costh2),
    cp1Y = fromY + mT * ( -sinTh * rx * sinth2 + cosTh * ry * costh2),
    cp2X = toX + mT * ( cosTh * rx * sinth3 + sinTh * ry * costh3),
    cp2Y = toY + mT * ( sinTh * rx * sinth3 - cosTh * ry * costh3);

  return [
    cp1X, cp1Y,
    cp2X, cp2Y,
    toX, toY
  ];
}

function calcVectorAngle(ux, uy, vx, vy) {
  let ta = Math.atan2(uy, ux),
    tb = Math.atan2(vy, vx);
  if (tb >= ta) {
    return tb - ta;
  }
  else {
    return 2 * Math.PI - (ta - tb);
  }
}
