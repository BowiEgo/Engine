class Projection {
  constructor (min, max) {
    if (min > max) {
      throw 'min value should less than max value';
    }
    this.min = min;
    this.max = max;
  }

  overlaps (projection) {
    // return this.max > projection.min && projection.max > this.min;
  }
}

export default Projection
