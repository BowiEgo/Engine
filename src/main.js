/*global ENV*/
import Engine from './core/Engine';
import Input from './core/Input';
import Time from './core/Time';
import Object from './core/Object';
import {
  Polygon,
  Polyline,
  Circle,
  Rectangle,
  Text
} from './shapes';
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

let polygon = new Object({
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
    // let { transform } = this;

    // const horizontalInput = Input.getAxis('horizontal');
    // const verticalInput = Input.getAxis('vertical');
    // const speed = 100;

    // transform.position.x += speed * Time.deltaTime * horizontalInput;
    // transform.position.y += speed * Time.deltaTime * verticalInput;

    // if (this.shape.collidesWith(rectangle.shape)) {
    //   console.log('collide!!');
    // }
  }
});

let circle = new Object({
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

let player = new Object({
  shape: [
    new Rectangle({
      width: 120,
      height: 40,
      rx: 2,
      ry: 2,
      fill: 'white',
      stroke: 'grey',
      strokeWidth: 2
    }),
    new Text('这是\n一个方块\n一个圆圆的方块', {
      align: 'center',
      lineHeight: 12,
      lineWidth: 16,
      fontSize: 10,
      fontStyle: 'italic',
      fontFamily: 'Avenir',
      fontWeight: 'bold',
      underline: true,
      linethrough: true,
      overline: true,
      dropShadow: true,
      dropShadowColor: 'rgba(0, 0, 0, 0.3)',
      letterSpacing: 4,
      fill: '#03a9f4',
      wordWrap: true
    })
  ],
  transform: {
    position: {
      x: 360,
      y: 40
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
  }
});

myGame.scene.addObject(polygon);
myGame.scene.addObject(polyline);
myGame.scene.addObject(circle);
myGame.scene.addObject(title);
myGame.scene.addObject(player);

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
