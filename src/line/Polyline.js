import Line from './Line';
import Vertices from '../geometry/Vertices';

class Polyline extends Line {
  constructor (points, opts) {
    super(opts);
    this.type = 'polyline';
    this.vertices = points.map(point => new Vertices(point[0], point[1]));
  }

  move (dx, dy) {
  }
}

export default Polyline;