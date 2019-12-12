export default class Grid {
  constructor (app) {
    this.plugin_name = 'grid';
    this.app = app;
    this.stepx = 10;
    this.stepy = 10;
    this.zoom = this.app.renderer._canvas.zoom;
  }

  static create (app) {
    return new Grid(app);
  }

  installed () {
    this.app.trigger.on('beforeCtxRendered', () => {
      this.drawGrid();
    });
  }

  destroy () {
    this.app.trigger.off('beforeCtxRendered');
  }

  drawGrid () {
    let app = this.app,
        renderer = app.renderer,
        context = renderer.context,
        pixelRatio = renderer.pixelRatio,
        w = renderer.canvas.width / pixelRatio,
        h = renderer.canvas.height / pixelRatio,
        zoom = renderer._canvas.zoom,
        offset = renderer._canvas.offset;

    let wByZoom = w / zoom,
        hByZoom = h / zoom,
        numx = wByZoom / 10,
        numy = hByZoom / 10,
        xByZoom = offset.x / zoom / 2,
        yByZoom = offset.y / zoom / 2;
    
    context.lineWidth = 1 / zoom;
    context.strokeStyle = 'skyblue';
    context.save();

    // console.log(zoom, this.zoom)
    // this.stepx = 10 / zoom;
    // this.stepy = 10 / zoom;
    if (zoom / this.zoom < 0.5) {
      this.stepx *= 2;
      this.stepy *= 2;
      this.zoom = zoom;
    }
    if (zoom / this.zoom > 2) {
      this.stepx /= 2;
      this.stepy /= 2;
      this.zoom = zoom;
    }

    // draw horizon line
    let i = 0,
        currentY = i * this.stepy;

    if (currentY < yByZoom) {
      while (currentY + yByZoom >= 0) {
        currentY = i * this.stepy;
        let start = {
          x: -xByZoom,
          y: currentY
        }
        let end = {
          x: wByZoom - xByZoom,
          y: currentY
        }
        _drawLine(start, end, context, i, zoom);
        i--;
      }
    } else {
      i = Math.round(-yByZoom / this.stepy);
    }

    while (currentY + yByZoom < hByZoom) {
      currentY = i * this.stepy;
      let start = {
        x: -xByZoom,
        y: currentY
      }
      let end = {
        x: wByZoom - xByZoom,
        y: currentY
      }
      _drawLine(start, end, context, i, zoom);
      i++;
    }

    // draw vertical line
    i = 0;
    let currentX = i * this.stepx;

    if (currentX < xByZoom) {
      while (currentX + xByZoom >= 0) {
        currentX = i * this.stepx;
        let start = {
          x: currentX,
          y: -yByZoom
        }
        let end = {
          x: currentX,
          y: wByZoom - yByZoom
        }
        _drawLine(start, end, context, i, zoom);
        i--;
      }
    } else {
      i = Math.round(-xByZoom / this.stepx);
    }

    while (currentX + xByZoom < wByZoom) {
      currentX = i * this.stepx;
      let start = {
        x: currentX,
        y: -yByZoom
      }
      let end = {
        x: currentX,
        y: wByZoom - yByZoom
      }
      _drawLine(start, end, context, i, zoom);
      i++;
    }

    context.restore();
  }
}

function _drawLine (start, end, context, i, zoom) {
  if (i % 5 === 0) {
    context.lineWidth = 1 / zoom;
  } else {
    context.lineWidth = 0.5 / zoom;
  }

  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
}
