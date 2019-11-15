import { TEXT_GRADIENT } from '../../shapes/Text/const';
import { arcToSegments } from '../../utils/arc';

export default class CanvasShapeRenderer {
  constructor (context, pixelRatio, canvasRenderer) {
    this.context = context;
    this.pixelRatio = pixelRatio;
    this.canvasRenderer = canvasRenderer;
  }

  render (shape) {
    const { context, pixelRatio, canvasRenderer } = this;

    if (shape.type === 'text') {
      _drawText(context, shape, pixelRatio, canvasRenderer);
      return;
    }

    switch (shape.type) {
      case 'path':
        _execPathCommands(context, shape);
        break;
      case 'polygon':
        _pathPolygon(context, shape);
        break;
      case 'polyline':
        _pathPolyline(context, shape);
        break;
      case 'rectangle':
        _pathRectangle(context, shape);
        break;
      case 'circle':
        _pathCircle(context, shape);
        break;
      default:
        break;
    }

    _setStrokeStyles(context, shape);
    _setFillStyles(context, shape);
    _setDropShadowStyles(context, shape);
    shape.strokeWidth > 0 && _renderStroke(context, shape);
    shape.fill && _renderFill(context, shape);
  }
}

function _setStrokeStyles (context, shape) {
  if (shape.stroke) {
    context.lineWidth = shape.strokeWidth;
    context.lineCap = shape.strokeLineCap;
    context.lineDashOffset = shape.strokeDashOffset;
    context.lineJoin = shape.strokeLineJoin;
    context.miterLimit = shape.strokeMiterLimit;
    context.strokeStyle = shape.stroke;
  }
}

function _setFillStyles (context, shape) {
  if (shape.fill) {
    context.fillStyle = shape.fill;
  }
}

function _renderStroke (context, shape) {
  if (!shape.stroke || shape.strokeWidth === 0) {
    return;
  }
  // _setLineDash(this.context, this.strokeDashArray, this._renderDashedStroke);
  context.save();
  context.stroke();
  context.restore();
}

function _renderFill (context) {
  context.save();
  context.fill();
  context.restore();
}

function _setDropShadowStyles (context, shape) {
  if (shape.dropShadow) {
    context.shadowColor = shape.dropShadowColor;
    context.shadowBlur = shape.dropShadowBlur;
    context.shadowOffsetX = Math.cos(shape.dropShadowAngle) * shape.dropShadowDistance * canvasRenderer.getZoom();
    context.shadowOffsetY = (Math.sin(shape.dropShadowAngle) * shape.dropShadowDistance) * canvasRenderer.getZoom();
  } else {
    context.shadowColor = 'black';
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
  }
}

function _pathPolygon(context, shape) {
  let points = shape.vertices,
    point;
  let len = points.length;

  if (!len || len === 0 || isNaN(points[len - 1].y)) {
    return false;
  }

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < len; i++) {
    point = points[i];
    context.lineTo(point.x, point.y);
  }
  context.closePath();
}

function _pathPolyline(context, shape) {
  context.beginPath();
  context.closePath();
}

function _pathRectangle(context, shape) {
  let rx = shape.rx ? Math.min(shape.rx, shape.width / 2) : 0,
    ry = shape.ry ? Math.min(shape.ry, shape.height / 2) : 0,
    w = shape.width,
    h = shape.height,
    isRounded = rx !== 0 || ry !== 0,
    /* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */
    k = 1 - 0.5522847498;

  context.beginPath();
  context.moveTo(rx, 0);

  context.lineTo(w - rx, 0);
  isRounded && context.bezierCurveTo(w - k * rx, 0, w, k * ry, w, ry);

  context.lineTo(w, h - ry);
  isRounded && context.bezierCurveTo(w, h - k * ry, w - k * rx, h, w - rx, h);

  context.lineTo(rx, h);
  isRounded && context.bezierCurveTo(k * rx, h, 0, h - k * ry, 0, h - ry);

  context.lineTo(0, ry);
  isRounded && context.bezierCurveTo(0, k * ry, k * rx, 0, rx, 0);

  context.closePath();
}

function _pathCircle(context, shape) {
  context.beginPath();
  context.arc(0, 0, shape.radius, 0, 2 * Math.PI);
  context.closePath();
}

function _execPathCommands(context, shape) {
  const { path } = shape;
  let current,
    previous,
    subpathStartX = 0,
    subpathStartY = 0,
    x = 0,
    y = 0,
    controlX = 0,
    controlY = 0,
    tempX,
    tempY

  context.beginPath();

  for (let i = 0, len = path.length; i < len; i++) {
    current = path[i];

    switch (current[0]) {
      case 'l': // lineTo, relative
        x += current[1];
        y += current[2];
        context.lineTo(x, y);
        break;
      case 'L': // lineTo, absolute
        x = current[1];
        y = current[2];
        context.lineTo(x, y);
        break;
      case 'h': // horizontal lineTo, relative
        x += current[1];
        context.lineTo(x, y);
        break;
      case 'H': // horizontal lineTo, absolute
        x = current[1];
        context.lineTo(x, y);
        break;
      case 'v': // vertical lineTo, relative
        y += current[1];
        context.lineTo(x, y);
        break;
      case 'V': // verical lineTo, absolute
        y = current[1];
        context.lineTo(x, y);
        break;
      case 'm': // moveTo, relative
        x += current[1];
        y += current[2];
        subpathStartX = x;
        subpathStartY = y;
        context.moveTo(x, y);
        break;
      case 'M': // moveTo, absolute
        x = current[1];
        y = current[2];
        subpathStartX = x;
        subpathStartY = y;
        context.moveTo(x, y);
        break;
      case 'c': // bezierCurveTo, relative
        tempX = x + current[5];
        tempY = y + current[6];
        controlX = x + current[3];
        controlY = y + current[4];
        context.bezierCurveTo(
          x + current[1], // x1
          y + current[2], // y1
          controlX, // x2
          controlY, // y2
          tempX,
          tempY
        )
        x = tempX;
        y = tempY;
        break;
      case 'C': // bezierCurveTo, absolute
        x = current[5];
        y = current[6];
        controlX = current[3];
        controlY = current[4];
        context.bezierCurveTo(
          current[1],
          current[2],
          controlX,
          controlY,
          x,
          y
        );
        break;
      case 's': // shorthand cubic bezierCurveTo, relative
        // transform to absolute x,y
        tempX = x + current[3];
        tempY = y + current[4];
        if (previous[0].match(/[CcSs]/) === null) {
          // If there is no previous command or if the previous command was not a C, c, S, or s,
          // the control point is coincident with the current point
          controlX = x;
          controlY = y;
        }
        else {
          // calculate reflection of previous control points
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        }
        context.bezierCurveTo(
          controlX,
          controlY,
          x + current[1],
          y + current[2],
          tempX,
          tempY
        );
        // set control point to 2nd one of this command
        // "... the first control point is assumed to be
        // the reflection of the second control point on
        // the previous command relative to the current point."
        controlX = x + current[1];
        controlY = y + current[2];

        x = tempX;
        y = tempY;
        break;
      case 'S': // shorthand cubic bezierCurveTo, absolute
        tempX = current[3];
        tempY = current[4];
        if (previous[0].match(/[CcSs]/) === null) {
          // If there is no previous command or if the previous command was not a C, c, S, or s,
          // the control point is coincident with the current point
          controlX = x;
          controlY = y;
        }
        else {
          // calculate reflection of previous control points
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        }
        context.bezierCurveTo(
          controlX,
          controlY,
          current[1],
          current[2],
          tempX,
          tempY
        );
        x = tempX;
        y = tempY;

        // set control point to 2nd one of this command
        // "... the first control point is assumed to be
        // the reflection of the second control point on
        // the previous command relative to the current point."
        controlX = current[1];
        controlY = current[2];
        break;
      case 'q': // quadraticCurveTo, relative
        // transform to absolute x,y
        tempX = x + current[3];
        tempY = y + current[4];

        controlX = x + current[1];
        controlY = y + current[2];

        context.quadraticCurveTo(
          controlX,
          controlY,
          tempX,
          tempY
        );
        x = tempX;
        y = tempY;
        break;
      case 'Q': // quadraticCurveTo, absolute
        tempX = current[3];
        tempY = current[4];

        context.quadraticCurveTo(
          current[1],
          current[2],
          tempX,
          tempY
        );
        x = tempX;
        y = tempY;
        controlX = current[1];
        controlY = current[2];
        break;
      case 't': // shorthand quadraticCurveTo, relative
        // transform to absolute x,y
        tempX = x + current[1];
        tempY = y + current[2];

        if (previous[0].match(/[QqTt]/) === null) {
          // If there is no previous command or if the previous command was not a Q, q, T or t,
          // assume the control point is coincident with the current point
          controlX = x;
          controlY = y;
        }
        else {
          // calculate reflection of previous control point
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        }

        context.quadraticCurveTo(
          controlX,
          controlY,
          tempX,
          tempY
        );
        x = tempX;
        y = tempY;
        break;
      case 'T': // shorthand quadraticCurveTo, absolute
        tempX = current[1];
        tempY = current[2];

        if (previous[0].match(/[QqTt]/) === null) {
          // If there is no previous command or if the previous command was not a Q, q, T or t,
          // assume the control point is coincident with the current point
          controlX = x;
          controlY = y;
        }
        else {
          // calculate reflection of previous control point
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        }
        context.quadraticCurveTo(
          controlX,
          controlY,
          tempX,
          tempY
        );
        x = tempX;
        y = tempY;
        break;
      case 'a': // arc, relative
        _drawArc(context, x, y, [
          current[1],
          current[2],
          current[3],
          current[4],
          current[5],
          current[6] + x,
          current[7] + y
        ]);
        x += current[6];
        y += current[7];
        break;
      case 'A': // arc, absolute
        _drawArc(context, x, y, [
          current[1],
          current[2],
          current[3],
          current[4],
          current[5],
          current[6],
          current[7]
        ]);
        x = current[6];
        y = current[7];
        break;
      case 'z':
      case 'Z':
        x = subpathStartX;
        y = subpathStartY;
        context.closePath();
        break;
    }
    previous = current;
  }
}

function _drawArc (context, fx, fy, coords) {
  var rx = coords[0],
      ry = coords[1],
      rot = coords[2],
      large = coords[3],
      sweep = coords[4],
      tx = coords[5],
      ty = coords[6],
      segs = [[], [], [], []],
      segsNorm = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);

  for (var i = 0, len = segsNorm.length; i < len; i++) {
    segs[i][0] = segsNorm[i][0] + fx;
    segs[i][1] = segsNorm[i][1] + fy;
    segs[i][2] = segsNorm[i][2] + fx;
    segs[i][3] = segsNorm[i][3] + fy;
    segs[i][4] = segsNorm[i][4] + fx;
    segs[i][5] = segsNorm[i][5] + fy;
    context.bezierCurveTo.apply(context, segs[i]);
  }
}

function _drawText (context, shape, pixelRatio, canvasRenderer) {
  context.beginPath();

  shape.updateText();

  const { measured, style } = shape;
  const width = measured.width;
  const height = measured.height;
  const lines = measured.lines;
  const lineHeight = measured.lineHeight;
  const lineWidths = measured.lineWidths;
  const maxLineWidth = measured.maxLineWidth;
  const fontProperties = measured.fontProperties;

  context.font = shape._font;
  context.lineWidth = style.strokeThickness;
  context.textBaseline = style.textBaseline;
  context.lineJoin = style.lineJoin;
  context.miterLimit = style.miterLimit;

  let linePositionX;
  let linePositionY;

  context.fillStyle = _generateFillStyle(style, lines, width, height);
  context.strokeStyle = style.stroke;

  if (style.dropShadow) {
    context.shadowColor = style.dropShadowColor;
    context.shadowBlur = style.dropShadowBlur;
    context.shadowOffsetX = Math.cos(style.dropShadowAngle) * style.dropShadowDistance * canvasRenderer.getZoom();
    context.shadowOffsetY = (Math.sin(style.dropShadowAngle) * style.dropShadowDistance) * canvasRenderer.getZoom();
  }

  for (let i = 0; i < lines.length; i++) {
    linePositionX = style.strokeThickness / 2;
    linePositionY = ((style.strokeThickness / 2) + (i * lineHeight)) + fontProperties.ascent;

    if (style.align === 'right') {
      linePositionX += maxLineWidth - lineWidths[i];
    } else if (style.align === 'center') {
      linePositionX += (maxLineWidth - lineWidths[i]) / 2;
    }

    if (style.stroke && style.strokeThickness) {
      _drawLetterSpacing(
        context,
        lines[i],
        style,
        linePositionX + style.padding,
        linePositionY + style.padding,
        true
      );
    }

    if (style.fill) {
      _drawLetterSpacing(
        context,
        lines[i],
        style,
        linePositionX + style.padding,
        linePositionY + style.padding
      );
    }
  }

  context.closePath();
}

function _generateFillStyle (style, lines, width, height) {
  if (!Array.isArray(style.fill)) {
    return style.fill;
  } else if (style.fill.length === 1) {
    return style.fill[0];
  }

  // the gradient will be evenly spaced out according to how large the array is.
  // ['#FF0000', '#00FF00', '#0000FF'] would created stops at 0.25, 0.5 and 0.75
  let gradient;
  let totalIterations;
  let currentIteration;
  let stop;

  // make a copy of the style settings, so we can manipulate them later
  const fill = style.fill.slice();
  const fillGradientStops = style.fillGradientStops.slice();

  // wanting to evenly distribute the fills. So an array of 4 colours should give fills of 0.25, 0.5 and 0.75
  if (!fillGradientStops.length) {
    const lengthPlus1 = fill.length + 1;

    for (let i = 1; i < lengthPlus1; ++i) {
      fillGradientStops.push(i / lengthPlus1);
    }
  }

  // stop the bleeding of the last gradient on the line above to the top gradient of the this line
  // by hard defining the first gradient colour at point 0, and last gradient colour at point 1
  fill.unshift(style.fill[0]);
  fillGradientStops.unshift(0);

  fill.push(style.fill[style.fill.length - 1]);
  fillGradientStops.push(1);

  if (style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL) {
    // start the gradient at the top center of the canvas, and end at the bottom middle of the canvas
    gradient = this.context.createLinearGradient(width / 2, 0, width / 2, height);

    // we need to repeat the gradient so that each individual line of text has the same vertical gradient effect
    // ['#FF0000', '#00FF00', '#0000FF'] over 2 lines would create stops at 0.125, 0.25, 0.375, 0.625, 0.75, 0.875
    totalIterations = (fill.length + 1) * lines.length;
    currentIteration = 0;
    for (let i = 0; i < lines.length; i++) {
      currentIteration += 1;
      for (let j = 0; j < fill.length; j++) {
        if (typeof fillGradientStops[j] === 'number') {
          stop = (fillGradientStops[j] / lines.length) + (i / lines.length);
        } else {
          stop = currentIteration / totalIterations;
        }
        gradient.addColorStop(stop, fill[j]);
        currentIteration++;
      }
    }
  } else {
    // start the gradient at the center left of the canvas, and end at the center right of the canvas
    gradient = this.context.createLinearGradient(0, height / 2, width, height / 2);

    // can just evenly space out the gradients in this case, as multiple lines makes no difference
    // to an even left to right gradient
    totalIterations = fill.length + 1;
    currentIteration = 1;

    for (let i = 0; i < fill.length; i++) {
      if (typeof fillGradientStops[i] === 'number') {
        stop = fillGradientStops[i];
      } else {
        stop = currentIteration / totalIterations;
      }
      gradient.addColorStop(stop, fill[i]);
      currentIteration++;
    }
  }

  return gradient;
}

function _drawLetterSpacing (context, text, style, x, y, isStroke = false) {
  // letterSpacing of 0 means normal
  const letterSpacing = style.letterSpacing;

  if (letterSpacing === 0) {
    if (isStroke) {
      context.strokeText(text, x, y);
    } else {
      context.fillText(text, x, y);
    }

    return;
  }

  let currentPosition = x;

  // Using Array.from correctly splits characters whilst keeping emoji together.
  // This is not supported on IE as it requires ES6, so regular text splitting occurs.
  // This also doesn't account for emoji that are multiple emoji put together to make something else.
  // Handling all of this would require a big library itself.
  // https://medium.com/@giltayar/iterating-over-emoji-characters-the-es6-way-f06e4589516
  // https://github.com/orling/grapheme-splitter
  const stringArray = Array.from ? Array.from(text) : text.split('');
  let previousWidth = context.measureText(text).width;
  let currentWidth = 0;

  for (let i = 0; i < stringArray.length; ++i) {
    const currentChar = stringArray[i];

    if (isStroke) {
      context.strokeText(currentChar, currentPosition, y);
    } else {
      context.fillText(currentChar, currentPosition, y);
    }
    currentWidth = context.measureText(text.substring(i + 1)).width;
    currentPosition += previousWidth - currentWidth + letterSpacing;
    previousWidth = currentWidth;
  }
}
