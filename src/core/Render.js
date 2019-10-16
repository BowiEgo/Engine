let Render = {};

Render.create = (game, el, opts) => {
  console.log('render-create', el, opts);
  let render = {
    el: el,
    game: game
  };

  const { width = 300, height = 300, scale = 1, bgColor = 'aliceblue' } = opts;
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
    objectArray.forEach(object => {
      if (object.shape.type === 'polygon') {
        renderPolygon(render.ctx, object.shape);
      }
    })
  }

  return render
}

function renderPolygon (ctx, polygon) {
  ctx.beginPath();
  const { x: posX, y: posY } = polygon.transform.position;

  ctx.moveTo(polygon.vertices[0].x + posX, polygon.vertices[0].y + posY);

  for (let i = 1; i < polygon.vertices.length; i++) {
    ctx.lineTo(polygon.vertices[i].x + posX, polygon.vertices[i].y + posY);
  }

  ctx.closePath();

  ctx.lineWidth = 1;
  ctx.strokeStyle = '#bbb';
  ctx.fillStyle = '#a23';
  ctx.stroke();
  ctx.fill();
}

export default Render;
