import Canvas from './Canvas';
import { CanvasShapeRenderer, CanvasHitShapeRenderer } from './ShapeRenderer';
import ShapesGroup from '../shapes/ShapesGroup';

export default class CanvasRenderer {
  constructor (app) {
    this.app = app;

    this._canvas = new Canvas(app.opts);
    this._context = this.canvas.getContext('2d');
    this.pixelRatio = this._canvas.pixelRatio;
    this._shapeRenderer = new CanvasShapeRenderer(this._context, this.pixelRatio, this._canvas);

    this._hitCanvas = new Canvas(app.opts);
    this._hitContext = this.hitCanvas.getContext('2d');
    this._hitShapeRenderer = new CanvasHitShapeRenderer(this._hitContext, this.pixelRatio, this._hitCanvas);
  }

  get canvas () {
    return this._canvas.canvas;
  }

  get context () {
    return this._context;
  }

  get hitCanvas () {
    return this._hitCanvas.canvas;
  }

  get hitContext () {
    return this._hitContext;
  }

  render (bodies) {
    const { context, hitContext, pixelRatio, app } = this;
    let vpt = this._canvas.viewportTransform;

    this.renderContext(context, vpt, pixelRatio, bodies);

    // render hit context
    // this.renderContext(hitContext, vpt, pixelRatio, bodies, true);

    app.trigger.fire('rendered', this.context);
  }

  renderContext (context, vpt, pixelRatio, bodies, isHit) {
    context.save();
    context.transform(
      vpt[0] * pixelRatio,
      vpt[1],
      vpt[2],
      vpt[3] * pixelRatio,
      vpt[4],
      vpt[5]
    );
    _renderBodies.call(this, context, bodies, isHit);
    context.restore();
  }

  clear () {
    this._canvas.clear();
    this._hitCanvas && this._hitCanvas.clear();
  }
}

/**
 * Render several types of graphics in canvas
 */
function _renderBodies (context, bodies, isHit) {
  bodies = bodies || [];

  bodies.forEach(body => {
    const transform = body.transform;
    const { scaleX = 1, skewX = 0, skewY = 0, scaleY = 1} = transform;
    const { x: posX, y: posY } = transform.position;

    context.save();
    context.transform(scaleX, skewX, skewY, scaleY, posX, posY);

    if (body.shape instanceof ShapesGroup) {
      body.shape.shapes.forEach(shape => {
        shape.hitFill = body.hitFill;
        _renderShape.call(this, shape, isHit);
        if (!isHit) {
          this.app.trigger.fire('shape_rendered', shape);
        }
      })
    } else {
      body.shape.hitFill = body.hitFill;
      _renderShape.call(this, body.shape, isHit);

      if (!isHit) {
        this.app.trigger.fire('shape_rendered', body.shape);
      }
    }

    context.restore();
  })
}

function _renderShape (shape, isHit) {
  let shapeRenderer;

  if (isHit) {
    shapeRenderer = this._hitShapeRenderer;
  } else {
    shapeRenderer = this._shapeRenderer;
  }

  shapeRenderer.render(shape);
}
