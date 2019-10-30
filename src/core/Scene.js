import Events from '../core/Events';

let Scene = {};

Scene.create = (game) => {
  let scene = {};

  scene.objects = [];

  scene.addObject = (object) => {
    scene.objects.push(object);

    Events.trigger('addObject', object);
  }

  scene.reset = () => {
    scene.objects.forEach((object) => {
      object.reset();
    })
  }

  scene.update = () => {
    scene.objects.forEach((object) => {
      if (game.status === 'playing') {
        object.updateCb.call(object);
      }
    })
  }

  return scene
}

export default Scene
