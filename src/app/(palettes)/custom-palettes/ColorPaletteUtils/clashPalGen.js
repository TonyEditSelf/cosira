export default function clashPalGen(oklch, options = {}) {
  const {
    intensity = 0.7,
    colorCount = "balanced",
    strategy = "structured",
    ensureLightnessSpread = true, // NEW: Optional toggle for lightness spreading
  } = options;

  const baseHue = oklch.h;
  const baseChroma = oklch.c;
  const baseLightness = oklch.l;

  // ============================================================================
  // SEEDED RANDOM FUNCTION - Deterministic randomness based on hue
  // ============================================================================

  function seededRandom(seed) {
    // Simple deterministic pseudo-random based on seed
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // ============================================================================
  // TARGET COUNTS
  // ============================================================================

  const neutralCount = {
    minimal: 3,
    balanced: 5,
    maximal: 7,
  }[colorCount];

  const targetColorCount = {
    minimal: 6,
    balanced: 10,
    maximal: 14,
  }[colorCount];

  const targetClashColors = targetColorCount - neutralCount;

  // ============================================================================
  // CLASH STRATEGIES
  // ============================================================================

  const strategies = {
    structured: () => {
      const offset = 10 + intensity * 15;

      const baseColors = [
        {
          h: baseHue,
          c: Math.min(0.37, baseChroma * (1.4 + intensity * 0.3)),
          l: baseLightness,
          name: "Primary-Amplified",
        },
        {
          h: (baseHue + 180 - offset) % 360,
          c: Math.min(0.35, baseChroma * 1.3),
          l: Math.max(0.3, Math.min(0.7, 1 - baseLightness + 0.1)),
          name: "Complement-Off",
        },
        {
          h: (baseHue + 35 + offset / 2) % 360,
          c: Math.min(0.38, baseChroma * (1.5 + intensity * 0.2)),
          l: Math.min(0.85, baseLightness + 0.2),
          name: "Analog-Clash",
        },
        {
          h: (baseHue + 120 + offset) % 360,
          c: Math.min(0.33, baseChroma * 1.25),
          l: Math.max(0.25, baseLightness - 0.15),
          name: "Triadic-Tension",
        },
        {
          h: (baseHue + 240 - offset * 2) % 360,
          c: Math.min(0.4, baseChroma * (1.6 + intensity * 0.4)),
          l: baseLightness > 0.6 ? 0.35 : 0.8,
          name: "Disruptor",
        },
      ];

      // Add extra colors for maximal
      if (targetClashColors > 5) {
        baseColors.push(
          {
            h: (baseHue + 60) % 360,
            c: Math.min(0.36, baseChroma * 1.35),
            l: Math.min(0.75, baseLightness + 0.15),
            name: "Harmonic-Clash",
          },
          {
            h: (baseHue + 300) % 360,
            c: Math.min(0.39, baseChroma * 1.45),
            l: Math.max(0.3, baseLightness - 0.2),
            name: "Counter-Tension",
          },
        );
      }

      return { colors: baseColors };
    },

    chaos: () => {
      const angles = [53, 147, 219, 281, 337];
      const chromaJumps = [1.6, 0.4, 1.8, 0.6, 1.5];
      const lightnessJumps = [0.25, -0.3, 0.35, -0.2, 0.4];

      const baseColors = [
        {
          h: baseHue,
          c: Math.min(0.4, baseChroma * 1.7),
          l: baseLightness,
          name: "Base-Chaos",
        },
        ...angles.map((angle, i) => ({
          h: (baseHue + angle * intensity) % 360,
          c: Math.min(
            0.42,
            Math.max(
              0.08,
              baseChroma * chromaJumps[i] * (0.7 + intensity * 0.5),
            ),
          ),
          l: Math.max(
            0.15,
            Math.min(0.92, baseLightness + lightnessJumps[i] * intensity),
          ),
          name: `Chaos-${i + 1}`,
        })),
      ];

      // Add more chaos colors if needed for maximal
      if (targetClashColors > 6) {
        baseColors.push({
          h: (baseHue + 101 * intensity) % 360,
          c: Math.min(0.4, baseChroma * 1.9),
          l: Math.max(0.2, Math.min(0.85, baseLightness + 0.3)),
          name: "Chaos-Extra",
        });
      }

      return { colors: baseColors };
    },

    "neon-pastel": () => {
      const huesToGenerate = Math.ceil(targetClashColors / 2);
      const hueStep = 360 / (huesToGenerate + 1);

      const hues = Array.from(
        { length: huesToGenerate },
        (_, i) => (baseHue + i * hueStep) % 360,
      );

      return {
        colors: hues
          .flatMap((h, i) => {
            // Use seeded random instead of Math.random() for reproducibility
            const neonSeed = baseHue + h + i * 100;
            const pastelSeed = baseHue + h + i * 200;

            return [
              {
                h,
                c: Math.min(0.4, 0.32 + intensity * 0.1),
                l: 0.6 + (seededRandom(neonSeed) - 0.5) * 0.15, // Seeded randomness
                name: `Neon-${i + 1}`,
              },
              {
                h: (h + 15) % 360,
                c: Math.max(0.05, 0.12 - intensity * 0.04),
                l: 0.82 + (seededRandom(pastelSeed) - 0.5) * 0.1, // Seeded randomness
                name: `Pastel-${i + 1}`,
              },
            ];
          })
          .slice(0, targetClashColors),
      };
    },

    "temperature-war": () => {
      const warmBase = baseHue < 60 || baseHue > 300 ? baseHue : 30;
      const coolBase = baseHue >= 180 && baseHue <= 300 ? baseHue : 220;

      const baseColors = [
        {
          h: warmBase,
          c: Math.min(0.38, 0.3 + intensity * 0.1),
          l: 0.55,
          name: "Heat-Primary",
        },
        {
          h: (warmBase + 25) % 360,
          c: Math.min(0.42, 0.35 + intensity * 0.12),
          l: 0.45,
          name: "Heat-Intense",
        },
        {
          h: (warmBase - 20 + 360) % 360,
          c: 0.28,
          l: 0.72,
          name: "Heat-Glow",
        },
        {
          h: coolBase,
          c: Math.min(0.36, 0.28 + intensity * 0.1),
          l: 0.5,
          name: "Cool-Primary",
        },
        {
          h: (coolBase + 30) % 360,
          c: Math.min(0.4, 0.32 + intensity * 0.12),
          l: 0.65,
          name: "Cool-Ice",
        },
        {
          h: ((warmBase + coolBase) / 2) % 360,
          c: Math.min(0.45, 0.38 + intensity * 0.15),
          l: 0.58,
          name: "Collision",
        },
      ];

      // Add extra temperature variations for maximal
      if (targetClashColors > 6) {
        baseColors.push({
          h: (warmBase + 40) % 360,
          c: Math.min(0.37, 0.3 + intensity * 0.08),
          l: 0.62,
          name: "Heat-Medium",
        });
      }

      return { colors: baseColors };
    },
  };

  // ============================================================================
  // GENERATE CLASH COLORS
  // ============================================================================

  let clashColors = strategies[strategy]().colors;

  // ============================================================================
  // LIGHTNESS SPREAD ENFORCEMENT (Optional)
  // Prevents muddy mid-tone collisions while preserving clash character
  // ============================================================================

  if (ensureLightnessSpread && clashColors.length > 2) {
    // Sort by current lightness
    clashColors.sort((a, b) => a.l - b.l);

    // Define target lightness range (avoid extreme darks/lights for clash colors)
    const minL = 0.25;
    const maxL = 0.85;
    const range = maxL - minL;

    // Redistribute lightness while preserving relative ordering
    clashColors = clashColors.map((color, i) => {
      const targetL = minL + (i / (clashColors.length - 1)) * range;

      // Blend 60% target, 40% original to preserve some character
      const blendedL = targetL * 0.6 + color.l * 0.4;

      return {
        ...color,
        l: Math.max(minL, Math.min(maxL, blendedL)),
      };
    });
  }

  // ============================================================================
  // GENERATE NEUTRALS
  // ============================================================================

  const neutrals = Array.from({ length: neutralCount }, (_, i) => {
    const step = i / (neutralCount - 1);
    return {
      h: baseHue,
      c: 0.015 + (0.025 - 0.015) * Math.sin(step * Math.PI),
      l: 0.12 + step * 0.84,
      name: `Neutral-${neutralCount - i}`,
    };
  }).reverse();

  // ============================================================================
  // ASSEMBLE PALETTE
  // ============================================================================

  const clashColorsToUse = clashColors.slice(0, targetClashColors);
  const palette = [...neutrals, ...clashColorsToUse];

  // ============================================================================
  // RETURN FORMAT
  // ============================================================================

  return palette.map((color) => ({
    name: color.name,
    value: {
      h: color.h,
      c: Math.round(color.c * 1000) / 1000,
      l: Math.round(color.l * 1000) / 1000,
    },
  }));
}
