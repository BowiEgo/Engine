export default class Scene {
  constructor (app) {
    this.app = app;
    this.bodies = [];
  }

  static create (app) {
    app._scene = new Scene(app);
  }

  addBody (body) {
    this.bodies.push(body);
    this.app.renderer.render([body]);
  }

  reset () {
    this.bodies.forEach(body => {
      body.reset();
    })
  }

  update () {
    this.bodies.forEach((body) => {
      if (this.app.status === 'playing') {
        body.updateCb.call(body);
      }
    })
  }
}
