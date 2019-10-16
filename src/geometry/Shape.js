import SAT from '../collision/SAT';

class Shape {
  constructor () {
    this.transform = {
      position: {}
    };
  }

  collidesWith (otherShape) {
    return SAT.detectCollide(this, otherShape);
  }

  getAxes () {
    throw 'getAxes() not implemented';
  }

  project (axis) {
    throw 'project(axis) not implemented';
  }

  move (dx, dy) {
    throw 'move(dx, dy) note implemented';
  }
}

export default Shape
