class Line {
  constructor (opts) {
    opts = opts || {};
    this.transform = {
      position: {}
    };
    this.close = !!opts.close;
    this.style = this.style || 'solid';
    this.fill = opts.fill || '#83cbff';
    this.strokeWidth = opts.strokeWidth || 0;
    this.stroke = opts.stroke || 'grey';

    this.dimensions = this.calcDimensions();
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

export default Line;