import { keys, clone } from '../utils/common';

export default class Events {
  constructor (game) {
    this.game = game;
    game._eventPool = {};
  }

  static create (game) {
    game.events = new Events(game);
  }

  on (eventNames, callback) {
    let game = this.game;
    let names = eventNames.split(' '),
      name;

    for (let i = 0; i < names.length; i++) {
      name = names[i];
      game._eventPool[name] = game._eventPool[name] || [];
      game._eventPool[name].push(callback);
    }

    return callback;
  }

  off (eventNames, callback) {
    let game = this.game;

    if (!eventNames) {
      return;
    }
  
    // handle Events.off(callback)
    if (typeof eventNames === 'function') {
      callback = eventNames;
      eventNames = keys(game._eventPool).join(' ');
    }
  
    let names = eventNames.split(' ');
  
    for (let i = 0; i < names.length; i++) {
      let callbacks = game._eventPool[names[i]],
        newCallbacks = [];
  
      if (callback && callbacks) {
        for (let j = 0; j < callbacks.length; j++) {
          if (callbacks[j] !== callback)
            newCallbacks.push(callbacks[j]);
        }
      }
  
      game._eventPool[names[i]] = newCallbacks;
    }
  }

  trigger (eventNames, event) {
    let names,
      name,
      callbacks,
      eventClone;

    let game = this.game;

    if (!game) {
      return;
    }
    
    let _eventPool = game._eventPool;
    
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
          eventClone.source = game;
    
          for (let j = 0; j < callbacks.length; j++) {
            callbacks[j].apply(game, [eventClone]);
          }
        }
      }
    }
  }
}
