/**
 * Converts a hexadecimal color number to a string.
 * @param {number} hex - Number in hex (e.g., `0xffffff`)
 * @return {string} The string color (e.g., `"#ffffff"`).
 */
export function hex2string(hex) {
  hex = hex.toString(16);
  hex = '000000'.substr(0, 6 - hex.length) + hex;

  return `#${hex}`;
}

/**
 * Converts a hexadecimal color number to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
 *
 * @param {number} hex - The hexadecimal number to convert
 * @param  {number[]} [out=[]] If supplied, this array will be used rather than returning a new one
 * @return {number[]} An array representing the [R, G, B] of the color where all values are floats.
 */
export function hex2rgb(hex, out) {
  out = out || [];

  out[0] = ((hex >> 16) & 0xff) / 255;
  out[1] = ((hex >> 8) & 0xff) / 255;
  out[2] = (hex & 0xff) / 255;

  return out;
}

/**
 * Converts a hexadecimal string to a hexadecimal color number.
 *
 * @param {string} The string color (e.g., `"#ffffff"`)
 * @return {number} Number in hexadecimal.
 */
export function string2hex(string) {
  if (typeof string === 'string' && string[0] === '#') {
    string = string.substr(1);
  }

  return parseInt(string, 16);
}
