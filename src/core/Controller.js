import { applyProps } from '../utils/Object';

const baseStyle = {
  size: 8,
  color: '#e91e6382',
  strokeWidth: 2,
  fill: '#fff',
  // boundColor: '#e91e6382',
  // boundStrokeWidth: 2,
};

export default class Controller {
  constructor(type, body, opts) {
    this.type = type;
    this.body = body;
    this.style = {};
    opts = opts || {};

    applyProps(this.style, baseStyle, opts);
  }

  get dim() {
    const { body } = this;
    const dim = {
      left: body.transform.position.x + body.shape.dimensions.left,
      top: body.transform.position.y + body.shape.dimensions.top,
      width: body.shape.dimensions.width,
      height: body.shape.dimensions.height,
    };

    return dim;
  }

  get pos() {
    return this.body.coords[this.type];
  }

  get coord() {
    const pos = this.body.coords[this.type];

    return {
      tl: {
        x: pos.x - this.size / 2,
        y: pos.y - this.size / 2,
      },
      tr: {
        x: pos.x + this.size / 2,
        y: pos.y - this.size / 2,
      },
      bl: {
        x: pos.x - this.size / 2,
        y: pos.y + this.size / 2,
      },
      br: {
        x: pos.x + this.size / 2,
        y: pos.y + this.size / 2,
      },
    };
  }

  _findTargetCorner() {}

  skewX() {}
}
