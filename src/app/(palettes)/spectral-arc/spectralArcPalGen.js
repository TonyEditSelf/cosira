/**
 * spectralArcPalGen.js  v4 — "Closing the Gap"
 *
 * Upgrades over v3:
 *
 *  1. OKLAB-SPACE JITTER (was: naive OKLCH polar jitter)
 *     Role modifiers are now applied in cartesian OKLab space (a, b axes),
 *     then converted back to OKLCH. This means a nudge of equal magnitude
 *     is perceptually equal regardless of lightness level.
 *
 *  2. PALETTE SCORING + RETRY
 *     Every generated palette is scored across four dimensions:
 *       - Variety:     mean pairwise ΔEOK (more spread = better)
 *       - Contrast:    shadow-to-highlight ratio vs WCAG AA
 *       - Temperature: balance between warm/cool hues (intentional skew ok)
 *       - Harmony:     how well hues relate to the arc (coherence of the set)
 *     If the total score is below SCORE_THRESHOLD, the generator retries
 *     with a fresh RNG offset — up to MAX_RETRIES times. Ships the best.
 *
 *  3. DUAL ACCENTS with defined relationship
 *     Instead of one Tension Accent, the palette now gets two:
 *       - Primary Accent:   near-complement, offset by warmth bias
 *       - Secondary Accent: a "bridge" color — midpoint hue between
 *                           the base and primary accent, at high chroma.
 *     They are in conversation — the secondary bridges the base to the
 *     primary rather than floating independently.
 *
 *  4. SMART MOOD (was: flat chroma multiplier)
 *     Instead of multiplying all chromas equally, the mood scalar now
 *     applies a weighted curve: accent and vivid roles get amplified
 *     more than shadow/muted roles. Electric palettes have peaks.
 *     Pastel palettes have a soft floor, not uniform desaturation.
 *
 *  5. TEMPERATURE BALANCING
 *     After generation, the palette's warm/cool balance is measured.
 *     If it falls outside the acceptable range (too many warms or too
 *     many cools by accident), the generator nudges outlier hues toward
 *     the underrepresented temperature zone — deliberately, not randomly.
 *
 * Retained from v3:
 *   - Gamut mapping (binary search, preserves L+H)
 *   - ΔEOK perceptual distance nudging
 *   - WCAG contrast enforcement
 *   - Role coherence (band alternation)
 *   - Seeded RNG (mulberry32) + encoded seed string
 *
 * Output: { palette, seed, encodedSeed, meta, score }
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLDEN_ANGLE = 137.50776;
const MIN_DELTA_EOK = 0.12;
const MAX_NUDGE_PASSES = 6;
const MIN_CONTRAST = 4.5;
const GAMUT_EPSILON = 0.001;
const MAX_RETRIES = 5;
const SCORE_THRESHOLD = 0.62; // 0–1 scale; retry if below this

// Temperature: hues 0–90 and 300–360 are "warm", rest are "cool"
const WARM_HUE_RANGES = [
  [0, 90],
  [300, 360],
];
// Acceptable warm ratio: 25%–75% of arc colors
const TEMP_MIN = 0.25;
const TEMP_MAX = 0.75;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wrapHue(h) {
  return ((h % 360) + 360) % 360;
}
function clamp(v, mn, mx) {
  return Math.min(Math.max(v, mn), mx);
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function jitter(v, r, rng) {
  return v + (rng() * 2 - 1) * r;
}

function isWarm(h) {
  const w = wrapHue(h);
  return WARM_HUE_RANGES.some(([lo, hi]) => w >= lo && w <= hi);
}

// ─── Color math ───────────────────────────────────────────────────────────────

function oklchToLinearRgb(l, c, h) {
  const hRad = (h * Math.PI) / 180;
  const a_ = c * Math.cos(hRad),
    b_ = c * Math.sin(hRad);
  let lr = l + 0.3963377774 * a_ + 0.2158037573 * b_;
  let mg = l - 0.1055613458 * a_ - 0.0638541728 * b_;
  let sb = l - 0.0894841775 * a_ - 1.291485548 * b_;
  lr = lr ** 3;
  mg = mg ** 3;
  sb = sb ** 3;
  return [
    +4.0767416621 * lr - 3.3077115913 * mg + 0.2309699292 * sb,
    -1.2684380046 * lr + 2.6097574011 * mg - 0.3413193965 * sb,
    -0.0041960863 * lr - 0.7034186147 * mg + 1.707614701 * sb,
  ];
}

function isInGamut(l, c, h, tol = 0.001) {
  const [r, g, b] = oklchToLinearRgb(l, c, h);
  return (
    r >= -tol &&
    r <= 1 + tol &&
    g >= -tol &&
    g <= 1 + tol &&
    b >= -tol &&
    b <= 1 + tol
  );
}

function mapToGamut(l, c, h) {
  if (c <= 0) return { l, c: 0, h };
  if (isInGamut(l, c, h)) return { l, c, h };
  let lo = 0,
    hi = c;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    if (isInGamut(l, mid, h)) lo = mid;
    else hi = mid;
  }
  return { l, c: Math.max(0, lo - GAMUT_EPSILON), h };
}

/** OKLab cartesian coords */
function oklchToLab(l, c, h) {
  const hRad = (h * Math.PI) / 180;
  return { L: l, a: c * Math.cos(hRad), b: c * Math.sin(hRad) };
}

/** OKLab → OKLCH */
function labToOklch(L, a, b) {
  return {
    l: L,
    c: Math.sqrt(a * a + b * b),
    h: wrapHue((Math.atan2(b, a) * 180) / Math.PI),
  };
}

function deltaEok(c1, c2) {
  const l1 = oklchToLab(c1.l, c1.c, c1.h);
  const l2 = oklchToLab(c2.l, c2.c, c2.h);
  return Math.sqrt(
    (l1.L - l2.L) ** 2 + (l1.a - l2.a) ** 2 + (l1.b - l2.b) ** 2,
  );
}

function relativeLuminance(l, c, h) {
  const [r, g, b] = oklchToLinearRgb(l, c, h).map((v) => clamp(v, 0, 1));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(c1, c2) {
  const l1 = relativeLuminance(c1.l, c1.c, c1.h);
  const l2 = relativeLuminance(c2.l, c2.c, c2.h);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// ─── Upgrade 1: OKLab-space jitter ───────────────────────────────────────────

/**
 * Apply a lightness + chroma-direction modifier in OKLab cartesian space.
 * cMod is applied along the existing a/b direction (preserves hue),
 * scaled by 1/max(c,0.05) so it's perceptually consistent across saturations.
 */
function applyRoleInLab(
  baseL,
  baseC,
  baseH,
  lMod,
  cMod,
  moodWeight,
  moodScalar,
) {
  const lab = oklchToLab(baseL, baseC, baseH);

  // Lightness mod applied directly (OKLab L is perceptually uniform)
  const newL = clamp(lab.L + lMod, 0.06, 0.97);

  // Chroma mod: scale along the a/b vector — preserves hue exactly
  const currentC = Math.max(baseC, 0.005);
  const scale = 1 + cMod / currentC;

  // Smart mood: accent/vivid roles amplified more, shadow/muted less
  const moodedScale = scale * (1 + (moodScalar - 1) * moodWeight);
  const newA = lab.a * moodedScale;
  const newB = lab.b * moodedScale;

  const result = labToOklch(newL, newA, newB);
  return mapToGamut(result.l, clamp(result.c, 0.01, 0.4), result.h);
}

// ─── Role profiles ────────────────────────────────────────────────────────────

/**
 * moodWeight: how much the mood scalar amplifies this role's chroma.
 * 1.0 = full mood effect, 0.3 = barely affected.
 */
const BASE_ROLE_PROFILES = [
  { name: "Anchor", lMod: 0.0, cMod: 0.0, band: "mid", moodWeight: 0.6 },
  { name: "Shadow", lMod: -0.22, cMod: -0.06, band: "dark", moodWeight: 0.3 },
  {
    name: "Highlight",
    lMod: +0.22,
    cMod: -0.1,
    band: "light",
    moodWeight: 0.3,
  },
  { name: "Vivid", lMod: -0.05, cMod: +0.08, band: "mid", moodWeight: 1.0 },
  { name: "Muted", lMod: +0.08, cMod: -0.15, band: "light", moodWeight: 0.2 },
  { name: "Dusk", lMod: -0.14, cMod: +0.04, band: "dark", moodWeight: 0.7 },
  { name: "Frost", lMod: +0.28, cMod: -0.08, band: "light", moodWeight: 0.2 },
];

// ─── Arc curve ────────────────────────────────────────────────────────────────

function arcHueOffset(step, total, arcBias, direction) {
  const linear = (step / total) * 360;
  const golden = step * GOLDEN_ANGLE;
  return (linear * (1 - arcBias) + golden * arcBias) * direction;
}

// ─── Role coherence ───────────────────────────────────────────────────────────

function coherentRoleOrder(roles) {
  if (roles.length <= 1) return roles;
  const result = [roles[0]];
  const remaining = roles.slice(1);
  for (let i = 1; i < roles.length; i++) {
    const lastBand = result[result.length - 1].band;
    const idx = remaining.findIndex((r) => r.band !== lastBand);
    result.push(idx !== -1 ? remaining.splice(idx, 1)[0] : remaining.shift());
  }
  return result;
}

// ─── Upgrade 5: Temperature balancing ────────────────────────────────────────

function balanceTemperature(colors, rng) {
  const arcColors = colors.filter(
    (c) => c.name.startsWith("Base") || c.name.startsWith("Arc"),
  );
  if (arcColors.length < 2) return colors;

  const warmCount = arcColors.filter((c) => isWarm(c.value.h)).length;
  const warmRatio = warmCount / arcColors.length;

  if (warmRatio >= TEMP_MIN && warmRatio <= TEMP_MAX) return colors; // already balanced

  // Too many warms → nudge one warm hue toward cool territory (and vice versa)
  const tooWarm = warmRatio > TEMP_MAX;
  const candidates = arcColors.filter((c) => isWarm(c.value.h) === tooWarm);
  if (candidates.length === 0) return colors;

  // Pick one candidate (not the Anchor/Base) to nudge
  const target =
    candidates.find((c) => !c.name.startsWith("Base")) ?? candidates[0];
  const nudgeDir = tooWarm ? 1 : -1; // toward cool (hue +120–180) or warm (hue -120)
  const nudgeAmount = 40 + rng() * 40; // 40–80° nudge
  const newHue = wrapHue(target.value.h + nudgeDir * nudgeAmount);
  target.value = {
    ...mapToGamut(target.value.l, target.value.c, newHue),
    a: target.value.a,
  };

  return colors;
}

// ─── Upgrade 2: Palette scoring ───────────────────────────────────────────────

/**
 * Scores a palette 0–1 across four dimensions.
 * Higher = better. Used to decide whether to retry.
 */
function scorePalette(colors, baseH) {
  // 1. Variety: mean pairwise ΔEOK, normalized to 0–1
  let totalDist = 0,
    pairs = 0;
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      totalDist += deltaEok(colors[i].value, colors[j].value);
      pairs++;
    }
  }
  const meanDist = pairs > 0 ? totalDist / pairs : 0;
  const varietyScore = clamp(meanDist / 0.45, 0, 1); // 0.45 = "excellent variety"

  // 2. Contrast: shadow vs highlight ratio, normalized
  const shadow = colors.find((c) => c.name === "Deep Shadow");
  const highlight = colors.find((c) => c.name === "Air Highlight");
  const cr =
    shadow && highlight ? contrastRatio(shadow.value, highlight.value) : 1;
  const contrastScore = clamp((cr - 1) / (21 - 1), 0, 1); // 1:1 → 21:1 range

  // 3. Temperature balance: closer to 50/50 = higher score, but intentional
  //    skew is ok — penalize only extremes (all warm or all cool)
  const arcColors = colors.filter(
    (c) => c.name.startsWith("Base") || c.name.startsWith("Arc"),
  );
  const warmRatio =
    arcColors.length > 0
      ? arcColors.filter((c) => isWarm(c.value.h)).length / arcColors.length
      : 0.5;
  const tempScore = 1 - Math.abs(warmRatio - 0.5) * 1.6; // peaks at 0.5, 0 at extremes

  // 4. Harmony: how distinct are the arc hues from each other?
  //    Penalize hues that cluster too tightly
  const arcHues = arcColors.map((c) => c.value.h);
  let minHueDist = 360;
  for (let i = 0; i < arcHues.length; i++) {
    for (let j = i + 1; j < arcHues.length; j++) {
      const d = Math.abs(arcHues[i] - arcHues[j]);
      minHueDist = Math.min(minHueDist, Math.min(d, 360 - d));
    }
  }
  const harmonyScore = clamp(minHueDist / 60, 0, 1); // 60° min hue gap = perfect

  // Weighted total
  return (
    varietyScore * 0.3 +
    contrastScore * 0.25 +
    clamp(tempScore, 0, 1) * 0.2 +
    harmonyScore * 0.25
  );
}

// ─── Core generation (single attempt) ────────────────────────────────────────

function generateOnce(baseOklch, rng) {
  const { l: baseL, c: baseC, h: baseH, a = 1 } = baseOklch;

  // Character
  const warmth = Math.sin(((baseH - 30) * Math.PI) / 180) * 0.5 + 0.5;
  const arcBias = clamp(jitter(0.35 + warmth * 0.4, 0.12, rng), 0.15, 0.78);
  const direction = rng() > 0.5 ? 1 : -1;
  const nodePool = baseC > 0.22 ? [3, 3, 4, 5] : [3, 4, 4, 5];
  const hueNodes = nodePool[Math.floor(rng() * nodePool.length)];

  // Smart mood scalar
  const moodScalar = clamp(jitter(1.0, 0.25, rng), 0.65, 1.35);

  // Hue arc
  const hues = [];
  for (let i = 0; i < hueNodes; i++) {
    hues.push(wrapHue(baseH + arcHueOffset(i, hueNodes, arcBias, direction)));
  }

  // Jitter profiles in OKLab space (Upgrade 1)
  const jitteredProfiles = BASE_ROLE_PROFILES.map((p, i) => {
    if (i === 0) return { ...p };
    return {
      ...p,
      lMod: jitter(p.lMod, 0.05, rng),
      cMod: jitter(p.cMod, 0.035, rng),
    };
  });

  const anchor = jitteredProfiles[0];
  const orderedOthers = coherentRoleOrder(
    shuffle(jitteredProfiles.slice(1), rng),
  );

  // Arc colors — jitter applied in OKLab (Upgrade 1)
  const rawColors = hues.map((hue, i) => {
    const role = i === 0 ? anchor : (orderedOthers[i - 1] ?? anchor);
    const mapped = applyRoleInLab(
      baseL,
      baseC,
      hue,
      role.lMod,
      role.cMod,
      role.moodWeight,
      moodScalar,
    );
    return {
      name: `${i === 0 ? "Base" : `Arc ${i}`} · ${role.name}`,
      value: { ...mapped, a },
    };
  });

  // Tonal anchors
  const sL = clamp(jitter(baseL - 0.38, 0.04, rng), 0.04, 0.22);
  const sC = clamp(
    jitter(baseC - 0.09, 0.03, rng) * (1 + (moodScalar - 1) * 0.3),
    0.01,
    0.16,
  );
  const sH = wrapHue(baseH + jitter(5, 8, rng));
  rawColors.push({
    name: "Deep Shadow",
    value: { ...mapToGamut(sL, sC, sH), a },
  });

  const hL = clamp(jitter(baseL + 0.36, 0.04, rng), 0.83, 0.97);
  const hC = clamp(
    jitter(baseC - 0.13, 0.03, rng) * (1 + (moodScalar - 1) * 0.2),
    0.005,
    0.11,
  );
  const hH = wrapHue(baseH + jitter(-8, 6, rng));
  rawColors.push({
    name: "Air Highlight",
    value: { ...mapToGamut(hL, hC, hH), a },
  });

  // Upgrade 3: Dual accents with defined relationship
  const ap = rng() > 0.5 ? 1 : -1;
  const primaryAccentH = wrapHue(baseH + 180 + ap * jitter(22, 14, rng));
  const primaryAccentL = clamp(jitter(baseL * 0.95, 0.06, rng), 0.34, 0.74);
  const primaryAccentC = clamp(
    jitter(baseC + 0.08, 0.04, rng) * (1 + (moodScalar - 1) * 1.0),
    0.14,
    0.4,
  );
  rawColors.push({
    name: `Primary Accent · ${ap > 0 ? "Warm" : "Cool"}`,
    value: { ...mapToGamut(primaryAccentL, primaryAccentC, primaryAccentH), a },
  });

  // Secondary accent: bridge hue between base and primary accent
  const bridgeH = wrapHue(lerp(baseH, primaryAccentH, 0.5));
  const bridgeL = clamp(jitter(baseL + 0.05, 0.05, rng), 0.38, 0.72);
  const bridgeC = clamp(
    jitter(baseC + 0.04, 0.03, rng) * (1 + (moodScalar - 1) * 0.8),
    0.12,
    0.36,
  );
  rawColors.push({
    name: "Secondary Accent · Bridge",
    value: { ...mapToGamut(bridgeL, bridgeC, bridgeH), a },
  });

  // Guardrail 2: perceptual distance nudge
  for (let pass = 0; pass < MAX_NUDGE_PASSES; pass++) {
    let nudged = false;
    for (let i = 0; i < rawColors.length; i++) {
      for (let j = i + 1; j < rawColors.length; j++) {
        const ci = rawColors[i].value,
          cj = rawColors[j].value;
        const dist = deltaEok(ci, cj);
        if (dist < MIN_DELTA_EOK) {
          const nudge = (MIN_DELTA_EOK - dist) / 2 + 0.02;
          if (ci.l <= cj.l) {
            rawColors[i].value = {
              ...mapToGamut(clamp(ci.l - nudge, 0.04, 0.95), ci.c, ci.h),
              a,
            };
            rawColors[j].value = {
              ...mapToGamut(clamp(cj.l + nudge, 0.05, 0.97), cj.c, cj.h),
              a,
            };
          } else {
            rawColors[i].value = {
              ...mapToGamut(clamp(ci.l + nudge, 0.05, 0.97), ci.c, ci.h),
              a,
            };
            rawColors[j].value = {
              ...mapToGamut(clamp(cj.l - nudge, 0.04, 0.95), cj.c, cj.h),
              a,
            };
          }
          nudged = true;
        }
      }
    }
    if (!nudged) break;
  }

  // Guardrail 3: contrast enforcement
  const shadowEntry = rawColors.find((c) => c.name === "Deep Shadow");
  const highlightEntry = rawColors.find((c) => c.name === "Air Highlight");
  if (shadowEntry && highlightEntry) {
    let att = 0;
    while (
      contrastRatio(shadowEntry.value, highlightEntry.value) < MIN_CONTRAST &&
      att < 20
    ) {
      shadowEntry.value = {
        ...mapToGamut(
          clamp(shadowEntry.value.l - 0.03, 0.02, 0.28),
          shadowEntry.value.c,
          shadowEntry.value.h,
        ),
        a,
      };
      highlightEntry.value = {
        ...mapToGamut(
          clamp(highlightEntry.value.l + 0.02, 0.72, 0.99),
          highlightEntry.value.c,
          highlightEntry.value.h,
        ),
        a,
      };
      att++;
    }
  }

  // Upgrade 5: temperature balancing
  balanceTemperature(rawColors, rng);

  const finalContrast =
    shadowEntry && highlightEntry
      ? contrastRatio(shadowEntry.value, highlightEntry.value)
      : null;

  return {
    colors: rawColors,
    meta: {
      moodScalar,
      direction,
      hueNodes,
      arcBias,
      contrast: finalContrast ? finalContrast.toFixed(1) : "—",
      mood:
        moodScalar > 1.15
          ? "Electric"
          : moodScalar < 0.85
            ? "Pastel"
            : "Balanced",
    },
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function spectralArcPalGen(baseOklch, numericSeed) {
  const { l: baseL, c: baseC, h: baseH } = baseOklch;

  const rngSeed = numericSeed ?? Math.floor(Math.random() * 0xffffffff);

  // Upgrade 2: retry loop — generate up to MAX_RETRIES+1 times, ship the best
  let bestResult = null;
  let bestScore = -1;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    // Each attempt gets a fresh RNG derived from the original seed + attempt offset
    // This keeps the base seed deterministic while exploring nearby variations
    const attemptSeed = (rngSeed + attempt * 0x9e3779b9) >>> 0;
    const rng = makeRng(attemptSeed);

    const result = generateOnce(baseOklch, rng);
    const score = scorePalette(result.colors, baseH);

    if (score > bestScore) {
      bestScore = score;
      bestResult = { ...result, attemptSeed };
    }

    if (bestScore >= SCORE_THRESHOLD) break; // good enough — stop early
  }

  const encodedSeed = `L${baseL.toFixed(3)}_C${baseC.toFixed(3)}_H${baseH.toFixed(1)}_S${rngSeed}`;

  return {
    palette: bestResult.colors,
    seed: rngSeed,
    encodedSeed,
    meta: bestResult.meta,
    score: Math.round(bestScore * 100), // 0–100 for display
  };
}
