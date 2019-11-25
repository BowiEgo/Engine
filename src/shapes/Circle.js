import Shape from './Shape';

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
    return {
      left: 0,
      top: 0,
      width: this.radius * 2,
      height: this.radius * 2
    };
  }

  move (dx, dy) {
  }
}

export default Cirlce;