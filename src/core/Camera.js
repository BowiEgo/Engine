export default class Camera {
  constructor (app) {
    this.app = app;

    this.position = { x: 0, y: 0 };
    this.offset = { x: 0, y: 0 };
    this.scale = 1;
    this.lookAt = null;

    this.bindMouseEvents();
  }

  static create (app) {
    app._camera = new Camera(app);
  }

  recover () {
    let { renderer } = this.app;
    renderer.clear(camera.scale);
    renderer.context.translate(-camera.position.x, -camera.position.y);
    renderer.context.scale(1 / camera.scale, 1 / camera.scale);
    this.scale = 1;
    this.offset = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };
  }

  lookAt () {

  }

  follow () {

  }

  bindMouseEvents () {
    const app = this.app;

    let isDragging = false;
    let lastMousePosition = { x: 0, y: 0 };

    app.mouse.on('mousemove', mouse => {
      if (isDragging) {
        this.offset = subPos(mouse.position, lastMousePosition);
        this.position = addPos(this.position, this.offset);
        lastMousePosition.x = mouse.position.x;
        lastMousePosition.y = mouse.position.y;

        if (app.hitTarget.length === 0) {
          app.renderer._canvas.translate(this.offset);
        }
        app.trigger.fire('drag', this.offset);
      }
    });
  
    app.mouse.on('mouseout', mouse => {
      isDragging = false;
    });
  
    app.mouse.on('mousedown', mouse => {
      isDragging = true;
      lastMousePosition.x = mouse.mousedownPosition.x;
      lastMousePosition.y = mouse.mousedownPosition.y;
    });
  
    app.mouse.on('mouseup', mouse => {
      this.offset = { x: 0, y: 0 };
      isDragging = false;
    });
  
    app.mouse.on('mousewheel', mouse => {
      this.scale *= (1 + mouse.wheelDelta * 0.03);
      app.renderer._canvas.zoomToPoint(mouse.position, this.scale);
    });
  }
}

function addPos (posA, posB) {
  return {
    x: posA.x + posB.x,
    y: posA.y + posB.y 
  }
}

function subPos (posA, posB) {
  return {
    x: posA.x - posB.x,
    y: posA.y - posB.y 
  }
}
