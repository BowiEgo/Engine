export function initCanvas (opts) {
  let canvas = _createCanvas(opts);

  return canvas;
}

function _createCanvas (opts) {
  const { width = 300, height = 300, bgColor = 'aliceblue' } = opts;
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.style.backgroundColor = bgColor;

  let pixelRatio = opts.pixelRatio || _getPixelRatio(canvas);
  canvas.setAttribute('data-pixel-ratio', pixelRatio);
  context.scale(pixelRatio, pixelRatio);

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
