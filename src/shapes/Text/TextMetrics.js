export class TextMetrics {
  constructor (text, style, width, height, lines, lineWidths, lineHeight, maxLineWidth, fontProperties) {
    this.text = text;
    this.style = style;
    this.width = width;
    this.height = height;
    this.lines = lines; // {string[]}
    this.lineWidths = lineWidths; // {number[]}
    this.lineHeight = lineHeight;
    this.maxLineWidth = maxLineWidth;
    this.fontProperties = fontProperties;
  }

  static measureText (text, style, wordWrap) {
    wordWrap = (wordWrap === undefined || wordWrap === null) ? style.wordWrap : wordWrap;
    const font = style.toFontString();
    const fontProperties = TextMetrics.measureFont(font);

    if (fontProperties.fontSize === 0) {
      fontProperties.fontSize = style.fontSize;
      fontProperties.ascent = style.fontSize;
    }

    const context = TextMetrics._context;

    context.font = font;

    const outputText = wordWrap ? TextMetrics.wordWrap(text, style) : text;

  }

  /**
   * Calculates the ascent, descent and fontSize of a given font-style
   * http://en.wikipedia.org/wiki/Typeface
   *
   * @static
   * @param {string} font - String representing the style of the font
   * @return {FontMetrics} Font properties object
   */
  static measureFont (font) {
    if (TextMetrics._fonts[font]) {
      return TextMetrics._fonts[font];
    }

    const properties = {};

    const canvas = TextMetrics._canvas;
    const context = TextMetrics._context;

    context.font = font;

    const metricsString = TextMetrics.METRICS_STRING + TextMetrics.BASELINE_SYMBOL;
    const width = Math.ceil(context.measureText(metricsString).width);
    let baseline = Math.ceil(context.measureText(TextMetrics.BASELINE_SYMBOL).width);
    const height = 2 * baseline;
    baseline = baseline * TextMetrics.BASELINE_MULTIPLIER | 0;

    canvas.width = width;
    canvas.height = height;

    context.fillStyle = '#f00';
    context.fillRect(0, 0, width, height);

    context.font = font;

    context.textBaseline = 'alphabetic';
    context.fillStyle = '#000';
    context.fillText(metricsString, 0, baseline);

    const imagedata = context.getImageData(0, 0, width, height).data;
    const pixels = imagedata.length;
    const line = width * 4;

    let i = 0;
    let idx = 0;
    let stop = false;

    for (i = 0; i < baseline; ++i) {
      for (let j = 0; j < line; j += 4) {
        if (imagedata[idx + j] !== 255) {
          stop = true;
          break;
        }
      }
      if (!stop) {
        idx += line;
      } else {
        break;
      }
    }

    properties.ascent = baseline - i;

    idx = pixels - line;
    stop = false;

    for (i = height; i > baseline; --i) {
      for (let j = 0; j < line; j += 4) {
        if (imagedata[idx + j] !== 255) {
          stop = true;
          break;
        }
      }

      if (!stop) {
        idx -= line;
      } else {
        break;
      }
    }

    properties.descent = i - baseline;
    properties.fontSize = properties.ascent + properties.descent;

    TextMetrics._fonts[font] = properties;

    return properties;
  }

  /**
   * Applies newlines to a string to have it optimally fit into the horizontal
   * bounds set by the Text object's wordWrapWidth property.
   *
   * @private
   * @param {string} text - String to apply word wrapping to
   * @param {TextStyle} style - the style to use when wrapping
   * @param {HTMLCanvasElement} [canvas] - optional specification of the canvas to use for measuring.
   * @return {string} New string with new lines applied where required
   */
  static wordWrap (text, style) {
    const context = TextMetrics._context;

    let width = 0;
    let line = '';
    let lines = '';

    const cache = {};
    const { letterSpacing, whiteSpace } = style;

    // How to handle whitespaces
    const collapseSpaces = TextMetrics.collapseSpaces(whiteSpace);
    const collapseNewlines = TextMetrics.collapseNewlines(whiteSpace);

    // whether or not spaces may be added to the beginning of lines
    let canPrependSpaces = !collapseSpaces;

    // There is letterSpacing after every char except the last one
    // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!
    // so for convenience the above needs to be compared to width + 1 extra letterSpace
    // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!_
    // ________________________________________________
    // And then the final space is simply no appended to each line
    const wordWrapWidth = style.wordWrapWidth + letterSpacing;

    // break text into words, spaces and newline chars
    const tokens = TextMetrics.tokenize(text);

    console.log('tokens', tokens);
    for (let i = 0; i < tokens.length; i++) {

    }

  }

  /**
   * Determines whether we should collapse breaking spaces
   *
   * @private
   * @param  {string}   whiteSpace  The TextStyle property whiteSpace
   * @return {boolean}  should collapse
   */
  static collapseSpaces (whiteSpace) {
      return (whiteSpace === 'normal' || whiteSpace === 'pre-line');
  }

  /**
   * Determines whether we should collapse newLine chars
   *
   * @private
   * @param  {string}   whiteSpace  The white space
   * @return {boolean}  should collapse
   */
  static collapseNewlines(whiteSpace) {
    return (whiteSpace === 'normal');
  }

  /**
   * Splits a string into words, breaking-spaces and newLine characters
   *
   * @private
   * @param  {string}  text       The text
   * @return {string[]}  A tokenized array
   */
  static tokenize (text) {
    const tokens = [];
    let token = '';
    if (typeof text !== 'string') {
      return tokens;
    }

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (TextMetrics.isBreakingSpace(char) || TextMetrics.isNewline(char)) {
        if (token !== '') {
          tokens.push(token);
          token = '';
        }

        tokens.push(char);

        continue;
      }
      token += char;
    }

    if (token !== '') {
      tokens.push(token);
    }

    return tokens;
  }

  /**
   * Determines if char is a breaking whitespace.
   *
   * @private
   * @param  {string}  char  The character
   * @return {boolean}  True if whitespace, False otherwise.
   */
  static isBreakingSpace (char) {
    if (typeof char !== 'string') {
      return false;
    }

    return (TextMetrics._breakingSpaces.indexOf(char.charCodeAt(0)) >= 0);
  }

  /**
   * Determines if char is a newline.
   *
   * @private
   * @param  {string}  char  The character
   * @return {boolean}  True if newline, False otherwise.
   */
  static isNewline (char) {
    if (typeof char !== 'string') {
      return false;
    }

    return (TextMetrics._newlines.indexOf(char.charCodeAt(0)) >= 0);
  }
}

const canvas = (() => {
  try {
    // OffscreenCanvas2D measureText can be up to 40% faster.
    const c = new OffscreenCanvas(0, 0);
    return c.getContext('2d') ? c : document.createElement('canvas');
  } catch (ex) {
    return document.createElement('canvas');
  }
})();

canvas.width = canvas.height = 10;

TextMetrics._canvas = canvas;
TextMetrics._context = canvas.getContext('2d');
TextMetrics._fonts = {};
TextMetrics.METRICS_STRING = '|ÉqÅ';
TextMetrics.BASELINE_SYMBOL = 'M';
TextMetrics.BASELINE_MULTIPLIER = 1.4;
TextMetrics._newlines = [
  0x000A, // line feed
  0x000D, // carriage return
];
TextMetrics._breakingSpaces = [
  0x0009, // character tabulation
  0x0020, // space
  0x2000, // en quad
  0x2001, // em quad
  0x2002, // en space
  0x2003, // em space
  0x2004, // three-per-em space
  0x2005, // four-per-em space
  0x2006, // six-per-em space
  0x2008, // punctuation space
  0x2009, // thin space
  0x200A, // hair space
  0x205F, // medium mathematical space
  0x3000, // ideographic space
];
