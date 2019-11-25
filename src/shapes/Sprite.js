import Shape from './Shape';

class Sprite extends Shape {
  constructor (opts) {
    super(opts);
    this.type = 'sprite';
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
      width: 100,
      height: 20
    };
  }

  move (dx, dy) {
  }
}

export default Sprite;