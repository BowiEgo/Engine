export default class TargetFinder {
  constructor (app) {
    this.app = app;

    this._bodies = this.app.scene.bodies;

    console.log(this)
    TargetFinder.bindMouseEvents(this);
  }

  static create (app) {
    app._targetFinder = new TargetFinder(app);
  }

  static bindMouseEvents (targetFinder) {
    targetFinder.app.mouse.on('mousedown', mouse => {
      targetFinder.findTarget(mouse.position);
    });
  }

  findTarget (pointer) {
    console.log('findTarget', pointer);

    for (let i = 0, len = this._bodies.length; i< len; i++) {
      let body = this._bodies[i];

      if (body.containsPoint(pointer)) {
        console.log(body);
        return body;
      }
    }

    return [];
  }
}
