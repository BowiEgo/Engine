import CanvasRenderer from './CanvasRenderer';
let Camera = {};

Camera.create = function (game) {
  let camera = {};
  camera.position = { x: 0, y: 0 };
  camera.offset = { x: 0, y: 0 };
  camera.scale = 1;
  camera.lookAt = null;

  let isDragging = false;
  let lastMousePosition = { x: 0, y: 0 };

  // trackTransforms(CanvasRenderer.context);

  game.mouse.on('mousemove', mouse => {
    if (isDragging) {
      camera.offset = subPos(mouse.position, lastMousePosition);
      camera.position = addPos(camera.position, camera.offset);
      lastMousePosition.x = mouse.position.x;
      lastMousePosition.y = mouse.position.y;
      game.renderer.clear(camera.scale);
      CanvasRenderer.context.translate(camera.offset.x / camera.scale, camera.offset.y / camera.scale);
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
    // let pt = CanvasRenderer.context.transformedPoint(mouse.position.x, mouse.position.y);
    let deltaScale = 1 + mouse.wheelDelta * 0.02;
    camera.scale *= deltaScale;
    game.renderer.clear(camera.scale);
    // CanvasRenderer.context.translate(pt.x, pt.y);
    CanvasRenderer.context.scale(deltaScale, deltaScale);
    // CanvasRenderer.context.translate(-pt.x, -pt.y);
  });

  camera.recover = function () {
    game.renderer.clear(camera.scale);
    CanvasRenderer.context.translate(-camera.position.x, -camera.position.y);
    CanvasRenderer.context.scale(1 / camera.scale, 1 / camera.scale);
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

// function trackTransforms(context){
//   let svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
//   let xform = svg.createSVGMatrix();

//   let pt  = svg.createSVGPoint();
//   context.transformedPoint = function(x,y){
//     pt.x=x; pt.y=y;
//     return pt.matrixTransform(xform.inverse());
//   }
// }

export default Camera
