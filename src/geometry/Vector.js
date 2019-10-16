class Vector {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  magnitude () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  add (vector) {
    let v = new Vector();
    v.x = this.x + vector.x;
    v.y = this.y + vector.y;
    return v;
  }

  /**
   * Subtracts another vector.
   * @method sub
   * @param {vector} vector
   * @return {vector} A new vector of two vector subtracted
   */
  sub (vector) {
    let v = new Vector();
    v.x = this.x - vector.x;
    v.y = this.y - vector.y;
    return v;
  }

  dot (vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  edge (vector) {
    return this.sub(vector);
  }

  /**
   * Returns the perpendicular vector. Set `negate` to true for the perpendicular in the opposite direction.
   * @method perp
   * @param {vector} vector
   * @param {bool} [negate=false]
   * @return {vector} The perpendicular vector
   */
  perp (negate) {
    negate = negate === true ? -1 : 1;
    let v = new Vector();
    v.x = negate * -this.y;
    v.y = negate * this.x;
    return v;
  }

  normalize () {
    let v = new Vector(0, 0), m = this.magnitude();

    if (m !== 0) {
      v.x = this.x / m;
      v.y = this.y / m;
    }
    return v;
  }

  normal () {
    let p = this.perp();
    return p.normalize();
  }
}

export default Vector