import Shape from './Shape';

class Rectangle extends Shape {
  constructor (opts) {
    super(opts);
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
    console.log(x, y);
  }

  calcDimensions () {
    return {
      left: 0,
      top: 0,
      width: this.width,
      height: this.height
    };
  }

  move (dx, dy) {
    console.log(dx, dy);
  }
}

export default Rectangle;