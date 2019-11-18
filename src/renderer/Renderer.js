import CanvasRenderer from './CanvasRenderer';

let Renderer = {};

Renderer.create = (game) => {
  let renderer = new CanvasRenderer(game);

  game.el.append(renderer.canvas);

  game.renderer = renderer;
}

export default Renderer;
