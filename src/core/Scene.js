export default class Scene {
  constructor (game) {
    this.game = game;
    this.bodies = [];
  }

  static create (game) {
    game.scene = new Scene(game);
  }

  addBody (body) {
    this.bodies.push(body);
    this.game.renderer.render([body]);
  }

  reset () {
    this.bodies.forEach(body => {
      body.reset();
    })
  }

  update () {
    this.bodies.forEach((body) => {
      if (this.game.status === 'playing') {
        body.updateCb.call(body);
      }
    })
  }
}
