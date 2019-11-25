import { isArray, isFunction, clone } from '../utils/common';
import { transformPoint } from '../utils/misc';
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
    this.calcCoords();
  }

  get shapes () {
    return this.shape.shapes;
  }

  get bound () {
    return null;
  }

  translate (dx, dy) {
    this.transform.position.x += dx;
    this.transform.position.y += dy;

    this.calcCoords();
  }

  start () {
  }

  update () {
  }

  reset () {
    this.transform = JSON.parse(JSON.stringify(this.transform0));
  }

  calcCoords () {
    const posX = this.transform.position.x;
    const posY = this.transform.position.y;
    const dim = this.shape.dimensions;

    let tl = {
      x: posX + dim.left,
      y: posY + dim.top
    }

    let tr = {
      x: tl.x + dim.width,
      y: tl.y
    }

    let bl = {
      x: tl.x,
      y: tr.y + dim.height
    }

    let br = {
      x: tr.x,
      y: bl.y
    }

    let coords = {
      tl: tl,
      tr: tr,
      bl: bl,
      br: br
    }

    this.coords = coords;

    return this.coords;
  }

  containsPoint (point) {
    const _canvas = this.app.renderer._canvas;
    const pixelRatio = _canvas.pixelRatio;
    const coords = this.calcCoords();
    let vpt = clone(_canvas.viewportTransform);

    vpt[4] /= pixelRatio;
    vpt[5] /= pixelRatio;

    let coordsTransformed = {
      tl: transformPoint(coords.tl, vpt),
      tr: transformPoint(coords.tr, vpt),
      bl: transformPoint(coords.bl, vpt),
      br: transformPoint(coords.br, vpt)
    }

    let lines = this._getImageLines(coordsTransformed),
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
    let b1, b2, a1, a2, xi, // yi,
      xcount = 0,
      iLine;

    for (let lineKey in lines) {
      iLine = lines[lineKey];
      // optimisation 1: line below point. no cross
      if ((iLine.o.y < point.y) && (iLine.d.y < point.y)) {
        continue;
      }
      // optimisation 2: line above point. no cross
      if ((iLine.o.y >= point.y) && (iLine.d.y >= point.y)) {
        continue;
      }
      // optimisation 3: vertical line case
      if ((iLine.o.x === iLine.d.x) && (iLine.o.x >= point.x)) {
        xi = iLine.o.x;
        // yi = point.y;
      }
      // calculate the intersection point
      else {
        b1 = 0;
        b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
        a1 = point.y - b1 * point.x;
        a2 = iLine.o.y - b2 * iLine.o.x;

        xi = -(a1 - a2) / (b1 - b2);
        // yi = a1 + b1 * xi;
      }
      // dont count xi < point.x cases
      if (xi >= point.x) {
        xcount += 1;
      }
      // optimisation 4: specific for square images
      if (xcount === 2) {
        break;
      }
    }
    return xcount;
  }
}
