import Line from './Line';
import Dimensions from '../geometry/Dimensions';

class Arc extends Line {
  constructor (opts) {
    super(opts);
    this.type = 'arc';
  }

  calcDimensions () {
    return new Dimensions(
      0,
      0,
      100,
      20
    );
  }

  move (dx, dy) {
  }
}

export default Arc;