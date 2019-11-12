import Events from '../core/Events';

let Scene = {};

Scene.create = (game) => {
  let scene = {};

  scene.bodies = [];

  scene.addBody = (body) => {
    scene.bodies.push(body);

    Events.trigger('addBody', body);
  }

  scene.reset = () => {
    scene.bodies.forEach((body) => {
      body.reset();
    })
  }

  scene.update = () => {
    scene.bodies.forEach((body) => {
      if (game.status === 'playing') {
        body.updateCb.call(body);
      }
    })
  }

  return scene
}

export default Scene
