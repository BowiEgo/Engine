import Shape from './Shape';

const commandLengths = {
  m: 2,
  l: 2,
  h: 1,
  v: 1,
  c: 6,
  s: 4,
  q: 4,
  t: 2,
  a: 7
}, 
repeatedCommands = {
  m: 'l',
  M: 'L'
};

class Path extends Shape {
  constructor (path, opts) {
    super(opts);
    this.type = 'path';
    this.path = path.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);
    this.path = Path.parsePath(this.path);
    this.width = 0;
    this.height = 0;
    this.dimensions = this.calcDimensions();
    this.fill = opts.fill;
    // console.log('new Path', this);
  }

  static parsePath (path) {
    let result = [],
      coords = [],
      currentPath,
      parsed,
      re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/ig,
      match,
      coordsStr;

    for (let i = 0, coordsParsed, len = path.length; i < len; i++) {
      currentPath = path[i];

      coordsStr = currentPath.slice(1).trim();
      coords.length = 0;

      while ((match = re.exec(coordsStr))) {
        coords.push(match[0]);
      }

      coordsParsed = [currentPath.charAt(0)];

      for (let j = 0, jlen = coords.length; j < jlen; j++) {
        parsed = parseFloat(coords[j]);
        if (!isNaN(parsed)) {
          coordsParsed.push(parsed);
        }
      }

      let command = coordsParsed[0],
          commandLength = commandLengths[command.toLowerCase()],
          repeatedCommand = repeatedCommands[command] || command;

      if (coordsParsed.length - 1 > commandLength) {
        for (let k = 1, klen = coordsParsed.length; k < klen; k += commandLength) {
          result.push([command].concat(coordsParsed.slice(k, k + commandLength)));
          command = repeatedCommand;
        }
      }
      else {
        result.push(coordsParsed);
      }
    }

    return result;
  }

  update (path) {
    this.path = path.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);
    this.path = Path.parsePath(this.path);
    return this;
  }

  calcDimensions () {
    return {
      left: 0,
      top: 0,
      width: this.width,
      height: this.height
    };
  }
}

export default Path
