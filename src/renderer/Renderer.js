import CanvasRenderer from './CanvasRenderer';

let Renderer = {};

Renderer.create = (game, opts) => {
  let renderer = new CanvasRenderer(game, opts);

  game.el.append(renderer.canvas);

  return renderer;
}

export default Renderer;
