import Line from './Line';

class Arc extends Line {
  constructor (opts) {
    super(opts);
    this.type = 'arc';
  }

  move (dx, dy) {
  }
}

export default Arc;