import Line from './Line';
import Vertice from '../geometry/Vertice';

class Polyline extends Line {
  constructor(points, opts) {
    super(opts);
    this.type = 'polyline';
    this.vertices = points.map((point) => new Vertice(point[0], point[1]));
  }

  move(dx, dy) {}
}

export default Polyline;
