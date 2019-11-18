import { isArray, isFunction } from '../utils/common';
import ShapesGroup from '../shapes/ShapesGroup';

export default class Body {
  constructor (opts) {
    this.shape = opts.shape;
    if (isArray(this.shape)) {
      this.shape = new ShapesGroup(this.shape);
    }
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
        y: opts.transform.position.y
      },
    }

    this.reset();
  }

  get shapes () {
    return this.shape.shapes;
  }

  start () {
  }

  update () {
  }

  reset () {
    this.transform = JSON.parse(JSON.stringify(this.transform0));
  }
}
