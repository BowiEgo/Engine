import Camera from './Camera';
import Time from './Time';
import Mouse from './Mouse';  
import Scene from './Scene';
import Events from './Events';
import Body from './Body';
import Shape from '../shapes';
import { Renderer, CanvasRenderer } from '../renderer';

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

class Engine {
  static create (el, opts) {
    console.log('create', el)
    let game = {};
    game.el = el;
    game.status = 'stop';
    game.PAUSE_TIMEOUT = 100;

    Events.create(game);

    game.renderer = Renderer.create(
      el,
      opts
    );

    game.view = game.renderer.canvas;

    game.mouse = Mouse.create(game.view);

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

    Events.on('addBody', (body) => {
      game.renderer.render([body]);
    })

    let plugins = opts.plugins || [];

    plugins.forEach(plugin => {
      plugin.create(Engine, game);
    });

    return game;
  }

  static reset (game) {
    _cancelFrame(game.frameReq);
    Time.reset();
    game.frameReq = null;
    game.scene.reset();
    game.renderer.clear();
    game.renderer.render(game.scene.bodies);
  }

  static run (game) {
    if (game.frameReq) {
      game.stop();
    }
  
    game.frameReq = _reqFrame((timeStamp) => tick.call(null, timeStamp));
  
    function tick (timeStamp) {
      Events.trigger('tick', timeStamp);
      Time.update(timeStamp); // update Time
      game.scene.update();
      game.renderer.clear();
      game.renderer.render(game.scene.bodies);
      game.frameReq = _reqFrame((timeStamp) => tick.call(null, timeStamp));
    }
  }
}

Engine.Time = Time;
Engine.Events = Events;
Engine.Body = Body;
Engine.Shape = Shape;

export default Engine
