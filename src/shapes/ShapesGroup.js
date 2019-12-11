import { min, max } from '../utils/array';
import Dimensions from '../geometry/Dimensions';

export default class ShapesGroup {
  constructor (shapes) {
    this.shapes = shapes;
    this.dimensions = this.calcDimensions();
  }

  calcDimensions () {
    let shapes = this.shapes,
        minX = min(shapes, 'dimensions.left') || 0,
        minY = min(shapes, 'dimensions.top') || 0,
        maxX = max(shapes, 'dimensions.right') || 0,
        maxY = max(shapes, 'dimensions.bottom') || 0,
        width = maxX - minX,
        height = maxY - minY

    return new Dimensions(minX, minY, width, height);
  }

  collidesWith (otherShape) {
    // return SAT.detectCollide(this, otherShape);
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
