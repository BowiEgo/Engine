export default class Select {
  constructor (game) {
    this.game = game;
  }

  static create (game) {
    game.select = new Select(game);
  }

}
