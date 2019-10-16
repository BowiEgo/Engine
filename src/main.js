/*global ENV*/
import Engine from './core/Engine';
import Object from './core/Object';
import Input from './core/Input';
import Time from './core/Time';
import Polygon from './geometry/Polygon';
import Point from './geometry/Vertices';

// Enable LiveReload
if (ENV !== 'production') {
  document.write(
    '<script src="http://' + (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1"></' + 'script>'
  )
}

const myGame = Engine.create(document.getElementById('stage'), {
  width: 600,
  height: 300
});
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const pauseBtn = document.getElementById('pause');
const fastBtn = document.getElementById('fastward');

let player = new Object({
  shape: new Polygon([
    new Point(0, 0),
    new Point(20, 0),
    new Point(30, 20),
    new Point(10, 20)
  ]),
  fill: '#ff8080',
  transform: {
    position: {
      x: 230,
      y: 150
    }
  },

  start: function () {
  },

  update: function () {
    let { transform } = this;

    const horizontalInput = Input.getAxis('horizontal');
    const verticalInput = Input.getAxis('vertical');
    const speed = 100;

    transform.position.x += speed * Time.deltaTime * horizontalInput;
    transform.position.y += speed * Time.deltaTime * verticalInput;

    if (this.shape.collidesWith(obstacle.shape)) {
      console.log('collide!!');
    }
  }
});

let obstacle = new Object({
  shape: new Polygon([
    new Point(0, 0),
    new Point(30, 20),
    new Point(10, 20)
  ]),
  transform: {
    position: {
      x: 20,
      y: 50
    }
  },

  start: function () {
  },

  update: function () {
    // let { transform } = this;

    // const speed = 100;
    // transform.position.x += speed * Time.deltaTime;
  }
});

myGame.scene.addObject(player);
myGame.scene.addObject(obstacle);

startBtn.addEventListener('click', () => {
  myGame.restart();
})

stopBtn.addEventListener('click', () => {
  myGame.stop();
})

pauseBtn.addEventListener('click', () => {
  if (myGame.status === 'paused') {
    myGame.resume();
  } else {
    myGame.pause();
  }
})

fastBtn.addEventListener('click', () => {
  myGame.Time.timeScale = 1.5;
})

console.log(myGame)
