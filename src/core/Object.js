class Object {
  constructor (opts) {
    this.shape = opts.shape;
    this.fill = opts.fill !== undefined ? opts.fill : '#83cbff';
    this.startCb = isFunc(opts.start) ? opts.start : this.start;
    this.updateCb = isFunc(opts.update) ? opts.update : this.update;
    this.transform0 = {
      position: {
        x: opts.transform.position.x || 0,
        y: opts.transform.position.y || 0
      }
    }

    this.reset();
  }

  start () {
  }

  update () {
  }

  reset () {
    this.shape.transform = this.transform = JSON.parse(JSON.stringify(this.transform0));
  }

  render () {
    const { ctx } = this.Scene;
    const { position } = this.transform;
    const rectW = 40;
    const rectH = 40;

    ctx.fillStyle = this.fill;
    ctx.fillRect(position.x, position.y, rectW, rectH);
  }
}

function isFunc (fn) {
  return typeof fn === 'function';
}

export default Object
