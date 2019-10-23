let Mouse = {};

Mouse.create = (element) => {
  let mouse = {};

  mouse.element = element;
  mouse.absolute = { x: 0, y: 0 };
  mouse.position = { x: 0, y: 0 };
  mouse.mousedownPosition = { x: 0, y: 0 };
  mouse.mouseupPosition = { x: 0, y: 0 };
  mouse.offset = { x: 0, y: 0 };
  mouse.scale = { x: 1, y: 1 };
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
  }

  mouse.on = function (eventName, callback) {
    mouse.eventHooks[eventName] = callback;
  }

  mouse.triggerHook = function (eventName) {
    mouse.eventHooks[eventName].call(null, mouse);
  }

  mouse.mousemove = function (event) {
    let position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
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
  }

  mouse.mouseout = function () {
    mouse.triggerHook('mouseout');
  }

  mouse.mousedown = function(event) {
    let position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
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

  mouse.mouseup = function(event) {
    let position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
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

  mouse.mousewheel = function(event) {
    mouse.wheelDelta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
    event.preventDefault();

    mouse.triggerHook('mousewheel');
  };

  Mouse.setElement(mouse, element);

  return mouse;
};

Mouse.setElement = (mouse, element) => {
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
Mouse.setOffset = function(mouse, offset) {
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
Mouse.setScale = function(mouse, scale) {
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
Mouse._getRelativeMousePosition = function(event, element, pixelRatio) {
  let elementBounds = element.getBoundingClientRect(),
    rootNode = (document.documentElement || document.body.parentNode || document.body),
    scrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : rootNode.scrollLeft,
    scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : rootNode.scrollTop,
    touches = event.changedTouches,
    x, y;
  
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

export default Mouse
