/**
 * Converts a hexadecimal color number to a string.
 * @param {number} hex - Number in hex (e.g., `0xffffff`)
 * @return {string} The string color (e.g., `"#ffffff"`).
 */
export function hex2string (hex) {
  hex = hex.toString(16);
  hex = '000000'.substr(0, 6 - hex.length) + hex;

  return `#${hex}`;
}
