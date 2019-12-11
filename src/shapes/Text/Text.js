import Shape from '../Shape';
import Dimensions from '../../geometry/Dimensions';
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
    
    this.localStyleID = -1;
    this.measured = {
      width: 0,
      height: 0
    };
    this.updateText();
    this.dimensions = this.calcDimensions();
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
    console.log(this.measured);
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
    // console.log(this.transform.position)
    return new Dimensions(
      this.transform.position.x,
      this.transform.position.y,
      this.measured.width,
      this.measured.height
    )
  }

  update () {
    return this;
  }

  move (dx, dy) {
  }
}

export default Text;