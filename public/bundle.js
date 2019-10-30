/*!
 * tree-graph-d3.js v1.0.0
 * (c) 2018-2019 bowiego
 * Released under the MIT License.
 */
var Camera = {};

Camera.create = function (game) {
  var camera = {};
  camera.position = {
    x: 0,
    y: 0
  };
  camera.offset = {
    x: 0,
    y: 0
  };
  camera.scale = 1;
  camera.lookAt = null;
  var isDragging = false;
  var lastMousePosition = {
    x: 0,
    y: 0
  }; // trackTransforms(CanvasRenderer.context);

  game.mouse.on('mousemove', function (mouse) {
    if (isDragging) {
      camera.offset = subPos(mouse.position, lastMousePosition);
      camera.position = addPos(camera.position, camera.offset);
      lastMousePosition.x = mouse.position.x;
      lastMousePosition.y = mouse.position.y;
      game.renderer.translate(camera.offset);
    }
  });
  game.mouse.on('mouseout', function (mouse) {
    isDragging = false;
  });
  game.mouse.on('mousedown', function (mouse) {
    isDragging = true;
    lastMousePosition.x = mouse.mousedownPosition.x;
    lastMousePosition.y = mouse.mousedownPosition.y;
  });
  game.mouse.on('mouseup', function (mouse) {
    camera.offset = {
      x: 0,
      y: 0
    };
    isDragging = false;
  });
  game.mouse.on('mousewheel', function (mouse) {
    camera.scale *= 1 + mouse.wheelDelta * 0.03;
    game.renderer.zoomToPoint(mouse.position, camera.scale);
  });

  camera.recover = function () {
    game.renderer.clear(camera.scale);
    game.renderer.context.translate(-camera.position.x, -camera.position.y);
    game.renderer.context.scale(1 / camera.scale, 1 / camera.scale);
    camera.scale = 1;
    camera.offset = {
      x: 0,
      y: 0
    };
    camera.position = {
      x: 0,
      y: 0
    };
  };

  return camera;
};

Camera.lookAt = function () {};

Camera.follow = function () {};

function addPos(posA, posB) {
  return {
    x: posA.x + posB.x,
    y: posA.y + posB.y
  };
}

function subPos(posA, posB) {
  return {
    x: posA.x - posB.x,
    y: posA.y - posB.y
  };
} // function trackTransforms(context){

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

var Mouse = {};

Mouse.create = function (element) {
  var mouse = {};
  mouse.element = element;
  mouse.absolute = {
    x: 0,
    y: 0
  };
  mouse.position = {
    x: 0,
    y: 0
  };
  mouse.mousedownPosition = {
    x: 0,
    y: 0
  };
  mouse.mouseupPosition = {
    x: 0,
    y: 0
  };
  mouse.offset = {
    x: 0,
    y: 0
  };
  mouse.scale = {
    x: 1,
    y: 1
  };
  mouse.wheelDelta = 0;
  mouse.button = -1;
  mouse.pixelRatio = parseInt(mouse.element.getAttribute('data-pixel-ratio'), 10) || 1;
  mouse.sourceEvents = {
    mousemove: null,
    mouseout: null,
    mousedown: null,
    mouseup: null,
    mousewheel: null
  };
  mouse.eventHooks = {
    mousemove: null,
    mouseout: null,
    mousedown: null,
    mouseup: null,
    mousewheel: null
  };

  mouse.on = function (eventName, callback) {
    mouse.eventHooks[eventName] = callback;
  };

  mouse.triggerHook = function (eventName) {
    mouse.eventHooks[eventName].call(null, mouse);
  };

  mouse.mousemove = function (event) {
    var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
        touches = event.changedTouches;

    if (touches) {
      mouse.button = 0;
      event.preventDefault();
    }

    mouse.absolute.x = position.x;
    mouse.absolute.y = position.y;
    mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
    mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
    mouse.sourceEvents.mousemove = event;
    mouse.triggerHook('mousemove');
  };

  mouse.mouseout = function () {
    mouse.triggerHook('mouseout');
  };

  mouse.mousedown = function (event) {
    var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
        touches = event.changedTouches;

    if (touches) {
      mouse.button = 0;
      event.preventDefault();
    } else {
      mouse.button = event.button;
    }

    mouse.absolute.x = position.x;
    mouse.absolute.y = position.y;
    mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
    mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
    mouse.mousedownPosition.x = mouse.position.x;
    mouse.mousedownPosition.y = mouse.position.y;
    mouse.sourceEvents.mousedown = event;
    mouse.triggerHook('mousedown');
  };

  mouse.mouseup = function (event) {
    var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
        touches = event.changedTouches;

    if (touches) {
      event.preventDefault();
    }

    mouse.button = -1;
    mouse.absolute.x = position.x;
    mouse.absolute.y = position.y;
    mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
    mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
    mouse.mouseupPosition.x = mouse.position.x;
    mouse.mouseupPosition.y = mouse.position.y;
    mouse.sourceEvents.mouseup = event;
    mouse.triggerHook('mouseup');
  };

  mouse.mousewheel = function (event) {
    mouse.wheelDelta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
    event.preventDefault();
    mouse.triggerHook('mousewheel');
  };

  Mouse.setElement(mouse, element);
  return mouse;
};

Mouse.setElement = function (mouse, element) {
  element.addEventListener('mousemove', mouse.mousemove);
  element.addEventListener('mouseout', mouse.mouseout);
  element.addEventListener('mousedown', mouse.mousedown);
  element.addEventListener('mouseup', mouse.mouseup);
  element.addEventListener('mousewheel', mouse.mousewheel);
  element.addEventListener('DOMMouseScroll', mouse.mousewheel);
  element.addEventListener('touchmove', mouse.mousemove);
  element.addEventListener('touchstart', mouse.mousedown);
  element.addEventListener('touchend', mouse.mouseup);
};
/**
 * Sets the mouse position offset.
 * @method setOffset
 * @param {mouse} mouse
 * @param {vector} offset
 */


Mouse.setOffset = function (mouse, offset) {
  mouse.offset.x = offset.x;
  mouse.offset.y = offset.y;
  mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
  mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
};
/**
 * Sets the mouse position scale.
 * @method setScale
 * @param {mouse} mouse
 * @param {vector} scale
 */


Mouse.setScale = function (mouse, scale) {
  mouse.scale.x = scale.x;
  mouse.scale.y = scale.y;
  mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
  mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
};
/**
 * Gets the mouse position relative to an element given a screen pixel ratio.
 * @method _getRelativeMousePosition
 * @private
 * @param {} event
 * @param {} element
 * @param {number} pixelRatio
 * @return {}
 */


Mouse._getRelativeMousePosition = function (event, element, pixelRatio) {
  var elementBounds = element.getBoundingClientRect(),
      rootNode = document.documentElement || document.body.parentNode || document.body,
      scrollX = window.pageXOffset !== undefined ? window.pageXOffset : rootNode.scrollLeft,
      scrollY = window.pageYOffset !== undefined ? window.pageYOffset : rootNode.scrollTop,
      touches = event.changedTouches,
      x,
      y;

  if (touches) {
    x = touches[0].pageX - elementBounds.left - scrollX;
    y = touches[0].pageY - elementBounds.top - scrollY;
  } else {
    x = event.pageX - elementBounds.left - scrollX;
    y = event.pageY - elementBounds.top - scrollY;
  }

  return {
    x: x / (element.clientWidth / (element.width || element.clientWidth) * pixelRatio),
    y: y / (element.clientHeight / (element.height || element.clientHeight) * pixelRatio)
  };
};

function extend(obj, deep) {
  var argsStart, deepClone;

  if (typeof deep === 'boolean') {
    argsStart = 2;
    deepClone = deep;
  } else {
    argsStart = 1;
    deepClone = true;
  }

  for (var i = argsStart; i < arguments.length; i++) {
    var source = arguments[i];

    if (source) {
      for (var prop in source) {
        if (deepClone && source[prop] && source[prop].constructor === Object) {
          if (!obj[prop] || obj[prop].constructor === Object) {
            obj[prop] = obj[prop] || {};
            extend(obj[prop], deepClone, source[prop]);
          } else {
            obj[prop] = source[prop];
          }
        } else {
          obj[prop] = source[prop];
        }
      }
    }
  }

  return obj;
}
function clone(obj, deep) {
  return extend({}, deep, obj);
}
function keys(obj) {
  if (Object.keys) return Object.keys(obj); // avoid hasOwnProperty for performance

  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
}
function isFunction(obj) {
  return typeof obj === 'function';
}

var Events = {};

Events.create = function (game) {
  this.game = game;
  game.events = {};
};

Events.on = function (eventNames, callback) {
  var names = eventNames.split(' '),
      name;

  for (var i = 0; i < names.length; i++) {
    name = names[i];
    this.game.events[name] = this.game.events[name] || [];
    this.game.events[name].push(callback);
  }

  return callback;
};

Events.off = function (eventNames, callback) {
  if (!eventNames) {
    object.events = {};
    return;
  } // handle Events.off(callback)


  if (typeof eventNames === 'function') {
    callback = eventNames;
    eventNames = keys(this.game.events).join(' ');
  }

  var names = eventNames.split(' ');

  for (var i = 0; i < names.length; i++) {
    var callbacks = this.game.events[names[i]],
        newCallbacks = [];

    if (callback && callbacks) {
      for (var j = 0; j < callbacks.length; j++) {
        if (callbacks[j] !== callback) newCallbacks.push(callbacks[j]);
      }
    }

    this.game.events[names[i]] = newCallbacks;
  }
};

Events.trigger = function (eventNames, event) {
  var names, name, callbacks, eventClone;
  var events = this.game.events;

  if (events && keys(events).length > 0) {
    if (!event) event = {};
    names = eventNames.split(' ');

    for (var i = 0; i < names.length; i++) {
      name = names[i];
      callbacks = events[name];

      if (callbacks) {
        eventClone = clone(event, false);
        eventClone.name = name;
        eventClone.source = this.game;

        for (var j = 0; j < callbacks.length; j++) {
          callbacks[j].apply(this.game, [eventClone]);
        }
      }
    }
  }
};

var Scene = {};

Scene.create = function (game) {
  var scene = {};
  scene.objects = [];

  scene.addObject = function (object) {
    scene.objects.push(object);
    Events.trigger('addObject', object);
  };

  scene.reset = function () {
    scene.objects.forEach(function (object) {
      object.reset();
    });
  };

  scene.update = function () {
    scene.objects.forEach(function (object) {
      if (game.status === 'playing') {
        object.updateCb.call(object);
      }
    });
  };

  return scene;
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

var Vertice = function Vertice(x, y) {
  _classCallCheck(this, Vertice);

  this.x = x;
  this.y = y;
};

var iMatrix = [1, 0, 0, 1, 0, 0];

var CanvasRenderer =
/*#__PURE__*/
function () {
  function CanvasRenderer(opts) {
    _classCallCheck(this, CanvasRenderer);

    var _opts$width = opts.width,
        width = _opts$width === void 0 ? 300 : _opts$width,
        _opts$height = opts.height,
        height = _opts$height === void 0 ? 300 : _opts$height,
        _opts$bgColor = opts.bgColor,
        bgColor = _opts$bgColor === void 0 ? 'aliceblue' : _opts$bgColor;
    this.canvas = _createCanvas();
    this.context = this.canvas.getContext('2d');
    this.viewportTransform = iMatrix;
    this.pixelRatio = _getPixelRatio(this.canvas);
    this.canvas.setAttribute('data-pixel-ratio', this.pixelRatios);
    this.context.scale(this.pixelRatio, this.pixelRatio);
    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = height * this.pixelRatio;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.canvas.style.backgroundColor = bgColor;
  }

  _createClass(CanvasRenderer, [{
    key: "getZoom",
    value: function getZoom() {
      return this.viewportTransform[0];
    }
  }, {
    key: "setViewportTransform",
    value: function setViewportTransform(vpt) {
      this.viewportTransform = vpt;
    }
  }, {
    key: "resetTransform",
    value: function resetTransform() {
      this.setViewportTransform(iMatrix);
    }
  }, {
    key: "zoomToPoint",
    value: function zoomToPoint(point, value) {
      var before = point,
          vpt = this.viewportTransform.slice(0);
      point = transformPoint(point, invertTransform(this.viewportTransform));
      vpt[0] = value;
      vpt[3] = value;
      var after = transformPoint(point, vpt);
      vpt[4] += before.x - after.x;
      vpt[5] += before.y - after.y;
      this.setViewportTransform(vpt);
    }
  }, {
    key: "translate",
    value: function translate(offset) {
      this.clear();
      this.context.translate(offset.x, offset.y);
    }
  }, {
    key: "render",
    value: function render(objects) {
      var context = this.context,
          pixelRatio = this.pixelRatio;
      var vpt = this.viewportTransform;
      context.save();
      context.transform(vpt[0] * pixelRatio, vpt[1], vpt[2], vpt[3] * pixelRatio, vpt[4], vpt[5]);

      _renderObjects(this.context, objects);

      context.restore();
      Events.trigger('rendered', this.context);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.context.clearRect(0, 0, this.width, this.height);
    }
  }, {
    key: "width",
    get: function get() {
      return this.canvas.width;
    }
  }, {
    key: "height",
    get: function get() {
      return this.canvas.height;
    }
  }]);

  return CanvasRenderer;
}();

function _createCanvas() {
  var canvas = document.createElement('canvas');
  canvas.getPixelRatio = _getPixelRatio.bind(null, canvas);
  return canvas;
}
/**
 * Gets the pixel ratio of the canvas.
 */


function _getPixelRatio(canvas) {
  var context = canvas.getContext('2d'),
      devicePixelRatio = window.devicePixelRatio || 1,
      backingStorePixelRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
  return devicePixelRatio / backingStorePixelRatio;
}
/**
 * Render several types of graphics in canvas
 */


function _renderObjects(context, objects) {
  objects = objects || [];
  objects.forEach(function (object) {
    var shapeType = object.shape.type;

    switch (shapeType) {
      case 'polygon':
        _renderPolygon(context, object.shape);

        break;

      case 'rectangle':
        _renderRectangle(context, object.shape);

        break;

      case 'circle':
        _renderCircle(context, object.shape);

        break;

      case 'text':
        _renderText(context, object.shape);

        break;

      case 'polyline':
        _renderPolyline(context, object.shape);

        break;

      default:
        break;
    }
  });
}

function _renderPolygon(context, shape) {
  var _shape$transform$posi = shape.transform.position,
      posX = _shape$transform$posi.x,
      posY = _shape$transform$posi.y;
  context.beginPath();
  context.moveTo(shape.vertices[0].x + posX, shape.vertices[0].y + posY);

  for (var i = 1; i < shape.vertices.length; i++) {
    context.lineTo(shape.vertices[i].x + posX, shape.vertices[i].y + posY);
  }

  context.closePath();

  _draw(context, shape);
}

function _renderRectangle(context, shape) {
  var _shape$transform$posi2 = shape.transform.position,
      posX = _shape$transform$posi2.x,
      posY = _shape$transform$posi2.y;
  context.beginPath();
  context.rect(posX, posY, shape.width, shape.height);
  context.closePath();

  _draw(context, shape);
}

function _renderCircle(context, shape) {
  var _shape$transform$posi3 = shape.transform.position,
      posX = _shape$transform$posi3.x,
      posY = _shape$transform$posi3.y;
  context.beginPath();
  context.arc(posX, posY, shape.radius, 0, Math.PI * 2, false);
  context.closePath();

  _draw(context, shape);
}

function _renderText(context, shape) {
  var _shape$transform$posi4 = shape.transform.position,
      posX = _shape$transform$posi4.x,
      posY = _shape$transform$posi4.y;
  context.font = shape.font;
  context.fillStyle = shape.fillStyle;
  context.strokeStyle = shape.strokeStyle;
  shape.fill && context.fillText(shape.text, posX, posY);
  shape.strokeWidth > 0 && context.strokeText(shape.text, posX, posY);
}

function _renderPolyline(context, shape) {
  var _shape$transform$posi5 = shape.transform.position,
      posX = _shape$transform$posi5.x,
      posY = _shape$transform$posi5.y;
  context.beginPath();
  context.moveTo(shape.vertices[0].x + posX, shape.vertices[0].y + posY);

  for (var i = 1; i < shape.vertices.length; i++) {
    context.lineTo(shape.vertices[i].x + posX, shape.vertices[i].y + posY);
  }

  shape.close && context.closePath();

  _drawLine(context, shape);
} // function _renderFill (context) {
//   context.save();
//   context.fill();
//   context.restore();
// }
// function _renderStroke (context) {
//   context.save();
//   context.stroke();
//   context.restore();
// }


function _draw(context, shape) {
  context.save();
  context.lineWidth = shape.strokeWidth;
  context.strokeStyle = shape.strokeStyle;
  context.fillStyle = shape.fillStyle;
  shape.strokeWidth > 0 && context.stroke();
  shape.fill && context.fill();
  context.restore();
}

function _drawLine(context, shape) {
  context.save();
  context.lineWidth = shape.strokeWidth;
  context.strokeStyle = shape.strokeStyle;
  context.stroke();
  context.restore();
}

function transformPoint(p, t, ignoreOffset) {
  if (ignoreOffset) {
    return new Vertice(t[0] * p.x + t[2] * p.y, t[1] * p.x + t[3] * p.y);
  }

  return new Vertice(t[0] * p.x + t[2] * p.y + t[4], t[1] * p.x + t[3] * p.y + t[5]);
}

function invertTransform(t) {
  var a = 1 / (t[0] * t[3] - t[1] * t[2]),
      r = [a * t[3], -a * t[1], -a * t[2], a * t[0]],
      o = transformPoint({
    x: t[4],
    y: t[5]
  }, r, true);
  r[4] = -o.x;
  r[5] = -o.y;
  return r;
}

var Renderer = {};

Renderer.create = function (el, opts) {
  var renderer = new CanvasRenderer(opts);
  el.append(renderer.canvas);
  return renderer;
};

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
  game.PAUSE_TIMEOUT = 100;
  Events.create(game);
  game.renderer = Renderer.create(el, opts);
  game.view = game.renderer.canvas;
  game.mouse = Mouse.create(game.view);
  game.camera = Camera.create(game);
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
  Events.on('addObject', function (object) {
    game.renderer.render([object]);
  });
  return game;
};

Engine.reset = function (game) {
  _cancelFrame(game.frameReq);

  Time.reset();
  game.frameReq = null;
  game.scene.reset();
  game.renderer.clear();
  game.renderer.render(game.scene.objects);
};

Engine.run = function (game) {
  if (game.frameReq) {
    game.stop();
  }

  game.frameReq = _reqFrame(function (timeStamp) {
    return tick.call(null, timeStamp);
  });

  function tick(timeStamp) {
    Events.trigger('tick', timeStamp);
    Time.update(timeStamp); // update Time

    game.scene.update();
    game.renderer.clear();
    game.renderer.render(game.scene.objects);
    game.frameReq = _reqFrame(function (timeStamp) {
      return tick.call(null, timeStamp);
    });
  }
};

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
      var context = this.Scene.context;
      var position = this.transform.position;
      var rectW = 40;
      var rectH = 40;
      context.fillStyle = this.fill;
      context.fillRect(position.x, position.y, rectW, rectH);
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
    value: function overlaps(projection) {// return this.max > projection.min && projection.max > this.min;
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

    opts = opts || {};
    this.transform = {
      position: {}
    };
    this.fill = opts.fill === undefined ? true : !!opts.fill;
    this.fillStyle = opts.fillStyle || '#83cbff';
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
      return new Vertice(point[0], point[1]);
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
      this.vertices.push(new Vertice(x, y));
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

var Text =
/*#__PURE__*/
function (_Shape) {
  _inherits(Text, _Shape);

  function Text(text, opts) {
    var _this;

    _classCallCheck(this, Text);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, opts));
    _this.type = 'text';
    _this.text = text;
    _this.font = '18px verdana';
    _this.fillStyle = '#333';
    return _this;
  }

  _createClass(Text, [{
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

  return Text;
}(Shape);

var Line =
/*#__PURE__*/
function () {
  function Line(opts) {
    _classCallCheck(this, Line);

    opts = opts || {};
    this.transform = {
      position: {}
    };
    this.close = !!opts.close;
    this.style = this.style || 'solid';
    this.fill = opts.fill === undefined ? true : !!opts.fill;
    this.fillStyle = opts.fillStyle || '#83cbff';
    this.strokeWidth = opts.strokeWidth || 0;
    this.strokeStyle = opts.stroke || 'grey';
  }

  _createClass(Line, [{
    key: "move",
    value: function move(dx, dy) {}
  }]);

  return Line;
}();

var Polyline =
/*#__PURE__*/
function (_Line) {
  _inherits(Polyline, _Line);

  function Polyline(points, opts) {
    var _this;

    _classCallCheck(this, Polyline);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Polyline).call(this, opts));
    _this.type = 'polyline';
    _this.vertices = points.map(function (point) {
      return new Vertice(point[0], point[1]);
    });
    return _this;
  }

  _createClass(Polyline, [{
    key: "move",
    value: function move(dx, dy) {}
  }]);

  return Polyline;
}(Line);

function insertAfter(el, targetEl) {
  var parent = targetEl.parentNode;

  if (parent.lastChild === targetEl) {
    parent.appendChild(el);
  } else {
    parent.insertBefore(el, targetEl.nextSibling);
  }
}

var Performance = {};

Performance.create = function (game, opts) {
  var performance = {};
  var view = game.view.getBoundingClientRect();
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
  });
  game.widget = game.widget || {};
  game.widget['performance'] = Performance;
};

Performance.update = function (performance) {
  performance.fpsEl.innerText = Time.fps.toFixed(2);
};

function _addFPS(performance) {
  performance.fpsEl = document.createElement('div');
  performance.el.append(performance.fpsEl);
  performance.fpsEl.style.color = 'white';
}

/*global "development"*/

{
  document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
}

var myGame = Engine.create(document.getElementById('stage'), {
  width: 600,
  height: 300
});
Performance.create(myGame);
var startBtn = document.getElementById('start');
var stopBtn = document.getElementById('stop');
var pauseBtn = document.getElementById('pause');
var fastBtn = document.getElementById('fastward');
var recoverBtn = document.getElementById('recover');
var player = new Object$1({
  shape: new Polygon([[0, 0], [60, 0], [60, 20], [30, 40], [10, 40]], {
    fillStyle: '#009688'
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
    fillStyle: '#ffc107'
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
var title = new Object$1({
  shape: new Text('Engine Test'),
  transform: {
    position: {
      x: 200,
      y: 50
    }
  },
  start: function start() {},
  update: function update() {}
});
var polyline = new Object$1({
  shape: new Polyline([[0, 0], [60, 0], [60, 20], [30, 40], [10, 40]], {
    style: 'dashed'
  }),
  transform: {
    position: {
      x: 320,
      y: 150
    }
  },
  start: function start() {},
  update: function update() {}
});
myGame.scene.addObject(obstacle1);
myGame.scene.addObject(obstacle2);
myGame.scene.addObject(title);
myGame.scene.addObject(polyline);
myGame.scene.addObject(player);
myGame.start();
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
recoverBtn.addEventListener('click', function () {
  myGame.camera.recover();
});
console.log('myGame', myGame);
//# sourceMappingURL=bundle.js.map
