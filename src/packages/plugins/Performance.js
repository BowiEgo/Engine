import { insertAfter } from '../../utils/Dom';

export default class Performance {
  static create (game, opts) {
    let performance = {};
    let view = game.view.getBoundingClientRect();

    opts = opts || {};
    performance.el = document.createElement('div');
    performance.el.className = 'performance-widget';
    performance.el.style.position = 'absolute';
    performance.el.style.top = view.top + 'px';
    performance.el.style.left = view.left + 'px';
    performance.el.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    performance.el.style.padding = '4px 10px';
    
    this._addFPS(performance);
    insertAfter(performance.el, game.view);
    
    game.Events.on('tick', () => {
      this._update(game);
    });

    game.plugins = game.plugin || {};
    game.plugins['performance'] = performance;
  }

  static _addFPS (performance) {
    performance.fpsEl = document.createElement('div');
    performance.el.append(performance.fpsEl);
    performance.fpsEl.style.color = 'white';
  }

  static _update (game) {
    game.plugins.performance.fpsEl.innerText = game.Time.fps.toFixed(2);
  }
}
