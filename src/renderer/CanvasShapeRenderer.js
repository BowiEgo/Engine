export default class CanvasShapeRenderer {
  constructor (context) {
    this.context = context;
  }

  render (shape) {
    const { context } = this;

    switch (shape.type) {
      case 'polygon':
        _pathPolygon(context, shape);
        break;
      case 'polyline':
        _pathPolyline(context, shape);
        break;
      case 'rectangle':
        _pathRectangle(context, shape);
        break;
      case 'circle':
        _pathCircle(context, shape);
        break;
      case 'text':
        _pathText(context, shape);
        break;
      default:
        break;
    }

    _setStrokeStyles(context, shape);
    _setFillStyles(context, shape);
    _renderStroke(context, shape);
    _renderFill(context, shape);
  }
}

function _setStrokeStyles (context, shape) {
  if (shape.stroke) {
    context.lineWidth = shape.strokeWidth;
    context.lineCap = shape.strokeLineCap;
    context.lineDashOffset = shape.strokeDashOffset;
    context.lineJoin = shape.strokeLineJoin;
    context.miterLimit = shape.strokeMiterLimit;
    context.strokeStyle = shape.stroke;
  }
}

function _setFillStyles (context, shape) {
  if (shape.fill) {
    context.fillStyle = shape.fill;
  }
}

function _renderStroke (context, shape) {
  if (!shape.stroke || shape.strokeWidth === 0) {
    return;
  }
  // _setLineDash(this.context, this.strokeDashArray, this._renderDashedStroke);
  context.save();
  context.stroke();
  context.restore();
}

function _renderFill (context) {
  context.save();
  context.fill();
  context.restore();
}

function _pathPolygon(context, shape) {
  let points = shape.vertices,
    point;
  let len = points.length;

  if (!len || len === 0 || isNaN(points[len - 1].y)) {
    return false;
  }

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < len; i++) {
    point = points[i];
    context.lineTo(point.x, point.y);
  }
  context.closePath();
}

function _pathPolyline(context, shape) {
  context.beginPath();
  context.closePath();
}

function _pathRectangle(context, shape) {
  let rx = shape.rx ? Math.min(shape.rx, shape.width / 2) : 0,
    ry = shape.ry ? Math.min(shape.ry, shape.height / 2) : 0,
    w = shape.width,
    h = shape.height,
    isRounded = rx !== 0 || ry !== 0,
    /* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */
    k = 1 - 0.5522847498;

  context.beginPath();
  context.moveTo(rx, 0);

  context.lineTo(w - rx, 0);
  isRounded && context.bezierCurveTo(w - k * rx, 0, w, k * ry, w, ry);

  context.lineTo(w, h - ry);
  isRounded && context.bezierCurveTo(w, h - k * ry, w - k * rx, h, w - rx, h);

  context.lineTo(rx, h);
  isRounded && context.bezierCurveTo(k * rx, h, 0, h - k * ry, 0, h - ry);

  context.lineTo(0, ry);
  isRounded && context.bezierCurveTo(0, k * ry, k * rx, 0, rx, 0);

  context.closePath();
}

function _pathCircle(context, shape) {
  context.beginPath();
  context.arc(0, 0, shape.radius, 0, 2 * Math.PI);
  context.closePath();
}

function _pathText(context, shape) {
  context.beginPath();

  shape.updateText();
  // const lineHeight = measured.lineHeight;
  // let linePositionX, linePositionY;

  // for (let i = 0, len = lines.length; i++) {
  //   linePositionX = 0;
  //   linePositionY = i * lineHeight;
  // }
  
  context.closePath();
}
