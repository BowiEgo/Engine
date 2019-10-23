import Camera from './Camera';
import Time from './Time';
import Mouse from './Mouse';
import Scene from './Scene';
import Render from './Render';

let _reqFrame, _cancelFrame, _frameTimeout;
if (typeof window !== 'undefined') {
  _reqFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
    var self = this, start, finish;

    _frameTimeout = window.setTimeout(function () {
      start = +new Date();
      callback(start);
      finish = +new Date();
      self.timeout = 1000 / 60 - (finish - start);
    }, self.timeout);
  };

  _cancelFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || function () {
    window.clearTimeout(_frameTimeout);
  };
}

let Engine = {};

Engine.create = (el, opts) => {
  let game = {};
  game.el = el;
  game.status = 'stop';
  game.showFPS = opts.showFPS !== undefined ? opts.showFPS : true;
  game.PAUSE_TIMEOUT = 100;

  game.render = Render.create(
    game,
    el,
    opts
  );

  game.mouse = Mouse.create(game.render.canvas);

  game.camera = Camera.create(game);

  game.scene = Scene.create(game);

  game.start = () => {
    Time.timeScale = 1;
    Engine.run(game);
    game.status = 'playing';
  }

  game.restart = () => {
    Engine.reset(game);
    game.start();
  }

  game.pause = () => {
    if (game.status === 'playing') {
      Time.timeScale = 0;
      game.status = 'paused';
    }
  }

  game.resume = () => {
    if (game.status === 'paused') {
      Time.timeScale = 1;
      game.status = 'playing';
    }
  }

  game.stop = () => {
    Engine.reset(game);
    game.status = 'stop';
  }

  Engine.reset(game);

  return game;
}

Engine.reset = (game) => {
  _cancelFrame(game.frameReq);
  Time.reset();
  game.frameReq = null;
  game.scene.reset();
  game.render.clear();
  game.render.render();
}

Engine.run = (game) => {
  if (game.frameReq) {
    game.stop();
  }

  game.frameReq = _reqFrame((timeStamp) => tick.call(null, timeStamp));

  function tick (timeStamp) {
    Time.update(timeStamp); // update Time
    game.scene.update();
    game.render.clear();
    game.render.render();
    game.frameReq = _reqFrame((timeStamp) => tick.call(null, timeStamp));
  }
}

export default Engine
