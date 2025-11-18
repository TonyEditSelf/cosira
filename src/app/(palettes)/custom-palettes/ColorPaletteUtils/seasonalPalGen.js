export default function seasonalPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.2;
  const CMAX = 0.32;
  const CMIN = 0.04;

  // Warm/cool detection
  const isWarm = oklch.h >= 330 || oklch.h < 90;
  const isBright = oklch.l > 0.65;

  let season = "spring";
  if (isWarm && isBright) season = "spring";
  else if (!isWarm && isBright) season = "summer";
  else if (isWarm && !isBright) season = "autumn";
  else season = "winter";

  // Helper for safe OKLCH
  function variant(offsetH, cMul, lShift) {
    const h = (oklch.h + offsetH + 360) % 360;

    const cRaw = oklch.c * cMul;
    const c = Math.min(CMAX, Math.max(CMIN, cRaw));

    const lRaw = oklch.l + lShift;
    const l = Math.min(LMAX, Math.max(LMIN, lRaw));

    return { l, c, h };
  }

  // Neutral generator — derived from base hue
  function neutral(l, c = 0.01, hueShift = 0) {
    return {
      l,
      c: Math.max(CMIN / 2, c),
      h: (oklch.h + hueShift + 360) % 360,
    };
  }

  let palette = [];

  // ---- SPRING (bright, warm, clear) ----
  if (season === "spring") {
    palette = [
      { name: "Spring-1", value: variant(+8, 1.15, +0.1) },
      { name: "Spring-2", value: variant(+18, 1.25, +0.12) },
      { name: "Spring-3", value: variant(+30, 1.35, +0.16) },
      { name: "Spring-4", value: variant(+45, 1.4, +0.2) },
      { name: "Spring-5", value: variant(+60, 1.28, +0.08) },
      { name: "Spring-6", value: variant(+80, 1.15, +0.05) },
      { name: "Spring-7", value: variant(+100, 1.1, -0.02) },
      { name: "Spring-Neutral-1", value: neutral(0.88, 0.02, +10) },
      { name: "Spring-Neutral-2", value: neutral(0.72, 0.015, +5) },
      { name: "Spring-Neutral-3", value: neutral(0.55, 0.018, +0) },
    ];
  }

  // ---- SUMMER (cool, soft, muted) ----
  if (season === "summer") {
    palette = [
      { name: "Summer-1", value: variant(+160, 0.55, +0.1) },
      { name: "Summer-2", value: variant(+185, 0.6, +0.07) },
      { name: "Summer-3", value: variant(+210, 0.65, +0.05) },
      { name: "Summer-4", value: variant(+240, 0.7, +0.03) },
      { name: "Summer-5", value: variant(+270, 0.5, +0.08) },
      { name: "Summer-6", value: variant(+300, 0.45, +0.02) },
      { name: "Summer-7", value: variant(+330, 0.55, -0.02) },
      { name: "Summer-Neutral-1", value: neutral(0.85, 0.02, +180) },
      { name: "Summer-Neutral-2", value: neutral(0.68, 0.015, +160) },
      { name: "Summer-Neutral-3", value: neutral(0.5, 0.012, +150) },
    ];
  }

  // ---- AUTUMN (warm, rich, earthy) ----
  if (season === "autumn") {
    palette = [
      { name: "Autumn-1", value: variant(+8, 1.1, -0.05) },
      { name: "Autumn-2", value: variant(+25, 1.2, -0.1) },
      { name: "Autumn-3", value: variant(+45, 1.25, -0.12) },
      { name: "Autumn-4", value: variant(+70, 1.05, -0.08) },
      { name: "Autumn-5", value: variant(+95, 0.95, -0.04) },
      { name: "Autumn-6", value: variant(+120, 1.0, -0.15) },
      { name: "Autumn-7", value: variant(+150, 0.9, -0.18) },
      { name: "Autumn-Neutral-1", value: neutral(0.7, 0.02, +30) },
      { name: "Autumn-Neutral-2", value: neutral(0.55, 0.018, +35) },
      { name: "Autumn-Neutral-3", value: neutral(0.42, 0.016, +40) },
    ];
  }

  // ---- WINTER (cool, vivid, high contrast) ----
  if (season === "winter") {
    palette = [
      { name: "Winter-1", value: variant(+200, 1.25, +0.15) },
      { name: "Winter-2", value: variant(+230, 1.35, +0.08) },
      { name: "Winter-3", value: variant(+260, 1.45, -0.05) },
      { name: "Winter-4", value: variant(+290, 1.4, +0.2) },
      { name: "Winter-5", value: variant(+320, 1.3, +0.02) },
      { name: "Winter-6", value: variant(+350, 1.2, -0.12) },
      { name: "Winter-7", value: variant(+30, 1.22, +0.25) },
      { name: "Winter-Neutral-1", value: neutral(0.9, 0.015, +220) },
      { name: "Winter-Neutral-2", value: neutral(0.6, 0.012, +230) },
      { name: "Winter-Neutral-3", value: neutral(0.35, 0.015, +240) },
    ];
  }

  return palette;
}
