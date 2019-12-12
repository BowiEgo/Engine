import Engine from './Engine';

let uid = 0;

export default class Application {
  constructor (el, opts) {
    this.uid = uid++;
    this.opts = opts;
    this.el = el;
    this.status = 'stop';
    this.PAUSE_TIMEOUT = 100;
    this.plugins = {};
  }

  get trigger () {
    return this._trigger;
  }
  
  get time () {
    return this._time;
  }

  get renderer () {
    return this._renderer;
  }

  get mouse () {
    return this._mouse;
  }

  get camera () {
    return this._camera;
  }

  get scene () {
    return this._scene;
  }

  get targetFinder () {
    return this._targetFinder;
  }

  install (plugin) {
    let p = plugin.create(this);
    this.plugins[p.plugin_name] = p;
    p.installed();
  }

  destroy () {
    this.stop();
    Object.keys(this.plugins).forEach(key => {
      this.plugins[key].destroy();
    })
    this.el.removeChild(this.view);
  }

  start () {
    if (this.status === 'playing') {
      return;
    }
    this.time.timeScale = 1;
    Engine.run(this);
    this.status = 'playing';
  }

  restart () {
    Engine.reset(this);
    this.start();
  }

  pause () {
    if (this.status === 'playing') {
      this.time.timeScale = 0;
      this.status = 'paused';
    }
  }

  resume () {
    if (this.status === 'paused') {
      this.Time.timeScale = 1;
      this.status = 'playing';
    }
  }

  stop () {
    Engine.reset(this);
    this.status = 'stop';
  }
}
