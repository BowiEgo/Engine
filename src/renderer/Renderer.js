import CanvasRenderer from './CanvasRenderer';

let Renderer = {};

Renderer.create = (el, opts) => {
  let renderer = new CanvasRenderer(opts);

  el.append(renderer.canvas);

  return renderer;
}

export default Renderer;
