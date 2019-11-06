import Events from '../core/Events';
import Point from '../geometry/Vertice';
import CanvasShapeRenderer from './CanvasShapeRenderer';
import { ShapesGroup } from '../shapes';

const iMatrix = [1, 0, 0, 1, 0, 0];

export default class CanvasRenderer {
  constructor (opts) {
    const { width = 300, height = 300, bgColor = 'aliceblue' } = opts;

    this.canvas = _createCanvas();
    this.context = this.canvas.getContext('2d');
    this.viewportTransform = iMatrix;
    
    this.pixelRatio = _getPixelRatio(this.canvas);
    this.shapeRenderer = new CanvasShapeRenderer(this.context, this.pixelRatio, this);
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
    let before = point, vpt = this.viewportTransform.slice(0);
    point = _transformPoint(point, _invertTransform(this.viewportTransform));
    vpt[0] = value;
    vpt[3] = value;
    let after = _transformPoint(point, vpt);
    vpt[4] += before.x - after.x;
    vpt[5] += before.y - after.y;

    this.setViewportTransform(vpt);
  }

  translate (offset) {
    let vpt = this.viewportTransform.slice(0);

    vpt[4] += offset.x;
    vpt[5] += offset.y;

    this.setViewportTransform(vpt);
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
    _renderObjects.call(this, this.context, objects);
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
  let context = canvas.getContext('2d'),
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
    const transform = object.transform;
    const { scaleX = 1, skewX = 0, skewY = 0, scaleY = 1} = transform;
    const { x: posX, y: posY } = transform.position;

    context.save();
    context.transform(scaleX, skewX, skewY, scaleY, posX, posY);

    if (object.shape instanceof ShapesGroup) {
      object.shape.shapes.forEach(shape => {
        _renderShape.call(this, shape);
      })
    } else {
      _renderShape.call(this, object.shape);
    }

    context.restore();
  })
}

function _renderShape (shape) {
  this.shapeRenderer.render(shape);
}

function _transformPoint (p, t, ignoreOffset) {
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

function _invertTransform (t) {
  let a = 1 / (t[0] * t[3] - t[1] * t[2]),
    r = [a * t[3], -a * t[1], -a * t[2], a * t[0]],
    o = _transformPoint({ x: t[4], y: t[5] }, r, true);
  r[4] = -o.x;
  r[5] = -o.y;
  return r;
}
