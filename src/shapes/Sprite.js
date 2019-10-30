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

  move (dx, dy) {
  }
}

export default Sprite;