import { CanvasRenderer } from '../renderer';

export default class Renderer {
  static create (app) {
    let renderer = new CanvasRenderer(app);

    app.el.append(renderer.canvas);

    app.view = renderer.canvas;

    app._renderer = renderer;
  }
}
