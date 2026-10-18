function encodeLiveRgb(rgb) {
  if (
    !rgb ||
    Object.keys(rgb).sort().join(",") !== "b,g,r" ||
    Object.values(rgb).some((v) => !Number.isInteger(v) || v < 0 || v > 255)
  )
    throw new Error("invalid-color");
  const report = Buffer.alloc(382);
  report.set([8, 10, 122, 1]);
  for (let offset = 4; offset < report.length; offset += 3)
    report.set([rgb.r, rgb.g, rgb.b], offset);
  return report;
}
module.exports = { encodeLiveRgb };
