import Shape from './Shape';
import Dimensions from '../geometry/Dimensions';

class Sprite extends Shape {
  constructor(opts) {
    super(opts);
    this.type = 'sprite';
  }

  getAxes() {}

  project(axis) {}

  addPoint(x, y) {}

  calcDimensions() {
    return new Dimensions(0, 0, 100, 20);
  }

  move(dx, dy) {}
}

export default Sprite;
