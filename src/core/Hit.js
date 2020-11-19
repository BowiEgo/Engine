import { clone } from '../utils/common';
import { transformPoint } from '../utils/misc';
import { subPos, addPos } from './utils';
import Controller from './Controller';

// import Body from './Body';

export default class Hit {
  constructor(app) {
    this.app = app;

    this.bodies = this.app.scene.bodies;
    // this._hitCanvas = this.app.renderer._hitCanvas;
    this.hitContext = this.app.renderer.hitContext;
    this.controller = null;

    Hit.bindMouseEvents(this);
    // Hit.createHitCanvas(this)
  }

  static create(app) {
    app._hit = new Hit(app);
  }

  static bindMouseEvents(hit) {
    let lastMousePosition = { x: 0, y: 0 },
      offset = { x: 0, y: 0 },
      position = { x: 0, y: 0 },
      scaleX = 1,
      scaleY = 1;

    hit.app.mouse.on('mousedown', (mouse) => {
      let target = hit.findTarget(mouse.position);
      console.log('target', target, hit, hit.controller);
      hit.app.hitTarget = target;
      hit.isDraging = true;
      // pseudocode------------------------------------
      // let corner = target.findCorner(mouse.position)
      // console.log('corner', corner)
    });

    hit.app.mouse.on('mouseup', (mouse) => {
      console.log('mouseup', hit.controller);
      hit.isDraging = false;
      hit.controller = null;
    });

    hit.app.mouse.on('mousemove', (mouse) => {
      // console.log('mousemove', hit.controller);
      const target = hit.app.scene.selectedBody;
      offset = subPos(mouse.position, lastMousePosition);
      position = addPos(position, offset);
      lastMousePosition.x = mouse.position.x;
      lastMousePosition.y = mouse.position.y;

      if (hit.controller) {
        const width = target.coords.tr.x - target.coords.tl.x;
        const height = target.coords.br.y - target.coords.tr.y;
        scaleX = (width + (mouse.position.x - hit.controller.pos.x)) / width;
        scaleY = (height + (mouse.position.x - hit.controller.pos.x)) / height;
        target.scale(scaleX, scaleY);
      } else if (target && hit.isDraging) {
        const vpt = hit.app.renderer._canvas.viewportTransform;
        target.translate(offset.x / vpt[0], offset.y / vpt[0]);
      }
    });
  }

  // static createHitCanvas (hit) {
  //   hit.hitCanvas = document.createElement('canvas');
  //   hit.hitContext = hit.hitCanvas.getContext('2d');
  //   hit.canvasRenderer = new CanvasRenderer(app);

  //   app.el.append(renderer.canvas);

  //   app.view = renderer.canvas;

  //   app._renderer = renderer;

  //   hit.app.trigger.on('shape_rendered', shape => hit.renderHitShape(shape));
  // }

  renderHitShape(shape) {}

  findTarget(point) {
    console.log('findTarget', point);
    const hasHitCanvas = false,
      pixelRatio = this.app.renderer.pixelRatio;

    const selectedBody = this.app.scene.selectedBody;
    let pixel;

    if (hasHitCanvas) {
      pixel = this.hitContext.getImageData(
        point.x * pixelRatio,
        point.y * pixelRatio,
        1,
        1
      ).data;
    }

    if (selectedBody) {
      this.controller = selectedBody.findController(point);
      console.log(111111111, this.controller);
      if (this.controller) {
        this.app.scene.selectBody(selectedBody);
        return selectedBody;
      }
    }

    for (let i = 0, len = this.bodies.length; i < len; i++) {
      let body = this.bodies[i];

      if (hasHitCanvas && pixel !== null) {
        const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
        // console.log(color, body)
        if (body.hitFill == color) {
          console.log('hit:', color, body);
        }
      }
      if (body.shape.type === 'text') {
        // console.log(body);
      }

      if (this.containsPoint(point, body.coords)) {
        console.log('2222222222', this.app.scene.selectedBody, this.controller);
        this.app.scene.selectBody(body);
        return body;
      }
    }

    console.log('controller', this.controller);

    this.app.scene.selectBody(null);

    return [];
  }

  containsPoint(point, coords) {
    const _canvas = this.app.renderer._canvas;
    const pixelRatio = _canvas.pixelRatio;
    let vpt = clone(_canvas.viewportTransform);

    vpt[4] /= pixelRatio;
    vpt[5] /= pixelRatio;

    let coordsTransformed = {
      tl: transformPoint(coords.tl, vpt),
      tr: transformPoint(coords.tr, vpt),
      bl: transformPoint(coords.bl, vpt),
      br: transformPoint(coords.br, vpt),
    };

    let lines = getImageLines(coordsTransformed),
      xPoints = findCrossPoints(point, lines);

    return xPoints !== 0 && xPoints % 2 === 1;
  }
}

function getImageLines(oCoords) {
  return {
    topline: {
      o: oCoords.tl,
      d: oCoords.tr,
    },
    rightline: {
      o: oCoords.tr,
      d: oCoords.br,
    },
    bottomline: {
      o: oCoords.br,
      d: oCoords.bl,
    },
    leftline: {
      o: oCoords.bl,
      d: oCoords.tl,
    },
  };
}

function findCrossPoints(point, lines) {
  let b1,
    b2,
    a1,
    a2,
    xi, // yi,
    xcount = 0,
    iLine;

  for (let lineKey in lines) {
    iLine = lines[lineKey];
    // optimisation 1: line below point. no cross
    if (iLine.o.y < point.y && iLine.d.y < point.y) {
      continue;
    }
    // optimisation 2: line above point. no cross
    if (iLine.o.y >= point.y && iLine.d.y >= point.y) {
      continue;
    }
    // optimisation 3: vertical line case
    if (iLine.o.x === iLine.d.x && iLine.o.x >= point.x) {
      xi = iLine.o.x;
      // yi = point.y;
    }
    // calculate the intersection point
    else {
      b1 = 0;
      b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
      a1 = point.y - b1 * point.x;
      a2 = iLine.o.y - b2 * iLine.o.x;

      xi = -(a1 - a2) / (b1 - b2);
      // yi = a1 + b1 * xi;
    }
    // dont count xi < point.x cases
    if (xi >= point.x) {
      xcount += 1;
    }
    // optimisation 4: specific for square images
    if (xcount === 2) {
      break;
    }
  }
  return xcount;
}
