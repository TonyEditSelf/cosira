export const paletteTypes = [
  {
    label: "Monochromatic",
    value: "monochromatic",
    description: "Variations of one hue (light/dark/saturation)",
  },
  {
    label: "Analogous",
    value: "analogous",
    description: "Colors next to each other on the wheel",
  },
  {
    label: "Complementary",
    value: "complementary",
    description: "Colors opposite each other",
  },
  {
    label: "Split-Complementary",
    value: "splitComplementary",
    description: "A base color plus two adjacent to its complement",
  },
  {
    label: "Triadic",
    value: "triadic",
    description: "Three colors evenly spaced on the color wheel (triangle)",
  },
  {
    label: "Tetradic",
    value: "tetradic",
    description: "Four colors in a rectangle (two complementary pairs)",
  },
  {
    label: "Achromatic",
    value: "achromatic",
    description:
      "Pure grayscale variation — no hue, only value contrast; ideal for neutral or UI tones.",
  },
  {
    label: "UI Palette",
    value: "uipalette",
    description: "Multiple distinct hues",
  },
  {
    label: "Brand Palette",
    value: "brandPalette",
    description: "Multiple distinct hues",
  },

  {
    label: "Gradient / Transitional",
    value: "gradient",
    description:
      "Continuous hue or lightness range rather than discrete steps — ideal for data or background transitions.",
  },
  {
    label: "Seasonal",
    value: "seasonal",
    description:
      "Palette based on seasonal color theory (Spring, Summer, Autumn, Winter), each with distinct lightness and chroma balance.",
  },
  {
    label: "Square",
    value: "square",
    description:
      "Four colors evenly spaced (90° apart) — balanced energy with multiple harmonies",
  },
  {
    label: "Accented Analogous",
    value: "accentedAnalogous",
    description:
      "Harmonious analogous colors plus one complementary accent for visual pop",
  },
  {
    label: "Compound (Complex)",
    value: "compound",
    description:
      "Base + analogous neighbors + complement — rich, sophisticated multi-harmony palette",
  },
  {
    label: "Warm-Cool Contrast",
    value: "warmCool",
    description:
      "Split between warm (red-yellow) and cool (blue-green) sides — strong temperature contrast",
  },
  {
    label: "Chromatic Neutral",
    value: "chromaticNeutral",
    description:
      "Subtle colored grays (very low chroma) — sophisticated neutrals with color undertones",
  },
  {
    label: "Double Split-Complementary",
    value: "doubleSplitComp",
    description:
      "Two split-complementary triads sharing complementary axis — complex, balanced harmony",
  },
  {
    label: "Near-Complementary",
    value: "nearComplementary",
    description:
      "Base + colors ~150-165° away instead of 180° — softer contrast than true complements",
  },
  {
    label: "Clash (Discordant)",
    value: "clash",
    description:
      "Intentionally jarring combinations (30-60° off harmonies) — bold, attention-grabbing tension",
  },
  {
    label: "UI Palette",
    name: "uipalette",
    description:
      "A balanced set of multiple distinct hues designed for user interfaces. Optimized for clarity, accessibility, and role differentiation across buttons, alerts, and interactive elements.",
  },
  {
    label: "Data Visualization Palette",
    name: "datavizpalette",
    description:
      "A palette of distinct hues optimized for categorical data visualization. Ensures clear differentiation between multiple data series in charts and graphs.",
  },
  {
    label: "Design System Palette",
    name: "designsystempalette",
    description:
      "A scalable palette with core hues defined across tonal ranges. Ideal for building consistent, themeable design systems and maintaining visual hierarchy.",
  },
];
