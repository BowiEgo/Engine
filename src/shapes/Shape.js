import SAT from '../collision/SAT';

class Shape {
  constructor (opts) {
    opts = opts || {};
    this.transform = {
      position: {}
    };
    this.fill = opts.fill === undefined ? true : !!opts.fill;
    this.fillStyle = opts.fillStyle || '#83cbff';
    this.strokeWidth = opts.strokeWidth || 0;
    this.strokeStyle = opts.stroke || 'grey';
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
}

export default Shape
