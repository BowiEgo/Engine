/*global ENV*/
import Engine from './core/Engine';
import Object from './core/Object';
import Input from './core/Input';
import Time from './core/Time';
import Polygon from './shape/Polygon';
import Circle from './shape/Circle';
import Rectangle from './shape/Rectangle';

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
    [0, 0],
    [60, 0],
    [60, 20],
    [30, 40],
    [10, 40]
  ], {
    fill: '#009688'
  }),
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

    if (this.shape.collidesWith(obstacle1.shape)) {
      console.log('collide!!');
    }
  }
});

let obstacle1 = new Object({
  shape: new Rectangle(600, 20),
  transform: {
    position: {
      x: 0,
      y: 270
    }
  },
  start: function () {
  },
  update: function () {
  }
});

let obstacle2 = new Object({
  shape: new Circle(20, {
    fill: '#ffc107'
  }),
  transform: {
    position: {
      x: 100,
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
myGame.scene.addObject(obstacle1);
myGame.scene.addObject(obstacle2);

myGame.render.render();

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
