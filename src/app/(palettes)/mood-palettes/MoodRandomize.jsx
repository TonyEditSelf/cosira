import { useState, useMemo, useCallback, useRef } from "react";
import { oklchToHex, wcagContrast, hexToOklch  } from "../custom-palettes/_components/Pickers/components/colorutil";
import { rand, clampOklch, generateHarmonyHues, meetsContrast, getContrastInfo, stratifiedHues, generatePalette } from "../culture-palettes/paletteUtils";

// ─── Mood definitions: hue range, chroma range, lightness range ───
const MOODS = {
  // ── Original 8 ──
  "Warm & Earthy": {
    emoji: "🌿",
    description: "Terracotta, rust, sand, sage",
    hues: [[15, 55], [80, 110]],
    chroma: [0.05, 0.14],
    lightness: [0.38, 0.68],
    accent: "#C17A3A",
    count: 5,
  },
  "Ocean & Calm": {
    emoji: "🌊",
    description: "Deep navy, teal, seafoam, mist",
    hues: [[185, 240]],
    chroma: [0.06, 0.18],
    lightness: [0.32, 0.72],
    accent: "#3A8FA0",
    count: 5,
  },
  "Bold & Electric": {
    emoji: "⚡",
    description: "Vivid, high-energy, saturated",
    hues: [[260, 330], [180, 220], [0, 30], [300, 360]],
    chroma: [0.18, 0.32],
    lightness: [0.42, 0.65],
    accent: "#7C3AED",
    count: 5,
  },
  "Dusk & Moody": {
    emoji: "🌆",
    description: "Deep purples, mauve, dusty rose",
    hues: [[290, 360]],
    chroma: [0.07, 0.18],
    lightness: [0.28, 0.62],
    accent: "#9B5C8F",
    count: 5,
  },
  "Fresh & Minimal": {
    emoji: "🌸",
    description: "Soft pastels, airy, light",
    hues: [[0, 360]],
    chroma: [0.03, 0.1],
    lightness: [0.72, 0.92],
    accent: "#A8C5DA",
    count: 5,
  },
  "Luxe & Dark": {
    emoji: "✦",
    description: "Ebony, deep gold, midnight",
    hues: [[30, 60], [250, 280], [340, 20]],
    chroma: [0.04, 0.16],
    lightness: [0.18, 0.48],
    accent: "#8B7355",
    count: 5,
  },
  "Neon Cyber": {
    emoji: "🔮",
    description: "Acid greens, hot pinks, glows",
    hues: [[120, 160], [300, 340]],
    chroma: [0.22, 0.38],
    lightness: [0.5, 0.75],
    accent: "#39FF14",
    count: 5,
  },
  "Nordic Frost": {
    emoji: "❄️",
    description: "Ice blue, white birch, pale grey",
    hues: [[195, 235]],
    chroma: [0.02, 0.09],
    lightness: [0.68, 0.93],
    accent: "#B8D4E8",
    count: 5,
  },

  // ── 12 New ──
  "Sunrise & Hopeful": {
    emoji: "🌅",
    description: "Soft coral, pale yellow, warm peach, light lavender",
    hues: [[0, 60], [300, 360]],
    chroma: [0.07, 0.16],
    lightness: [0.72, 0.88],
    accent: "#F4A97F",
    count: 5,
  },
  "Forest & Natural": {
    emoji: "🌲",
    description: "Deep greens, moss, bark brown, muted gold",
    hues: [[95, 145], [40, 65]],
    chroma: [0.06, 0.16],
    lightness: [0.28, 0.58],
    accent: "#4A7C59",
    count: 5,
  },
  "Vintage & Retro": {
    emoji: "📻",
    description: "Mustard, burnt orange, olive, muted teal",
    hues: [[0, 360]],
    chroma: [0.07, 0.17],
    lightness: [0.38, 0.62],
    accent: "#C9943A",
    count: 5,
  },
  "Candy & Playful": {
    emoji: "🍬",
    description: "Bubblegum pink, lemon yellow, mint, sky blue",
    hues: [[0, 360]],
    chroma: [0.12, 0.22],
    lightness: [0.68, 0.86],
    accent: "#F472B6",
    count: 5,
  },
  "Industrial & Urban": {
    emoji: "🏭",
    description: "Steel grey, concrete, muted navy, brick red",
    hues: [[0, 360]],
    chroma: [0.02, 0.1],
    lightness: [0.25, 0.58],
    accent: "#7A8A9A",
    count: 5,
  },
  "Romantic & Soft": {
    emoji: "🌹",
    description: "Blush pink, rose, soft mauve, creamy ivory",
    hues: [[0, 25], [340, 360]],
    chroma: [0.05, 0.14],
    lightness: [0.65, 0.88],
    accent: "#E8A0A0",
    count: 5,
  },
  "Autumn & Cozy": {
    emoji: "🍂",
    description: "Pumpkin, burnt sienna, chocolate, warm amber",
    hues: [[20, 50]],
    chroma: [0.1, 0.22],
    lightness: [0.32, 0.62],
    accent: "#C4622D",
    count: 5,
  },
  "Winter & Cozy": {
    emoji: "🕯️",
    description: "Deep pine, cranberry, soft taupe, candlelight yellow",
    hues: [[120, 165], [0, 20], [50, 70]],
    chroma: [0.05, 0.16],
    lightness: [0.22, 0.55],
    accent: "#7A4A4A",
    count: 5,
  },
  "Desert & Sun-baked": {
    emoji: "🏜️",
    description: "Sand, ochre, clay, faded turquoise",
    hues: [[45, 75], [175, 200]],
    chroma: [0.05, 0.15],
    lightness: [0.48, 0.76],
    accent: "#C8A96A",
    count: 5,
  },
  "Jungle & Vibrant": {
    emoji: "🌺",
    description: "Deep jungle green, bright ferns, exotic pinks, tropical teal",
    hues: [[130, 175], [0, 20], [170, 195]],
    chroma: [0.14, 0.26],
    lightness: [0.35, 0.68],
    accent: "#2D8C55",
    count: 5,
  },
  "Fire & Passion": {
    emoji: "🔥",
    description: "Scarlet, crimson, bright orange, molten gold",
    hues: [[350, 360], [0, 45]],
    chroma: [0.18, 0.32],
    lightness: [0.38, 0.65],
    accent: "#E03A1A",
    count: 5,
  },
  "Tea & Calm": {
    emoji: "🍵",
    description: "Matcha green, light beige, soft brown, warm cream",
    hues: [[95, 130], [55, 80]],
    chroma: [0.03, 0.1],
    lightness: [0.55, 0.82],
    accent: "#8FAF7A",
    count: 5,
  },
};

// Contrast lock options
const CONTRAST_MODES = [
  { id: "none", label: "None", desc: "Free generation" },
  { id: "aa", label: "AA", desc: "≥ 4.5:1 on white or black" },
  { id: "aaa", label: "AAA", desc: "≥ 7:1 on white or black" },
];

// Harmony types
const HARMONY_MODES = [
  { id: "free", label: "Free", desc: "Independent colors" },
  { id: "analogous", label: "Analogous", desc: "Adjacent hues ±30°" },
  { id: "complementary", label: "Complementary", desc: "Opposite hues" },
  { id: "triadic", label: "Triadic", desc: "3 equidistant hues" },
  { id: "split", label: "Split Comp", desc: "Split complementary" },
];

// ─── Sub-components ───

function MoodCard({ moodKey, mood, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(moodKey)}
      className={`w-full text-left px-3 py-2.5 rounded-md border transition-all flex items-center gap-2.5 group ${
        isSelected
          ? "border-(--brand) bg-foreground/[0.04] text-foreground"
          : "border-(--navBorder) hover:border-foreground/20 text-foreground/60 hover:text-foreground/80"
      }`}
    >
      <span className="text-base leading-none shrink-0">{mood.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className={`text-[10px] font-bold leading-tight truncate ${isSelected ? "text-(--brand)" : ""}`}>
          {moodKey}
        </div>
        <div className="text-[8px] text-foreground/30 truncate mt-0.5">{mood.description}</div>
      </div>
      <div
        className="w-3 h-3 rounded-full shrink-0 border border-black/10"
        style={{ backgroundColor: mood.accent }}
      />
    </button>
  );
}

function ColorSwatch({ color, index, isLocked, onLock, onCopy, copied }) {
  const info = getContrastInfo(color.hex);
  const { l, c, h } = hexToOklch(color.hex);

  return (
    <div className="group flex flex-col rounded-lg border border-(--navBorder) overflow-hidden hover:border-foreground/20 transition-all hover:shadow-lg bg-background">
      {/* Color block */}
      <div
        className="relative h-28 cursor-pointer flex flex-col items-center justify-center transition-all"
        style={{ backgroundColor: color.hex }}
        onClick={() => onCopy(color.hex)}
      >
        {/* Lock button */}
        <button
          onClick={(e) => { e.stopPropagation(); onLock(index); }}
          className={`absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center transition-all text-[10px] ${
            isLocked
              ? "bg-white/90 text-gray-800 shadow-md"
              : "bg-black/20 text-white/60 opacity-0 group-hover:opacity-100"
          }`}
          title={isLocked ? "Unlock color" : "Lock color"}
        >
          {isLocked ? "🔒" : "○"}
        </button>

        {/* Copy feedback */}
        {copied === color.hex ? (
          <span className="text-[10px] font-bold" style={{ color: info.textColor }}>✓ Copied</span>
        ) : (
          <span
            className="text-[11px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: info.textColor }}
          >
            {color.hex.toUpperCase()}
          </span>
        )}

        {/* Lock indicator strip */}
        {isLocked && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/40" />
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 space-y-2">
        <div
          className="text-[10px] font-mono font-bold text-foreground/80 cursor-pointer hover:text-(--brand) transition-colors"
          onClick={() => onCopy(color.hex)}
        >
          {color.hex.toUpperCase()}
        </div>
        <div className="flex gap-2 text-[8px] font-mono text-foreground/35">
          <span>L:{(l * 100).toFixed(0)}</span>
          <span>C:{c.toFixed(2)}</span>
          <span>H:{h.toFixed(0)}°</span>
        </div>

        {/* WCAG badge */}
        <div className="flex items-center gap-1">
          <span
            className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
              info.aaa
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                : info.aa
                ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600"
                : "bg-red-500/10 border-red-500/30 text-red-500"
            }`}
          >
            {info.aaa ? "AAA" : info.aa ? "AA" : "Fail"}
          </span>
          <span className="text-[8px] font-mono text-foreground/30">{info.best}:1</span>
        </div>


      </div>
    </div>
  );
}

function PalettePreviewBar({ colors }) {
  if (!colors.length) return null;
  return (
    <div className="flex h-8 rounded-md overflow-hidden border border-(--navBorder) shadow-sm">
      {colors.map((c, i) => (
        <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} title={c.hex} />
      ))}
    </div>
  );
}

// ─── Variation Explorer ───
function VariationStrip({ baseColor, mood }) {
  const m = MOODS[mood];
  const variations = useMemo(() => {
    if (!baseColor) return [];

const { h } = hexToOklch(baseColor.hex);
    // Generate lightness variations
    return [0.15, 0.3, 0.45, 0.6, 0.75, 0.88].map((l) => {
      const c = rand(m.chroma[0], m.chroma[1]);
      const col = clampOklch(l, c, h);
      return col;
    });
  }, [baseColor, mood]);

  if (!baseColor) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: baseColor.hex }} />
        <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest">
          Tonal Range · {baseColor.hex.toUpperCase()}
        </span>
      </div>
      <div className="flex h-10 rounded-md overflow-hidden border border-(--navBorder)">
        {variations.map((v, i) => (
          <div
            key={i}
            className="flex-1 cursor-pointer hover:flex-[1.5] transition-all"
            style={{ backgroundColor: v.hex }}
            onClick={() => navigator.clipboard.writeText(v.hex)}
            title={v.hex}
          />
        ))}
      </div>
    </div>
  );
}

// ─── History ───
const MAX_HISTORY = 7;

// ─── Main Component ───
export default function MoodRandomize() {

  const [selectedMood, setSelectedMood] = useState("Warm & Earthy");
  const [harmony, setHarmony] = useState("free");
  const [contrastMode, setContrastMode] = useState("none");
  const [count, setCount] = useState(5);
  const [generated, setGenerated] = useState([]);
  const [locks, setLocks] = useState({});
  const [copied, setCopied] = useState(null);
  const [history, setHistory] = useState([]);
  const [expandedVariation, setExpandedVariation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const lockedColors = useMemo(() => {
    const obj = {};
    Object.keys(locks).forEach((i) => {
      if (locks[i] && generated[i]) obj[i] = generated[i];
    });
    return obj;
  }, [locks, generated]);

  const generate = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const colors = generatePalette(MOODS[selectedMood], harmony, contrastMode, count, lockedColors);
      setGenerated(colors);
      setHistory((prev) => {
        const entry = { mood: selectedMood, colors, id: Date.now() };
        return [entry, ...prev].slice(0, MAX_HISTORY);
      });
      setExpandedVariation(null);
      setIsGenerating(false);
    }, 80);
  }, [selectedMood, harmony, contrastMode, count, lockedColors]);

  const handleLock = (index) => {
    setLocks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopy = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleRestoreHistory = (entry) => {
    setGenerated(entry.colors);
    setSelectedMood(entry.mood);
    setLocks({});
  };

  const handleCopyAll = (format) => {
    if (!generated.length) return;
    if (format === "hex") {
      navigator.clipboard.writeText(generated.map((c) => c.hex).join(", "));
    } else if (format === "css") {
      const vars = generated.map((c, i) => `  --brand-${i + 1}: ${c.hex};`).join("\n");
      navigator.clipboard.writeText(`:root {\n${vars}\n}`);
    } else if (format === "json") {
      const json = generated.map((c) => {
        const { l, c: cc, h } = hexToOklch(c.hex);
return { hex: c.hex, oklch: { l: +(l).toFixed(3), c: +(cc).toFixed(3), h: +(h).toFixed(1) } };
      });
      navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    }
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const lockedCount = Object.values(locks).filter(Boolean).length;

  return (
    <div className="hidden bg-background lg:flex flex-col pt-3 h-full">

      {/* ── Top header bar ── */}
      <div className="mx-2 mb-2 ml-4 mr-4 p-4 border border-(--navBorder) rounded-md bg-foreground/[0.015] flex-shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                Smart Randomizer
              </span>
              <div className="h-4 w-[1px] bg-(--navBorder)" />
              <span className="text-[9px] text-foreground/30">
                Mood-constrained brand palette generation
              </span>
            </div>
            {generated.length > 0 && (
              <>
                <div className="h-4 w-[1px] bg-(--navBorder)" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-foreground/40 uppercase">Active mood</span>
                  <span className="text-[10px]">{MOODS[selectedMood].emoji}</span>
                  <span className="text-[10px] font-bold text-(--brand)">{selectedMood}</span>
                </div>
                {lockedCount > 0 && (
                  <>
                    <div className="h-4 w-[1px] bg-(--navBorder)" />
                    <span className="text-[9px] text-foreground/40">🔒 {lockedCount} locked</span>
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {generated.length > 0 && (
              <>
                <button
                  onClick={() => handleCopyAll("hex")}
                  className="px-3 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
                >
                  {copied === "hex" ? "✓ Copied" : "Copy HEX"}
                </button>
                <button
                  onClick={() => handleCopyAll("css")}
                  className="px-3 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
                >
                  {copied === "css" ? "✓ Copied" : "CSS Vars"}
                </button>
                <button
                  onClick={() => handleCopyAll("json")}
                  className="px-3 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
                >
                  {copied === "json" ? "✓ Copied" : "JSON"}
                </button>
                <div className="h-4 w-[1px] bg-(--navBorder)" />

              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content: left toolbar + right canvas ── */}
      <div className="flex flex-1 gap-2 mx-2 mb-2 min-h-0">

        {/* ── Left toolbar ── */}
        <div
          className="flex flex-col ml-2 border border-(--navBorder) rounded-md bg-foreground/[0.015] flex-shrink-0 min-h-0"
          style={{ width: "22%" }}
        >

          {/* Generate button — fixed, never scrolls */}
          <div className="p-3 flex-shrink-0 border-b border-(--navBorder)">
            <button
              onClick={generate}
              disabled={isGenerating}
              className="w-full py-3 rounded-md font-bold text-[11px] uppercase tracking-widest transition-all border border-(--brand) text-(--brand) hover:bg-(--brand) hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isGenerating ? "Generating…" : generated.length ? "↺ Regenerate" : "✦ Generate"}
            </button>
            {generated.length > 0 && lockedCount > 0 && (
              <p className="text-[8px] text-foreground/30 text-center mt-1.5">
                {lockedCount} color{lockedCount !== 1 ? "s" : ""} locked · {count - lockedCount} will refresh
              </p>
            )}
          </div>

          {/* Scrollable options */}
          <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">

          {/* Mood selector */}
          <div className="px-3 pb-1 flex-shrink-0">
            <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest">
              Mood
            </span>
          </div>
          <div className="px-3 pb-3 flex flex-col gap-1 flex-shrink-0">
            {Object.entries(MOODS).map(([key, mood]) => (
              <MoodCard
                key={key}
                moodKey={key}
                mood={mood}
                isSelected={selectedMood === key}
                onSelect={(moodKey) => {
                  setSelectedMood(moodKey);
                  setLocks({});
                  setExpandedVariation(null);
                  if (generated.length > 0) {
                    setIsGenerating(true);
                    setTimeout(() => {
                      const colors = generatePalette(MOODS[moodKey], harmony, contrastMode, count, {});
                      setGenerated(colors);
                      setHistory((prev) => [{ mood: moodKey, colors, id: Date.now() }, ...prev].slice(0, MAX_HISTORY));
                      setIsGenerating(false);
                    }, 80);
                  }
                }}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="mx-3 border-t border-(--navBorder) my-1" />

          {/* Count */}
          <div className="px-4 pt-3 pb-1 flex-shrink-0">
            <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest">
              Colors
            </span>
          </div>
          <div className="px-3 pb-3 flex-shrink-0">
            <div className="flex gap-1">
              {[3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setCount(n);
                    setLocks({});
                    setExpandedVariation(null);
                    if (generated.length > 0) {
                      setIsGenerating(true);
                      setTimeout(() => {
                        const colors = generatePalette(MOODS[selectedMood], harmony, contrastMode, n, {});
                        setGenerated(colors);
                        setHistory((prev) => [{ mood: selectedMood, colors, id: Date.now() }, ...prev].slice(0, MAX_HISTORY));
                        setIsGenerating(false);
                      }, 80);
                    }
                  }}
                  className={`flex-1 py-2 rounded text-[10px] font-bold border transition-all ${
                    count === n
                      ? "border-(--brand) bg-(--brand)/5 text-(--brand)"
                      : "border-(--navBorder) text-foreground/40 hover:text-foreground/70 hover:border-foreground/20"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-3 border-t border-(--navBorder) my-1" />

          {/* Harmony */}
          <div className="px-4 pt-3 pb-1 flex-shrink-0">
            <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest">
              Harmony
            </span>
          </div>
          <div className="px-3 pb-3 flex flex-col gap-1 flex-shrink-0">
            {HARMONY_MODES.map((h) => (
              <button
                key={h.id}
                onClick={() => {
                  setHarmony(h.id);
                  if (generated.length > 0) {
                    setIsGenerating(true);
                    setTimeout(() => {
                      const colors = generatePalette(MOODS[selectedMood], h.id, contrastMode, count, lockedColors);
                      setGenerated(colors);
                      setHistory((prev) => [{ mood: selectedMood, colors, id: Date.now() }, ...prev].slice(0, MAX_HISTORY));
                      setIsGenerating(false);
                    }, 80);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded border transition-all ${
                  harmony === h.id
                    ? "border-(--brand) bg-(--brand)/5 text-(--brand)"
                    : "border-(--navBorder) text-foreground/50 hover:text-foreground/80 hover:border-foreground/20"
                }`}
              >
                <div className="text-[10px] font-bold leading-tight">{h.label}</div>
                <div className="text-[8px] text-foreground/30 mt-0.5">{h.desc}</div>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-3 border-t border-(--navBorder) my-1" />

          {/* Contrast lock */}
          <div className="px-4 pt-3 pb-1 flex-shrink-0">
            <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest">
              Contrast Lock
            </span>
          </div>
          <div className="px-3 pb-4 flex flex-col gap-1 flex-shrink-0">
            {CONTRAST_MODES.map((cm) => (
              <button
                key={cm.id}
                onClick={() => {
                  setContrastMode(cm.id);
                  if (generated.length > 0) {
                    setIsGenerating(true);
                    setTimeout(() => {
                      const colors = generatePalette(MOODS[selectedMood], harmony, cm.id, count, lockedColors);
                      setGenerated(colors);
                      setHistory((prev) => [{ mood: selectedMood, colors, id: Date.now() }, ...prev].slice(0, MAX_HISTORY));
                      setIsGenerating(false);
                    }, 80);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded border transition-all ${
                  contrastMode === cm.id
                    ? "border-(--brand) bg-(--brand)/5 text-(--brand)"
                    : "border-(--navBorder) text-foreground/50 hover:text-foreground/80 hover:border-foreground/20"
                }`}
              >
                <div className="text-[10px] font-bold leading-tight">{cm.label}</div>
                <div className="text-[8px] text-foreground/30 mt-0.5">{cm.desc}</div>
              </button>
            ))}
          </div>

          </div>{/* end scrollable */}
        </div>

        {/* ── Right canvas ── */}
        <div className="flex-1 mr-2 border border-(--navBorder) rounded-md overflow-hidden bg-gradient-to-br from-foreground/[0.01] to-foreground/[0.03] relative min-w-0">
          <div className="h-full overflow-y-auto custom-scrollbar p-6">

            {/* Empty state */}
            {generated.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center gap-6 text-center">
                <div className="text-5xl">{MOODS[selectedMood].emoji}</div>
                <div>
                  <div className="text-[13px] font-bold text-foreground/50 mb-1">{selectedMood}</div>
                  <div className="text-[10px] text-foreground/25">{MOODS[selectedMood].description}</div>
                </div>
                <button
                  onClick={generate}
                  className="px-8 py-3 rounded-md font-bold text-[11px] uppercase tracking-widest border border-(--brand) text-(--brand) hover:bg-(--brand) hover:text-white transition-all"
                >
                  ✦ Generate Palette
                </button>
                <p className="text-[9px] text-foreground/20 max-w-xs">
                  Generates {count} colors constrained to the mood's hue, chroma, and lightness ranges
                </p>
              </div>
            )}

            {/* Generated palette */}
            {generated.length > 0 && (
              <div className="space-y-8">

                {/* Preview bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">
                      {MOODS[selectedMood].emoji} {selectedMood}
                      <span className="ml-2 font-normal">{MOODS[selectedMood].description}</span>
                    </span>
                    <span className="text-[8px] text-foreground/20">{harmony !== "free" ? harmony : "free harmony"} · {contrastMode !== "none" ? contrastMode + " locked" : "no contrast lock"}</span>
                  </div>
                  <PalettePreviewBar colors={generated} />
                </div>

                {/* Color cards grid */}
                <div className={`grid gap-4 ${
                  generated.length <= 3 ? "grid-cols-3" :
                  generated.length === 4 ? "grid-cols-4" :
                  generated.length === 5 ? "grid-cols-5" :
                  generated.length === 6 ? "grid-cols-6" :
                  "grid-cols-7"
                }`}>
                  {generated.map((color, i) => (
                    <ColorSwatch
                      key={i}
                      color={color}
                      index={i}
                      isLocked={!!locks[i]}
                      onLock={handleLock}
                      onCopy={handleCopy}
                    copied={copied}
                    />
                  ))}
                </div>

                {/* Tonal variation explorer */}
                <div className="space-y-3 pt-2 border-t border-(--navBorder)">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">
                      Tonal Ranges
                    </span>
                    <span className="text-[8px] text-foreground/20">Click a color to explore its full tonal scale</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {generated.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setExpandedVariation(expandedVariation === i ? null : i)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[9px] font-bold transition-all ${
                          expandedVariation === i
                            ? "border-(--brand) bg-(--brand)/5 text-(--brand)"
                            : "border-(--navBorder) text-foreground/40 hover:border-foreground/20"
                        }`}
                      >
                        <div className="w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: c.hex }} />
                        Color {i + 1}
                      </button>
                    ))}
                  </div>
                  {expandedVariation !== null && generated[expandedVariation] && (
                    <VariationStrip
                      baseColor={generated[expandedVariation]}
                      mood={selectedMood}
                    />
                  )}
                </div>

                {/* History */}
                {history.length > 1 && (
                  <div className="space-y-3 pt-2 border-t border-(--navBorder)">
                    <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest block">
                      Generation History
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      {history.slice(1).map((entry) => (
                        <button
                          key={entry.id}
                          onClick={() => handleRestoreHistory(entry)}
                          className="group flex flex-col gap-1.5 p-2.5 border border-(--navBorder) rounded-md hover:border-foreground/20 transition-all text-left hover:shadow-sm bg-background"
                        >
                          <div className="flex h-6 rounded overflow-hidden border border-(--navBorder)">
                            {entry.colors.map((c, i) => (
                              <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} />
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] text-foreground/30 font-bold truncate">
                              {MOODS[entry.mood]?.emoji} {entry.mood}
                            </span>
                            <span className="text-[7px] text-foreground/20 group-hover:text-(--brand) transition-colors font-bold uppercase">
                              Restore
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Toast */}
          {copied && !["hex", "css", "json"].includes(copied) && (
            <div className="absolute bottom-6 right-6 bg-foreground text-background px-4 py-2 rounded-full shadow-2xl z-50 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-bottom-2">
              ✓ Copied {copied}
            </div>
          )}
          {["hex", "css", "json"].includes(copied) && (
            <div className="absolute bottom-6 right-6 bg-foreground text-background px-4 py-2 rounded-full shadow-2xl z-50 text-[10px] font-bold uppercase tracking-widest">
              ✓ Copied as {copied.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}