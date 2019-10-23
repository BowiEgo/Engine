/*!
 * tree-graph-d3.js v1.0.0
 * (c) 2018-2019 bowiego
 * Released under the MIT License.
 */
var STARTING_FPS = 60;
var Time = {
  timeScale: 0,
  unscaledDeltaTime: 0,
  deltaTime: 0
};

Time.reset = function () {
  Time.timeStart = 0;
  Time.timePassed = 0;
  Time.fps = STARTING_FPS;
};

Time.update = function (timeStamp) {
  if (Time.timeStart === 0) {
    Time.timeStart = timeStamp;
    Time.fps = STARTING_FPS;
  } else {
    Time.fps = 1000 / (timeStamp - Time.timeStart);
  }

  Time.unscaledDeltaTime = 1 / Time.fps;
  Time.deltaTime = Time.unscaledDeltaTime * Time.timeScale;
  Time.timePassed += Time.unscaledDeltaTime;
  Time.timeStart = timeStamp;
};

Time.reset();

var Scene = {};

Scene.create = function (game) {
  var scene = {};
  scene.game = game;
  scene.objectArray = [];

  scene.addObject = function (object) {
    scene.objectArray.push(object);
  };

  scene.reset = function () {
    scene.objectArray.forEach(function (object) {
      object.reset();
    });
  };

  scene.update = function () {
    scene.objectArray.forEach(function (object) {
      if (game.status === 'playing') {
        object.updateCb.call(object);
      }
    });
  };

  return scene;
};

var Render = {};

Render.create = function (game, el, opts) {
  console.log('render-create', el, opts);
  var render = {
    el: el,
    game: game
  };
  var _opts$width = opts.width,
      width = _opts$width === void 0 ? 300 : _opts$width,
      _opts$height = opts.height,
      height = _opts$height === void 0 ? 300 : _opts$height,
      _opts$scale = opts.scale,
      scale = _opts$scale === void 0 ? 2 : _opts$scale,
      _opts$bgColor = opts.bgColor,
      bgColor = _opts$bgColor === void 0 ? 'aliceblue' : _opts$bgColor;
  var elRect = el.getBoundingClientRect();
  render.ctxW = width || elRect.width;
  render.ctxH = height || elRect.height;
  render.canvasEl = document.createElement('canvas');
  render.canvasEl.width = render.ctxW * scale;
  render.canvasEl.height = render.ctxH * scale;
  render.canvasEl.style.width = render.ctxW + 'px';
  render.canvasEl.style.height = render.ctxH + 'px';
  render.canvasEl.style.backgroundColor = bgColor;
  render.el.append(render.canvasEl);
  render.ctx = render.canvasEl.getContext('2d');
  render.ctx.scale(scale, scale);

  render.clear = function () {
    render.ctx.clearRect(0, 0, render.ctxW, render.ctxH);
  };

  render.render = function () {
    var objectArray = render.game.scene.objectArray;
    console.log('render', objectArray);
    objectArray.forEach(function (object) {
      var shapeType = object.shape.type;

      switch (shapeType) {
        case 'polygon':
          renderPolygon(render.ctx, object.shape);
          break;

        case 'rectangle':
          renderRectangle(render.ctx, object.shape);
          break;

        case 'circle':
          renderCircle(render.ctx, object.shape);
          break;

        default:
          break;
      }
    });
  };

  return render;
};

function renderPolygon(ctx, shape) {
  var _shape$transform$posi = shape.transform.position,
      posX = _shape$transform$posi.x,
      posY = _shape$transform$posi.y;
  ctx.beginPath();
  ctx.moveTo(shape.vertices[0].x + posX, shape.vertices[0].y + posY);

  for (var i = 1; i < shape.vertices.length; i++) {
    ctx.lineTo(shape.vertices[i].x + posX, shape.vertices[i].y + posY);
  }

  ctx.closePath();
  draw(ctx, shape);
}

function renderRectangle(ctx, shape) {
  var _shape$transform$posi2 = shape.transform.position,
      posX = _shape$transform$posi2.x,
      posY = _shape$transform$posi2.y;
  ctx.beginPath();
  ctx.rect(posX, posY, shape.width, shape.height);
  ctx.closePath();
  draw(ctx, shape);
}

function renderCircle(ctx, shape) {
  var _shape$transform$posi3 = shape.transform.position,
      posX = _shape$transform$posi3.x,
      posY = _shape$transform$posi3.y;
  ctx.beginPath();
  ctx.arc(posX, posY, shape.radius, 0, Math.PI * 2, false);
  ctx.closePath();
  draw(ctx, shape);
}

function draw(ctx, shape) {
  ctx.lineWidth = shape.strokeWidth;
  ctx.strokeStyle = shape.strokeStyle;
  ctx.fillStyle = shape.fillStyle;
  shape.strokeWidth > 0 && ctx.stroke();
  ctx.fill();
}

var _reqFrame, _cancelFrame, _frameTimeout;

if (typeof window !== 'undefined') {
  _reqFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
    var self = this,
        start,
        finish;
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

var Engine = {};

Engine.create = function (el, opts) {
  var game = {};
  game.el = el;
  game.status = 'stop';
  game.showFPS = opts.showFPS !== undefined ? opts.showFPS : true;
  game.PAUSE_TIMEOUT = 100;
  game.render = Render.create(game, el, opts);
  game.scene = Scene.create(game);

  game.start = function () {
    Time.timeScale = 1;
    Engine.run(game);
    game.status = 'playing';
  };

  game.restart = function () {
    Engine.reset(game);
    game.start();
  };

  game.pause = function () {
    if (game.status === 'playing') {
      Time.timeScale = 0;
      game.status = 'paused';
    }
  };

  game.resume = function () {
    if (game.status === 'paused') {
      Time.timeScale = 1;
      game.status = 'playing';
    }
  };

  game.stop = function () {
    Engine.reset(game);
    game.status = 'stop';
  };

  Engine.reset(game);
  return game;
};

Engine.reset = function (game) {
  _cancelFrame(game.frameReq);

  Time.reset();
  game.frameReq = null;
  game.scene.reset();
  game.render.clear();
  game.render.render();
};

Engine.run = function (game) {
  if (game.frameReq) {
    game.stop();
  }

  game.frameReq = _reqFrame(function (timeStamp) {
    return tick.call(null, timeStamp);
  });

  function tick(timeStamp) {
    Time.update(timeStamp); // update Time

    game.scene.update();
    game.render.clear();
    game.render.render();
    game.frameReq = _reqFrame(function (timeStamp) {
      return tick.call(null, timeStamp);
    });
  }
};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

/**
 * Returns true if the object is a function.
 * @method isFunction
 * @param {object} obj
 * @return {boolean} True if the object is a function, otherwise false
 */
function isFunction(obj) {
  return typeof obj === 'function';
}

var Object$1 =
/*#__PURE__*/
function () {
  function Object(opts) {
    _classCallCheck(this, Object);

    this.shape = opts.shape;
    this.fill = opts.fill !== undefined ? opts.fill : '#83cbff';
    this.startCb = isFunction(opts.start) ? opts.start : this.start;
    this.updateCb = isFunction(opts.update) ? opts.update : this.update;
    this.transform0 = {
      position: {
        x: opts.transform.position.x || 0,
        y: opts.transform.position.y || 0
      }
    };
    this.reset();
  }

  _createClass(Object, [{
    key: "start",
    value: function start() {}
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "reset",
    value: function reset() {
      this.shape.transform = this.transform = JSON.parse(JSON.stringify(this.transform0));
    }
  }, {
    key: "render",
    value: function render() {
      var ctx = this.Scene.ctx;
      var position = this.transform.position;
      var rectW = 40;
      var rectH = 40;
      ctx.fillStyle = this.fill;
      ctx.fillRect(position.x, position.y, rectW, rectH);
    }
  }]);

  return Object;
}();

var Input = {
  keyCodeArray: []
};

Input.create = function () {
  document.onkeydown = function (event) {
    var keyCode = event.keyCode;
    var idx = Input.keyCodeArray.indexOf(keyCode);

    if (idx === -1) {
      Input.keyCodeArray.push(keyCode);
    }
  };

  document.onkeyup = function (event) {
    var keyCode = event.keyCode;
    var idx = Input.keyCodeArray.indexOf(keyCode);

    if (idx > -1) {
      Input.keyCodeArray.splice(idx, 1);
    }
  };
};

Input.getAxis = function (direction) {
  if (direction === 'horizontal') {
    if (Input.keyCodeArray.indexOf(37) > -1) {
      return -1;
    }

    if (Input.keyCodeArray.indexOf(39) > -1) {
      return 1;
    }

    return 0;
  }

  if (direction === 'vertical') {
    if (Input.keyCodeArray.indexOf(38) > -1) {
      return -1;
    }

    if (Input.keyCodeArray.indexOf(40) > -1) {
      return 1;
    }

    return 0;
  }
};

Input.create(); // class Input {

var Vertices = function Vertices(x, y) {
  _classCallCheck(this, Vertices);

  this.x = x;
  this.y = y;
};

var Projection =
/*#__PURE__*/
function () {
  function Projection(min, max) {
    _classCallCheck(this, Projection);

    if (min > max) {
      throw 'min value should less than max value';
    }

    this.min = min;
    this.max = max;
  }

  _createClass(Projection, [{
    key: "overlaps",
    value: function overlaps(projection) {
      return this.max > projection.min && projection.max > this.min;
    }
  }]);

  return Projection;
}();

var SAT = {};

SAT.detectCollide = function (shapeA, shapeB) {
  return !SAT.separationOnAxes(shapeA, shapeB);
};

SAT.separationOnAxes = function (shapeA, shapeB) {
  var axes = shapeA.getAxes().concat(shapeB.getAxes());

  for (var i = 0; i < axes.length; i++) {
    var axis = axes[i];
    var projection1 = shapeA.project(axis);
    var projection2 = shapeB.project(axis);

    if (!projection1.overlaps(projection2)) {
      return true;
    }
  }

  return false;
};

var Shape =
/*#__PURE__*/
function () {
  function Shape(opts) {
    _classCallCheck(this, Shape);

    console.log('shape,', opts);
    opts = opts || {};
    this.transform = {
      position: {}
    };
    this.fillStyle = opts.fill || '#83cbff';
    this.strokeWidth = opts.strokeWidth || 0;
    this.strokeStyle = opts.stroke || 'grey';
  }

  _createClass(Shape, [{
    key: "collidesWith",
    value: function collidesWith(otherShape) {
      return SAT.detectCollide(this, otherShape);
    }
  }, {
    key: "getAxes",
    value: function getAxes() {
      throw 'getAxes() not implemented';
    }
  }, {
    key: "project",
    value: function project() {
      throw 'project(axis) not implemented';
    }
  }, {
    key: "move",
    value: function move() {
      throw 'move(dx, dy) note implemented';
    }
  }]);

  return Shape;
}();

var Vector =
/*#__PURE__*/
function () {
  function Vector(x, y) {
    _classCallCheck(this, Vector);

    this.x = x;
    this.y = y;
  }

  _createClass(Vector, [{
    key: "magnitude",
    value: function magnitude() {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
  }, {
    key: "add",
    value: function add(vector) {
      var v = new Vector();
      v.x = this.x + vector.x;
      v.y = this.y + vector.y;
      return v;
    }
    /**
     * Subtracts another vector.
     * @method sub
     * @param {vector} vector
     * @return {vector} A new vector of two vector subtracted
     */

  }, {
    key: "sub",
    value: function sub(vector) {
      var v = new Vector();
      v.x = this.x - vector.x;
      v.y = this.y - vector.y;
      return v;
    }
  }, {
    key: "dot",
    value: function dot(vector) {
      return this.x * vector.x + this.y * vector.y;
    }
  }, {
    key: "edge",
    value: function edge(vector) {
      return this.sub(vector);
    }
    /**
     * Returns the perpendicular vector. Set `negate` to true for the perpendicular in the opposite direction.
     * @method perp
     * @param {vector} vector
     * @param {bool} [negate=false]
     * @return {vector} The perpendicular vector
     */

  }, {
    key: "perp",
    value: function perp(negate) {
      negate = negate === true ? -1 : 1;
      var v = new Vector();
      v.x = negate * -this.y;
      v.y = negate * this.x;
      return v;
    }
  }, {
    key: "normalize",
    value: function normalize() {
      var v = new Vector(0, 0),
          m = this.magnitude();

      if (m !== 0) {
        v.x = this.x / m;
        v.y = this.y / m;
      }

      return v;
    }
  }, {
    key: "normal",
    value: function normal() {
      var p = this.perp();
      return p.normalize();
    }
  }]);

  return Vector;
}();

var Polygon =
/*#__PURE__*/
function (_Shape) {
  _inherits(Polygon, _Shape);

  function Polygon(points, opts) {
    var _this;

    _classCallCheck(this, Polygon);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Polygon).call(this, opts));
    _this.type = 'polygon';
    _this.vertices = points.map(function (point) {
      return new Vertices(point[0], point[1]);
    });
    return _this;
  }

  _createClass(Polygon, [{
    key: "getAxes",
    value: function getAxes() {
      var _this$transform$posit = this.transform.position,
          posX = _this$transform$posit.x,
          posY = _this$transform$posit.y;
      var v1 = new Vector(),
          v2 = new Vector(),
          axes = [],
          pointNum = this.vertices.length;

      for (var i = 0; i < pointNum - 1; i++) {
        v1.x = this.vertices[i].x + posX;
        v1.y = this.vertices[i].y + posY;
        v2.x = this.vertices[i + 1].x + posX;
        v2.y = this.vertices[i + 1].y + posY;
        axes.push(v1.edge(v2).normal());
      }

      v1.x = this.vertices[pointNum - 1].x + posX;
      v1.y = this.vertices[pointNum - 1].y + posY;
      v2.x = this.vertices[0].x + posX;
      v2.y = this.vertices[0].y + posY;
      axes.push(v1.edge(v2).normal());
      return axes;
    }
  }, {
    key: "project",
    value: function project(axis) {
      var _this$transform$posit2 = this.transform.position,
          posX = _this$transform$posit2.x,
          posY = _this$transform$posit2.y;
      var scalars = [],
          v = new Vector();
      this.vertices.forEach(function (point) {
        v.x = point.x + posX;
        v.y = point.y + posY;
        scalars.push(v.dot(axis));
      });
      return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    }
  }, {
    key: "addPoint",
    value: function addPoint(x, y) {
      this.vertices.push(new Vertices(x, y));
    }
  }, {
    key: "move",
    value: function move(dx, dy) {
      for (var i = 0, point; i < this.vertices.length; i++) {
        point = this.vertices[i];
        point.x += dx;
        point.y += dy;
      }
    }
  }]);

  return Polygon;
}(Shape);

var Cirlce =
/*#__PURE__*/
function (_Shape) {
  _inherits(Cirlce, _Shape);

  function Cirlce(radius, opts) {
    var _this;

    _classCallCheck(this, Cirlce);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Cirlce).call(this, opts));
    _this.type = 'circle';
    _this.radius = radius;
    return _this;
  }

  _createClass(Cirlce, [{
    key: "getAxes",
    value: function getAxes() {}
  }, {
    key: "project",
    value: function project(axis) {}
  }, {
    key: "addPoint",
    value: function addPoint(x, y) {}
  }, {
    key: "move",
    value: function move(dx, dy) {}
  }]);

  return Cirlce;
}(Shape);

var Rectangle =
/*#__PURE__*/
function (_Shape) {
  _inherits(Rectangle, _Shape);

  function Rectangle(width, height, opts) {
    var _this;

    _classCallCheck(this, Rectangle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Rectangle).call(this, opts));
    _this.type = 'rectangle';
    _this.width = width;
    _this.height = height;
    return _this;
  }

  _createClass(Rectangle, [{
    key: "getAxes",
    value: function getAxes() {}
  }, {
    key: "project",
    value: function project(axis) {}
  }, {
    key: "addPoint",
    value: function addPoint(x, y) {}
  }, {
    key: "move",
    value: function move(dx, dy) {}
  }]);

  return Rectangle;
}(Shape);

/*global "development"*/

{
  document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
}

var myGame = Engine.create(document.getElementById('stage'), {
  width: 600,
  height: 300
});
var startBtn = document.getElementById('start');
var stopBtn = document.getElementById('stop');
var pauseBtn = document.getElementById('pause');
var fastBtn = document.getElementById('fastward');
var player = new Object$1({
  shape: new Polygon([[0, 0], [60, 0], [60, 20], [30, 40], [10, 40]], {
    fill: '#009688'
  }),
  transform: {
    position: {
      x: 230,
      y: 150
    }
  },
  start: function start() {},
  update: function update() {
    var transform = this.transform;
    var horizontalInput = Input.getAxis('horizontal');
    var verticalInput = Input.getAxis('vertical');
    var speed = 100;
    transform.position.x += speed * Time.deltaTime * horizontalInput;
    transform.position.y += speed * Time.deltaTime * verticalInput;

    if (this.shape.collidesWith(obstacle1.shape)) {
      console.log('collide!!');
    }
  }
});
var obstacle1 = new Object$1({
  shape: new Rectangle(600, 20),
  transform: {
    position: {
      x: 0,
      y: 270
    }
  },
  start: function start() {},
  update: function update() {}
});
var obstacle2 = new Object$1({
  shape: new Cirlce(20, {
    fill: '#ffc107'
  }),
  transform: {
    position: {
      x: 100,
      y: 50
    }
  },
  start: function start() {},
  update: function update() {// let { transform } = this;
    // const speed = 100;
    // transform.position.x += speed * Time.deltaTime;
  }
});
myGame.scene.addObject(player);
myGame.scene.addObject(obstacle1);
myGame.scene.addObject(obstacle2);
myGame.render.render();
startBtn.addEventListener('click', function () {
  myGame.restart();
});
stopBtn.addEventListener('click', function () {
  myGame.stop();
});
pauseBtn.addEventListener('click', function () {
  if (myGame.status === 'paused') {
    myGame.resume();
  } else {
    myGame.pause();
  }
});
fastBtn.addEventListener('click', function () {
  myGame.Time.timeScale = 1.5;
});
console.log(myGame);
//# sourceMappingURL=bundle.js.map
