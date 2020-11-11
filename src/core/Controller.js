import { applyProps } from '../utils/Object';

const baseProp = {
  boundColor: '#e91e6382',
  boundStrokeWidth: 2,
  pointColor: '#e91e6382',
  pointStrokeWidth: 2,
  pointFill: '#fff',
};

export default class Controller {
  constructor(body, opts) {
    this.body = body;
    opts = opts || {};

    applyProps(this, baseProp, opts);
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
}
