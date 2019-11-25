import Application from './Application';
import Camera from './Camera';
import Time from './Time';
import Mouse from './Mouse';  
import Scene from './Scene';
import Hit from './Hit';
import Trigger from './Trigger';
import Body from './Body';
import Shape from '../shapes';
import Renderer from './Renderer';

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
    let app = new Application(el, opts);

    Trigger.create(app);
    Time.create(app);
    Renderer.create(app);
    Mouse.create(app);
    Camera.create(app);
    Scene.create(app);
    Hit.create(app);

    // install plugins
    let plugins = opts.plugins || [];

    plugins.forEach(plugin => {
      plugin.create(app);
    });

    Engine.reset(app);

    // check autoStart
    if (opts.autoStart) {
      app.start();
    }

    return app;
  }

  static reset (app) {
    _cancelFrame(app.frameReq);
    app.time.reset();
    app.frameReq = null;
    app.scene.reset();
    app.renderer.clear();
    app.renderer.render(app.scene.bodies);
  }

  static run (app) {
    if (app.frameReq) {
      app.stop();
    }

    app.frameReq = _reqFrame((timeStamp) => tick.call(null, timeStamp));
  
    function tick (timeStamp) {
      app.trigger.fire('tick', timeStamp);
      app.time.update(timeStamp); // update Time
      app.scene.update();
      app.renderer.clear();
      app.renderer.render(app.scene.bodies);
      app.frameReq = _reqFrame((timeStamp) => tick.call(null, timeStamp));
    }
  }
}

Engine.Body = Body;
Engine.Shape = Shape;

export default Engine
