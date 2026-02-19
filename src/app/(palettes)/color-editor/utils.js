import chroma from "chroma-js";

export const getContrastText = (color) => {
  try {
    const c = chroma.oklch(color.l, color.c, color.h);
    return chroma.contrast(c, "white") > chroma.contrast(c, "black")
      ? "#ffffff"
      : "#000000";
  } catch {
    return "#000000";
  }
};

export const toHex = (l, c, h) => chroma.oklch(l, c, h).hex();

export const generateExportText = (format, adjustedPalette) => {
  switch (format) {
    case "css":
      return adjustedPalette
        .map((c, i) => {
          const hex = toHex(c.l, c.c, c.h);
          return `--color-${i + 1}: ${hex};\n--color-${i + 1}-oklch: oklch(${c.l.toFixed(3)} ${c.c.toFixed(3)} ${c.h.toFixed(1)});`;
        })
        .join("\n");
    case "tailwind":
      return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${adjustedPalette
        .map((c, i) => `        "palette-${i + 1}": "${toHex(c.l, c.c, c.h)}",`)
        .join("\n")}\n      }\n    }\n  }\n}`;
    case "scss":
      return adjustedPalette
        .map((c, i) => `$color-${i + 1}: ${toHex(c.l, c.c, c.h)};`)
        .join("\n");
    case "json":
      return JSON.stringify(
        adjustedPalette.map((c, i) => ({
          name: `color-${i + 1}`,
          hex: toHex(c.l, c.c, c.h),
          oklch: {
            l: parseFloat(c.l.toFixed(3)),
            c: parseFloat(c.c.toFixed(3)),
            h: parseFloat(c.h.toFixed(1)),
          },
        })),
        null,
        2,
      );
    case "hex":
    default:
      return adjustedPalette.map((c) => toHex(c.l, c.c, c.h)).join("\n");
  }
};
