import { keys, clone } from '../utils/common';

export default class Trigger {
  constructor (app) {
    this.app = app;
    app._eventPool = {};
  }

  static create (app) {
    app._trigger = new Trigger(app);
  }

  on (eventNames, callback) {
    let app = this.app;
    let names = eventNames.split(' '),
      name;

    for (let i = 0; i < names.length; i++) {
      name = names[i];
      app._eventPool[name] = app._eventPool[name] || [];
      app._eventPool[name].push(callback);
    }

    return callback;
  }

  off (eventNames, callback) {
    let app = this.app;

    if (!eventNames) {
      return;
    }
  
    // handle Events.off(callback)
    if (typeof eventNames === 'function') {
      callback = eventNames;
      eventNames = keys(app._eventPool).join(' ');
    }
  
    let names = eventNames.split(' ');
  
    for (let i = 0; i < names.length; i++) {
      let callbacks = app._eventPool[names[i]],
        newCallbacks = [];
  
      if (callback && callbacks) {
        for (let j = 0; j < callbacks.length; j++) {
          if (callbacks[j] !== callback)
            newCallbacks.push(callbacks[j]);
        }
      }
  
      app._eventPool[names[i]] = newCallbacks;
    }
  }

  fire (eventNames, event) {
    let names,
      name,
      callbacks,
      eventClone;

    let app = this.app;

    if (!app) {
      return;
    }
    
    let _eventPool = app._eventPool;
    
    if (_eventPool && keys(_eventPool).length > 0) {
      if (!event)
        event = {};
    
      names = eventNames.split(' ');
    
      for (let i = 0; i < names.length; i++) {
        name = names[i];
        callbacks = _eventPool[name];
    
        if (callbacks) {
          eventClone = clone(event, false);
          eventClone.name = name;
          eventClone.source = app;
    
          for (let j = 0; j < callbacks.length; j++) {
            callbacks[j].apply(app, [eventClone]);
          }
        }
      }
    }
  }
}
