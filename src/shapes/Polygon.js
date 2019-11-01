import Projection from '../geometry/Projection';
import Shape from './Shape';
import Vector from '../geometry/Vector';
import Vertice from '../geometry/Vertice';
import { min, max } from '../utils/Array';

class Polygon extends Shape {
  constructor (points, opts) {
    super(opts);
    this.type = 'polygon';
    this.vertices = points.map(point => new Vertice(point[0], point[1]));
    this.dimensions = this.calcDimensions();
  }

  getAxes () {
    const { x: posX, y: posY } = this.transform.position;

    let v1 = new Vector(),
      v2 = new Vector(),
      axes = [],
      pointNum = this.vertices.length;

  
    for (let i = 0; i < pointNum - 1; i++) {
      v1.x = this.vertices[i].x + posX;
      v1.y = this.vertices[i].y + posY;

      v2.x = this.vertices[i + 1].x + posX;
      v2.y = this.vertices[i + 1].y + posY;

      axes.push(v1.edge(v2).normal());
    }

    v1.x = this.vertices[pointNum - 1].x + posX;
    v1.y = this.vertices[pointNum - 1].y + posY;

    v2.x = this.vertices[0].x + posX;
    v2.y = this.vertices[0].y + posY;
    
    axes.push(v1.edge(v2).normal());

    return axes;
  }

  project (axis) {
    const { x: posX, y: posY } = this.transform.position;

    let scalars = [],
      v = new Vector();

    this.vertices.forEach(point => {
      v.x = point.x + posX;
      v.y = point.y + posY;
      scalars.push(v.dot(axis));
    })

    return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
  }

  addPoint (x, y) {
    this.vertices.push(new Vertice(x, y));
  }

  calcDimensions () {
    let vertices = this.vertices,
      minX = min(vertices, 'x') || 0,
      minY = min(vertices, 'y') || 0,
      maxX = max(vertices, 'x') || 0,
      maxY = max(vertices, 'y') || 0,
      width = (maxX - minX),
      height = (maxY - minY);

    return {
      left: minX,
      top: minY,
      width: width,
      height: height
    };
  }

  move (dx, dy) {
    for (let i = 0, point; i < this.vertices.length; i++) {
      point = this.vertices[i];
      point.x += dx;
      point.y += dy;
    }
  }
}

export default Polygon;
