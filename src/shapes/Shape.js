import SAT from '../collision/SAT';

class Shape {
  constructor (opts) {
    opts = opts || {};
    this.transform = {
      position: {
        x: 0,
        y: 0
      }
    };
    this.fill = opts.fill || '#83cbff';
    this.stroke = opts.stroke || 'grey';
    this.strokeWidth = opts.strokeWidth || 0;
  }

  collidesWith (otherShape) {
    return SAT.detectCollide(this, otherShape);
  }

  getAxes () {
    throw 'getAxes() not implemented';
  }

  project () {
    throw 'project(axis) not implemented';
  }

  move () {
    throw 'move(dx, dy) note implemented';
  }

  transition () {
    return this;
  }

  translate (dx, dy) {
    this.transform.position.x += dx;
    this.transform.position.y += dy;
    return this;
  }
}

export default Shape
