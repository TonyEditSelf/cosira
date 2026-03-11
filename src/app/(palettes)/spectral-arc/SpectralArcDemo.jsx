import { useState, useEffect, useCallback, useRef } from "react";
import { useColorPaletteContext } from "../ColorContext";

// ─── Algorithm (v4 — Closing the Gap) ────────────────────────────────────────

const GOLDEN_ANGLE = 137.50776;
const MIN_DELTA_EOK = 0.12;
const MAX_NUDGE_PASSES = 6;
const MIN_CONTRAST = 4.5;
const GAMUT_EPSILON = 0.001;
const MAX_RETRIES = 5;
const SCORE_THRESHOLD = 0.62;
const WARM_HUE_RANGES = [
  [0, 90],
  [300, 360],
];
const TEMP_MIN = 0.25,
  TEMP_MAX = 0.75;

function wrapHue(h) {
  return ((h % 360) + 360) % 360;
}
function clamp(v, mn, mx) {
  return Math.min(Math.max(v, mn), mx);
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function isWarm(h) {
  const w = wrapHue(h);
  return WARM_HUE_RANGES.some(([lo, hi]) => w >= lo && w <= hi);
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

// Color math
function oklchToLinearRgb(l, c, h) {
  const hRad = (h * Math.PI) / 180,
    a_ = c * Math.cos(hRad),
    b_ = c * Math.sin(hRad);
  let lr = l + 0.3963377774 * a_ + 0.2158037573 * b_,
    mg = l - 0.1055613458 * a_ - 0.0638541728 * b_,
    sb = l - 0.0894841775 * a_ - 1.291485548 * b_;
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
function oklchToLab(l, c, h) {
  const hRad = (h * Math.PI) / 180;
  return { L: l, a: c * Math.cos(hRad), b: c * Math.sin(hRad) };
}
function labToOklch(L, a, b) {
  return {
    l: L,
    c: Math.sqrt(a * a + b * b),
    h: wrapHue((Math.atan2(b, a) * 180) / Math.PI),
  };
}
function deltaEok(c1, c2) {
  const l1 = oklchToLab(c1.l, c1.c, c1.h),
    l2 = oklchToLab(c2.l, c2.c, c2.h);
  return Math.sqrt(
    (l1.L - l2.L) ** 2 + (l1.a - l2.a) ** 2 + (l1.b - l2.b) ** 2,
  );
}
function relativeLuminance(l, c, h) {
  const [r, g, b] = oklchToLinearRgb(l, c, h).map((v) => clamp(v, 0, 1));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(c1, c2) {
  const l1 = relativeLuminance(c1.l, c1.c, c1.h),
    l2 = relativeLuminance(c2.l, c2.c, c2.h);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// OKLab-space role application (Upgrade 1)
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
  const newL = clamp(lab.L + lMod, 0.06, 0.97);
  const currentC = Math.max(baseC, 0.005);
  const scale = 1 + cMod / currentC;
  const moodedScale = scale * (1 + (moodScalar - 1) * moodWeight);
  const result = labToOklch(newL, lab.a * moodedScale, lab.b * moodedScale);
  return mapToGamut(result.l, clamp(result.c, 0.01, 0.4), result.h);
}

const BASE_ROLES = [
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

function arcHueOffset(step, total, arcBias, direction) {
  return (
    ((step / total) * 360 * (1 - arcBias) + step * GOLDEN_ANGLE * arcBias) *
    direction
  );
}
function coherentRoleOrder(roles) {
  if (roles.length <= 1) return roles;
  const result = [roles[0]],
    remaining = roles.slice(1);
  for (let i = 1; i < roles.length; i++) {
    const lb = result[result.length - 1].band,
      idx = remaining.findIndex((r) => r.band !== lb);
    result.push(idx !== -1 ? remaining.splice(idx, 1)[0] : remaining.shift());
  }
  return result;
}

// Temperature balancing (Upgrade 5)
function balanceTemperature(colors, rng) {
  const arc = colors.filter(
    (c) => c.name.startsWith("Base") || c.name.startsWith("Arc"),
  );
  if (arc.length < 2) return colors;
  const warmRatio = arc.filter((c) => isWarm(c.value.h)).length / arc.length;
  if (warmRatio >= TEMP_MIN && warmRatio <= TEMP_MAX) return colors;
  const tooWarm = warmRatio > TEMP_MAX;
  const candidates = arc.filter((c) => isWarm(c.value.h) === tooWarm);
  const target =
    candidates.find((c) => !c.name.startsWith("Base")) ?? candidates[0];
  if (!target) return colors;
  const nudgeDir = tooWarm ? 1 : -1;
  const newHue = wrapHue(target.value.h + nudgeDir * (40 + rng() * 40));
  target.value = {
    ...mapToGamut(target.value.l, target.value.c, newHue),
    a: target.value.a,
  };
  return colors;
}

// Palette scoring (Upgrade 2)
function scorePalette(colors, baseH) {
  let totalDist = 0,
    pairs = 0;
  for (let i = 0; i < colors.length; i++)
    for (let j = i + 1; j < colors.length; j++) {
      totalDist += deltaEok(colors[i].value, colors[j].value);
      pairs++;
    }
  const varietyScore = clamp((pairs > 0 ? totalDist / pairs : 0) / 0.45, 0, 1);
  const shadow = colors.find((c) => c.name === "Deep Shadow"),
    highlight = colors.find((c) => c.name === "Air Highlight");
  const cr =
    shadow && highlight ? contrastRatio(shadow.value, highlight.value) : 1;
  const contrastScore = clamp((cr - 1) / 20, 0, 1);
  const arc = colors.filter(
    (c) => c.name.startsWith("Base") || c.name.startsWith("Arc"),
  );
  const warmRatio =
    arc.length > 0
      ? arc.filter((c) => isWarm(c.value.h)).length / arc.length
      : 0.5;
  const tempScore = clamp(1 - Math.abs(warmRatio - 0.5) * 1.6, 0, 1);
  const arcHues = arc.map((c) => c.value.h);
  let minHueDist = 360;
  for (let i = 0; i < arcHues.length; i++)
    for (let j = i + 1; j < arcHues.length; j++) {
      const d = Math.abs(arcHues[i] - arcHues[j]);
      minHueDist = Math.min(minHueDist, Math.min(d, 360 - d));
    }
  const harmonyScore = clamp(minHueDist / 60, 0, 1);
  return (
    varietyScore * 0.3 +
    contrastScore * 0.25 +
    tempScore * 0.2 +
    harmonyScore * 0.25
  );
}

// Single generation attempt
function generateOnce(baseOklch, rng) {
  const { l: baseL, c: baseC, h: baseH, a = 1 } = baseOklch;
  const warmth = Math.sin(((baseH - 30) * Math.PI) / 180) * 0.5 + 0.5;
  const arcBias = clamp(jitter(0.35 + warmth * 0.4, 0.12, rng), 0.15, 0.78);
  const direction = rng() > 0.5 ? 1 : -1;
  const nodePool = baseC > 0.22 ? [3, 3, 4, 5] : [3, 4, 4, 5];
  const hueNodes = nodePool[Math.floor(rng() * nodePool.length)];
  const moodScalar = clamp(jitter(1.0, 0.25, rng), 0.65, 1.35);
  const hues = [];
  for (let i = 0; i < hueNodes; i++)
    hues.push(wrapHue(baseH + arcHueOffset(i, hueNodes, arcBias, direction)));
  const jProfiles = BASE_ROLES.map((p, i) =>
    i === 0
      ? { ...p }
      : {
          ...p,
          lMod: jitter(p.lMod, 0.05, rng),
          cMod: jitter(p.cMod, 0.035, rng),
        },
  );
  const anchor = jProfiles[0];
  const orderedOthers = coherentRoleOrder(shuffle(jProfiles.slice(1), rng));
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
  rawColors.push({
    name: "Deep Shadow",
    value: {
      ...mapToGamut(
        clamp(jitter(baseL - 0.38, 0.04, rng), 0.04, 0.22),
        clamp(
          jitter(baseC - 0.09, 0.03, rng) * (1 + (moodScalar - 1) * 0.3),
          0.01,
          0.16,
        ),
        wrapHue(baseH + jitter(5, 8, rng)),
      ),
      a,
    },
  });
  rawColors.push({
    name: "Air Highlight",
    value: {
      ...mapToGamut(
        clamp(jitter(baseL + 0.36, 0.04, rng), 0.83, 0.97),
        clamp(
          jitter(baseC - 0.13, 0.03, rng) * (1 + (moodScalar - 1) * 0.2),
          0.005,
          0.11,
        ),
        wrapHue(baseH + jitter(-8, 6, rng)),
      ),
      a,
    },
  });
  // Dual accents (Upgrade 3)
  const ap = rng() > 0.5 ? 1 : -1;
  const paH = wrapHue(baseH + 180 + ap * jitter(22, 14, rng));
  rawColors.push({
    name: `Primary Accent · ${ap > 0 ? "Warm" : "Cool"}`,
    value: {
      ...mapToGamut(
        clamp(jitter(baseL * 0.95, 0.06, rng), 0.34, 0.74),
        clamp(
          jitter(baseC + 0.08, 0.04, rng) * (1 + (moodScalar - 1) * 1.0),
          0.14,
          0.4,
        ),
        paH,
      ),
      a,
    },
  });
  rawColors.push({
    name: "Secondary Accent · Bridge",
    value: {
      ...mapToGamut(
        clamp(jitter(baseL + 0.05, 0.05, rng), 0.38, 0.72),
        clamp(
          jitter(baseC + 0.04, 0.03, rng) * (1 + (moodScalar - 1) * 0.8),
          0.12,
          0.36,
        ),
        wrapHue(lerp(baseH, paH, 0.5)),
      ),
      a,
    },
  });
  // Distance nudge
  for (let pass = 0; pass < MAX_NUDGE_PASSES; pass++) {
    let nudged = false;
    for (let i = 0; i < rawColors.length; i++)
      for (let j = i + 1; j < rawColors.length; j++) {
        const ci = rawColors[i].value,
          cj = rawColors[j].value,
          dist = deltaEok(ci, cj);
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
    if (!nudged) break;
  }
  // Contrast enforcement
  const se = rawColors.find((c) => c.name === "Deep Shadow"),
    he = rawColors.find((c) => c.name === "Air Highlight");
  if (se && he) {
    let att = 0;
    while (contrastRatio(se.value, he.value) < MIN_CONTRAST && att < 20) {
      se.value = {
        ...mapToGamut(
          clamp(se.value.l - 0.03, 0.02, 0.28),
          se.value.c,
          se.value.h,
        ),
        a,
      };
      he.value = {
        ...mapToGamut(
          clamp(he.value.l + 0.02, 0.72, 0.99),
          he.value.c,
          he.value.h,
        ),
        a,
      };
      att++;
    }
  }
  // Temperature balance
  balanceTemperature(rawColors, rng);
  const fc = se && he ? contrastRatio(se.value, he.value) : null;
  return {
    colors: rawColors,
    meta: {
      moodScalar,
      direction,
      hueNodes,
      arcBias,
      contrast: fc ? fc.toFixed(1) : "—",
      mood:
        moodScalar > 1.15
          ? "Electric"
          : moodScalar < 0.85
            ? "Pastel"
            : "Balanced",
    },
  };
}

function decodeSeed(str) {
  try {
    const l = parseFloat(str.match(/L([0-9.]+)/)?.[1]),
      c = parseFloat(str.match(/C([0-9.]+)/)?.[1]),
      h = parseFloat(str.match(/H([0-9.]+)/)?.[1]),
      s = parseInt(str.match(/S([0-9]+)/)?.[1], 10);
    if ([l, c, h, s].some(isNaN)) return null;
    return { oklch: { l, c, h, a: 1 }, rngSeed: s };
  } catch {
    return null;
  }
}

function spectralArcPalGen(baseOklch, numericSeed) {
  const { l: baseL, c: baseC, h: baseH } = baseOklch;
  const rngSeed = numericSeed ?? Math.floor(Math.random() * 0xffffffff);
  let bestResult = null,
    bestScore = -1;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const attemptSeed = (rngSeed + attempt * 0x9e3779b9) >>> 0;
    const rng = makeRng(attemptSeed);
    const result = generateOnce(baseOklch, rng);
    const score = scorePalette(result.colors, baseH);
    if (score > bestScore) {
      bestScore = score;
      bestResult = result;
    }
    if (bestScore >= SCORE_THRESHOLD) break;
  }
  const encodedSeed = `L${baseL.toFixed(3)}_C${baseC.toFixed(3)}_H${baseH.toFixed(1)}_S${rngSeed}`;
  return {
    palette: bestResult.colors,
    seed: rngSeed,
    encodedSeed,
    meta: bestResult.meta,
    score: Math.round(bestScore * 100),
  };
}

// ─── Color utils ──────────────────────────────────────────────────────────────

function oklchToCss({ l, c, h }) {
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)}deg)`;
}

function oklchToHex({ l, c, h }) {
  const hRad = (h * Math.PI) / 180,
    a_ = c * Math.cos(hRad),
    b_ = c * Math.sin(hRad);
  let lr = l + 0.3963377774 * a_ + 0.2158037573 * b_,
    mg = l - 0.1055613458 * a_ - 0.0638541728 * b_,
    sb = l - 0.0894841775 * a_ - 1.291485548 * b_;
  lr = lr ** 3;
  mg = mg ** 3;
  sb = sb ** 3;
  const r = 4.0767416621 * lr - 3.3077115913 * mg + 0.2309699292 * sb;
  const g = -1.2684380046 * lr + 2.6097574011 * mg - 0.3413193965 * sb;
  const bv = -0.0041960863 * lr - 0.7034186147 * mg + 1.707614701 * sb;
  const h2 = (x) =>
    Math.round(clamp(x, 0, 1) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${h2(r)}${h2(g)}${h2(bv)}`;
}

function getTextColor({ l }) {
  return l > 0.55 ? "#111" : "#f5f5f5";
}
function randomSeed() {
  return {
    l: Math.random() * 0.2 + 0.48,
    c: Math.random() * 0.16 + 0.14,
    h: Math.random() * 360,
    a: 1,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SpectralArcDemo({ bg = "var(--background, #fff)" }) {
  const { setPalette: setContextPalette } = useColorPaletteContext();

  const [seed, setSeed] = useState({ l: 0.58, c: 0.22, h: 260, a: 1 });
  const [result, setResult] = useState({
    palette: [],
    seed: 0,
    meta: {},
    score: null,
  });
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [copied, setCopied] = useState(null);
  const [seedInput, setSeedInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [seedCopied, setSeedCopied] = useState(false);
  const [showP3, setShowP3] = useState(false);
  const timerRef = useRef(null);

  // Map Spectral Arc palette entries → context palette shape { value: { l, c, h, a } }
  // This is the same shape all other palette generators in the app produce.
  const pushToContext = useCallback(
    (spectralPalette) => {
      if (!spectralPalette?.length) return;
      const mapped = spectralPalette.map((color) => ({
        value: {
          l: color.value.l,
          c: color.value.c,
          h: color.value.h,
          a: color.value.a ?? 1,
        },
        // Pass through the name so downstream components that read it still work
        name: color.name,
        semanticRole: color.semanticRole,
      }));
      setContextPalette(mapped);
    },
    [setContextPalette],
  );

  const generate = useCallback(
    (colorSeed, numericSeed) => {
      setRevealed(false);
      setTimeout(() => {
        const r = spectralArcPalGen(colorSeed ?? seed, numericSeed);
        setResult(r);
        setSeedInput(r.encodedSeed);
        pushToContext(r.palette);
        setTimeout(() => setRevealed(true), 30);
      }, 120);
    },
    [seed, pushToContext],
  );

  useEffect(() => {
    generate(seed);
  }, []);

  const handleRandom = () => {
    const s = randomSeed();
    setSeed(s);
    generate(s);
  };

  const handleSeedReplay = () => {
    const decoded = decodeSeed(seedInput);
    if (!decoded) return;
    setSeed(decoded.oklch);
    setRevealed(false);
    setTimeout(() => {
      const r = spectralArcPalGen(decoded.oklch, decoded.rngSeed);
      setResult(r);
      setSeedInput(r.encodedSeed);
      pushToContext(r.palette);
      setTimeout(() => setRevealed(true), 30);
    }, 120);
  };

  const handleCopy = async (color, key) => {
    const hex = color.hex ?? oklchToHex(color.value);
    await navigator.clipboard.writeText(hex).catch(() => {});
    setCopied(key);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(null), 1600);
  };

  const handleCopySeed = async () => {
    await navigator.clipboard
      .writeText(result.encodedSeed ?? "")
      .catch(() => {});
    setSeedCopied(true);
    setTimeout(() => setSeedCopied(false), 1600);
  };

  const { palette, meta } = result;
  const seedCss = oklchToCss(seed);
  const moodLabel = meta.mood ?? "—";
  const dirLabel = meta.direction === 1 ? "Clockwise ↻" : "Counter ↺";

  const metaPills = [
    ["Mood", moodLabel],
    ["Arc", dirLabel],
    ["Nodes", meta.hueNodes],
    ["Arc Bias", meta.arcBias?.toFixed(2)],
    ["Colors", palette.length],
    ["Contrast", meta.contrast ? `${meta.contrast}:1` : "—"],
    ["Score", result.score != null ? `${result.score}/100` : "—"],
  ];

  const sliders = [
    {
      id: "l",
      label: "Lightness",
      min: 0.2,
      max: 0.85,
      step: 0.01,
      fmt: (v) => v.toFixed(2),
      track: `linear-gradient(to right,oklch(0.1 ${seed.c.toFixed(3)} ${seed.h.toFixed(0)}deg),oklch(0.95 ${seed.c.toFixed(3)} ${seed.h.toFixed(0)}deg))`,
    },
    {
      id: "c",
      label: "Chroma",
      min: 0.04,
      max: 0.36,
      step: 0.005,
      fmt: (v) => v.toFixed(3),
      track: `linear-gradient(to right,oklch(${seed.l.toFixed(2)} 0.01 ${seed.h.toFixed(0)}deg),oklch(${seed.l.toFixed(2)} 0.36 ${seed.h.toFixed(0)}deg))`,
    },
    {
      id: "h",
      label: "Hue",
      min: 0,
      max: 359,
      step: 1,
      fmt: (v) => `${Math.round(v)}°`,
      track:
        "linear-gradient(to right,oklch(0.6 0.2 0deg),oklch(0.6 0.2 60deg),oklch(0.6 0.2 120deg),oklch(0.6 0.2 180deg),oklch(0.6 0.2 240deg),oklch(0.6 0.2 300deg),oklch(0.6 0.2 360deg))",
    },
  ];

  return (
    <div
      className="flex flex-col h-full bg-background"
      style={{ fontFamily: "'DM Mono','Fira Mono','Courier New',monospace" }}
    >
      {/* ── Main layout: left panel + right canvas ─────────────────────────── */}
      <div className="flex flex-1 gap-2 mx-4 mb-3 mt-3 min-h-0">
        {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
        <div className="w-52 flex-shrink-0 border border-(--navBorder) rounded-md bg-foreground/[0.015] flex flex-col overflow-y-auto">
          {/* Seed swatch preview */}
          <div className="p-3 border-b border-(--navBorder) flex-shrink-0">
            <span className="text-[9px] font-bold text-foreground/25 uppercase tracking-widest block mb-2">
              Base Color
            </span>
            <div
              style={{
                width: "100%",
                height: 44,
                borderRadius: 8,
                background: seedCss,
                boxShadow: `0 0 20px ${seedCss}55`,
                transition: "background 0.3s, box-shadow 0.3s",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
            <div className="flex gap-2 mt-2">
              {[
                ["L", seed.l.toFixed(2)],
                ["C", seed.c.toFixed(3)],
                ["H", `${Math.round(seed.h)}°`],
              ].map(([k, v]) => (
                <span
                  key={k}
                  className="text-[10px] font-mono text-foreground/30"
                >
                  {k}
                  <span className="text-foreground/50 ml-0.5">{v}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="p-3 border-b border-(--navBorder) flex-shrink-0">
            <span className="text-[9px] font-bold text-foreground/25 uppercase tracking-widest block mb-3">
              Adjust
            </span>
            <div className="flex flex-col gap-4">
              {sliders.map(({ id, label, min, max, step, fmt, track }) => (
                <label key={id} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                      {label}
                    </span>
                    <span className="text-[10px] font-mono text-foreground/60">
                      {fmt(seed[id])}
                    </span>
                  </div>
                  <div className="relative h-4 flex items-center">
                    <div
                      className="absolute w-full h-1.5 rounded-full"
                      style={{ background: track }}
                    />
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={seed[id]}
                      onChange={(e) => {
                        const s = { ...seed, [id]: parseFloat(e.target.value) };
                        setSeed(s);
                        generate(s);
                      }}
                      className="relative w-full h-1.5 rounded-full appearance-none cursor-pointer bg-transparent"
                      style={{ WebkitAppearance: "none" }}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Seed input */}
          <div className="p-3 border-b border-(--navBorder) flex-shrink-0">
            <span className="text-[9px] font-bold text-foreground/25 uppercase tracking-widest block mb-2">
              Seed
            </span>
            <div className="flex border border-(--navBorder) rounded overflow-hidden mb-2">
              <input
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSeedReplay()}
                placeholder="paste seed…"
                className="flex-1 bg-transparent border-none outline-none text-foreground/50 text-[10px] px-2 py-1.5 font-mono min-w-0"
              />
              <button
                onClick={handleSeedReplay}
                className="px-2 py-1.5 bg-foreground/[0.03] border-l border-(--navBorder) text-foreground/30 text-[10px] hover:text-foreground/60 transition-colors cursor-pointer"
              >
                ↵
              </button>
            </div>
            <button
              onClick={handleCopySeed}
              className="w-full py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:border-foreground/30 transition-colors uppercase tracking-wide cursor-pointer bg-transparent"
              style={{ color: seedCopied ? "oklch(0.72 0.15 145)" : undefined }}
            >
              {seedCopied ? "✓ copied" : "copy seed"}
            </button>
          </div>

          {/* Gamut toggle */}
          <div className="p-3 border-b border-(--navBorder) flex-shrink-0">
            <span className="text-[9px] font-bold text-foreground/25 uppercase tracking-widest block mb-2">
              Gamut
            </span>
            <div className="flex gap-1.5">
              {["sRGB", "P3"].map((g) => {
                const active = showP3 ? g === "P3" : g === "sRGB";
                return (
                  <button
                    key={g}
                    onClick={() => setShowP3(g === "P3")}
                    className={`flex-1 py-1.5 rounded text-[10px] font-bold border transition-all cursor-pointer bg-transparent
                      ${active ? "border-(--brand) text-(--brand) bg-foreground/[0.03]" : "border-(--navBorder) text-foreground/30 hover:text-foreground/50"}`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
            <span className="text-[9px] text-foreground/20 mt-1.5 block">
              {showP3
                ? "Wider · richer on P3 displays"
                : "Safe for all displays"}
            </span>
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
        <div className="flex-1 border border-(--navBorder) rounded-md bg-foreground/[0.01] flex flex-col min-h-0 overflow-hidden">
          {/* Meta pills row + action buttons */}
          {meta.moodScalar && (
            <div className="flex-shrink-0 px-3 pt-2 pb-2 border-b border-(--navBorder) flex items-center gap-1 flex-nowrap">
              {/* Pills */}
              <div className="flex gap-1 items-center flex-1 min-w-0 overflow-hidden">
                {metaPills.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-(--navBorder) bg-foreground/[0.02] flex-shrink-0"
                  >
                    <span className="text-[9px] font-bold text-foreground/25 uppercase tracking-widest">
                      {k}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-(--brand)">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              {/* Action buttons — right side */}
              <div className="flex gap-1.5 flex-shrink-0 ml-2">
                <button
                  onClick={handleRandom}
                  className="px-2.5 py-1 rounded text-[10px] font-bold border border-(--navBorder) text-foreground/40 hover:text-foreground/70 hover:border-foreground/30 transition-all cursor-pointer bg-transparent uppercase tracking-wide"
                >
                  ⟳ Random
                </button>
                <button
                  onClick={() => generate(seed)}
                  className="px-2.5 py-1 rounded text-[10px] font-bold border-none cursor-pointer transition-all uppercase tracking-wide"
                  style={{
                    background: seedCss,
                    color: getTextColor(seed),
                    boxShadow: `0 2px 10px ${seedCss}55`,
                  }}
                >
                  Generate
                </button>
              </div>
            </div>
          )}

          {/* ── HERO PALETTE BAR — fills all remaining space ── */}
          <div className="flex-1 min-h-0 px-4 pb-4 pt-3">
            <div className="flex h-full rounded-lg overflow-hidden border border-(--navBorder)">
              {palette.map((color, i) => {
                const bg = showP3
                  ? (color.cssP3 ?? color.cssSrgb ?? oklchToCss(color.value))
                  : (color.cssSrgb ?? oklchToCss(color.value));
                const hex = color.hex ?? oklchToHex(color.value);
                const tc = getTextColor(color.value);
                const isH = hoveredIdx === i;
                const isCopied = copied === `strip-${i}`;
                const parts = color.name.split(" · ");
                const label = parts[0];
                const role = parts.slice(1).join(" · ");
                const delay = `${i * 35}ms`;

                return (
                  <div
                    key={i}
                    style={{
                      flex: isH ? 3.5 : 1,
                      background: bg,
                      transition: "flex 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      opacity: revealed ? 1 : 0,
                      animation: revealed
                        ? `fadeUp 0.45s ${delay} both`
                        : "none",
                    }}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => handleCopy(color, `strip-${i}`)}
                  >
                    {/* Always-visible bottom label — shows on every segment */}
                    <div
                      className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-3 pb-3 pt-8"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
                      }}
                    >
                      <span
                        className="text-sm font-bold leading-tight truncate"
                        style={{
                          color: "#fff",
                          textShadow: "0 1px 4px rgba(0,0,0,0.7)",
                          writingMode: isH ? "horizontal-tb" : "vertical-lr",
                          transform: isH ? "none" : "rotate(180deg)",
                          transition: "all 0.3s",
                        }}
                      >
                        {label}
                      </span>
                      {isH && (
                        <>
                          {role && (
                            <span
                              className="text-xs font-bold uppercase tracking-widest mt-1"
                              style={{
                                color: "rgba(255,255,255,0.7)",
                                textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                              }}
                            >
                              {role}
                            </span>
                          )}
                          <span
                            className="text-xs font-mono mt-1"
                            style={{
                              color: "rgba(255,255,255,0.6)",
                              textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                            }}
                          >
                            {hex}
                          </span>
                          <span
                            className="text-xs font-mono"
                            style={{ color: "rgba(255,255,255,0.45)" }}
                          >
                            L{color.value.l.toFixed(2)} · C
                            {color.value.c.toFixed(3)} ·{" "}
                            {Math.round(color.value.h)}°
                          </span>
                        </>
                      )}
                    </div>

                    {/* Semantic role badge — top */}
                    {isH && color.semanticRole && (
                      <div className="absolute top-3 left-3">
                        <span
                          className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                          style={{
                            color: tc === "#111" ? "#111" : "#fff",
                            background:
                              tc === "#111"
                                ? "rgba(255,255,255,0.75)"
                                : "rgba(0,0,0,0.55)",
                            backdropFilter: "blur(6px)",
                          }}
                        >
                          {color.semanticRole}
                        </span>
                      </div>
                    )}

                    {/* Copied flash */}
                    <div
                      className="absolute inset-0 flex items-center justify-center transition-opacity duration-150"
                      style={{
                        background: "rgba(0,0,0,0.4)",
                        opacity: isCopied ? 1 : 0,
                        pointerEvents: "none",
                      }}
                    >
                      <span className="text-sm font-bold text-white">
                        ✓ copied
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 11px; height: 11px;
          border-radius: 50%; background: var(--foreground, #e8e4df);
          border: 2px solid var(--background, #1a1a20); cursor: pointer;
          box-shadow: 0 0 5px rgba(0,0,0,0.4);
        }
        input[type=range]::-moz-range-thumb {
          width: 11px; height: 11px; border-radius: 50%;
          background: var(--foreground, #e8e4df);
          border: 2px solid var(--background, #1a1a20); cursor: pointer;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
