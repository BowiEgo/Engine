import Point from '../geometry/Vertice';

const iMatrix = [1, 0, 0, 1, 0, 0];

export default class Canvas {
  constructor (opts) {
    const { width = 300, height = 300, bgColor = 'aliceblue' } = opts;

    this.canvas = _createCanvas();
    this.context = this.canvas.getContext('2d');
    this.viewportTransform = iMatrix;
    
    this.pixelRatio = this.canvas.getPixelRatio();
    this.canvas.setAttribute('data-pixel-ratio', this.pixelRatio);
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
    let relativePoint = {
      x: point.x * this.pixelRatio,
      y: point.y * this.pixelRatio
    }
    let before = relativePoint, vpt = this.viewportTransform.slice(0);
    relativePoint = _transformPoint(relativePoint, _invertTransform(this.viewportTransform));
    vpt[0] = value;
    vpt[3] = value;
    let after = _transformPoint(relativePoint, vpt);
    vpt[4] += before.x - after.x;
    vpt[5] += before.y - after.y;

    this.setViewportTransform(vpt);
  }

  translate (offset) {
    // console.log('translate', offset);
    let vpt = this.viewportTransform.slice(0);

    vpt[4] += offset.x * this.pixelRatio;
    vpt[5] += offset.y * this.pixelRatio;

    this.setViewportTransform(vpt);
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