import { insertAfter } from '../../utils/dom';

export default class Performance {
  static create (game, opts) {
    console.log('create-Performance', game);
    let performance = {};
    let viewBC = game.view.getBoundingClientRect();

    opts = opts || {};
    performance.el = document.createElement('div');
    performance.el.className = 'performance-widget';
    performance.el.style.position = 'absolute';
    performance.el.style.top = viewBC.top + 'px';
    performance.el.style.left = viewBC.left + 'px';
    performance.el.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    performance.el.style.padding = '4px 10px';
    
    this._addFPS(performance);
    insertAfter(performance.el, game.view);

    game.trigger.on('tick', () => {
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
    game.plugins.performance.fpsEl.innerText = game.time.fps.toFixed(2);
  }
}
