let Scene = {};

Scene.create = (game) => {
  let scene = {};

  scene.game = game;
  scene.objectArray = [];

  scene.addObject = (object) => {
    scene.objectArray.push(object);
    scene.game.render.clear();
    scene.game.render.render();
  }

  scene.reset = () => {
    scene.objectArray.forEach((object) => {
      object.reset();
    })
  }

  scene.update = () => {
    scene.objectArray.forEach((object) => {
      if (game.status === 'playing') {
        object.updateCb.call(object);
      }
    })
  }

  return scene
}

export default Scene


// class Scene {
//   constructor (opts, Engine) {
//     this.Engine = Engine;
//     this.canvasEl = null;
//     this.ctx = null;
//     this.el = opts.el;
//     this.scale = opts.scale !== undefined ? opts.scale : 1;
//     this.bgColor = opts.scale !== undefined ? opts.bgColor : '#dedede';
//     this.objectArray = [];

//     _init.call(this, opts);
//   }

//   create (game) {
//     this.game = game;
//   }

//   reset () {
//     this.objectArray.forEach((object) => {
//       object.reset();
//     })
//     this.clearCtx();
//     this.update();
//   }

//   run () {
//     this.clearCtx();

//     this.objectArray.forEach((object) => {
//       object.startCb.call(object);
//     })
//   }

//   update () {
//     const { Engine } = this;
//     const { Time } = Engine;

//     this.objectArray.forEach((object) => {
//       if (Engine.status === 'playing') {
//         object.updateCb.call(object);
//       }
//       // object.render();
//     })

//     // if (Engine.showFPS && Engine.fps) {
//     //   this.showFPS(Time.fps);
//     // }
//   }

//   clearCtx () {
//     this.ctx.clearRect(0, 0, this.ctxW, this.ctxH);
//   }

//   showFPS (fps) {
//     this.ctx.font = '25px Arial';
//     this.ctx.fillStyle = 'black';
//     this.ctx.fillText('FPS: ' + fps, 10, 30);
//   }

//   addObject (object) {
//     object.Scene = this;
//     object.Engine = this.Engine;
//     this.objectArray.push(object);
//     object.render();
//   }
// }

// function _init (opts) {
//   const { scale, bgColor } = this;
//   const elRect = opts.el.getBoundingClientRect();

//   this.ctxW = elRect.width;
//   this.ctxH = elRect.height || 300;

//   this.canvasEl = document.createElement('canvas');
//   this.canvasEl.width = elRect.width * scale;
//   this.canvasEl.height = 300 * scale;
//   this.canvasEl.style.width = elRect.width + 'px';
//   this.canvasEl.style.height = 300 + 'px';
//   this.canvasEl.style.backgroundColor = bgColor;
//   this.el.append(this.canvasEl);

//   this.ctx = this.canvasEl.getContext('2d');
//   this.ctx.scale(scale, scale);
// }

// export default Scene
