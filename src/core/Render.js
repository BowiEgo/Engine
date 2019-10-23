let Render = {};

Render.create = (game, el, opts) => {
  console.log('render-create', el, opts);
  let render = {
    el: el,
    game: game
  };

  const { width = 300, height = 300, scale = 2, bgColor = 'aliceblue' } = opts;
  const elRect = el.getBoundingClientRect();

  render.ctxW = width || elRect.width;
  render.ctxH = height || elRect.height;

  render.canvasEl = document.createElement('canvas');
  render.canvasEl.width = render.ctxW * scale;
  render.canvasEl.height = render.ctxH * scale;
  render.canvasEl.style.width = render.ctxW + 'px';
  render.canvasEl.style.height = render.ctxH + 'px';
  render.canvasEl.style.backgroundColor = bgColor;
  render.el.append(render.canvasEl);

  render.ctx = render.canvasEl.getContext('2d');
  render.ctx.scale(scale, scale);

  render.clear = () => {
    render.ctx.clearRect(0, 0, render.ctxW, render.ctxH);
  }

  render.render = () => {
    const { objectArray } = render.game.scene;
    console.log('render', objectArray);

    objectArray.forEach(object => {
      const shapeType = object.shape.type;

      switch (shapeType) {
        case 'polygon':
          renderPolygon(render.ctx, object.shape);
          break;
        case 'rectangle':
          renderRectangle(render.ctx, object.shape);
          break;
        case 'circle':
          renderCircle(render.ctx, object.shape);
          break;
        default:
          break;
      }
    })
  }

  return render
}

function renderPolygon (ctx, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  ctx.beginPath();
  ctx.moveTo(shape.vertices[0].x + posX, shape.vertices[0].y + posY);
  for (let i = 1; i < shape.vertices.length; i++) {
    ctx.lineTo(shape.vertices[i].x + posX, shape.vertices[i].y + posY);
  }
  ctx.closePath();

  draw(ctx, shape);
}

function renderRectangle (ctx, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  ctx.beginPath();
  ctx.rect(posX, posY, shape.width, shape.height);
  ctx.closePath();

  draw(ctx, shape);
}

function renderCircle (ctx, shape) {
  const { x: posX, y: posY } = shape.transform.position;

  ctx.beginPath();
  ctx.arc(posX, posY, shape.radius, 0, Math.PI * 2, false);
  ctx.closePath();

  draw(ctx, shape);
}

function draw (ctx, shape) {
  ctx.lineWidth = shape.strokeWidth;
  ctx.strokeStyle = shape.strokeStyle;
  ctx.fillStyle = shape.fillStyle;
  shape.strokeWidth > 0 && ctx.stroke();
  ctx.fill();
}

export default Render;
