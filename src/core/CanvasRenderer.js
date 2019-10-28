let CanvasRenderer = {
  canvas: _createCanvas()
};

CanvasRenderer.context = CanvasRenderer.canvas.getContext('2d');

CanvasRenderer.init = function (opts) {
  const { width = 300, height = 300, bgColor = 'aliceblue' } = opts;
  let { canvas, context } = CanvasRenderer;
  let pixelRatio = canvas.getPixelRatio();
  context.scale(pixelRatio, pixelRatio);

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.style.backgroundColor = bgColor;
}

CanvasRenderer.clear = function () {
  CanvasRenderer.context.clearRect(0, 0, CanvasRenderer.canvas.width, CanvasRenderer.canvas.height);
}

function _createCanvas () {
  let canvas = document.createElement('canvas');
  canvas.getPixelRatio = _getPixelRatio.bind(null, canvas);
  canvas.renderPolygon = _renderPolygon;
  canvas.renderRectangle = _renderRectangle;
  canvas.renderPolyline = _renderPolyline;
  canvas.renderCircle = _renderCircle;
  canvas.renderText = _renderText;
  return canvas;
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

function _renderPolygon (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.beginPath();
  context.moveTo(shape.vertices[0].x + posX, shape.vertices[0].y + posY);
  for (let i = 1; i < shape.vertices.length; i++) {
    context.lineTo(shape.vertices[i].x + posX, shape.vertices[i].y + posY);
  }
  context.closePath();

  _draw(context, shape);
}

function _renderRectangle (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.beginPath();
  context.rect(posX, posY, shape.width, shape.height);
  context.closePath();

  _draw(context, shape);
}

function _renderCircle (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.beginPath();
  context.arc(posX, posY, shape.radius, 0, Math.PI * 2, false);
  context.closePath();

  _draw(context, shape);
}

function _renderText (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.font = shape.font;
  context.fillStyle = shape.fillStyle;
  context.strokeStyle = shape.strokeStyle;
  shape.fill && context.fillText(shape.text, posX, posY);
  shape.strokeWidth > 0 && context.strokeText(shape.text, posX, posY);
}

function _renderPolyline (context, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  context.beginPath();
  context.moveTo(shape.vertices[0].x + posX, shape.vertices[0].y + posY);
  for (let i = 1; i < shape.vertices.length; i++) {
    context.lineTo(shape.vertices[i].x + posX, shape.vertices[i].y + posY);
  }
  shape.close && context.closePath();

  _drawLine(context, shape);
}

function _draw (context, shape) {
  context.lineWidth = shape.strokeWidth;
  context.strokeStyle = shape.strokeStyle;
  context.fillStyle = shape.fillStyle;
  shape.strokeWidth > 0 && context.stroke();
  shape.fill && context.fill();
}

function _drawLine (context, shape) {
  context.lineWidth = shape.strokeWidth;
  context.strokeStyle = shape.strokeStyle;
  context.stroke();
}

export default CanvasRenderer;
