export default function seasonalPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.25;
  const CMIN = 0.05;

  const baseColor = oklch;

  // Determine season based on hue and lightness
  const isWarm = baseColor.h >= 0 && baseColor.h < 180;
  const isBright = baseColor.l > 0.6;

  let seasonType = "spring"; // default
  if (isWarm && isBright) seasonType = "spring";
  else if (!isWarm && isBright) seasonType = "summer";
  else if (isWarm && !isBright) seasonType = "autumn";
  else seasonType = "winter";

  // Spring: Light, clear, warm (high L, medium-high C)
  const spring1 = {
    ...baseColor,
    h: (baseColor.h + 15) % 360,
    c: Math.min(CMAX, Math.max(CMIN, 0.18)),
    l: Math.min(LMAX, Math.max(LMIN, 0.78)),
  };

  const spring2 = {
    ...baseColor,
    h: (baseColor.h + 45) % 360,
    c: Math.min(CMAX, Math.max(CMIN, 0.2)),
    l: Math.min(LMAX, Math.max(LMIN, 0.82)),
  };

  // Summer: Soft, muted, cool (high L, low-medium C)
  const summer1 = {
    ...baseColor,
    h: (baseColor.h + 200) % 360,
    c: Math.min(CMAX, Math.max(CMIN, 0.12)),
    l: Math.min(LMAX, Math.max(LMIN, 0.75)),
  };

  const summer2 = {
    ...baseColor,
    h: (baseColor.h + 220) % 360,
    c: Math.min(CMAX, Math.max(CMIN, 0.14)),
    l: Math.min(LMAX, Math.max(LMIN, 0.72)),
  };

  // Autumn: Warm, rich, earthy (medium L, medium C)
  const autumn1 = {
    ...baseColor,
    h: (baseColor.h + 30) % 360,
    c: Math.min(CMAX, Math.max(CMIN, 0.16)),
    l: Math.min(LMAX, Math.max(LMIN, 0.52)),
  };

  const autumn2 = {
    ...baseColor,
    h: (baseColor.h + 50) % 360,
    c: Math.min(CMAX, Math.max(CMIN, 0.18)),
    l: Math.min(LMAX, Math.max(LMIN, 0.48)),
  };

  const autumn3 = {
    ...baseColor,
    h: (baseColor.h + 70) % 360,
    c: Math.min(CMAX, Math.max(CMIN, 0.15)),
    l: Math.min(LMAX, Math.max(LMIN, 0.55)),
  };

  // Winter: Clear, bright, cool (varied L, high C)
  const winter1 = {
    ...baseColor,
    h: (baseColor.h + 240) % 360,
    c: Math.min(CMAX, Math.max(CMIN, 0.22)),
    l: Math.min(LMAX, Math.max(LMIN, 0.65)),
  };

  const winter2 = {
    ...baseColor,
    h: (baseColor.h + 260) % 360,
    c: Math.min(CMAX, Math.max(CMIN, 0.24)),
    l: Math.min(LMAX, Math.max(LMIN, 0.38)),
  };

  const winter3 = {
    ...baseColor,
    h: (baseColor.h + 280) % 360,
    c: Math.min(CMAX, Math.max(CMIN, 0.21)),
    l: Math.min(LMAX, Math.max(LMIN, 0.85)),
  };

  return [
    { name: "Spring-1", value: spring1 },
    { name: "Spring-2", value: spring2 },
    { name: "Summer-1", value: summer1 },
    { name: "Summer-2", value: summer2 },
    { name: "Autumn-1", value: autumn1 },
    { name: "Autumn-2", value: autumn2 },
    { name: "Autumn-3", value: autumn3 },
    { name: "Winter-1", value: winter1 },
    { name: "Winter-2", value: winter2 },
    { name: "Winter-3", value: winter3 },
  ];
}
