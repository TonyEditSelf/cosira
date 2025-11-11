export default function compoundPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.25;
  const CMIN = 0.05;

  const baseColor = oklch;

  // Base + analogous neighbors
  const analogPrev = {
    ...baseColor,
    h: (baseColor.h - 30 + 360) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
  };

  const analogNext = {
    ...baseColor,
    h: (baseColor.h + 30) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
  };

  // Complement
  const complement = {
    ...baseColor,
    h: (baseColor.h + 180) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c)),
  };

  // Base variants
  const baseDark = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.1)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.25)),
  };

  const baseLight = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.9)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.25)),
  };

  // Analog variants
  const analogPrevLight = {
    ...analogPrev,
    c: Math.min(CMAX, Math.max(CMIN, analogPrev.c * 0.85)),
    l: Math.min(LMAX, Math.max(LMIN, analogPrev.l + 0.2)),
  };

  const analogNextLight = {
    ...analogNext,
    c: Math.min(CMAX, Math.max(CMIN, analogNext.c * 0.85)),
    l: Math.min(LMAX, Math.max(LMIN, analogNext.l + 0.2)),
  };

  // Complement variants
  const complementDark = {
    ...complement,
    c: Math.min(CMAX, Math.max(CMIN, complement.c * 1.15)),
    l: Math.min(LMAX, Math.max(LMIN, complement.l - 0.25)),
  };

  const complementLight = {
    ...complement,
    c: Math.min(CMAX, Math.max(CMIN, complement.c * 0.88)),
    l: Math.min(LMAX, Math.max(LMIN, complement.l + 0.25)),
  };

  return [
    { name: "Base-D", value: baseDark },
    { name: "Base", value: baseColor },
    { name: "Base-L", value: baseLight },
    { name: "Analog-Prev", value: analogPrev },
    { name: "Analog-Prev-L", value: analogPrevLight },
    { name: "Analog-Next", value: analogNext },
    { name: "Analog-Next-L", value: analogNextLight },
    { name: "Comp-D", value: complementDark },
    { name: "Comp", value: complement },
    { name: "Comp-L", value: complementLight },
  ];
}
