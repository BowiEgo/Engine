import Shape from './Shape';

class Text extends Shape {
  constructor (text, opts) {
    super(opts);
    this.type = 'text';
    this.text = text;
    this.font = '18px verdana';
    this.fillStyle = '#333';
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

export default Text;