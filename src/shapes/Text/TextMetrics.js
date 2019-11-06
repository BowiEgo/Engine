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
    console.log(this)
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
    const lines = outputText.split(/(?:\r\n|\r|\n)/);
    const lineWidths = new Array(lines.length);
    let maxLineWidth = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineWidth = context.measureText(lines[i]).width + ((lines[i].length - 1) * style.letterSpacing);

      lineWidths[i] = lineWidth;
      maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }

    let width = maxLineWidth + style.strokeThickness;

    if (style.dropShadow) {
      width += style.dropShadowDistance;
    }

    const lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
    let height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness)

    if (style.dropShadow) {
      height += style.dropShadowDistance;
    }
    
    return new TextMetrics(
      text,
      style,
      width,
      height,
      lines,
      lineWidths,
      lineHeight + style.leading,
      maxLineWidth,
      fontProperties
    );
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

    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];

      if (TextMetrics.isNewline(token)) {
        if (!collapseNewlines) {
          lines += TextMetrics.addLine(line);
          canPrependSpaces = !collapseSpaces;
          line = '';
          width = 0;
          continue;
        }

        // if we should collapse new lines
        // we simply convert it into a space
        token = ' ';
      }

      // if we should collapse repeated whitespaces
      if (collapseSpaces) {
        // check both this and the last tokens for spaces
        const currIsBreakingSpace = TextMetrics.isBreakingSpace(token);
        const lastIsBreakingSpace = TextMetrics.isBreakingSpace(line[line.length - 1]);

        if (currIsBreakingSpace && lastIsBreakingSpace) {
          continue;
        }
      }

      const tokenWidth = TextMetrics.getFromCache(token, letterSpacing, cache, context);

      // word is longer than desired bounds
      if (tokenWidth > wordWrapWidth) {
        // if we are not already at the beginning of a line
        if (line !== '') {
          // start newlines for overflow words
          lines += TextMetrics.addLine(line);
          line = '';
          width = 0;
        }

        // break large word over multiple lines
        if (TextMetrics.canBreakWords(token, style.breakWords)) {
          // break word into characters
          const characters = token.split('');
          // loop the characters
          for (let j = 0; j < characters.length; j++) {
            let char = characters[j];

            let k = 1;
            // we are not at the end of the token

            while (characters[j + k]) {
              const nextChar = characters[j + k];
              const lastChar = char[char.length - 1];
              
              // should not split chars
              if (!TextMetrics.canBreakChars(lastChar, nextChar, token, j, style.breakWords)) {
                // combine chars & move forward one
                char += nextChar;
              } else {
                break;
              }

              k++;
            }

            j += char.length - 1;

            const characterWidth = TextMetrics.getFromCache(char, letterSpacing, cache, context);

            if (characterWidth + width > wordWrapWidth) {
              lines += TextMetrics.addLine(line);
              canPrependSpaces = false;
              line = '';
              width = 0;
            }

            line += char;
            width += characterWidth;
          }
        } else {
          // if there are words in this line already
          // finish that line and start a new one
          if (line.length > 0) {
            lines += TextMetrics.addLine(line);
            line = '';
            width = 0;
          }

          const isLastToken = i === tokens.length - 1;

          // give it its own line if it's not the end
          lines += TextMetrics.addLine(token, !isLastToken);
          canPrependSpaces = false;
          line = '';
          width = 0;
        }
      } else {
        // word won't fit because of existing words
        // start a new line
        if (tokenWidth + width > wordWrapWidth) {
          // if its a space we don't want it
          canPrependSpaces = false;

          // add a new line
          lines += TextMetrics.addLine(line);

          // start a new line
          line = '';
          width = 0;
        }

        // don't add spaces to the beginning of lines
        if (line.length > 0 || !TextMetrics.isBreakingSpace(token) || canPrependSpaces) {
          // add the word to the current line
          line += token;

          // update width counter
          width += tokenWidth;
        }
      }
    }

    lines += TextMetrics.addLine(line, false);

    return lines;
  }

  /**
   * Gets & sets the widths of calculated characters in a cache object
   *
   * @private
   * @param  {string}                    key            The key
   * @param  {number}                    letterSpacing  The letter spacing
   * @param  {object}                    cache          The cache
   * @param  {CanvasRenderingContext2D}  context        The canvas context
   * @return {number}                    The from cache.
   */
  static getFromCache (key, letterSpacing, cache, context) {
    let width = cache[key];

    if (width === undefined) {
      const spacing = ((key.length) * letterSpacing);

      width = context.measureText(key).width + spacing;
      cache[key] = width;
    }

    return width;
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
   * This method exists to be easily overridden
   * It allows one to customise which words should break
   * Examples are if the token is CJK or numbers.
   * It must return a boolean.
   *
   * @private
   * @param  {string}  token       The token
   * @param  {boolean}  breakWords  The style attr break words
   * @return {boolean} whether to break word or not
   */
  static canBreakWords(token, breakWords) {
    return breakWords;
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

  /**
   * Convienience function for logging each line added during the wordWrap
   * method
   *
   * @private
   * @param  {string}   line        - The line of text to add
   * @param  {boolean}  newLine     - Add new line character to end
   * @return {string}   A formatted line
   */
  static addLine (line, newLine = true) {
    line = TextMetrics.trimRight(line);

    line = (newLine) ? `${line}\n` : line;

    return line;
  }

  /**
   * trims breaking whitespaces from string
   *
   * @private
   * @param  {string}  text  The text
   * @return {string}  trimmed string
   */
  static trimRight (text) {
    if (typeof text !== 'string') {
      return '';
    }

    for (let i = text.length - 1; i >= 0; i--) {
      const char = text[i];

      if (!TextMetrics.isBreakingSpace(char)) {
        break;
      }

      text = text.slice(0, -1);
    }

    return text;
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
