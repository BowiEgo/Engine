import Events from '../core/Events';
import Point from '../geometry/Vertice'

const iMatrix = [1, 0, 0, 1, 0, 0];

export default class CanvasRenderer {
  constructor (opts) {
    const { width = 300, height = 300, bgColor = 'aliceblue' } = opts;

    this.canvas = _createCanvas();
    this.context = this.canvas.getContext('2d');
    this.viewportTransform = iMatrix;

    this.pixelRatio = _getPixelRatio(this.canvas);
    this.canvas.setAttribute('data-pixel-ratio', this.pixelRatios);
    this.context.scale(this.pixelRatio, this.pixelRatio);

    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = height * this.pixelRatio;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.canvas.style.backgroundColor = bgColor;
  }

  get width () {
    return this.canvas.width;
  }

  get height () {
    return this.canvas.height;
  }

  getZoom () {
    return this.viewportTransform[0];
  }

  setViewportTransform (vpt) {
    this.viewportTransform = vpt;
  }

  resetTransform () {
    this.setViewportTransform(iMatrix);
  }

  zoomToPoint (point, value) {
    var before = point, vpt = this.viewportTransform.slice(0);
    point = transformPoint(point, invertTransform(this.viewportTransform));
    vpt[0] = value;
    vpt[3] = value;
    var after = transformPoint(point, vpt);
    vpt[4] += before.x - after.x;
    vpt[5] += before.y - after.y;

    this.setViewportTransform(vpt);
  }

  translate (offset) {
    this.clear();
    this.context.translate(offset.x, offset.y);
  }

  render (objects) {
    const { context, pixelRatio } = this;
    let vpt = this.viewportTransform;
    context.save();
    context.transform(
      vpt[0] * pixelRatio,
      vpt[1],
      vpt[2],
      vpt[3] * pixelRatio,
      vpt[4],
      vpt[5]
    );
    _renderObjects(this.context, objects);
    context.restore();
    Events.trigger('rendered', this.context);
  }

  clear () {
    this.context.clearRect(0, 0, this.width, this.height);
  }
}

function _createCanvas () {
  let canvas = document.createElement('canvas');
  canvas.getPixelRatio = _getPixelRatio.bind(null, canvas);
  return canvas;
}

/**
 * Gets the pixel ratio of the canvas.
 */
function _getPixelRatio (canvas) {
  var context = canvas.getContext('2d'),
    devicePixelRatio = window.devicePixelRatio || 1,
    backingStorePixelRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;

  return devicePixelRatio / backingStorePixelRatio;
}

/**
 * Render several types of graphics in canvas
 */
function _renderObjects (context, objects) {
  objects = objects || [];
  objects.forEach(object => {
    const shapeType = object.shape.type;

    switch (shapeType) {
      case 'polygon':
        _renderPolygon(context, object.shape);
        break;
      case 'rectangle':
        _renderRectangle(context, object.shape);
        break;
      case 'circle':
        _renderCircle(context, object.shape);
        break;
      case 'text':
        _renderText(context, object.shape);
        break;
      case 'polyline':
        _renderPolyline(context, object.shape);
        break;
      default:
        break;
    }
  })
}

function _renderPolygon (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.beginPath();
  context.moveTo(shape.vertices[0].x + posX, shape.vertices[0].y + posY);
  for (let i = 1; i < shape.vertices.length; i++) {
    context.lineTo(shape.vertices[i].x + posX, shape.vertices[i].y + posY);
  }
  context.closePath();

  _draw(context, shape);
}

function _renderRectangle (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.beginPath();
  context.rect(posX, posY, shape.width, shape.height);
  context.closePath();

  _draw(context, shape);
}

function _renderCircle (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.beginPath();
  context.arc(posX, posY, shape.radius, 0, Math.PI * 2, false);
  context.closePath();

  _draw(context, shape);
}

function _renderText (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.font = shape.font;
  context.fillStyle = shape.fillStyle;
  context.strokeStyle = shape.strokeStyle;
  shape.fill && context.fillText(shape.text, posX, posY);
  shape.strokeWidth > 0 && context.strokeText(shape.text, posX, posY);
}

function _renderPolyline (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.beginPath();
  context.moveTo(shape.vertices[0].x + posX, shape.vertices[0].y + posY);
  for (let i = 1; i < shape.vertices.length; i++) {
    context.lineTo(shape.vertices[i].x + posX, shape.vertices[i].y + posY);
  }
  shape.close && context.closePath();

  _drawLine(context, shape);
}

// function _renderFill (context) {
//   context.save();
//   context.fill();
//   context.restore();
// }

// function _renderStroke (context) {
//   context.save();
//   context.stroke();
//   context.restore();
// }

function _draw (context, shape) {
  context.save();
  context.lineWidth = shape.strokeWidth;
  context.strokeStyle = shape.strokeStyle;
  context.fillStyle = shape.fillStyle;
  shape.strokeWidth > 0 && context.stroke();
  shape.fill && context.fill();
  context.restore();
}

function _drawLine (context, shape) {
  context.save();
  context.lineWidth = shape.strokeWidth;
  context.strokeStyle = shape.strokeStyle;
  context.stroke();
  context.restore();
}

function transformPoint (p, t, ignoreOffset) {
  if (ignoreOffset) {
    return new Point(
      t[0] * p.x + t[2] * p.y,
      t[1] * p.x + t[3] * p.y
    );
  }
  return new Point(
    t[0] * p.x + t[2] * p.y + t[4],
    t[1] * p.x + t[3] * p.y + t[5]
  );
}

function invertTransform (t) {
  var a = 1 / (t[0] * t[3] - t[1] * t[2]),
    r = [a * t[3], -a * t[1], -a * t[2], a * t[0]],
    o = transformPoint({ x: t[4], y: t[5] }, r, true);
  r[4] = -o.x;
  r[5] = -o.y;
  return r;
}
