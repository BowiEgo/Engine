import Shape from './Shape';
import Dimensions from '../geometry/Dimensions';

class Rectangle extends Shape {
  constructor (opts) {
    super(opts);
    console.log('rect', opts)
    this.type = 'rectangle';
    this.width = opts.width || 0;
    this.height = opts.height || 0;
    this.rx = opts.rx || 0;
    this.ry = opts.ry || 0;
    this.dimensions = this.calcDimensions();
  }

  getAxes () {
  }

  project (axis) {
    // console.log(axis);
  }

  addPoint (x, y) {
    // console.log(x, y);
  }

  calcDimensions () {
    return new Dimensions(
      -this.strokeWidth / 2,
      -this.strokeWidth / 2,
      this.width + this.strokeWidth,
      this.height + this.strokeWidth
    );
  }

  move (dx, dy) {
    console.log(dx, dy);
  }
}

export default Rectangle;