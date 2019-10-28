/*global ENV*/
import Engine from './core/Engine';
import Object from './core/Object';
import Input from './core/Input';
import Time from './core/Time';
import Polygon from './shape/Polygon';
import Circle from './shape/Circle';
import Rectangle from './shape/Rectangle';
import Text from './shape/Text';
import Polyline from './line/Polyline';
import Performance from './widget/Performance';

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
Performance.create(myGame);
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const pauseBtn = document.getElementById('pause');
const fastBtn = document.getElementById('fastward');
const recoverBtn = document.getElementById('recover');

let player = new Object({
  shape: new Polygon([
    [0, 0],
    [60, 0],
    [60, 20],
    [30, 40],
    [10, 40]
  ], {
    fillStyle: '#009688'
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
    fillStyle: '#ffc107'
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

let title = new Object({
  shape: new Text('Engine Test'),
  transform: {
    position: {
      x: 200,
      y: 50
    }
  },
  start: function () {
  },
  update: function () {
  }
});

let polyline = new Object({
  shape: new Polyline([
    [0, 0],
    [60, 0],
    [60, 20],
    [30, 40],
    [10, 40]
  ], {
    style: 'dashed'
  }),
  transform: {
    position: {
      x: 320,
      y: 150
    }
  },
  start: function () {
  },
  update: function () {
  }
});

myGame.scene.addObject(obstacle1);
myGame.scene.addObject(obstacle2);
myGame.scene.addObject(title);
myGame.scene.addObject(polyline);
myGame.scene.addObject(player);

myGame.renderer.render();
myGame.start();

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

recoverBtn.addEventListener('click', () => {
  myGame.camera.recover();
})

console.log('myGame', myGame);
