export default function compoundPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.2;
  const CMAX = 0.28;
  const CMIN = 0.05;

  const baseColor = oklch;

  // Wider analogous range for more personality (45° instead of 30°)
  const analogPrev = {
    ...baseColor,
    h: (baseColor.h - 45 + 360) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)), // Lower chroma - supporting role
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.1)),
  };

  const analogNext = {
    ...baseColor,
    h: (baseColor.h + 45) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.1)),
  };

  // Complement - straight across for maximum contrast
  const complement = {
    ...baseColor,
    h: (baseColor.h + 180) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.0)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.05)),
  };

  // Triadic accent - 120° for distinct third color
  const triadicAccent = {
    ...baseColor,
    h: (baseColor.h + 120) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.15)),
  };

  // Base variants with clear hierarchy
  const baseDark = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.2)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.3)),
  };

  const baseLight = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.8)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.3)),
  };

  // Hero accent - highly saturated complement for CTAs/focus
  const accentHero = {
    ...complement,
    c: Math.min(0.32, complement.c * 1.5), // Push saturation high
    l: Math.min(LMAX, Math.max(LMIN, 0.68)), // Bright and attention-grabbing
  };

  // Neutral anchors - essential for practical design
  const neutralDark = {
    ...baseColor,
    c: 0.02, // Near-gray with hue memory
    l: 0.15, // Text darkness
  };

  const neutralLight = {
    ...baseColor,
    c: 0.03,
    l: 0.92, // Background lightness
  };

  // Triadic variant for distinct supporting accent
  const triadicSubtle = {
    ...triadicAccent,
    c: Math.min(CMAX, Math.max(CMIN, triadicAccent.c * 0.65)), // More desaturated
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.3)),
  };

  return [
    { name: "Neutral-Dark", value: neutralDark },
    { name: "Neutral-Light", value: neutralLight },
    { name: "Base-Dark", value: baseDark },
    { name: "Base", value: baseColor },
    { name: "Base-Light", value: baseLight },
    { name: "Analog-Prev", value: analogPrev },
    { name: "Analog-Next", value: analogNext },
    { name: "Triadic-Subtle", value: triadicSubtle },
    { name: "Complement", value: complement },
    { name: "Accent-Hero", value: accentHero },
  ];
}
