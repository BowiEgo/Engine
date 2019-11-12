import { insertAfter } from '../../utils/Dom';

let Performance = {};

Performance.create = function (Engine, game, opts) {
  this.engine = Engine;
  const { Events } = this.engine;

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

  game.plugin = game.plugin || {};
  game.plugin['performance'] = Performance;
}

Performance.update = function (performance) {
  const { Time } = this.engine;
  performance.fpsEl.innerText = Time.fps.toFixed(2);
}

function _addFPS (performance) {
  performance.fpsEl = document.createElement('div');
  performance.el.append(performance.fpsEl);
  performance.fpsEl.style.color = 'white';
}

export default Performance;
