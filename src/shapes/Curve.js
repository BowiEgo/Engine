import Line from './Line';

class Curve extends Line {
  constructor (opts) {
    super(opts);
    this.type = 'curve';
  }

  move (dx, dy) {
  }
}

export default Curve;