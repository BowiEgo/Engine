import Events from './Events';

let Render = {};

Render.create = (game, el, opts) => {
  let render = {
    el: el,
    game: game
  };

  const { width = 300, height = 300, bgColor = 'aliceblue' } = opts;

  render.width = width;
  render.height = height;
  render.canvas = document.createElement('canvas');

  let pixelRatio = opts.pixelRatio || _getPixelRatio(render.canvas);
  render.canvas.setAttribute('data-pixel-ratio', pixelRatio);

  render.canvas.width = width * pixelRatio;
  render.canvas.height = height * pixelRatio;
  render.canvas.style.width = width + 'px';
  render.canvas.style.height = height + 'px';
  render.canvas.style.backgroundColor = bgColor;
  render.el.append(render.canvas);

  render.context = render.canvas.getContext('2d');
  render.context.scale(pixelRatio, pixelRatio);

  render.clear = () => {
    const { camera } = render.game;

    render.context.clearRect(-camera.position.x, -camera.position.y, render.canvas.width, render.canvas.height);
  }

  render.render = () => {
    const { objectArray } = render.game.scene;

    objectArray.forEach(object => {
      const shapeType = object.shape.type;

      switch (shapeType) {
        case 'polygon':
          renderPolygon(render.context, object.shape);
          break;
        case 'rectangle':
          renderRectangle(render.context, object.shape);
          break;
        case 'circle':
          renderCircle(render.context, object.shape);
          break;
        case 'text':
          renderText(render.context, object.shape);
          break;
        case 'polyline':
          renderPolyline(render.context, object.shape);
        default:
          break;
      }
    })

    Events.trigger(render.game, 'tick');
  }

  return render
}

/**
 * Gets the pixel ratio of the canvas.
 * @method _getPixelRatio
 * @private
 * @param {HTMLElement} canvas
 * @return {Number} pixel ratio
 */
function _getPixelRatio (canvas) {
  var context = canvas.getContext('2d'),
    devicePixelRatio = window.devicePixelRatio || 1,
    backingStorePixelRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;

  return devicePixelRatio / backingStorePixelRatio;
}

function renderPolygon (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.beginPath();
  context.moveTo(shape.vertices[0].x + posX, shape.vertices[0].y + posY);
  for (let i = 1; i < shape.vertices.length; i++) {
    context.lineTo(shape.vertices[i].x + posX, shape.vertices[i].y + posY);
  }
  context.closePath();

  draw(context, shape);
}

function renderRectangle (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.beginPath();
  context.rect(posX, posY, shape.width, shape.height);
  context.closePath();

  draw(context, shape);
}

function renderCircle (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.beginPath();
  context.arc(posX, posY, shape.radius, 0, Math.PI * 2, false);
  context.closePath();

  draw(context, shape);
}

function renderText (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.font = shape.font;
  context.fillStyle = shape.fillStyle;
  context.strokeStyle = shape.strokeStyle;
  shape.fill && context.fillText(shape.text, posX, posY);
  shape.strokeWidth > 0 && context.strokeText(shape.text, posX, posY);
}

function renderPolyline (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.beginPath();
  context.moveTo(shape.vertices[0].x + posX, shape.vertices[0].y + posY);
  for (let i = 1; i < shape.vertices.length; i++) {
    context.lineTo(shape.vertices[i].x + posX, shape.vertices[i].y + posY);
  }
  shape.close && context.closePath();

  drawLine(context, shape);
}

function draw (context, shape) {
  context.lineWidth = shape.strokeWidth;
  context.strokeStyle = shape.strokeStyle;
  context.fillStyle = shape.fillStyle;
  shape.strokeWidth > 0 && context.stroke();
  shape.fill && context.fill();
}

function drawLine (context, shape) {
  context.lineWidth = shape.strokeWidth;
  context.strokeStyle = shape.strokeStyle;
  context.stroke();
}

export default Render;
