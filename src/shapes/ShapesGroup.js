import { min, max } from '../utils/Array';

export default class ShapesGroup {
  constructor (shapes) {
    this.shapes = shapes;
    this.dimensions = this.calcDimensions();
  }

  calcDimensions () {
    let shapes = this.shapes,
      minX = min(shapes, 'dimensions.left') || 0,
      minY = min(shapes, 'dimensions.top') || 0,
      maxX = max(shapes, 'dimensions.left') || 0,
      maxY = max(shapes, 'dimensions.top') || 0,
      width = max(shapes, 'dimensions.width'),
      height = max(shapes, 'dimensions.height');

    return {
      left: minX,
      top: minY,
      width: width,
      height: height
    };
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
