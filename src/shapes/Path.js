import Shape from './Shape';
import Dimensions from '../geometry/Dimensions';
import { min, max } from '../utils/array';
import { getBoundsOfCurve, getBoundsOfArc } from '../utils/arc';

const commandLengths = {
  m: 2,
  l: 2,
  h: 1,
  v: 1,
  c: 6,
  s: 4,
  q: 4,
  t: 2,
  a: 7
}, repeatedCommands = {
  m: 'l',
  M: 'L'
};

class Path extends Shape {
  constructor (path, opts) {
    super(opts);
    this.type = 'path';
    this.path = path.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);
    this.path = Path.parsePath(this.path);
    this.width = 0;
    this.height = 0;
    this.fill = opts.fill;
    this.dimensions = this.calcDimensions();
    // console.log('new Path', this);
  }

  static parsePath (path) {
    let result = [],
        coords = [],
        currentPath,
        parsed,
        re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/ig,
        match,
        coordsStr;

    for (let i = 0, coordsParsed, len = path.length; i < len; i++) {
      currentPath = path[i];

      coordsStr = currentPath.slice(1).trim();
      coords.length = 0;

      while ((match = re.exec(coordsStr))) {
        coords.push(match[0]);
      }

      coordsParsed = [currentPath.charAt(0)];

      for (let j = 0, jlen = coords.length; j < jlen; j++) {
        parsed = parseFloat(coords[j]);
        if (!isNaN(parsed)) {
          coordsParsed.push(parsed);
        }
      }

      let command = coordsParsed[0],
          commandLength = commandLengths[command.toLowerCase()],
          repeatedCommand = repeatedCommands[command] || command;

      if (coordsParsed.length - 1 > commandLength) {
        for (let k = 1, klen = coordsParsed.length; k < klen; k += commandLength) {
          result.push([command].concat(coordsParsed.slice(k, k + commandLength)));
          command = repeatedCommand;
        }
      }
      else {
        result.push(coordsParsed);
      }
    }

    return result;
  }

  update (path) {
    this.path = path.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);
    this.path = Path.parsePath(this.path);
    return this;
  }

  calcDimensions () {
    let aX = [],
        aY = [],
        current, // current instruction
        previous = null,
        subpathStartX = 0,
        subpathStartY = 0,
        x = 0, // current x
        y = 0, // current y
        controlX = 0, // current control point x
        controlY = 0, // current control point y
        tempX,
        tempY,
        bounds;

    for (let i = 0, len = this.path.length; i < len; ++i) {
      current = this.path[i];

      switch (current[0]) { // first letter

        case 'l': // lineto, relative
          x += current[1];
          y += current[2];
          bounds = [];
          break;

        case 'L': // lineto, absolute
          x = current[1];
          y = current[2];
          bounds = [];
          break;

        case 'h': // horizontal lineto, relative
          x += current[1];
          bounds = [];
          break;

        case 'H': // horizontal lineto, absolute
          x = current[1];
          bounds = [];
          break;

        case 'v': // vertical lineto, relative
          y += current[1];
          bounds = [];
          break;

        case 'V': // verical lineto, absolute
          y = current[1];
          bounds = [];
          break;

        case 'm': // moveTo, relative
          x += current[1];
          y += current[2];
          subpathStartX = x;
          subpathStartY = y;
          bounds = [];
          break;

        case 'M': // moveTo, absolute
          x = current[1];
          y = current[2];
          subpathStartX = x;
          subpathStartY = y;
          bounds = [];
          break;

        case 'c': // bezierCurveTo, relative
          tempX = x + current[5];
          tempY = y + current[6];
          controlX = x + current[3];
          controlY = y + current[4];
          bounds = getBoundsOfCurve(x, y,
            x + current[1], // x1
            y + current[2], // y1
            controlX, // x2
            controlY, // y2
            tempX,
            tempY
          );
          x = tempX;
          y = tempY;
          break;

        case 'C': // bezierCurveTo, absolute
          controlX = current[3];
          controlY = current[4];
          bounds = getBoundsOfCurve(x, y,
            current[1],
            current[2],
            controlX,
            controlY,
            current[5],
            current[6]
          );
          x = current[5];
          y = current[6];
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

          bounds = getBoundsOfCurve(x, y,
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
          bounds = getBoundsOfCurve(x, y,
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
          bounds = getBoundsOfCurve(x, y,
            controlX,
            controlY,
            controlX,
            controlY,
            tempX,
            tempY
          );
          x = tempX;
          y = tempY;
          break;

        case 'Q': // quadraticCurveTo, absolute
          controlX = current[1];
          controlY = current[2];
          bounds = getBoundsOfCurve(x, y,
            controlX,
            controlY,
            controlX,
            controlY,
            current[3],
            current[4]
          );
          x = current[3];
          y = current[4];
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

          bounds = getBoundsOfCurve(x, y,
            controlX,
            controlY,
            controlX,
            controlY,
            tempX,
            tempY
          );
          x = tempX;
          y = tempY;

          break;

        case 'T':
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
          bounds = getBoundsOfCurve(x, y,
            controlX,
            controlY,
            controlX,
            controlY,
            tempX,
            tempY
          );
          x = tempX;
          y = tempY;
          break;

        case 'a':
          // TODO: optimize this
          bounds = getBoundsOfArc(x, y,
            current[1],
            current[2],
            current[3],
            current[4],
            current[5],
            current[6] + x,
            current[7] + y
          );
          x += current[6];
          y += current[7];
          break;

        case 'A':
          // TODO: optimize this
          bounds = getBoundsOfArc(x, y,
            current[1],
            current[2],
            current[3],
            current[4],
            current[5],
            current[6],
            current[7]
          );
          x = current[6];
          y = current[7];
          break;

        case 'z':
        case 'Z':
          x = subpathStartX;
          y = subpathStartY;
          break;
      }
      previous = current;
      bounds.forEach(function (point) {
        aX.push(point.x);
        aY.push(point.y);
      });
      aX.push(x);
      aY.push(y);
    }

    let minX = min(aX) || 0,
        minY = min(aY) || 0,
        maxX = max(aX) || 0,
        maxY = max(aY) || 0,
        deltaX = maxX - minX,
        deltaY = maxY - minY;

    return new Dimensions(
      minX - this.strokeWidth / 2,
      minY - this.strokeWidth / 2,
      deltaX + this.strokeWidth,
      deltaY + this.strokeWidth
    )
  }
}

export default Path
