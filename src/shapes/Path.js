import Shape from './Shape';

class Path extends Shape {
  constructor (path, opts) {
    super(opts);
    this.path = path;
    this.width = 0;
    this.height = 0;
    this.dimensions = this.calcDimensions();
    console.log('new Path', this);
  }

  calcDimensions () {
    return {
      left: 0,
      top: 0,
      width: this.width,
      height: this.height
    };
  }
}

export default Path
