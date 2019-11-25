const { Body, Shape } = Engine;

function createGame () {
  const myGame = Engine.create(
    document.getElementById('stage'),
    {
      width: 1200,
      height: 600,
      plugins: [ Performance, Input ]
    },
  );
  const startBtn = document.getElementById('start');
  const stopBtn = document.getElementById('stop');
  const pauseBtn = document.getElementById('pause');
  const fastBtn = document.getElementById('fastward');
  const recoverBtn = document.getElementById('recover');

  let polygon = new Body({
    shape: new Shape.Polygon([
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

  let circle = new Body({
    shape: new Shape.Circle(20, {
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

  let title = new Body({
    shape: new Shape.Text('hail hydra ！！', {
      fill: '#f44336'
    }),
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

  let polyline = new Body({
    shape: new Shape.Polyline([
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

  let player = new Body({
    shape: [
      new Shape.Rectangle({
        width: 120,
        height: 40,
        rx: 2,
        ry: 2,
        fill: 'white',
        stroke: 'grey',
        strokeWidth: 2
      }),
      new Shape.Text('这是\n一个方块\n一个圆圆的方块', {
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
      }).translate(-50, 6)
    ],
    transform: {
      position: {
        x: 540,
        y: 220
      }
    },
    start: function () {
    },
    update: function () {
      let { transform } = this;
      let { input } = myGame;

      const horizontalInput = input.getAxis('horizontal');
      const verticalInput = input.getAxis('vertical');
      const speed = 100;

      transform.position.x += speed * myGame.time.deltaTime * horizontalInput;
      transform.position.y += speed * myGame.time.deltaTime * verticalInput;
    }
  });

  let arrow = new Body({
    shape: [
      new Shape.Path('M121.32,0L44.58,0C36.67,0,29.5,3.22,24.31,8.41\
      c-5.19,5.19-8.41,12.37-8.41,20.28c0,15.82,12.87,28.69,28.69,28.69c0,0,4.4,\
      0,7.48,0C36.66,72.78,8.4,101.04,8.4,101.04C2.98,106.45,0,113.66,0,121.32\
      c0,7.66,2.98,14.87,8.4,20.29l0,0c5.42,5.42,12.62,8.4,20.28,8.4c7.66,0,14.87\
      -2.98,20.29-8.4c0,0,28.26-28.25,43.66-43.66c0,3.08,0,7.48,0,7.48c0,15.82,\
      12.87,28.69,28.69,28.69c7.66,0,14.87-2.99,20.29-8.4c5.42-5.42,8.4-12.62,8.4\
      -20.28l0-76.74c0-7.66-2.98-14.87-8.4-20.29C136.19,2.98,128.98,0,121.32,0z',
      {
        fill: '#e91e63',
        stroke: 'green',
        strokeWidth: 2
      }),
      // new Shape.Path('M-200,200 l 50,-25\
      // a25,25 -30 0,1 50,-25 l 50,-25\
      // a25,50 -30 0,1 50,-25 l 50,-25\
      // a25,75 -30 0,1 50,-25 l 50,-25\
      // a25,100 -30 0,1 50,-25 l 50,-25',
      // {
      //   stroke: '#3f51b5',
      //   strokeWidth: 5
      // })
    ],
    transform: {
      position: {
        x: 660,
        y: 40
      },
      scale: 1
    }
  })

  let boundingCurve = new Body({
    shape: [
      new Shape.Path('M-200,200 l 50,-25\
      a25,25 -30 0,1 50,-25 l 50,-25\
      a25,50 -30 0,1 50,-25 l 50,-25\
      a25,75 -30 0,1 50,-25 l 50,-25\
      a25,100 -30 0,1 50,-25 l 50,-25',
      {
        stroke: '#3f51b5',
        strokeWidth: 5
      })
    ],
    transform: {
      position: {
        x: 900,
        y: 260
      },
      scale: 1
    }
  })

  let pie = new Body({
    shape: [
      new Shape.Path('M300,200 h-150 a150,150 0 1,0 150,-150 z',
      {
        stroke: 'green',
        strokeWidth: 5
      }),
      new Shape.Path('M275,175 v-150 a150,150 0 0,0 -150,150 z',
      {
        stroke: 'green',
        strokeWidth: 5
      })
    ],
    transform: {
      position: {
        x: 100,
        y: 240
      }
    }
  })

  myGame.scene.addBody(polygon);
  // myGame.scene.addBody(polyline);
  myGame.scene.addBody(circle);
  myGame.scene.addBody(title);
  myGame.scene.addBody(player);
  myGame.scene.addBody(arrow);
  myGame.scene.addBody(boundingCurve);
  myGame.scene.addBody(pie);

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

  myGame.start();
  console.log('myGame', myGame);
}

// graph
function createGraph () {
  const myGraph = Engine.create(
    document.getElementById('graph'),
    {
      width: 600,
      height: 800,
      autoStart: true,
      plugins: [ Performance, Input ]
    },
  );

  let direction = -1;

  function createTextNode (index) {
    const posY = 120 + index * 70;

    return new Body({
      shape: [
        new Shape.Rectangle({
          width: 120,
          height: 56,
          rx: 2,
          ry: 2,
          fill: 'white',
          stroke: 'grey',
          strokeWidth: 2
        }),
        new Shape.Text('巴啦啦', {
          align: 'left',
          lineHeight: 16,
          fill: '#333',
          fontSize: 10,
          fontFamily: 'Avenir',
          letterSpacing: 1,
          wordWrap: true,
          wordWrapWidth: 100,
          breakWords: true
        }).translate(10, 6),
        new Shape.Text('power: 100%', {
          align: 'left',
          lineHeight: 16,
          fill: '#333',
          fontSize: 10,
          fontFamily: 'Avenir',
          letterSpacing: 1,
          wordWrap: true,
          wordWrapWidth: 100,
          breakWords: true
        }).translate(10, 38),
        new Shape.Path('M120,20C140,20,160,60,180,60',
        {
          stroke: 'grey',
          strokeWidth: 2
        })
      ],
      transform: {
        position: {
          x: 240,
          y: posY
        }
      },
      start: function () {
      },
      update: function () {
        if (index !== 0 || myGraph.hitTarget !== this) return;
        let { transform } = this;
        let { time, camera } = myGraph;
    
        let startPointX = 120;
        let startPointY = 20;

        let endPointX = 180 - camera.position.x;
        let endPointY = 180 - camera.position.y - posY;

        let spaceX = endPointX - startPointX;
    
        this.shapes[3].update(`M${startPointX},${startPointY}C${startPointX + spaceX / 2},20,${endPointX - spaceX / 2},${endPointY},${endPointX},${endPointY}`);
      }
    });
  }

  const textNodes = [];

  for (let i = 0; i < 20; i++) {
    let textNode = createTextNode(i);
    textNodes.push(textNode);
    myGraph.scene.addBody(textNode);
  }
  console.log(textNodes);

  let branch = new Body({
    shape: new Shape.Rectangle({
      width: 20,
      height: 60,
      rx: 2,
      ry: 2,
      fill: 'white',
      stroke: 'grey',
      strokeWidth: 2
    }),
    transform: {
      position: {
        x: 420,
        y: 150
      }
    },
    update: function () {
      // let { transform } = this;
      // let { Time, camera } = myGraph;

      // this.shape.transform.position = {
      //   x: -camera.position.x,
      //   y: -camera.position.y
      // }
    }
  })

  myGraph.scene.addBody(branch);
  console.log('myGraph', myGraph);
}

// createGraph();
createGame();
