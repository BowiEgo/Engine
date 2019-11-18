export default class Mouse {
  constructor (game) {
    this.game = game;
    this.element = game.view;
    this.pixelRatio = game.renderer.pixelRatio;
    this.absolute = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };
    this.mousedownPosition = { x: 0, y: 0 };
    this.mouseupPosition = { x: 0, y: 0 };
    this.offset = { x: 0, y: 0 };
    this.scale = { x: 1, y: 1 };
    this.wheelDelta = 0;
    this.button = -1;

    this.sourceEvents = {
      mousemove: null,
      mouseout: null,
      mousedown: null,
      mouseup: null,
      mousewheel: null
    };

    this.eventHooks = {
      mousemove: null,
      mouseout: null,
      mousedown: null,
      mouseup: null,
      mousewheel: null
    }

    Mouse.setElement(this, this.element);
  }

  static create (game) {
    game.mouse = new Mouse(game);
  }

  static setElement (mouse, element) {
    element.addEventListener('mousemove', mouse.mousemove.bind(mouse));
    element.addEventListener('mouseout', mouse.mouseout.bind(mouse));
    element.addEventListener('mousedown', mouse.mousedown.bind(mouse));
    element.addEventListener('mouseup', mouse.mouseup.bind(mouse));
    
    element.addEventListener('mousewheel', mouse.mousewheel.bind(mouse));
    element.addEventListener('DOMMouseScroll', mouse.mousewheel.bind(mouse));
  
    element.addEventListener('touchmove', mouse.mousemove.bind(mouse));
    element.addEventListener('touchstart', mouse.mousedown.bind(mouse));
    element.addEventListener('touchend', mouse.mouseup.bind(mouse));
  }

  static _getRelativeMousePosition (event, element, pixelRatio) {
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
  }

  mousemove (event) {
    let position = Mouse._getRelativeMousePosition(event, this.element, this.pixelRatio),
      touches = event.changedTouches;

    if (touches) {
      this.button = 0;
      event.preventDefault();
    }

    this.absolute.x = position.x;
    this.absolute.y = position.y;
    this.position.x = this.absolute.x * this.scale.x + this.offset.x;
    this.position.y = this.absolute.y * this.scale.y + this.offset.y;
    this.sourceEvents.mousemove = event;

    this.triggerHook('mousemove');
  }

  mousedown (event) {
    let position = Mouse._getRelativeMousePosition(event, this.element, this.pixelRatio),
      touches = event.changedTouches;
    
    if (touches) {
      this.button = 0;
      event.preventDefault();
    } else {
      this.button = event.button;
    }
    
    this.absolute.x = position.x;
    this.absolute.y = position.y;
    this.position.x = this.absolute.x * this.scale.x + this.offset.x;
    this.position.y = this.absolute.y * this.scale.y + this.offset.y;
    this.mousedownPosition.x = this.position.x;
    this.mousedownPosition.y = this.position.y;
    this.sourceEvents.mousedown = event;
    
    this.triggerHook('mousedown');
  }

  mouseup (event) {
    let position = Mouse._getRelativeMousePosition(event, this.element, this.pixelRatio),
      touches = event.changedTouches;
    
    if (touches) {
      event.preventDefault();
    }
    
    this.button = -1;
    this.absolute.x = position.x;
    this.absolute.y = position.y;
    this.position.x = this.absolute.x * this.scale.x + this.offset.x;
    this.position.y = this.absolute.y * this.scale.y + this.offset.y;
    this.mouseupPosition.x = this.position.x;
    this.mouseupPosition.y = this.position.y;
    this.sourceEvents.mouseup = event;
    
    this.triggerHook('mouseup');
  }

  mouseout () {
    this.triggerHook('mouseout');
  }

  mousewheel (event) {
    this.wheelDelta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
    event.preventDefault();
    
    this.triggerHook('mousewheel');
  }

  setOffset (offset) {
    this.offset.x = offset.x;
    this.offset.y = offset.y;
    this.position.x = this.absolute.x * this.scale.x + this.offset.x;
    this.position.y = this.absolute.y * this.scale.y + this.offset.y;
  }

  setScale (scale) {
    this.scale.x = scale.x;
    this.scale.y = scale.y;
    this.position.x = this.absolute.x * this.scale.x + this.offset.x;
    this.position.y = this.absolute.y * this.scale.y + this.offset.y;
  }

  on (eventName, callback) {
    this.eventHooks[eventName] = callback;
  }

  triggerHook (eventName) {
    this.eventHooks[eventName].call(null, this);
  }
}
