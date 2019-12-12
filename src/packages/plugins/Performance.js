import { insertAfter } from '../../utils/dom';

export default class Performance {
  constructor (app) {
    let viewBC = app.view.getBoundingClientRect();
    this.plugin_name = 'performance';
    this.app = app;

    this.el = document.createElement('div');
    this.el.className = 'performance-widget';
    this.el.style.position = 'absolute';
    this.el.style.top = viewBC.top + 'px';
    this.el.style.left = viewBC.left + 'px';
    this.el.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    this.el.style.padding = '4px 10px';

    Performance._addFPS(this);
    insertAfter(this.el, app.view);
  }

  static create (app) {
    return new Performance(app);
  }

  static _addFPS (performance) {
    performance.fpsEl = document.createElement('div');
    performance.el.append(performance.fpsEl);
    performance.fpsEl.style.color = 'white';
  }

  static _update (app) {
    app.plugins.performance.fpsEl.innerText = app.time.fps.toFixed(2);
  }

  installed () {
    this.app.trigger.on('tick', () => {
      Performance._update(this.app);
    });
  }

  destroy () {
    this.app.el.removeChild(this.el);
    delete this.app.plugins.performance;
  }
}
