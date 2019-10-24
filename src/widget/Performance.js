import Time from '../core/Time';
import Events from '../core/Events';
import { insertAfter } from '../utils/Dom';

let Performance = {};

Performance.create = function (game, opts) {
  let performance = {};
  let canvasRect = game.render.canvas.getBoundingClientRect();

  opts = opts || {};
  performance.el = document.createElement('div');
  performance.el.className = 'performance-widget';
  performance.el.style.position = 'absolute';
  performance.el.style.top = canvasRect.top + 'px';
  performance.el.style.left = canvasRect.left + 'px';
  performance.el.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  performance.el.style.padding = '4px 10px';

  _addFPS(performance);
  insertAfter(performance.el, game.render.canvas);

  Events.on(game, 'tick', function () {
    Performance.update(game, performance);
  })

  game.widget = game.widget || {};
  game.widget['performance'] = Performance;
}

Performance.update = function (game, performance) {
  performance.fpsEl.innerText = Time.fps.toFixed(2);
}

function _addFPS (performance) {
  performance.fpsEl = document.createElement('div');
  performance.el.append(performance.fpsEl);
  performance.fpsEl.style.color = 'white';
}

export default Performance;
