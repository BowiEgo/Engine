let Camera = {};

Camera.create = function (game) {
  let camera = {};
  camera.position = { x: 0, y: 0 };
  camera.offset = { x: 0, y: 0 };
  camera.scale = 1;
  camera.lookAt = null;

  let isDragging = false;
  let lastMousePosition = { x: 0, y: 0 };

  game.mouse.on('mousemove', mouse => {
    if (isDragging) {
      camera.offset = subPos(mouse.position, lastMousePosition);
      camera.position = addPos(camera.position, camera.offset);
      lastMousePosition.x = mouse.position.x;
      lastMousePosition.y = mouse.position.y;
      game.render.clear(camera.scale);
      game.render.context.translate(camera.offset.x, camera.offset.y);
    }
  });

  game.mouse.on('mouseout', mouse => {
    isDragging = false;
  });

  game.mouse.on('mousedown', mouse => {
    isDragging = true;
    lastMousePosition.x = mouse.mousedownPosition.x;
    lastMousePosition.y = mouse.mousedownPosition.y;
  });

  game.mouse.on('mouseup', mouse => {
    camera.offset = { x: 0, y: 0 };
    isDragging = false;
  });

  game.mouse.on('mousewheel', mouse => {
    let deltaScale = 1 + mouse.wheelDelta * 0.008;
    camera.scale *= deltaScale;
    game.render.clear(camera.scale);
    game.render.context.scale(deltaScale, deltaScale);
  });

  camera.recover = function () {
    game.render.clear(camera.scale);
    game.render.context.translate(-camera.position.x, -camera.position.y);
    game.render.context.scale(1 / camera.scale, 1 / camera.scale);
    camera.scale = 1;
    camera.offset = { x: 0, y: 0 };
    camera.position = { x: 0, y: 0 };
  };
  return camera;
}

Camera.lookAt = function ()  {
}

Camera.follow = function ()  {
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

export default Camera
