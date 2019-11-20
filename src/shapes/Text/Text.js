import Shape from '../Shape';
import { TextStyle } from './TextStyle';
import { TextMetrics } from './TextMetrics';

class Text extends Shape {
  constructor (text, opts) {
    super(opts);
    this.type = 'text';
    this.text = text;
    this._style = null;
    this.style = opts;

    this._font = '18px verdana';
    this.fill = '#333';
    this.dimensions = this.calcDimensions();

    this.localStyleID = -1;
    this.measured = {};
    // console.log('new Text:', this);
  }

  get style () {
    return this._style;
  }

  set style (style) {
    style = style || {};
    if (style instanceof TextStyle) {
      this._style = style;
    } else {
      this._style = new TextStyle(style);
    }
    this.localStyleID = -1;
    this.dirty = true;
  }

  updateText () {
    const style = this._style;

    if (this.localStyleID !== style.styleID) {
      this.dirty = true;
      this.localStyleID = style.styleID;
    }

    if (!this.dirty) {
      return;
    }

    this.measured = TextMetrics.measureText(this.text || ' ', style, style.wordWrap);
    this._font = this.style.toFontString();

    this.dirty = false;
  }

  getAxes () {
  }

  project (axis) {
  }

  addPoint (x, y) {
  }

  calcDimensions () {
    return {
      left: 0,
      top: 0,
      width: 100,
      height: 20
    };
  }

  update () {
    return this;
  }

  move (dx, dy) {
  }
}

export default Text;