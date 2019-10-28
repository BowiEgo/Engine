import Events from './Events';
import CanvasRenderer from './CanvasRenderer';

let Render = {};

Render.create = (game, el, opts) => {
  let renderer = {
    el: el,
    game: game
  };

  CanvasRenderer.init(opts);
  renderer.el.append(CanvasRenderer.canvas);

  renderer.clear = _clear.bind(null);
  renderer.render = _render.bind(null, renderer);

  return renderer
}

function _clear () {
  CanvasRenderer.clear();
}

function _render (renderer) {
  const { objectArray } = renderer.game.scene;
  const { canvas, context } = CanvasRenderer;

  objectArray.forEach(object => {
    const shapeType = object.shape.type;

    switch (shapeType) {
      case 'polygon':
        canvas.renderPolygon(context, object.shape);
        break;
      case 'rectangle':
        canvas.renderRectangle(context, object.shape);
        break;
      case 'circle':
        canvas.renderCircle(context, object.shape);
        break;
      case 'text':
        canvas.renderText(context, object.shape);
        break;
      case 'polyline':
        canvas.renderPolyline(context, object.shape);
        break;
      default:
        break;
    }
  })

  Events.trigger(renderer.game, 'tick');
}

export default Render;
