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

let scale;

export default class Body {
  constructor(opts) {
    this.shape = opts.shape;
    if (isArray(this.shape)) {
      this.shape = new ShapesGroup(this.shape);
    }
    this.shape.body = this;
    // shallow copy
    this.dimensions = {};
    Object.keys(this.shape.dimensions).forEach((key) => {
      this.dimensions[key] = this.shape.dimensions[key];
    });
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
      origin: {
        x: 0,
        y: 0,
      },
    };

    this.hitFill = getRandomColor();
    this.reset();
    this.calcCoords();
    // shallow copy
    this.controllers = Object.keys(this.coords).map((key) => {
      return new Controller(key, this);
    });
  }

  get shapes() {
    return this.shape.shapes;
  }

  get bound() {
    return null;
  }

  // get coords() {
  //   return this.calcCoords();
  // }

  translate(dx, dy) {
    this.transform.position.x += dx;
    this.transform.position.y += dy;

    this.calcCoords();
  }

  beforeScale() {
    // shallow copy
    this.dimensions0 = {};
    Object.keys(this.dimensions).forEach((key) => {
      this.dimensions0[key] = this.shape.dimensions[key];
    });
  }

  scale(scaleX, scaleY, controller) {
    const dim = this.dimensions;

    this.transform.scaleX = scaleX;
    this.transform.scaleY = scaleY;
    switch (controller.type) {
      case 'tl':
        this.transform.origin.x = dim.width;
        this.transform.origin.y = dim.height;
        break;
      case 'tr':
        this.transform.origin.x = 0;
        this.transform.origin.y = dim.height;
        break;
      case 'bl':
        this.transform.origin.x = dim.width;
        this.transform.origin.y = 0;
        break;
      case 'br':
        this.transform.origin.x = 0;
        this.transform.origin.y = 0;
        break;
      default:
        break;
    }

    scale = {
      scaleX: scaleX,
      scaleY: scaleY,
    };

    this.applyScale();
  }

  applyScale() {
    this.dimensions.width = this.dimensions0.width * scale.scaleX;
    this.dimensions.height = this.dimensions0.height * scale.scaleY;
    this.calcCoords();
    scale = {
      scaleX: 1,
      scaleY: 1,
    };
  }

  resetTransformOrigin() {
    this.transform.origin.x = 0;
    this.transform.origin.y = 0;
  }

  start() {}

  update() {}

  reset() {
    // shallow copy
    this.transform = JSON.parse(JSON.stringify(this.transform0));
  }

  calcCoords() {
    const posX = this.transform.position.x;
    const posY = this.transform.position.y;
    const dim = this.dimensions;

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
  }

  findController(point) {
    const { controllers } = this;

    for (let i = 0, len = controllers.length; i < len; i++) {
      if (this.app._hit.containsPoint(point, this.controllers[i].coords)) {
        return controllers[i];
      }
    }

    return;
  }
}
