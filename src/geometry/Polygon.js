import Point from './Vertices';
import Projection from './Projection';
import Shape from './Shape';
import Vector from './Vector';

class Polygon extends Shape {
  constructor (vertices) {
    super(vertices);
    this.type = 'polygon';
    this.vertices = vertices;
    this.strokeStyle = 'blue';
    this.fillStyle = 'white';
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
    this.vertices.push(new Point(x, y));
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
