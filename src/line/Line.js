class Line {
  constructor (opts) {
    opts = opts || {};
    this.transform = {
      position: {}
    };
    this.close = !!opts.close;
    this.style = this.style || 'solid';
    this.fill = opts.fill === undefined ? true : !!opts.fill;
    this.fillStyle = opts.fillStyle || '#83cbff';
    this.strokeWidth = opts.strokeWidth || 0;
    this.strokeStyle = opts.stroke || 'grey';
  }

  move (dx, dy) {
  }
}

export default Line;