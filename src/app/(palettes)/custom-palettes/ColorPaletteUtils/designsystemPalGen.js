export default function designsystemPalGen(oklch) {
  const CMAX = 0.25;
  const CMIN = 0.04;
  const LMAX = 0.98;
  const LMIN = 0.2;

  const primaryHue = oklch.h % 360;

  // Smarter accent: use split-complement or triadic
  // More universally harmonious than straight 180°
  const accentHue = (oklch.h + 150) % 360; // Split-complement

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  const baseChroma = clamp(oklch.c, CMIN, CMAX);

  // CORRECTED chroma curve: peak in midtones, lower at extremes
  const chromaScale = {
    900: 0.85, // Dark: lower chroma (was 1.1)
    700: 1.0, // Mid-dark: full chroma
    500: 1.05, // Midtone: peak chroma
    300: 0.75, // Light: reduced chroma (was 0.8)
    100: 0.35, // Very light: minimal chroma (was 0.4)
  };

  // IMPROVED lightness scale with better spacing
  const lightnessScale = {
    900: 0.25, // Dark
    700: 0.42, // Mid-dark (was 0.45)
    500: 0.6, // Midtone (was 0.65)
    300: 0.8, // Light (was 0.85)
    100: 0.93, // Very light (was 0.95)
  };

  function makeColor(hue, scale) {
    const l = clamp(lightnessScale[scale], LMIN, LMAX);
    const c = clamp(baseChroma * chromaScale[scale], CMIN, CMAX);
    return { ...oklch, h: hue, l, c };
  }

  // PRIMARY scale
  const P900 = makeColor(primaryHue, 900);
  const P700 = makeColor(primaryHue, 700);
  const P500 = makeColor(primaryHue, 500);
  const P300 = makeColor(primaryHue, 300);
  const P100 = makeColor(primaryHue, 100);

  // ACCENT scale
  const A900 = makeColor(accentHue, 900);
  const A700 = makeColor(accentHue, 700);
  const A500 = makeColor(accentHue, 500);
  const A300 = makeColor(accentHue, 300);
  const A100 = makeColor(accentHue, 100);

  // NEUTRALS (using primary hue with minimal chroma)
  const neutralHue = primaryHue;
  const N900 = { ...oklch, h: neutralHue, l: 0.15, c: 0.01 };
  const N700 = { ...oklch, h: neutralHue, l: 0.35, c: 0.01 };
  const N500 = { ...oklch, h: neutralHue, l: 0.55, c: 0.01 };
  const N300 = { ...oklch, h: neutralHue, l: 0.75, c: 0.01 };
  const N100 = { ...oklch, h: neutralHue, l: 0.95, c: 0.01 };

  // SEMANTIC colors
  const success = { ...oklch, h: 140, l: 0.55, c: 0.18 }; // Green
  const warning = { ...oklch, h: 80, l: 0.7, c: 0.2 }; // Yellow
  const error = { ...oklch, h: 25, l: 0.55, c: 0.22 }; // Red
  const info = { ...oklch, h: 240, l: 0.6, c: 0.18 }; // Blue

  return [
    { name: "Primary-900", value: P900 },
    { name: "Primary-700", value: P700 },
    { name: "Primary-500", value: P500 },
    { name: "Primary-300", value: P300 },
    { name: "Primary-100", value: P100 },

    { name: "Accent-900", value: A900 },
    { name: "Accent-700", value: A700 },
    { name: "Accent-500", value: A500 },
    { name: "Accent-300", value: A300 },
    { name: "Accent-100", value: A100 },

    { name: "Neutral-900", value: N900 },
    { name: "Neutral-700", value: N700 },
    { name: "Neutral-500", value: N500 },
    { name: "Neutral-300", value: N300 },
    { name: "Neutral-100", value: N100 },

    { name: "Success", value: success },
    { name: "Warning", value: warning },
    { name: "Error", value: error },
    { name: "Info", value: info },
  ];
}
