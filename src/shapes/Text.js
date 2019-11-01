import Shape from './Shape';

class Text extends Shape {
  constructor (text, opts) {
    super(opts);
    this.type = 'text';
    this.text = text;
    this.font = '18px verdana';
    this.fill = '#333';
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
      width: 100,
      height: 20
    };
  }

  move (dx, dy) {
  }
}

export default Text;