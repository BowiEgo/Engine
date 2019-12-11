import Shape from './Shape';
import Dimensions from '../geometry/Dimensions';

class Cirlce extends Shape {
  constructor (radius, opts) {
    super(opts);
    this.type = 'circle';
    this.radius = radius;

    this.dimensions = this.calcDimensions();
  }

  getAxes () {
  }

  project (axis) {
  }

  addPoint (x, y) {
  }

  calcDimensions () {
    return new Dimensions(
     0,
     0,
     this.radius * 2,
     this.radius * 2
    );
  }

  move (dx, dy) {
  }
}

export default Cirlce;