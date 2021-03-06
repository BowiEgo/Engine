let keyCodeArray = [];

document.onkeydown = (event) => {
  const { keyCode } = event;
  let idx = keyCodeArray.indexOf(keyCode);

  if (idx === -1) {
    keyCodeArray.push(keyCode);
  }
}

document.onkeyup = (event) => {
  const { keyCode } = event;
  let idx = keyCodeArray.indexOf(keyCode);
  if (idx > -1) {
    keyCodeArray.splice(idx, 1);
  }
}

export default class Input {
  constructor (app) {
    this.plugin_name = 'input';
    this.app = app;
  }

  static create (app) {
    return new Input(app);
  }

  installed () {
  }

  destroy () {
    document.onkeydown = null;
    document.onkeyup = null;
  }

  getAxis (direction) {
    if (direction === 'horizontal') {
      if (keyCodeArray.indexOf(37) > -1) {
        return -1
      }
      if (keyCodeArray.indexOf(39) > -1) {
        return 1
      }
      return 0
    }
    
    if (direction === 'vertical') {
      if (keyCodeArray.indexOf(38) > -1) {
        return -1
      }
      if (keyCodeArray.indexOf(40) > -1) {
        return 1
      }
      return 0
    }
  }
}
