import { keys, clone } from '../utils/Common';

export default class Events {
  constructor (game) {
    this.game = game;
    game.events = {};
  }

  static create (game) {
    game.Events = new Events(game);
  }

  on (eventNames, callback) {
    let game = this.game;
    let names = eventNames.split(' '),
      name;

    for (let i = 0; i < names.length; i++) {
      name = names[i];
      game.events[name] = game.events[name] || [];
      game.events[name].push(callback);
    }

    return callback;
  }

  off (eventNames, callback) {
    let game = this.game;

    if (!eventNames) {
      object.events = {};
      return;
    }
  
    // handle Events.off(callback)
    if (typeof eventNames === 'function') {
      callback = eventNames;
      eventNames = keys(game.events).join(' ');
    }
  
    let names = eventNames.split(' ');
  
    for (let i = 0; i < names.length; i++) {
      let callbacks = game.events[names[i]],
        newCallbacks = [];
  
      if (callback && callbacks) {
        for (let j = 0; j < callbacks.length; j++) {
          if (callbacks[j] !== callback)
            newCallbacks.push(callbacks[j]);
        }
      }
  
      game.events[names[i]] = newCallbacks;
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
    
    let events = game.events;
    
    if (events && keys(events).length > 0) {
      if (!event)
        event = {};
    
      names = eventNames.split(' ');
    
      for (let i = 0; i < names.length; i++) {
        name = names[i];
        callbacks = events[name];
    
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
