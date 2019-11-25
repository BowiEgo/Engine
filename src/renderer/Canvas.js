import Point from '../geometry/Vertice';
import { transformPoint, invertTransform } from '../utils/misc';

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
    relativePoint = transformPoint(relativePoint, invertTransform(this.viewportTransform));
    vpt[0] = value;
    vpt[3] = value;
    let after = transformPoint(relativePoint, vpt);
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
