import Shape from './Shape';

class Rectangle extends Shape {
  constructor (width, height, opts) {
    super(opts);
    this.type = 'rectangle';
    this.width = width;
    this.height = height;
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

export default Rectangle;