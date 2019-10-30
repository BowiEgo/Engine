import { keys, clone } from '../utils/Common';

let Events = {};

Events.create = function (game) {
  this.game = game;
  game.events = {};
}

Events.on = function (eventNames, callback) {
  let names = eventNames.split(' '),
    name;

  for (let i = 0; i < names.length; i++) {
    name = names[i];
    this.game.events[name] = this.game.events[name] || [];
    this.game.events[name].push(callback);
  }

  return callback;
}

Events.off = function(eventNames, callback) {
  if (!eventNames) {
    object.events = {};
    return;
  }

  // handle Events.off(callback)
  if (typeof eventNames === 'function') {
    callback = eventNames;
    eventNames = keys(this.game.events).join(' ');
  }

  let names = eventNames.split(' ');

  for (let i = 0; i < names.length; i++) {
    let callbacks = this.game.events[names[i]],
      newCallbacks = [];

    if (callback && callbacks) {
      for (let j = 0; j < callbacks.length; j++) {
        if (callbacks[j] !== callback)
          newCallbacks.push(callbacks[j]);
      }
    }

    this.game.events[names[i]] = newCallbacks;
  }
};

Events.trigger = function(eventNames, event) {
  let names,
    name,
    callbacks,
    eventClone;

  let events = this.game.events;

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
        eventClone.source = this.game;

        for (let j = 0; j < callbacks.length; j++) {
          callbacks[j].apply(this.game, [eventClone]);
        }
      }
    }
  }
};

export default Events;
