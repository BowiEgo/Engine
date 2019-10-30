import Time from '../core/Time';
import Events from '../core/Events';
import CanvasRenderer from '../renderer/CanvasRenderer';
import { insertAfter } from '../utils/Dom';

let Performance = {};

Performance.create = function (game, opts) {
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

  _addFPS(performance);
  insertAfter(performance.el, game.view);

  Events.on('tick', function () {
    Performance.update(performance);
  })

  game.widget = game.widget || {};
  game.widget['performance'] = Performance;
}

Performance.update = function (performance) {
  performance.fpsEl.innerText = Time.fps.toFixed(2);
}

function _addFPS (performance) {
  performance.fpsEl = document.createElement('div');
  performance.el.append(performance.fpsEl);
  performance.fpsEl.style.color = 'white';
}

export default Performance;
