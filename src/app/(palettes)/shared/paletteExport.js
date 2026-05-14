import chroma from "chroma-js";

function getEntryColor(entry) {
  const value = entry?.value ?? entry ?? {};
  const l = value.l ?? 0;
  const c = value.c ?? 0;
  const h = value.h ?? 0;
  const a = value.a ?? 1;
  return { l, c, h, a };
}

export function oklchToHexString(entry) {
  const { l, c, h } = getEntryColor(entry);

  try {
    return chroma.oklch(l, c, h).hex();
  } catch {
    return "#000000";
  }
}

export function paletteToExportText(
  palette,
  format = "json",
  paletteName = "palette",
) {
  const normalized = (palette ?? []).map((entry, index) => {
    const value = getEntryColor(entry);
    const hex = oklchToHexString(value);
    return {
      name: entry?.name ?? `Color ${index + 1}`,
      value,
      hex,
      semanticRole: entry?.semanticRole ?? null,
    };
  });

  switch (format) {
    case "tailwind":
      return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${normalized
        .map(
          (entry, index) =>
            `        "${paletteName}-${index + 1}": "${entry.hex}",`,
        )
        .join("\n")}\n      }\n    }\n  }\n}`;
    case "css":
      return `:root {\n${normalized
        .map(
          (entry, index) =>
            `  --${paletteName}-${index + 1}: ${entry.hex};\n  --${paletteName}-${index + 1}-oklch: oklch(${entry.value.l.toFixed(3)} ${entry.value.c.toFixed(3)} ${entry.value.h.toFixed(1)});`,
        )
        .join("\n")}\n}`;
    case "hex":
      return normalized.map((entry) => entry.hex).join("\n");
    case "json":
    default:
      return JSON.stringify(
        normalized.map((entry, index) => ({
          name: entry.name,
          hex: entry.hex,
          semanticRole: entry.semanticRole,
          oklch: {
            l: parseFloat(entry.value.l.toFixed(3)),
            c: parseFloat(entry.value.c.toFixed(3)),
            h: parseFloat(entry.value.h.toFixed(1)),
            a: parseFloat(entry.value.a.toFixed(3)),
          },
          index: index + 1,
        })),
        null,
        2,
      );
  }
}

export function downloadPaletteExport(
  palette,
  format,
  paletteName = "palette",
) {
  const text = paletteToExportText(palette, format, paletteName);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${paletteName}.${format === "tailwind" ? "js" : format === "json" ? "json" : format === "css" ? "css" : "txt"}`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
