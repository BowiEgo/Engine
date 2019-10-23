import Shape from './Shape';

class Cirlce extends Shape {
  constructor (radius, opts) {
    super(opts);
    this.type = 'circle';
    this.radius = radius;
  }

  getAxes () {
  }

  project (axis) {
  }

  addPoint (x, y) {
  }

  move (dx, dy) {
  }
}

export default Cirlce;