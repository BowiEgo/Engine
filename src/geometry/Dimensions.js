class Dimensions {
  constructor (left, top, width, height) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }

  get right () {
    return this.left + this.width;
  }

  get bottom () {
    return this.top + this.height;
  }
}

export default Dimensions
