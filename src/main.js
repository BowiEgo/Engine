/*global ENV*/
import Engine from './core/Engine';
import Input from './core/Input';
import Time from './core/Time';
import Body from './core/Body';
import Shape from './shapes';

// Enable LiveReload
if (ENV !== 'production') {
  document.write(
    '<script src="http://' + (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1"></' + 'script>'
  )
}

Engine.Input = Input;
Engine.Time = Time;
Engine.Body = Body;
Engine.Shape = Shape;

export default Engine;
