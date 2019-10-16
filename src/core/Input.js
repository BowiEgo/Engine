let Input = {
  keyCodeArray: []
};

Input.create = () => {
  document.onkeydown = (event) => {
    const { keyCode } = event;
    let idx = Input.keyCodeArray.indexOf(keyCode);

    if (idx === -1) {
      Input.keyCodeArray.push(keyCode);
    }
  }

  document.onkeyup = (event) => {
    const { keyCode } = event;
    let idx = Input.keyCodeArray.indexOf(keyCode);
    if (idx > -1) {
      Input.keyCodeArray.splice(idx, 1);
    }
  }
}

Input.getAxis = (direction) => {
  if (direction === 'horizontal') {
    if (Input.keyCodeArray.indexOf(37) > -1) {
      return -1
    }
    if (Input.keyCodeArray.indexOf(39) > -1) {
      return 1
    }
    return 0
  }

  if (direction === 'vertical') {
    if (Input.keyCodeArray.indexOf(38) > -1) {
      return -1
    }
    if (Input.keyCodeArray.indexOf(40) > -1) {
      return 1
    }
    return 0
  }
}

Input.create();

// class Input {
//   constructor () {
//     this.keyCodeArray = [];

//     document.onkeydown = (event) => {
//       const { keyCode } = event;
//       let idx = this.keyCodeArray.indexOf(keyCode);

//       if (idx === -1) {
//         this.keyCodeArray.push(keyCode);
//       }
//     }

//     document.onkeyup = (event) => {
//       const { keyCode } = event;
//       let idx = this.keyCodeArray.indexOf(keyCode);
//       if (idx > -1) {
//         this.keyCodeArray.splice(idx, 1);
//       }
//     }
//   }

//   getAxis (direction) {
    
//   }
// }

export default Input
