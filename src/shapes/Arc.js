import Line from './Line';

class Arc extends Line {
  constructor (opts) {
    super(opts);
    this.type = 'arc';
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

export default Arc;