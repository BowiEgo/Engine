import { isArray, isFunction } from '../utils/common';
import ShapesGroup from '../shapes/ShapesGroup';
import Controller from './Controller';
import { line } from 'd3';

function getRandomColor() {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}

export default class Body {
  constructor(opts) {
    this.shape = opts.shape;
    if (isArray(this.shape)) {
      this.shape = new ShapesGroup(this.shape);
    }
    this.shape.body = this;
    this.fill = opts.fill !== undefined ? opts.fill : '#83cbff';
    this.startCb = isFunction(opts.start) ? opts.start : this.start;
    this.updateCb = isFunction(opts.update) ? opts.update : this.update;
    this.transform0 = {
      scaleX: opts.transform.scaleX,
      skewX: opts.transform.skewX,
      skewY: opts.transform.skewY,
      scaleY: opts.transform.scaleY,
      position: {
        x: opts.transform.position.x,
        y: opts.transform.position.y,
      },
    };

    this.hitFill = getRandomColor();
    this.reset();
    this.calcCoords();
    this.controllers = Object.keys(this.coords).map((key) => {
      return new Controller(key, this);
    });

    console.log(this);
  }

  get shapes() {
    return this.shape.shapes;
  }

  get bound() {
    return null;
  }

  translate(dx, dy) {
    this.transform.position.x += dx;
    this.transform.position.y += dy;

    this.calcCoords();
  }

  start() {}

  update() {}

  reset() {
    this.transform = JSON.parse(JSON.stringify(this.transform0));
  }

  calcCoords() {
    const posX = this.transform.position.x;
    const posY = this.transform.position.y;
    const dim = this.shape.dimensions;

    let tl = {
      x: posX + dim.left,
      y: posY + dim.top,
    };

    let tr = {
      x: tl.x + dim.width,
      y: tl.y,
    };

    let bl = {
      x: tl.x,
      y: tr.y + dim.height,
    };

    let br = {
      x: tr.x,
      y: bl.y,
    };

    let coords = {
      tl: tl,
      tr: tr,
      bl: bl,
      br: br,
    };

    this.coords = coords;

    return this.coords;
  }
}
