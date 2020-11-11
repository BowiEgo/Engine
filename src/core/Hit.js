export default class Hit {
  constructor(app) {
    this.app = app;

    this.bodies = this.app.scene.bodies;
    // this._hitCanvas = this.app.renderer._hitCanvas;
    this.hitContext = this.app.renderer.hitContext;

    console.log(this);
    Hit.bindMouseEvents(this);
    // Hit.createHitCanvas(this)
  }

  static create(app) {
    app._hit = new Hit(app);
  }

  static bindMouseEvents(hit) {
    hit.app.mouse.on('mousedown', (mouse) => {
      hit.app.hitTarget = hit.findTarget(mouse.position);
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

  findTarget(pointer) {
    console.log('findTarget', pointer);
    const hasHitCanvas = false,
      pixelRatio = this.app.renderer.pixelRatio;
    let pixel;

    if (hasHitCanvas) {
      pixel = this.hitContext.getImageData(
        pointer.x * pixelRatio,
        pointer.y * pixelRatio,
        1,
        1
      ).data;
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
        console.log(body);
      }

      if (body.containsPoint(pointer)) {
        console.log(body);
        this.app.scene.selectBody(body);
        return body;
      }
    }

    this.app.scene.selectBody(null);

    return [];
  }
}
