import { keys, clone } from '../utils/Common';

let Events = {};

Events.on = function (object, eventNames, callback) {
  let names = eventNames.split(' '),
    name;

  for (let i = 0; i < names.length; i++) {
    name = names[i];
    object.events = object.events || {};
    object.events[name] = object.events[name] || [];
    object.events[name].push(callback);
  }

  return callback;
}

Events.off = function(object, eventNames, callback) {
  if (!eventNames) {
    object.events = {};
    return;
  }

  // handle Events.off(object, callback)
  if (typeof eventNames === 'function') {
    callback = eventNames;
    eventNames = keys(object.events).join(' ');
  }

  let names = eventNames.split(' ');

  for (let i = 0; i < names.length; i++) {
    let callbacks = object.events[names[i]],
      newCallbacks = [];

    if (callback && callbacks) {
      for (let j = 0; j < callbacks.length; j++) {
        if (callbacks[j] !== callback)
          newCallbacks.push(callbacks[j]);
      }
    }

    object.events[names[i]] = newCallbacks;
  }
};

Events.trigger = function(object, eventNames, event) {
  let names,
    name,
    callbacks,
    eventClone;

  let events = object.events;
  
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
        eventClone.source = object;

        for (let j = 0; j < callbacks.length; j++) {
          callbacks[j].apply(object, [eventClone]);
        }
      }
    }
  }
};

export default Events;
