import { isArray, isFunction } from '../utils/common';
import ShapesGroup from '../shapes/ShapesGroup';

function getRandomColor () {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}

export default class Body {
  constructor (opts) {
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
        y: opts.transform.position.y
      },
    };

    this.hitFill = getRandomColor();
    this.reset();
  }

  get shapes () {
    return this.shape.shapes;
  }

  get bound () {
    return null;
  }

  start () {
  }

  update () {
  }

  reset () {
    this.transform = JSON.parse(JSON.stringify(this.transform0));
  }

  containsPoint (point) {
    return true;
    let lines = this._getImageLines(),
      xPoints = this._findCrossPoints(point, lines);

    return (xPoints !== 0 && xPoints % 2 === 1);
  }

  /**
   * Method that returns an object with the object edges in it, given the coordinates of the corners
   * @private
   * @param {Object} oCoords Coordinates of the object corners
   */
  _getImageLines (oCoords) {
    return {
      topline: {
        o: oCoords.tl,
        d: oCoords.tr
      },
      rightline: {
        o: oCoords.tr,
        d: oCoords.br
      },
      bottomline: {
        o: oCoords.br,
        d: oCoords.bl
      },
      leftline: {
        o: oCoords.bl,
        d: oCoords.tl
      }
    };
  }

  _findCrossPoints (point, lines) {

  }
}
