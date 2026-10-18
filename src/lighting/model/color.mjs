/** @param {string} text */
export function parseHex(text) {
  if (!/^#?[0-9a-f]{6}$/i.test(text)) return null;
  const hex = text.replace("#", "");
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}
/** @param {{r:number,g:number,b:number}} rgb */
export function formatHex(rgb) {
  return (
    "#" +
    [rgb.r, rgb.g, rgb.b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}
