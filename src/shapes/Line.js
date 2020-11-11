import Dimensions from '../geometry/Dimensions';

class Line {
  constructor(opts) {
    opts = opts || {};
    this.transform = {
      position: {},
    };
    this.close = !!opts.close;
    this.style = this.style || 'solid';
    this.fill = opts.fill || '#83cbff';
    this.strokeWidth = opts.strokeWidth || 0;
    this.stroke = opts.stroke || 'grey';

    this.dimensions = this.calcDimensions();
  }

  calcDimensions() {
    return new Dimensions(0, 0, 100, 20);
  }

  move(dx, dy) {}
}

export default Line;
