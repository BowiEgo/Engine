let Scene = {};

Scene.create = (game) => {
  let scene = {};

  scene.game = game;
  scene.objectArray = [];

  scene.addObject = (object) => {
    scene.objectArray.push(object);
  }

  scene.reset = () => {
    scene.objectArray.forEach((object) => {
      object.reset();
    })
  }

  scene.update = () => {
    scene.objectArray.forEach((object) => {
      if (game.status === 'playing') {
        object.updateCb.call(object);
      }
    })
  }

  return scene
}

export default Scene
