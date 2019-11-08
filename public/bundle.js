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
function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
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
    this.fill = opts.fill || '#83cbff';
    this.strokeWidth = opts.strokeWidth || 0;
    this.stroke = opts.stroke || 'grey';
  }

  _createClass(Line, [{
    key: "move",
    value: function move(dx, dy) {}
  }]);

  return Line;
}();

var Arc =
/*#__PURE__*/
function (_Line) {
  _inherits(Arc, _Line);

  function Arc(opts) {
    var _this;

    _classCallCheck(this, Arc);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Arc).call(this, opts));
    _this.type = 'arc';
    return _this;
  }

  _createClass(Arc, [{
    key: "move",
    value: function move(dx, dy) {}
  }]);

  return Arc;
}(Line);

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
    this.fill = opts.fill || '#83cbff';
    this.stroke = opts.stroke || 'grey';
    this.strokeWidth = opts.strokeWidth || 0;
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

var Curve =
/*#__PURE__*/
function (_Line) {
  _inherits(Curve, _Line);

  function Curve(opts) {
    var _this;

    _classCallCheck(this, Curve);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Curve).call(this, opts));
    _this.type = 'curve';
    return _this;
  }

  _createClass(Curve, [{
    key: "move",
    value: function move(dx, dy) {}
  }]);

  return Curve;
}(Line);

var commandLengths = {
  m: 2,
  l: 2,
  h: 1,
  v: 1,
  c: 6,
  s: 4,
  q: 4,
  t: 2,
  a: 7
},
    repeatedCommands = {
  m: 'l',
  M: 'L'
};

var Path =
/*#__PURE__*/
function (_Shape) {
  _inherits(Path, _Shape);

  function Path(path, opts) {
    var _this;

    _classCallCheck(this, Path);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Path).call(this, opts));
    _this.type = 'path';
    _this.path = path.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);
    _this.path = Path.parsePath(_this.path);
    _this.width = 0;
    _this.height = 0;
    _this.dimensions = _this.calcDimensions();
    console.log('new Path', _assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Path, [{
    key: "calcDimensions",
    value: function calcDimensions() {
      return {
        left: 0,
        top: 0,
        width: this.width,
        height: this.height
      };
    }
  }], [{
    key: "parsePath",
    value: function parsePath(path) {
      var result = [],
          coords = [],
          currentPath,
          parsed,
          re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/ig,
          match,
          coordsStr;

      for (var i = 0, coordsParsed, len = path.length; i < len; i++) {
        currentPath = path[i];
        coordsStr = currentPath.slice(1).trim();
        coords.length = 0;

        while (match = re.exec(coordsStr)) {
          coords.push(match[0]);
        }

        coordsParsed = [currentPath.charAt(0)];

        for (var j = 0, jlen = coords.length; j < jlen; j++) {
          parsed = parseFloat(coords[j]);

          if (!isNaN(parsed)) {
            coordsParsed.push(parsed);
          }
        }

        var command = coordsParsed[0],
            commandLength = commandLengths[command.toLowerCase()],
            repeatedCommand = repeatedCommands[command] || command;

        if (coordsParsed.length - 1 > commandLength) {
          for (var k = 1, klen = coordsParsed.length; k < klen; k += commandLength) {
            result.push([command].concat(coordsParsed.slice(k, k + commandLength)));
            command = repeatedCommand;
          }
        } else {
          result.push(coordsParsed);
        }
      }

      return result;
    }
  }]);

  return Path;
}(Shape);

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

var Vertice = function Vertice(x, y) {
  _classCallCheck(this, Vertice);

  this.x = x;
  this.y = y;
};

function getValue(object, key) {
  var keysArray = key.split('.');
  var value = object;

  for (var i = 0, len = keysArray.length; i < len; i++) {
    value = value[keysArray[i]];

    if (value === undefined) {
      console.error("can't find object value ".concat(key));
      return;
    }
  }

  return value;
}

/**
 * Finds maximum value in array (not necessarily "first" one)
 * @memberOf fabric.util.array
 * @param {Array} array Array to iterate over
 * @param {String} byProperty
 * @return {*}
 */

function max(array, byProperty) {
  return find(array, byProperty, function (value1, value2) {
    return value1 >= value2;
  });
}
/**
 * Finds minimum value in array (not necessarily "first" one)
 * @memberOf fabric.util.array
 * @param {Array} array Array to iterate over
 * @param {String} byProperty
 * @return {*}
 */

function min(array, byProperty) {
  return find(array, byProperty, function (value1, value2) {
    return value1 < value2;
  });
}
function find(array, byProperty, condition) {
  if (!array || array.length === 0) {
    return;
  }

  var i = array.length - 1,
      result = byProperty ? getValue(array[i], byProperty) : array[i];

  if (byProperty) {
    while (i--) {
      if (condition(getValue(array[i], byProperty), result)) {
        result = getValue(array[i], byProperty);
      }
    }
  } else {
    while (i--) {
      if (condition(array[i], result)) {
        result = array[i];
      }
    }
  }

  return result;
}

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
    _this.dimensions = _this.calcDimensions();
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
    key: "calcDimensions",
    value: function calcDimensions() {
      var vertices = this.vertices,
          minX = min(vertices, 'x') || 0,
          minY = min(vertices, 'y') || 0,
          maxX = max(vertices, 'x') || 0,
          maxY = max(vertices, 'y') || 0,
          width = maxX - minX,
          height = maxY - minY;
      return {
        left: minX,
        top: minY,
        width: width,
        height: height
      };
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

var Rectangle =
/*#__PURE__*/
function (_Shape) {
  _inherits(Rectangle, _Shape);

  function Rectangle(opts) {
    var _this;

    _classCallCheck(this, Rectangle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Rectangle).call(this, opts));
    _this.type = 'rectangle';
    _this.width = opts.width || 0;
    _this.height = opts.height || 0;
    _this.rx = opts.rx || 0;
    _this.ry = opts.ry || 0;
    _this.dimensions = _this.calcDimensions();
    return _this;
  }

  _createClass(Rectangle, [{
    key: "getAxes",
    value: function getAxes() {}
  }, {
    key: "project",
    value: function project(axis) {// console.log(axis);
    }
  }, {
    key: "addPoint",
    value: function addPoint(x, y) {
      console.log(x, y);
    }
  }, {
    key: "calcDimensions",
    value: function calcDimensions() {
      return {
        left: 0,
        top: 0,
        width: this.width,
        height: this.height
      };
    }
  }, {
    key: "move",
    value: function move(dx, dy) {
      console.log(dx, dy);
    }
  }]);

  return Rectangle;
}(Shape);

var Sprite =
/*#__PURE__*/
function (_Shape) {
  _inherits(Sprite, _Shape);

  function Sprite(opts) {
    var _this;

    _classCallCheck(this, Sprite);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Sprite).call(this, opts));
    _this.type = 'sprite';
    return _this;
  }

  _createClass(Sprite, [{
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

  return Sprite;
}(Shape);

/**
 * Constants that define the type of gradient on text.
 *
 * @static
 * @constant
 * @type {object}
 * @property {number} LINEAR_VERTICAL Vertical gradient
 * @property {number} LINEAR_HORIZONTAL Linear gradient
 */
var TEXT_GRADIENT = {
  LINEAR_VERTICAL: 0,
  LINEAR_HORIZONTAL: 1
};

/**
 * Converts a hexadecimal color number to a string.
 * @param {number} hex - Number in hex (e.g., `0xffffff`)
 * @return {string} The string color (e.g., `"#ffffff"`).
 */
function hex2string(hex) {
  hex = hex.toString(16);
  hex = '000000'.substr(0, 6 - hex.length) + hex;
  return "#".concat(hex);
}

var defaultStyle = {
  align: 'left',
  breakWords: false,
  dropShadow: false,
  dropShadowAlpha: 1,
  dropShadowAngle: Math.PI / 6,
  dropShadowBlur: 0,
  dropShadowColor: 'black',
  dropShadowDistance: 5,
  fill: 'black',
  fillGradientType: TEXT_GRADIENT.LINEAR_VERTICAL,
  fillGradientStops: [],
  fontFamily: 'Arial',
  fontSize: 26,
  fontStyle: 'normal',
  fontVariant: 'normal',
  fontWeight: 'normal',
  letterSpacing: 0,
  lineHeight: 0,
  lineJoin: 'miter',
  miterLimit: 10,
  padding: 0,
  stroke: 'black',
  strokeThickness: 0,
  textBaseline: 'alphabetic',
  trim: false,
  whiteSpace: 'pre',
  wordWrap: false,
  wordWrapWidth: 100,
  leading: 0
};
var genericFontFamilies = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui'];
var TextStyle =
/*#__PURE__*/
function () {
  function TextStyle(style) {
    _classCallCheck(this, TextStyle);

    this.styleID = 0;
    this.reset();
    deepCopyProperties(this, style, style);
  }

  _createClass(TextStyle, [{
    key: "reset",
    value: function reset() {
      deepCopyProperties(this, defaultStyle, defaultStyle);
    }
  }, {
    key: "clone",
    value: function clone() {
      var clonedProperties = {};
      deepCopyProperties(clonedProperties, this, defaultStyle);
      return new TextStyle(clonedProperties);
    }
  }, {
    key: "toFontString",
    value: function toFontString() {
      var fontSizeString = typeof this.fontSize === 'number' ? "".concat(this.fontSize, "px") : this.fontSize;
      var fontFamilies = this.fontFamily;

      if (!Array.isArray(this.fontFamily)) {
        fontFamilies = this.fontFamily.split(',');
      }

      for (var i = fontFamilies.length - 1; i >= 0; i--) {
        // Trim any extra white-space
        var fontFamily = fontFamilies[i].trim(); // Check if font already contains strings

        if (!/([\"\'])[^\'\"]+\1/.test(fontFamily) && genericFontFamilies.indexOf(fontFamily) < 0) {
          fontFamily = "\"".concat(fontFamily, "\"");
        }

        fontFamilies[i] = fontFamily;
      }

      return "".concat(this.fontStyle, " ").concat(this.fontVariant, " ").concat(this.fontWeight, " ").concat(fontSizeString, " ").concat(fontFamilies.join(','));
    }
  }, {
    key: "align",
    get: function get() {
      return this._align;
    },
    set: function set(align) {
      if (this._align !== align) {
        this._align = align;
        this.styleID++;
      }
    }
    /**
     * Indicates if lines can be wrapped within words, it needs wordWrap to be set to true
     *
     * @member {boolean}
     */

  }, {
    key: "breakWords",
    get: function get() {
      return this._breakWords;
    },
    set: function set(breakWords) {
      if (this._breakWords !== breakWords) {
        this._breakWords = breakWords;
        this.styleID++;
      }
    }
    /**
     * Set a drop shadow for the text
     *
     * @member {boolean}
     */

  }, {
    key: "dropShadow",
    get: function get() {
      return this._dropShadow;
    },
    set: function set(dropShadow) {
      if (this._dropShadow !== dropShadow) {
        this._dropShadow = dropShadow;
        this.styleID++;
      }
    }
    /**
     * Set alpha for the drop shadow
     *
     * @member {number}
     */

  }, {
    key: "dropShadowAlpha",
    get: function get() {
      return this._dropShadowAlpha;
    },
    set: function set(dropShadowAlpha) {
      if (this._dropShadowAlpha !== dropShadowAlpha) {
        this._dropShadowAlpha = dropShadowAlpha;
        this.styleID++;
      }
    }
    /**
     * Set a angle of the drop shadow
     *
     * @member {number}
     */

  }, {
    key: "dropShadowAngle",
    get: function get() {
      return this._dropShadowAngle;
    },
    set: function set(dropShadowAngle) {
      if (this._dropShadowAngle !== dropShadowAngle) {
        this._dropShadowAngle = dropShadowAngle;
        this.styleID++;
      }
    }
    /**
     * Set a shadow blur radius
     *
     * @member {number}
     */

  }, {
    key: "dropShadowBlur",
    get: function get() {
      return this._dropShadowBlur;
    },
    set: function set(dropShadowBlur) {
      if (this._dropShadowBlur !== dropShadowBlur) {
        this._dropShadowBlur = dropShadowBlur;
        this.styleID++;
      }
    }
    /**
     * A fill style to be used on the dropshadow e.g 'red', '#00FF00'
     *
     * @member {string|number}
     */

  }, {
    key: "dropShadowColor",
    get: function get() {
      return this._dropShadowColor;
    },
    set: function set(dropShadowColor) {
      var outputColor = getColor(dropShadowColor);

      if (this._dropShadowColor !== outputColor) {
        this._dropShadowColor = outputColor;
        this.styleID++;
      }
    }
    /**
     * Set a distance of the drop shadow
     *
     * @member {number}
     */

  }, {
    key: "dropShadowDistance",
    get: function get() {
      return this._dropShadowDistance;
    },
    set: function set(dropShadowDistance) {
      if (this._dropShadowDistance !== dropShadowDistance) {
        this._dropShadowDistance = dropShadowDistance;
        this.styleID++;
      }
    }
    /**
     * A canvas fillstyle that will be used on the text e.g 'red', '#00FF00'.
     * Can be an array to create a gradient eg ['#000000','#FFFFFF']
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
     *
     * @member {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
     */

  }, {
    key: "fill",
    get: function get() {
      return this._fill;
    },
    set: function set(fill) {
      var outputColor = getColor(fill);

      if (this._fill !== outputColor) {
        this._fill = outputColor;
        this.styleID++;
      }
    }
    /**
     * If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.
     *
     * @member {number}
     */

  }, {
    key: "fillGradientType",
    get: function get() {
      return this._fillGradientType;
    },
    set: function set(fillGradientType) {
      if (this._fillGradientType !== fillGradientType) {
        this._fillGradientType = fillGradientType;
        this.styleID++;
      }
    }
    /**
     * If fill is an array of colours to create a gradient, this array can set the stop points
     * (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
     *
     * @member {number[]}
     */

  }, {
    key: "fillGradientStops",
    get: function get() {
      return this._fillGradientStops;
    },
    set: function set(fillGradientStops) {
      if (!areArraysEqual(this._fillGradientStops, fillGradientStops)) {
        this._fillGradientStops = fillGradientStops;
        this.styleID++;
      }
    }
    /**
     * The font family
     *
     * @member {string|string[]}
     */

  }, {
    key: "fontFamily",
    get: function get() {
      return this._fontFamily;
    },
    set: function set(fontFamily) {
      if (this.fontFamily !== fontFamily) {
        this._fontFamily = fontFamily;
        this.styleID++;
      }
    }
    /**
     * The font size
     * (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')
     *
     * @member {number|string}
     */

  }, {
    key: "fontSize",
    get: function get() {
      return this._fontSize;
    },
    set: function set(fontSize) {
      if (this._fontSize !== fontSize) {
        this._fontSize = fontSize;
        this.styleID++;
      }
    }
    /**
     * The font style
     * ('normal', 'italic' or 'oblique')
     *
     * @member {string}
     */

  }, {
    key: "fontStyle",
    get: function get() {
      return this._fontStyle;
    },
    set: function set(fontStyle) {
      if (this._fontStyle !== fontStyle) {
        this._fontStyle = fontStyle;
        this.styleID++;
      }
    }
    /**
     * The font variant
     * ('normal' or 'small-caps')
     *
     * @member {string}
     */

  }, {
    key: "fontVariant",
    get: function get() {
      return this._fontVariant;
    },
    set: function set(fontVariant) {
      if (this._fontVariant !== fontVariant) {
        this._fontVariant = fontVariant;
        this.styleID++;
      }
    }
    /**
     * The font weight
     * ('normal', 'bold', 'bolder', 'lighter' and '100', '200', '300', '400', '500', '600', '700', 800' or '900')
     *
     * @member {string}
     */

  }, {
    key: "fontWeight",
    get: function get() {
      return this._fontWeight;
    },
    set: function set(fontWeight) {
      if (this._fontWeight !== fontWeight) {
        this._fontWeight = fontWeight;
        this.styleID++;
      }
    }
    /**
     * The amount of spacing between letters, default is 0
     *
     * @member {number}
     */

  }, {
    key: "letterSpacing",
    get: function get() {
      return this._letterSpacing;
    },
    set: function set(letterSpacing) {
      if (this._letterSpacing !== letterSpacing) {
        this._letterSpacing = letterSpacing;
        this.styleID++;
      }
    }
    /**
     * The line height, a number that represents the vertical space that a letter uses
     *
     * @member {number}
     */

  }, {
    key: "lineHeight",
    get: function get() {
      return this._lineHeight;
    },
    set: function set(lineHeight) {
      if (this._lineHeight !== lineHeight) {
        this._lineHeight = lineHeight;
        this.styleID++;
      }
    }
    /**
     * The space between lines
     *
     * @member {number}
     */

  }, {
    key: "leading",
    get: function get() {
      return this._leading;
    },
    set: function set(leading) {
      if (this._leading !== leading) {
        this._leading = leading;
        this.styleID++;
      }
    }
    /**
     * The lineJoin property sets the type of corner created, it can resolve spiked text issues.
     * Default is 'miter' (creates a sharp corner).
     *
     * @member {string}
     */

  }, {
    key: "lineJoin",
    get: function get() {
      return this._lineJoin;
    },
    set: function set(lineJoin) {
      if (this._lineJoin !== lineJoin) {
        this._lineJoin = lineJoin;
        this.styleID++;
      }
    }
    /**
     * The miter limit to use when using the 'miter' lineJoin mode
     * This can reduce or increase the spikiness of rendered text.
     *
     * @member {number}
     */

  }, {
    key: "miterLimit",
    get: function get() {
      return this._miterLimit;
    },
    set: function set(miterLimit) {
      if (this._miterLimit !== miterLimit) {
        this._miterLimit = miterLimit;
        this.styleID++;
      }
    }
    /**
     * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
     * by adding padding to all sides of the text.
     *
     * @member {number}
     */

  }, {
    key: "padding",
    get: function get() {
      return this._padding;
    },
    set: function set(padding) {
      if (this._padding !== padding) {
        this._padding = padding;
        this.styleID++;
      }
    }
    /**
     * A canvas fillstyle that will be used on the text stroke
     * e.g 'blue', '#FCFF00'
     *
     * @member {string|number}
     */

  }, {
    key: "stroke",
    get: function get() {
      return this._stroke;
    },
    set: function set(stroke) {
      var outputColor = getColor(stroke);

      if (this._stroke !== outputColor) {
        this._stroke = outputColor;
        this.styleID++;
      }
    }
    /**
     * A number that represents the thickness of the stroke.
     * Default is 0 (no stroke)
     *
     * @member {number}
     */

  }, {
    key: "strokeThickness",
    get: function get() {
      return this._strokeThickness;
    },
    set: function set(strokeThickness) {
      if (this._strokeThickness !== strokeThickness) {
        this._strokeThickness = strokeThickness;
        this.styleID++;
      }
    }
    /**
     * The baseline of the text that is rendered.
     *
     * @member {string}
     */

  }, {
    key: "textBaseline",
    get: function get() {
      return this._textBaseline;
    },
    set: function set(textBaseline) {
      if (this._textBaseline !== textBaseline) {
        this._textBaseline = textBaseline;
        this.styleID++;
      }
    }
    /**
     * Trim transparent borders
     *
     * @member {boolean}
     */

  }, {
    key: "trim",
    get: function get() {
      return this._trim;
    },
    set: function set(trim) {
      if (this._trim !== trim) {
        this._trim = trim;
        this.styleID++;
      }
    }
    /**
     * How newlines and spaces should be handled.
     * Default is 'pre' (preserve, preserve).
     *
     *  value       | New lines     |   Spaces
     *  ---         | ---           |   ---
     * 'normal'     | Collapse      |   Collapse
     * 'pre'        | Preserve      |   Preserve
     * 'pre-line'   | Preserve      |   Collapse
     *
     * @member {string}
     */

  }, {
    key: "whiteSpace",
    get: function get() {
      return this._whiteSpace;
    },
    set: function set(whiteSpace) {
      if (this._whiteSpace !== whiteSpace) {
        this._whiteSpace = whiteSpace;
        this.styleID++;
      }
    }
  }, {
    key: "wordWrap",
    get: function get() {
      return this._wordWrap;
    },
    set: function set(wordWrap) {
      if (this._wordWrap !== wordWrap) {
        this._wordWrap = wordWrap;
        this.styleID++;
      }
    }
    /**
     * The width at which text will wrap, it needs wordWrap to be set to true
     *
     * @member {number}
     */

  }, {
    key: "wordWrapWidth",
    get: function get() {
      return this._wordWrapWidth;
    },
    set: function set(wordWrapWidth) {
      if (this._wordWrapWidth !== wordWrapWidth) {
        this._wordWrapWidth = wordWrapWidth;
        this.styleID++;
      }
    }
  }]);

  return TextStyle;
}();
/**
 * Utility function to convert hexadecimal colors to strings, and simply return the color if it's a string.
 * @private
 * @param {number|number[]} color
 * @return {string} The color as a string.
 */

function getSingleColor(color) {
  if (typeof color === 'number') {
    return hex2string(color);
  } else if (typeof color === 'string') {
    if (color.indexOf('0x') === 0) {
      color = color.replace('0x', '#');
    }
  }

  return color;
}
/**
 * Utility function to convert hexadecimal colors to strings, and simply return the color if it's a string.
 * This version can also convert array of colors
 * @private
 * @param {number|number[]} color
 * @return {string} The color as a string.
 */


function getColor(color) {
  if (!Array.isArray(color)) {
    return getSingleColor(color);
  } else {
    for (var i = 0; i < color.length; ++i) {
      color[i] = getSingleColor(color[i]);
    }

    return color;
  }
}
/**
 * Utility function to convert hexadecimal colors to strings, and simply return the color if it's a string.
 * This version can also convert array of colors
 * @private
 * @param {Array} array1 First array to compare
 * @param {Array} array2 Second array to compare
 * @return {boolean} Do the arrays contain the same values in the same order
 */


function areArraysEqual(array1, array2) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false;
  }

  if (array1.length !== array2.length) {
    return false;
  }

  for (var i = 0; i < array1.length; ++i) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
}
/**
 * Utility function to ensure that object properties are copied by value, and not by reference
 * @private
 * @param {Object} target Target object to copy properties into
 * @param {Object} source Source object for the properties to copy
 * @param {string} propertyObj Object containing properties names we want to loop over
 */


function deepCopyProperties(target, source, propertyObj) {
  for (var prop in propertyObj) {
    if (Array.isArray(source[prop])) {
      target[prop] = source[prop].slice();
    } else {
      target[prop] = source[prop];
    }
  }
}

var TextMetrics =
/*#__PURE__*/
function () {
  function TextMetrics(text, style, width, height, lines, lineWidths, lineHeight, maxLineWidth, fontProperties) {
    _classCallCheck(this, TextMetrics);

    this.text = text;
    this.style = style;
    this.width = width;
    this.height = height;
    this.lines = lines; // {string[]}

    this.lineWidths = lineWidths; // {number[]}

    this.lineHeight = lineHeight;
    this.maxLineWidth = maxLineWidth;
    this.fontProperties = fontProperties;
    console.log(this);
  }

  _createClass(TextMetrics, null, [{
    key: "measureText",
    value: function measureText(text, style, wordWrap) {
      wordWrap = wordWrap === undefined || wordWrap === null ? style.wordWrap : wordWrap;
      var font = style.toFontString();
      var fontProperties = TextMetrics.measureFont(font);

      if (fontProperties.fontSize === 0) {
        fontProperties.fontSize = style.fontSize;
        fontProperties.ascent = style.fontSize;
      }

      var context = TextMetrics._context;
      context.font = font;
      var outputText = wordWrap ? TextMetrics.wordWrap(text, style) : text;
      var lines = outputText.split(/(?:\r\n|\r|\n)/);
      var lineWidths = new Array(lines.length);
      var maxLineWidth = 0;

      for (var i = 0; i < lines.length; i++) {
        var lineWidth = context.measureText(lines[i]).width + (lines[i].length - 1) * style.letterSpacing;
        lineWidths[i] = lineWidth;
        maxLineWidth = Math.max(maxLineWidth, lineWidth);
      }

      var width = maxLineWidth + style.strokeThickness;

      if (style.dropShadow) {
        width += style.dropShadowDistance;
      }

      var lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
      var height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness);

      if (style.dropShadow) {
        height += style.dropShadowDistance;
      }

      return new TextMetrics(text, style, width, height, lines, lineWidths, lineHeight + style.leading, maxLineWidth, fontProperties);
    }
    /**
     * Calculates the ascent, descent and fontSize of a given font-style
     * http://en.wikipedia.org/wiki/Typeface
     *
     * @static
     * @param {string} font - String representing the style of the font
     * @return {FontMetrics} Font properties object
     */

  }, {
    key: "measureFont",
    value: function measureFont(font) {
      if (TextMetrics._fonts[font]) {
        return TextMetrics._fonts[font];
      }

      var properties = {};
      var canvas = TextMetrics._canvas;
      var context = TextMetrics._context;
      context.font = font;
      var metricsString = TextMetrics.METRICS_STRING + TextMetrics.BASELINE_SYMBOL;
      var width = Math.ceil(context.measureText(metricsString).width);
      var baseline = Math.ceil(context.measureText(TextMetrics.BASELINE_SYMBOL).width);
      var height = 2 * baseline;
      baseline = baseline * TextMetrics.BASELINE_MULTIPLIER | 0;
      canvas.width = width;
      canvas.height = height;
      context.fillStyle = '#f00';
      context.fillRect(0, 0, width, height);
      context.font = font;
      context.textBaseline = 'alphabetic';
      context.fillStyle = '#000';
      context.fillText(metricsString, 0, baseline);
      var imagedata = context.getImageData(0, 0, width, height).data;
      var pixels = imagedata.length;
      var line = width * 4;
      var i = 0;
      var idx = 0;
      var stop = false;

      for (i = 0; i < baseline; ++i) {
        for (var j = 0; j < line; j += 4) {
          if (imagedata[idx + j] !== 255) {
            stop = true;
            break;
          }
        }

        if (!stop) {
          idx += line;
        } else {
          break;
        }
      }

      properties.ascent = baseline - i;
      idx = pixels - line;
      stop = false;

      for (i = height; i > baseline; --i) {
        for (var _j = 0; _j < line; _j += 4) {
          if (imagedata[idx + _j] !== 255) {
            stop = true;
            break;
          }
        }

        if (!stop) {
          idx -= line;
        } else {
          break;
        }
      }

      properties.descent = i - baseline;
      properties.fontSize = properties.ascent + properties.descent;
      TextMetrics._fonts[font] = properties;
      return properties;
    }
    /**
     * Applies newlines to a string to have it optimally fit into the horizontal
     * bounds set by the Text object's wordWrapWidth property.
     *
     * @private
     * @param {string} text - String to apply word wrapping to
     * @param {TextStyle} style - the style to use when wrapping
     * @param {HTMLCanvasElement} [canvas] - optional specification of the canvas to use for measuring.
     * @return {string} New string with new lines applied where required
     */

  }, {
    key: "wordWrap",
    value: function wordWrap(text, style) {
      var context = TextMetrics._context;
      var width = 0;
      var line = '';
      var lines = '';
      var cache = {};
      var letterSpacing = style.letterSpacing,
          whiteSpace = style.whiteSpace; // How to handle whitespaces

      var collapseSpaces = TextMetrics.collapseSpaces(whiteSpace);
      var collapseNewlines = TextMetrics.collapseNewlines(whiteSpace); // whether or not spaces may be added to the beginning of lines

      var canPrependSpaces = !collapseSpaces; // There is letterSpacing after every char except the last one
      // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!
      // so for convenience the above needs to be compared to width + 1 extra letterSpace
      // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!_
      // ________________________________________________
      // And then the final space is simply no appended to each line

      var wordWrapWidth = style.wordWrapWidth + letterSpacing; // break text into words, spaces and newline chars

      var tokens = TextMetrics.tokenize(text);

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (TextMetrics.isNewline(token)) {
          if (!collapseNewlines) {
            lines += TextMetrics.addLine(line);
            canPrependSpaces = !collapseSpaces;
            line = '';
            width = 0;
            continue;
          } // if we should collapse new lines
          // we simply convert it into a space


          token = ' ';
        } // if we should collapse repeated whitespaces


        if (collapseSpaces) {
          // check both this and the last tokens for spaces
          var currIsBreakingSpace = TextMetrics.isBreakingSpace(token);
          var lastIsBreakingSpace = TextMetrics.isBreakingSpace(line[line.length - 1]);

          if (currIsBreakingSpace && lastIsBreakingSpace) {
            continue;
          }
        }

        var tokenWidth = TextMetrics.getFromCache(token, letterSpacing, cache, context); // word is longer than desired bounds

        if (tokenWidth > wordWrapWidth) {
          // if we are not already at the beginning of a line
          if (line !== '') {
            // start newlines for overflow words
            lines += TextMetrics.addLine(line);
            line = '';
            width = 0;
          } // break large word over multiple lines


          if (TextMetrics.canBreakWords(token, style.breakWords)) {
            // break word into characters
            var characters = token.split(''); // loop the characters

            for (var j = 0; j < characters.length; j++) {
              var char = characters[j];
              var k = 1; // we are not at the end of the token

              while (characters[j + k]) {
                var nextChar = characters[j + k];
                var lastChar = char[char.length - 1]; // should not split chars

                if (!TextMetrics.canBreakChars(lastChar, nextChar, token, j, style.breakWords)) {
                  // combine chars & move forward one
                  char += nextChar;
                } else {
                  break;
                }

                k++;
              }

              j += char.length - 1;
              var characterWidth = TextMetrics.getFromCache(char, letterSpacing, cache, context);

              if (characterWidth + width > wordWrapWidth) {
                lines += TextMetrics.addLine(line);
                canPrependSpaces = false;
                line = '';
                width = 0;
              }

              line += char;
              width += characterWidth;
            }
          } else {
            // if there are words in this line already
            // finish that line and start a new one
            if (line.length > 0) {
              lines += TextMetrics.addLine(line);
              line = '';
              width = 0;
            }

            var isLastToken = i === tokens.length - 1; // give it its own line if it's not the end

            lines += TextMetrics.addLine(token, !isLastToken);
            canPrependSpaces = false;
            line = '';
            width = 0;
          }
        } else {
          // word won't fit because of existing words
          // start a new line
          if (tokenWidth + width > wordWrapWidth) {
            // if its a space we don't want it
            canPrependSpaces = false; // add a new line

            lines += TextMetrics.addLine(line); // start a new line

            line = '';
            width = 0;
          } // don't add spaces to the beginning of lines


          if (line.length > 0 || !TextMetrics.isBreakingSpace(token) || canPrependSpaces) {
            // add the word to the current line
            line += token; // update width counter

            width += tokenWidth;
          }
        }
      }

      lines += TextMetrics.addLine(line, false);
      return lines;
    }
    /**
     * Gets & sets the widths of calculated characters in a cache object
     *
     * @private
     * @param  {string}                    key            The key
     * @param  {number}                    letterSpacing  The letter spacing
     * @param  {object}                    cache          The cache
     * @param  {CanvasRenderingContext2D}  context        The canvas context
     * @return {number}                    The from cache.
     */

  }, {
    key: "getFromCache",
    value: function getFromCache(key, letterSpacing, cache, context) {
      var width = cache[key];

      if (width === undefined) {
        var spacing = key.length * letterSpacing;
        width = context.measureText(key).width + spacing;
        cache[key] = width;
      }

      return width;
    }
    /**
     * Determines whether we should collapse breaking spaces
     *
     * @private
     * @param  {string}   whiteSpace  The TextStyle property whiteSpace
     * @return {boolean}  should collapse
     */

  }, {
    key: "collapseSpaces",
    value: function collapseSpaces(whiteSpace) {
      return whiteSpace === 'normal' || whiteSpace === 'pre-line';
    }
    /**
     * Determines whether we should collapse newLine chars
     *
     * @private
     * @param  {string}   whiteSpace  The white space
     * @return {boolean}  should collapse
     */

  }, {
    key: "collapseNewlines",
    value: function collapseNewlines(whiteSpace) {
      return whiteSpace === 'normal';
    }
    /**
     * Splits a string into words, breaking-spaces and newLine characters
     *
     * @private
     * @param  {string}  text       The text
     * @return {string[]}  A tokenized array
     */

  }, {
    key: "tokenize",
    value: function tokenize(text) {
      var tokens = [];
      var token = '';

      if (typeof text !== 'string') {
        return tokens;
      }

      for (var i = 0; i < text.length; i++) {
        var char = text[i];

        if (TextMetrics.isBreakingSpace(char) || TextMetrics.isNewline(char)) {
          if (token !== '') {
            tokens.push(token);
            token = '';
          }

          tokens.push(char);
          continue;
        }

        token += char;
      }

      if (token !== '') {
        tokens.push(token);
      }

      return tokens;
    }
    /**
     * This method exists to be easily overridden
     * It allows one to customise which words should break
     * Examples are if the token is CJK or numbers.
     * It must return a boolean.
     *
     * @private
     * @param  {string}  token       The token
     * @param  {boolean}  breakWords  The style attr break words
     * @return {boolean} whether to break word or not
     */

  }, {
    key: "canBreakWords",
    value: function canBreakWords(token, breakWords) {
      return breakWords;
    }
    /**
     * Determines if char is a breaking whitespace.
     *
     * @private
     * @param  {string}  char  The character
     * @return {boolean}  True if whitespace, False otherwise.
     */

  }, {
    key: "isBreakingSpace",
    value: function isBreakingSpace(char) {
      if (typeof char !== 'string') {
        return false;
      }

      return TextMetrics._breakingSpaces.indexOf(char.charCodeAt(0)) >= 0;
    }
    /**
     * Determines if char is a newline.
     *
     * @private
     * @param  {string}  char  The character
     * @return {boolean}  True if newline, False otherwise.
     */

  }, {
    key: "isNewline",
    value: function isNewline(char) {
      if (typeof char !== 'string') {
        return false;
      }

      return TextMetrics._newlines.indexOf(char.charCodeAt(0)) >= 0;
    }
    /**
     * Convienience function for logging each line added during the wordWrap
     * method
     *
     * @private
     * @param  {string}   line        - The line of text to add
     * @param  {boolean}  newLine     - Add new line character to end
     * @return {string}   A formatted line
     */

  }, {
    key: "addLine",
    value: function addLine(line) {
      var newLine = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      line = TextMetrics.trimRight(line);
      line = newLine ? "".concat(line, "\n") : line;
      return line;
    }
    /**
     * trims breaking whitespaces from string
     *
     * @private
     * @param  {string}  text  The text
     * @return {string}  trimmed string
     */

  }, {
    key: "trimRight",
    value: function trimRight(text) {
      if (typeof text !== 'string') {
        return '';
      }

      for (var i = text.length - 1; i >= 0; i--) {
        var char = text[i];

        if (!TextMetrics.isBreakingSpace(char)) {
          break;
        }

        text = text.slice(0, -1);
      }

      return text;
    }
  }]);

  return TextMetrics;
}();

var canvas = function () {
  try {
    // OffscreenCanvas2D measureText can be up to 40% faster.
    var c = new OffscreenCanvas(0, 0);
    return c.getContext('2d') ? c : document.createElement('canvas');
  } catch (ex) {
    return document.createElement('canvas');
  }
}();

canvas.width = canvas.height = 10;
TextMetrics._canvas = canvas;
TextMetrics._context = canvas.getContext('2d');
TextMetrics._fonts = {};
TextMetrics.METRICS_STRING = '|ÉqÅ';
TextMetrics.BASELINE_SYMBOL = 'M';
TextMetrics.BASELINE_MULTIPLIER = 1.4;
TextMetrics._newlines = [0x000A, // line feed
0x000D];
TextMetrics._breakingSpaces = [0x0009, // character tabulation
0x0020, // space
0x2000, // en quad
0x2001, // em quad
0x2002, // en space
0x2003, // em space
0x2004, // three-per-em space
0x2005, // four-per-em space
0x2006, // six-per-em space
0x2008, // punctuation space
0x2009, // thin space
0x200A, // hair space
0x205F, // medium mathematical space
0x3000];

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
    _this._style = null;
    _this.style = opts;
    _this._font = '18px verdana';
    _this.fill = '#333';
    _this.dimensions = _this.calcDimensions();
    _this.localStyleID = -1;
    _this.measured = {};
    console.log('new Text:', _assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Text, [{
    key: "updateText",
    value: function updateText() {
      var style = this._style;

      if (this.localStyleID !== style.styleID) {
        this.dirty = true;
        this.localStyleID = style.styleID;
      }

      if (!this.dirty) {
        return;
      }

      this.measured = TextMetrics.measureText(this.text || ' ', style, style.wordWrap);
      this._font = this.style.toFontString();
      this.dirty = false;
    }
  }, {
    key: "getAxes",
    value: function getAxes() {}
  }, {
    key: "project",
    value: function project(axis) {}
  }, {
    key: "addPoint",
    value: function addPoint(x, y) {}
  }, {
    key: "calcDimensions",
    value: function calcDimensions() {
      return {
        left: 0,
        top: 0,
        width: 100,
        height: 20
      };
    }
  }, {
    key: "move",
    value: function move(dx, dy) {}
  }, {
    key: "style",
    get: function get() {
      return this._style;
    },
    set: function set(style) {
      style = style || {};

      if (style instanceof TextStyle) {
        this._style = style;
      } else {
        this._style = new TextStyle(style);
      }

      this.localStyleID = -1;
      this.dirty = true;
    }
  }]);

  return Text;
}(Shape);

var ShapesGroup =
/*#__PURE__*/
function () {
  function ShapesGroup(shapes) {
    _classCallCheck(this, ShapesGroup);

    this.shapes = shapes;
    this.dimensions = this.calcDimensions();
  }

  _createClass(ShapesGroup, [{
    key: "calcDimensions",
    value: function calcDimensions() {
      var shapes = this.shapes,
          minX = min(shapes, 'dimensions.left') || 0,
          minY = min(shapes, 'dimensions.top') || 0,
          maxX = max(shapes, 'dimensions.left') || 0,
          maxY = max(shapes, 'dimensions.top') || 0,
          width = max(shapes, 'dimensions.width'),
          height = max(shapes, 'dimensions.height');
      return {
        left: minX,
        top: minY,
        width: width,
        height: height
      };
    }
  }, {
    key: "collidesWith",
    value: function collidesWith(otherShape) {// return SAT.detectCollide(this, otherShape);
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

  return ShapesGroup;
}();

var Object$1 =
/*#__PURE__*/
function () {
  function Object(opts) {
    _classCallCheck(this, Object);

    this.shape = opts.shape;

    if (isArray(this.shape)) {
      this.shape = new ShapesGroup(this.shape);
    }

    this.fill = opts.fill !== undefined ? opts.fill : '#83cbff';
    this.startCb = isFunction(opts.start) ? opts.start : this.start;
    this.updateCb = isFunction(opts.update) ? opts.update : this.update;
    this.transform0 = {
      scaleX: opts.transform.scaleX,
      skewX: opts.transform.skewX,
      skewY: opts.transform.skewY,
      scaleY: opts.transform.scaleY,
      position: {
        x: opts.transform.position.x,
        y: opts.transform.position.y
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
  }]);

  return Object;
}();

var CanvasShapeRenderer =
/*#__PURE__*/
function () {
  function CanvasShapeRenderer(context, pixelRatio, canvasRenderer) {
    _classCallCheck(this, CanvasShapeRenderer);

    this.context = context;
    this.pixelRatio = pixelRatio;
    this.canvasRenderer = canvasRenderer;
  }

  _createClass(CanvasShapeRenderer, [{
    key: "render",
    value: function render(shape) {
      var context = this.context,
          pixelRatio = this.pixelRatio,
          canvasRenderer = this.canvasRenderer;

      if (shape.type === 'text') {
        _drawText(context, shape, pixelRatio, canvasRenderer);

        return;
      }

      switch (shape.type) {
        case 'path':
          _execPathCommands(context, shape);

          break;

        case 'polygon':
          _pathPolygon(context, shape);

          break;

        case 'polyline':
          _pathPolyline(context, shape);

          break;

        case 'rectangle':
          _pathRectangle(context, shape);

          break;

        case 'circle':
          _pathCircle(context, shape);

          break;

        default:
          break;
      }

      _setStrokeStyles(context, shape);

      _setFillStyles(context, shape);

      _renderStroke(context, shape);

      _renderFill(context, shape);
    }
  }]);

  return CanvasShapeRenderer;
}();

function _setStrokeStyles(context, shape) {
  if (shape.stroke) {
    context.lineWidth = shape.strokeWidth;
    context.lineCap = shape.strokeLineCap;
    context.lineDashOffset = shape.strokeDashOffset;
    context.lineJoin = shape.strokeLineJoin;
    context.miterLimit = shape.strokeMiterLimit;
    context.strokeStyle = shape.stroke;
  }
}

function _setFillStyles(context, shape) {
  if (shape.fill) {
    context.fillStyle = shape.fill;
  }
}

function _renderStroke(context, shape) {
  if (!shape.stroke || shape.strokeWidth === 0) {
    return;
  } // _setLineDash(this.context, this.strokeDashArray, this._renderDashedStroke);


  context.save();
  context.stroke();
  context.restore();
}

function _renderFill(context) {
  context.save();
  context.fill();
  context.restore();
}

function _pathPolygon(context, shape) {
  var points = shape.vertices,
      point;
  var len = points.length;

  if (!len || len === 0 || isNaN(points[len - 1].y)) {
    return false;
  }

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);

  for (var i = 0; i < len; i++) {
    point = points[i];
    context.lineTo(point.x, point.y);
  }

  context.closePath();
}

function _pathPolyline(context, shape) {
  context.beginPath();
  context.closePath();
}

function _pathRectangle(context, shape) {
  var rx = shape.rx ? Math.min(shape.rx, shape.width / 2) : 0,
      ry = shape.ry ? Math.min(shape.ry, shape.height / 2) : 0,
      w = shape.width,
      h = shape.height,
      isRounded = rx !== 0 || ry !== 0,

  /* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */
  k = 1 - 0.5522847498;
  context.beginPath();
  context.moveTo(rx, 0);
  context.lineTo(w - rx, 0);
  isRounded && context.bezierCurveTo(w - k * rx, 0, w, k * ry, w, ry);
  context.lineTo(w, h - ry);
  isRounded && context.bezierCurveTo(w, h - k * ry, w - k * rx, h, w - rx, h);
  context.lineTo(rx, h);
  isRounded && context.bezierCurveTo(k * rx, h, 0, h - k * ry, 0, h - ry);
  context.lineTo(0, ry);
  isRounded && context.bezierCurveTo(0, k * ry, k * rx, 0, rx, 0);
  context.closePath();
}

function _pathCircle(context, shape) {
  context.beginPath();
  context.arc(0, 0, shape.radius, 0, 2 * Math.PI);
  context.closePath();
}

function _execPathCommands(context, shape) {
  var path = shape.path;
  var current,
      subpathStartX = 0,
      subpathStartY = 0,
      x = 0,
      y = 0;
  context.beginPath();

  for (var i = 0, len = path.length; i < len; i++) {
    current = path[i];

    switch (current[0]) {
      case 'l':
        // lineTo, relative
        break;

      case 'L':
        // lineTo, absolute
        x = current[1];
        y = current[2];
        context.lineTo(x, y);
        break;

      case 'h':
        // horizontal lineTo, relative
        break;

      case 'H':
        // horizontal lineTo, absolute
        break;

      case 'v':
        // vertical lineTo, relative
        break;

      case 'V':
        // verical lineTo, absolute
        break;

      case 'm':
        // moveTo, relative
        break;

      case 'M':
        // moveTo, absolute
        x = current[1];
        y = current[2];
        subpathStartX = x;
        subpathStartY = y;
        context.moveTo(x, y);
        break;

      case 'c':
        // bezierCurveTo, relative
        break;

      case 'C':
        // bezierCurveTo, absolute
        break;

      case 's':
        // shorthand cubic bezierCurveTo, relative
        break;

      case 'S':
        // shorthand cubic bezierCurveTo, absolute
        break;

      case 'q':
        // quadraticCurveTo, relative
        break;

      case 'Q':
        // quadraticCurveTo, absolute
        break;

      case 't':
        // shorthand quadraticCurveTo, relative
        break;

      case 'T':
        // shorthand quadraticCurveTo, absolute
        break;

      case 'a':
        // arc, relative
        break;

      case 'A':
        // arc, absolute
        break;

      case 'z':
      case 'Z':
        x = subpathStartX;
        y = subpathStartY;
        context.closePath();
        break;
    }
  }
}

function _drawText(context, shape, pixelRatio, canvasRenderer) {
  context.beginPath();
  shape.updateText();
  var measured = shape.measured,
      style = shape.style;
  var width = measured.width;
  var height = measured.height;
  var lines = measured.lines;
  var lineHeight = measured.lineHeight;
  var lineWidths = measured.lineWidths;
  var maxLineWidth = measured.maxLineWidth;
  var fontProperties = measured.fontProperties;
  context.font = shape._font;
  context.lineWidth = style.strokeThickness;
  context.textBaseline = style.textBaseline;
  context.lineJoin = style.lineJoin;
  context.miterLimit = style.miterLimit;
  var linePositionX;
  var linePositionY;
  context.fillStyle = _generateFillStyle(style, lines, width, height);
  context.strokeStyle = style.stroke;

  if (style.dropShadow) {
    context.shadowColor = style.dropShadowColor;
    context.shadowBlur = style.dropShadowBlur;
    context.shadowOffsetX = Math.cos(style.dropShadowAngle) * style.dropShadowDistance * canvasRenderer.getZoom();
    context.shadowOffsetY = Math.sin(style.dropShadowAngle) * style.dropShadowDistance * canvasRenderer.getZoom();
  }

  for (var i = 0; i < lines.length; i++) {
    linePositionX = style.strokeThickness / 2;
    linePositionY = style.strokeThickness / 2 + i * lineHeight + fontProperties.ascent;

    if (style.align === 'right') {
      linePositionX += maxLineWidth - lineWidths[i];
    } else if (style.align === 'center') {
      linePositionX += (maxLineWidth - lineWidths[i]) / 2;
    }

    if (style.stroke && style.strokeThickness) {
      _drawLetterSpacing(context, lines[i], style, linePositionX + style.padding, linePositionY + style.padding, true);
    }

    if (style.fill) {
      _drawLetterSpacing(context, lines[i], style, linePositionX + style.padding, linePositionY + style.padding);
    }
  }

  context.closePath();
}
/**
 * Generates the fill style. Can automatically generate a gradient based on the fill style being an array
 *
 * @param {object} style - The style.
 * @param {string[]} lines - The lines of text.
 * @param {number} width
 * @param {number} height
 * @return {string|number|CanvasGradient} The fill style
 */


function _generateFillStyle(style, lines, width, height) {
  if (!Array.isArray(style.fill)) {
    return style.fill;
  } else if (style.fill.length === 1) {
    return style.fill[0];
  } // the gradient will be evenly spaced out according to how large the array is.
  // ['#FF0000', '#00FF00', '#0000FF'] would created stops at 0.25, 0.5 and 0.75


  var gradient;
  var totalIterations;
  var currentIteration;
  var stop; // make a copy of the style settings, so we can manipulate them later

  var fill = style.fill.slice();
  var fillGradientStops = style.fillGradientStops.slice(); // wanting to evenly distribute the fills. So an array of 4 colours should give fills of 0.25, 0.5 and 0.75

  if (!fillGradientStops.length) {
    var lengthPlus1 = fill.length + 1;

    for (var i = 1; i < lengthPlus1; ++i) {
      fillGradientStops.push(i / lengthPlus1);
    }
  } // stop the bleeding of the last gradient on the line above to the top gradient of the this line
  // by hard defining the first gradient colour at point 0, and last gradient colour at point 1


  fill.unshift(style.fill[0]);
  fillGradientStops.unshift(0);
  fill.push(style.fill[style.fill.length - 1]);
  fillGradientStops.push(1);

  if (style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL) {
    // start the gradient at the top center of the canvas, and end at the bottom middle of the canvas
    gradient = this.context.createLinearGradient(width / 2, 0, width / 2, height); // we need to repeat the gradient so that each individual line of text has the same vertical gradient effect
    // ['#FF0000', '#00FF00', '#0000FF'] over 2 lines would create stops at 0.125, 0.25, 0.375, 0.625, 0.75, 0.875

    totalIterations = (fill.length + 1) * lines.length;
    currentIteration = 0;

    for (var _i = 0; _i < lines.length; _i++) {
      currentIteration += 1;

      for (var j = 0; j < fill.length; j++) {
        if (typeof fillGradientStops[j] === 'number') {
          stop = fillGradientStops[j] / lines.length + _i / lines.length;
        } else {
          stop = currentIteration / totalIterations;
        }

        gradient.addColorStop(stop, fill[j]);
        currentIteration++;
      }
    }
  } else {
    // start the gradient at the center left of the canvas, and end at the center right of the canvas
    gradient = this.context.createLinearGradient(0, height / 2, width, height / 2); // can just evenly space out the gradients in this case, as multiple lines makes no difference
    // to an even left to right gradient

    totalIterations = fill.length + 1;
    currentIteration = 1;

    for (var _i2 = 0; _i2 < fill.length; _i2++) {
      if (typeof fillGradientStops[_i2] === 'number') {
        stop = fillGradientStops[_i2];
      } else {
        stop = currentIteration / totalIterations;
      }

      gradient.addColorStop(stop, fill[_i2]);
      currentIteration++;
    }
  }

  return gradient;
}
/**
 * Render the text with letter-spacing.
 * @param {string} text - The text to draw
 * @param {number} x - Horizontal position to draw the text
 * @param {number} y - Vertical position to draw the text
 * @param {boolean} [isStroke=false] - Is this drawing for the outside stroke of the
 *  text? If not, it's for the inside fill
 * @private
 */


function _drawLetterSpacing(context, text, style, x, y) {
  var isStroke = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  // letterSpacing of 0 means normal
  var letterSpacing = style.letterSpacing;

  if (letterSpacing === 0) {
    if (isStroke) {
      context.strokeText(text, x, y);
    } else {
      context.fillText(text, x, y);
    }

    return;
  }

  var currentPosition = x; // Using Array.from correctly splits characters whilst keeping emoji together.
  // This is not supported on IE as it requires ES6, so regular text splitting occurs.
  // This also doesn't account for emoji that are multiple emoji put together to make something else.
  // Handling all of this would require a big library itself.
  // https://medium.com/@giltayar/iterating-over-emoji-characters-the-es6-way-f06e4589516
  // https://github.com/orling/grapheme-splitter

  var stringArray = Array.from ? Array.from(text) : text.split('');
  var previousWidth = context.measureText(text).width;
  var currentWidth = 0;

  for (var i = 0; i < stringArray.length; ++i) {
    var currentChar = stringArray[i];

    if (isStroke) {
      context.strokeText(currentChar, currentPosition, y);
    } else {
      context.fillText(currentChar, currentPosition, y);
    }

    currentWidth = context.measureText(text.substring(i + 1)).width;
    currentPosition += previousWidth - currentWidth + letterSpacing;
    previousWidth = currentWidth;
  }
}

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
    this.shapeRenderer = new CanvasShapeRenderer(this.context, this.pixelRatio, this);
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
      point = _transformPoint(point, _invertTransform(this.viewportTransform));
      vpt[0] = value;
      vpt[3] = value;

      var after = _transformPoint(point, vpt);

      vpt[4] += before.x - after.x;
      vpt[5] += before.y - after.y;
      this.setViewportTransform(vpt);
    }
  }, {
    key: "translate",
    value: function translate(offset) {
      var vpt = this.viewportTransform.slice(0);
      vpt[4] += offset.x;
      vpt[5] += offset.y;
      this.setViewportTransform(vpt);
    }
  }, {
    key: "render",
    value: function render(objects) {
      var context = this.context,
          pixelRatio = this.pixelRatio;
      var vpt = this.viewportTransform;
      context.save();
      context.transform(vpt[0] * pixelRatio, vpt[1], vpt[2], vpt[3] * pixelRatio, vpt[4], vpt[5]);

      _renderObjects.call(this, this.context, objects);

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
  var _this = this;

  objects = objects || [];
  objects.forEach(function (object) {
    var transform = object.transform;
    var _transform$scaleX = transform.scaleX,
        scaleX = _transform$scaleX === void 0 ? 1 : _transform$scaleX,
        _transform$skewX = transform.skewX,
        skewX = _transform$skewX === void 0 ? 0 : _transform$skewX,
        _transform$skewY = transform.skewY,
        skewY = _transform$skewY === void 0 ? 0 : _transform$skewY,
        _transform$scaleY = transform.scaleY,
        scaleY = _transform$scaleY === void 0 ? 1 : _transform$scaleY;
    var _transform$position = transform.position,
        posX = _transform$position.x,
        posY = _transform$position.y;
    context.save();
    context.transform(scaleX, skewX, skewY, scaleY, posX, posY);

    if (object.shape instanceof ShapesGroup) {
      object.shape.shapes.forEach(function (shape) {
        _renderShape.call(_this, shape);
      });
    } else {
      _renderShape.call(_this, object.shape);
    }

    context.restore();
  });
}

function _renderShape(shape) {
  this.shapeRenderer.render(shape);
}

function _transformPoint(p, t, ignoreOffset) {
  if (ignoreOffset) {
    return new Vertice(t[0] * p.x + t[2] * p.y, t[1] * p.x + t[3] * p.y);
  }

  return new Vertice(t[0] * p.x + t[2] * p.y + t[4], t[1] * p.x + t[3] * p.y + t[5]);
}

function _invertTransform(t) {
  var a = 1 / (t[0] * t[3] - t[1] * t[2]),
      r = [a * t[3], -a * t[1], -a * t[2], a * t[0]],
      o = _transformPoint({
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
var polygon = new Object$1({
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
  update: function update() {// let { transform } = this;
    // const horizontalInput = Input.getAxis('horizontal');
    // const verticalInput = Input.getAxis('vertical');
    // const speed = 100;
    // transform.position.x += speed * Time.deltaTime * horizontalInput;
    // transform.position.y += speed * Time.deltaTime * verticalInput;
    // if (this.shape.collidesWith(rectangle.shape)) {
    //   console.log('collide!!');
    // }
  }
});
var circle = new Object$1({
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
var player = new Object$1({
  shape: [new Rectangle({
    width: 120,
    height: 40,
    rx: 2,
    ry: 2,
    fill: 'white',
    stroke: 'grey',
    strokeWidth: 2
  }), new Text('这是\n一个方块\n一个圆圆的方块', {
    align: 'center',
    lineHeight: 12,
    lineWidth: 16,
    fontSize: 10,
    fontStyle: 'italic',
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    underline: true,
    linethrough: true,
    overline: true,
    dropShadow: true,
    dropShadowColor: 'rgba(0, 0, 0, 0.3)',
    letterSpacing: 4,
    fill: '#03a9f4',
    wordWrap: true
  }), new Path('M 0 0 L 300 100 L 200 300 z', {
    fill: 'red',
    stroke: 'green'
  })],
  transform: {
    position: {
      x: 360,
      y: 40
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
  }
});
myGame.scene.addObject(polygon);
myGame.scene.addObject(polyline);
myGame.scene.addObject(circle);
myGame.scene.addObject(title);
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
