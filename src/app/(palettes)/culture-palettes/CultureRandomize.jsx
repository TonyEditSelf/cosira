// CultureRandomize.jsx
import { useState, useMemo, useCallback } from "react";

import { hexToOklch } from "../custom-palettes/_components/Pickers/components/colorutil";

import {
  rand,
  clampOklch,
  generatePalette,
  getContrastInfo,
  stratifiedHues,
} from "./paletteUtils";

// ─── Palette definitions ───────────────────────────────────────────────────

const CULTURES = {
  // ── East Asia ──
  "Japanese Wabi-sabi": {
    emoji: "🪨",
    region: "East Asia",
    description: "Stone grey, moss, aged cedar, ink, soft white",
    hues: [[80, 130], [30, 55]],
    chroma: [0.01, 0.07],
    lightness: [0.22, 0.88],
    accent: "#8A8A7A",
    count: 5,
  },
  "Chinese Imperial": {
    emoji: "🏮",
    region: "East Asia",
    description: "Vermillion, imperial yellow, jade green, lacquer black",
    hues: [[0, 25], [45, 65], [155, 175]],
    chroma: [0.02, 0.26],
    lightness: [0.15, 0.78],
    accent: "#C41E3A",
    count: 5,
  },
  "Korean Joseon": {
    emoji: "🎎",
    region: "East Asia",
    description: "White linen, celadon green, deep indigo, natural earth",
    hues: [[155, 195], [230, 260], [40, 65]],
    chroma: [0.03, 0.12],
    lightness: [0.28, 0.88],
    accent: "#7BAAB0",
    count: 5,
  },

  // ── South Asia ──
  "Indian Festive": {
    emoji: "🪔",
    region: "South Asia",
    description: "Turmeric, saffron, vermillion, marigold, deep magenta",
    hues: [[20, 55], [0, 18], [310, 345]],
    chroma: [0.18, 0.30],
    lightness: [0.42, 0.72],
    accent: "#E8820C",
    count: 5,
  },
  "Rajasthani Desert": {
    emoji: "🐪",
    region: "South Asia",
    description: "Rose pink, turquoise, sand gold, royal blue, terracotta",
    hues: [[0, 20], [180, 215], [45, 65], [230, 260]],
    chroma: [0.12, 0.22],
    lightness: [0.45, 0.75],
    accent: "#D4507A",
    count: 5,
  },
  "Sri Lankan Spice": {
    emoji: "🌿",
    region: "South Asia",
    description: "Cinnamon, cardamom green, deep teal, warm ivory",
    hues: [[25, 50], [140, 175]],
    chroma: [0.08, 0.18],
    lightness: [0.35, 0.88],
    accent: "#A0522D",
    count: 5,
  },

  // ── Southeast Asia ──
  "Thai Royal": {
    emoji: "🏛️",
    region: "Southeast Asia",
    description: "Gold, deep purple, emerald, warm white, crimson",
    hues: [[45, 65], [270, 300], [145, 165], [0, 15]],
    chroma: [0.02, 0.24],
    lightness: [0.35, 0.88],
    accent: "#C9A84C",
    count: 5,
  },
  "Balinese Temple": {
    emoji: "🌺",
    region: "Southeast Asia",
    description: "Ochre stone, jungle green, volcanic black, lotus pink",
    hues: [[40, 65], [125, 160], [330, 355]],
    chroma: [0.01, 0.18],
    lightness: [0.14, 0.68],
    accent: "#8B7355",
    count: 5,
  },

  // ── Middle East & North Africa ──
  "Moroccan Souk": {
    emoji: "🕌",
    region: "Middle East & North Africa",
    description: "Terracotta, mosaic teal, saffron, deep indigo, dusty rose",
    hues: [[15, 35], [175, 200], [45, 65], [240, 265], [345, 360]],
    chroma: [0.05, 0.2],
    lightness: [0.28, 0.72],
    accent: "#C46A3A",
    count: 5,
  },
  "Persian Garden": {
    emoji: "🌹",
    region: "Middle East & North Africa",
    description: "Lapis blue, turquoise, rose, saffron, deep forest",
    hues: [[215, 250], [175, 200], [0, 20], [45, 65], [120, 145]],
    chroma: [0.1, 0.22],
    lightness: [0.32, 0.68],
    accent: "#2A5F8F",
    count: 5,
  },
  "Egyptian Ancient": {
    emoji: "🏺",
    region: "Middle East & North Africa",
    description: "Lapis, gold, sandstone, turquoise, ochre",
    hues: [[220, 255], [45, 65], [175, 195]],
    chroma: [0.05, 0.22],
    lightness: [0.35, 0.72],
    accent: "#1B4F8A",
    count: 5,
  },

  // ── Africa ──
  "West African Kente": {
    emoji: "🌍",
    region: "Africa",
    description: "Gold, green, red, black — bold, high contrast geometric",
    hues: [[45, 65], [130, 155], [0, 20]],
    chroma: [0.02, 0.28],
    lightness: [0.14, 0.75],
    accent: "#D4A017",
    count: 5,
  },
  "Maasai Savanna": {
    emoji: "🦁",
    region: "Africa",
    description: "Warm red, ochre, deep brown, sky blue, ivory",
    hues: [[0, 25], [40, 60], [200, 230]],
    chroma: [0.02, 0.22],
    lightness: [0.24, 0.88],
    accent: "#C0392B",
    count: 5,
  },

  // ── Latin America ──
  "Mexican Oaxacan": {
    emoji: "🎨",
    region: "Latin America",
    description: "Hot pink, electric blue, marigold, jade green, vermillion",
    hues: [[310, 345], [225, 255], [45, 65], [145, 170], [0, 20]],
    chroma: [0.18, 0.30],
    lightness: [0.42, 0.72],
    accent: "#E040A0",
    count: 5,
  },
  "Andean Textile": {
    emoji: "🦙",
    region: "Latin America",
    description: "Alpaca cream, deep indigo, coca red, sky blue, warm gold",
    hues: [[230, 265], [0, 20], [195, 220], [45, 65]],
    chroma: [0.04, 0.24],
    lightness: [0.35, 0.90],
    accent: "#4A3F8A",
    count: 5,
  },

  // ── Europe ──
  "Mediterranean Coastal": {
    emoji: "🏖️",
    region: "Europe",
    description: "Azure, terracotta, olive, white chalk, sun yellow",
    hues: [[195, 230], [15, 35], [80, 110], [45, 65]],
    chroma: [0.02, 0.2],
    lightness: [0.45, 0.92],
    accent: "#2980B9",
    count: 5,
  },
  "Scandinavian Folk": {
    emoji: "🌲",
    region: "Europe",
    description: "Dala red, birch white, navy, forest green, slate grey",
    hues: [[0, 15], [210, 240], [130, 155]],
    chroma: [0.02, 0.2],
    lightness: [0.28, 0.90],
    accent: "#C0392B",
    count: 5,
  },
  "Celtic Emerald": {
    emoji: "☘️",
    region: "Europe",
    description: "Emerald, golden amber, deep navy, heather grey, peat brown",
    hues: [[130, 160], [40, 60], [215, 245], [275, 305]],
    chroma: [0.02, 0.2],
    lightness: [0.28, 0.68],
    accent: "#2E8B57",
    count: 5,
  },
};

const FESTIVALS = {
  // ── India ──
  "Diwali": {
    emoji: "🪔",
    occasion: "Festival of Lights",
    region: "India",
    description: "Gold, deep magenta, royal purple, warm orange, crimson",
    hues: [[45, 65], [310, 345], [265, 290], [15, 35]],
    chroma: [0.16, 0.28],
    lightness: [0.38, 0.68],
    accent: "#FFD700",
    count: 5,
  },
  "Holi": {
    emoji: "🎨",
    occasion: "Festival of Colors",
    region: "India",
    description: "Pure saturated spectrum — every hue at peak vibrancy",
    hues: [[0, 360]],
    chroma: [0.22, 0.35],
    lightness: [0.48, 0.72],
    accent: "#FF1493",
    count: 5,
  },
  "Navratri": {
    emoji: "💃",
    occasion: "Nine Nights",
    region: "India",
    description: "Each night has a color — layered bright costume hues",
    hues: [[0, 360]],
    chroma: [0.16, 0.28],
    lightness: [0.45, 0.75],
    accent: "#FF6B35",
    count: 5,
  },

  // ── East Asia ──
  "Lunar New Year": {
    emoji: "🧨",
    occasion: "Chinese New Year",
    region: "East Asia",
    description: "Scarlet, imperial gold, black, jade — prosperity and luck",
    hues: [[0, 18], [45, 62], [145, 165]],
    chroma: [0.02, 0.30],
    lightness: [0.14, 0.65],
    accent: "#DC143C",
    count: 5,
  },
  "Sakura Season": {
    emoji: "🌸",
    occasion: "Cherry Blossom",
    region: "East Asia",
    description: "Blush pink, soft white, pale green, sky blue, warm beige",
    hues: [[0, 20], [340, 360], [120, 155], [200, 225], [40, 62]],
    chroma: [0.04, 0.12],
    lightness: [0.68, 0.92],
    accent: "#FFB7C5",
    count: 5,
  },
  "Tanabata": {
    emoji: "🎋",
    occasion: "Star Festival",
    region: "East Asia",
    description: "Midnight navy, silver, pale gold, deep violet, soft white",
    hues: [[215, 250], [265, 290], [45, 65]],
    chroma: [0.01, 0.18],
    lightness: [0.22, 0.90],
    accent: "#191970",
    count: 5,
  },

  // ── Middle East ──
  "Ramadan Nights": {
    emoji: "🌙",
    occasion: "Holy Month",
    region: "Middle East",
    description: "Deep teal, gold crescent, midnight navy, warm amber, star white",
    hues: [[175, 210], [45, 65], [220, 250]],
    chroma: [0.02, 0.2],
    lightness: [0.22, 0.88],
    accent: "#008080",
    count: 5,
  },

  // ── Americas ──
  "Día de los Muertos": {
    emoji: "💀",
    occasion: "Day of the Dead",
    region: "Mexico",
    description: "Marigold, hot pink, violet, cobalt, warm black",
    hues: [[45, 65], [310, 345], [265, 295], [210, 240]],
    chroma: [0.02, 0.30],
    lightness: [0.28, 0.72],
    accent: "#FF8C00",
    count: 5,
  },
  "Halloween": {
    emoji: "🎃",
    occasion: "All Hallows Eve",
    region: "Western",
    description: "Pumpkin orange, black, deep purple, sickly green, blood red",
    hues: [[20, 40], [265, 295], [120, 145], [0, 15]],
    chroma: [0.02, 0.26],
    lightness: [0.12, 0.65],
    accent: "#FF6600",
    count: 5,
  },

  // ── Europe ──
  "Christmas": {
    emoji: "🎄",
    occasion: "Winter Holiday",
    region: "Western",
    description: "Deep pine green, crimson, gold, ivory, midnight blue",
    hues: [[130, 160], [0, 18], [45, 65], [220, 250]],
    chroma: [0.02, 0.22],
    lightness: [0.22, 0.90],
    accent: "#165B33",
    count: 5,
  },
  "Midsommar": {
    emoji: "🌼",
    occasion: "Midsummer",
    region: "Scandinavia",
    description: "Meadow green, wildflower yellow, sky blue, white, soft lilac",
    hues: [[120, 155], [60, 85], [195, 225], [280, 310]],
    chroma: [0.06, 0.16],
    lightness: [0.62, 0.90],
    accent: "#FFD700",
    count: 5,
  },
  "Carnival Venice": {
    emoji: "🎭",
    occasion: "Venetian Carnival",
    region: "Europe",
    description: "Deep teal, gold, crimson, midnight, ivory mask",
    hues: [[175, 200], [45, 65], [0, 18], [240, 265]],
    chroma: [0.02, 0.24],
    lightness: [0.22, 0.78],
    accent: "#008B8B",
    count: 5,
  },

  // ── Africa & Caribbean ──
  "Rio Carnival": {
    emoji: "🎉",
    occasion: "Brazilian Carnival",
    region: "South America",
    description: "Electric green, vivid yellow, hot pink, cobalt blue, gold",
    hues: [[120, 150], [55, 75], [310, 345], [210, 240]],
    chroma: [0.22, 0.34],
    lightness: [0.45, 0.75],
    accent: "#00CC44",
    count: 5,
  },
  "Kwanzaa": {
    emoji: "🕯️",
    occasion: "African Heritage",
    region: "African Diaspora",
    description: "Black, red, green — unity, struggle, hope",
    hues: [[0, 18], [130, 155]],
    chroma: [0.02, 0.26],
    lightness: [0.12, 0.58],
    accent: "#CC0000",
    count: 5,
  },
};

// ─── Shared constants ───

const CONTRAST_MODES = [
  { id: "none",  label: "None", desc: "Free generation" },
  { id: "aa",   label: "AA",   desc: "≥ 4.5:1 on white or black" },
  { id: "aaa",  label: "AAA",  desc: "≥ 7:1 on white or black" },
];

const HARMONY_MODES = [
  { id: "free",           label: "Free",        desc: "Independent colors" },
  { id: "analogous",      label: "Analogous",   desc: "Adjacent hues ±30°" },
  { id: "complementary",  label: "Complementary", desc: "Opposite hues" },
  { id: "triadic",        label: "Triadic",     desc: "3 equidistant hues" },
  { id: "split",          label: "Split Comp",  desc: "Split complementary" },
];

const TABS = [
  { id: "cultures",  label: "Cultures",  emoji: "🌍" },
  { id: "festivals", label: "Festivals", emoji: "🎉" },
];

const MAX_HISTORY = 7;

// ─── Sub-components ───

function PaletteCard({ itemKey, item, isSelected, onSelect, showOccasion }) {
  return (
    <button
      onClick={() => onSelect(itemKey)}
      className={`w-full text-left px-3 py-2.5 rounded-md border transition-all flex items-center gap-2.5 group ${
        isSelected
          ? "border-(--brand) bg-foreground/[0.04] text-foreground"
          : "border-(--navBorder) hover:border-foreground/20 text-foreground/60 hover:text-foreground/80"
      }`}
    >
      <span className="text-base leading-none shrink-0">{item.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className={`text-[10px] font-bold leading-tight truncate ${isSelected ? "text-(--brand)" : ""}`}>
          {itemKey}
        </div>
        {showOccasion && item.occasion && (
          <div className="text-[8px] text-foreground/40 truncate mt-0.5 font-semibold">
            {item.occasion}
          </div>
        )}
        <div className="text-[8px] text-foreground/30 truncate mt-0.5">
          {item.description}
        </div>
      </div>
      <div
        className="w-3 h-3 rounded-full shrink-0 border border-black/10"
        style={{ backgroundColor: item.accent }}
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

// TO:
function VariationStrip({ baseColor, paletteDef }) {
  const { h } = hexToOklch(baseColor.hex);
  const variations = useMemo(() => {
    return [0.12, 0.28, 0.44, 0.58, 0.72, 0.86].map((l) => {
      const c = rand(paletteDef.chroma[0], paletteDef.chroma[1]);
      return clampOklch(l, c, h);
    });
  }, [baseColor.hex, paletteDef]);

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

// ─── Main Component ───

export default function CultureRandomize() {
  const [activeTab, setActiveTab]       = useState("cultures");
  const [selectedKey, setSelectedKey]   = useState("Japanese Wabi-sabi");
  const [harmony, setHarmony]           = useState("free");
  const [contrastMode, setContrastMode] = useState("none");
  const [count, setCount]               = useState(5);
  const [generated, setGenerated]       = useState([]);
  const [locks, setLocks]               = useState({});
  const [copied, setCopied]             = useState(null);
  const [history, setHistory]           = useState([]);
  const [expandedVariation, setExpandedVariation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const catalog = activeTab === "cultures" ? CULTURES : FESTIVALS;

  // Ensure selectedKey is valid for the current tab
  const activeKey = catalog[selectedKey] ? selectedKey : Object.keys(catalog)[0];
  const activeDef = catalog[activeKey];

  const lockedColors = useMemo(() => {
    const obj = {};
    Object.keys(locks).forEach((i) => {
      if (locks[i] && generated[i]) obj[i] = generated[i];
    });
    return obj;
  }, [locks, generated]);

  const generate = useCallback(
    (keyOverride, defOverride) => {
      const key = keyOverride || activeKey;
      const def = defOverride || catalog[key];
      setIsGenerating(true);
      setTimeout(() => {
        const colors = generatePalette(def, harmony, contrastMode, count, lockedColors);
        setGenerated(colors);
        setHistory((prev) => {
          const entry = { key, tab: activeTab, colors, id: Date.now() };
          return [entry, ...prev].slice(0, MAX_HISTORY);
        });
        setExpandedVariation(null);
        setIsGenerating(false);
      }, 80);
    },
    [activeKey, catalog, harmony, contrastMode, count, lockedColors, activeTab],
  );

  const handleSelect = (key) => {
    setSelectedKey(key);
    setLocks({});
    setExpandedVariation(null);
    if (generated.length > 0) {
      const def = catalog[key];
      generate(key, def);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    const newCatalog = tab === "cultures" ? CULTURES : FESTIVALS;
    const firstKey = Object.keys(newCatalog)[0];
    setSelectedKey(firstKey);
    setGenerated([]);
    setLocks({});
    setExpandedVariation(null);
  };

  const handleLock  = (index) => setLocks((prev) => ({ ...prev, [index]: !prev[index] }));

  const handleCopy  = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleCopyAll = (format) => {
    if (!generated.length) return;
    let output = "";
    if (format === "hex") {
      output = generated.map((c) => c.hex).join(", ");
    } else if (format === "css") {
      const vars = generated.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join("\n");
      output = `:root {\n${vars}\n}`;
    } else if (format === "json") {
      const data = generated.map((c) => {
        const { l, c: cc, h } = hexToOklch(c.hex);
        return { hex: c.hex, oklch: { l: +l.toFixed(3), c: +cc.toFixed(3), h: +h.toFixed(1) } };
      });
      output = JSON.stringify(data, null, 2);
    }
    navigator.clipboard.writeText(output);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

const handleRestoreHistory = (entry) => {
  setGenerated(entry.colors);
  setSelectedKey(entry.key);
  setActiveTab(entry.tab);
  setLocks({});
  setExpandedVariation(null);
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
                Culture & Festival
              </span>
              <div className="h-4 w-[1px] bg-(--navBorder)" />
              <span className="text-[9px] text-foreground/30">
                Culturally-grounded palette generation
              </span>
            </div>
            {generated.length > 0 && (
              <>
                <div className="h-4 w-[1px] bg-(--navBorder)" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-foreground/40 uppercase">Active</span>
                  <span className="text-[10px]">{activeDef.emoji}</span>
                  <span className="text-[10px] font-bold text-(--brand)">{activeKey}</span>
                  {activeDef.region && (
                    <span className="text-[9px] text-foreground/30">· {activeDef.region}</span>
                  )}
                  {activeDef.occasion && (
                    <span className="text-[9px] text-foreground/40 font-semibold">· {activeDef.occasion}</span>
                  )}
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

          {/* Export buttons */}
          <div className="flex items-center gap-2">
            {generated.length > 0 && (
              <>
                <button onClick={() => handleCopyAll("hex")} className="px-3 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors">
                  {copied === "hex" ? "✓ Copied" : "Copy HEX"}
                </button>
                <button onClick={() => handleCopyAll("css")} className="px-3 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors">
                  {copied === "css" ? "✓ Copied" : "CSS Vars"}
                </button>
                <button onClick={() => handleCopyAll("json")} className="px-3 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors">
                  {copied === "json" ? "✓ Copied" : "JSON"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-1 gap-2 mx-2 mb-2 min-h-0">

        {/* ── Left toolbar ── */}
        <div
          className="flex flex-col ml-2 border border-(--navBorder) rounded-md bg-foreground/[0.015] flex-shrink-0 min-h-0"
          style={{ width: "22%" }}
        >
          {/* Tab switcher */}
          <div className="p-2 border-b border-(--navBorder) flex-shrink-0">
            <div className="flex gap-1 p-0.5 bg-foreground/[0.04] rounded-md">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-[10px] font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-foreground/40 hover:text-foreground/70"
                  }`}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <div className="p-3 flex-shrink-0 border-b border-(--navBorder)">
            <button
              onClick={() => generate()}
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

            {/* Palette selector */}
            <div className="px-3 pt-3 pb-1">
              <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest">
                {activeTab === "cultures" ? "Culture" : "Festival"}
              </span>
            </div>
            <div className="px-3 pb-3 flex flex-col gap-1">
              {Object.entries(catalog).map(([key, item]) => (
                <PaletteCard
                  key={key}
                  itemKey={key}
                  item={item}
                  isSelected={activeKey === key}
                  onSelect={handleSelect}
                  showOccasion={activeTab === "festivals"}
                />
              ))}
            </div>

            <div className="mx-3 border-t border-(--navBorder) my-1" />

            {/* Count */}
            <div className="px-4 pt-3 pb-1">
              <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest">Colors</span>
            </div>
            <div className="px-3 pb-3">
              <div className="flex gap-1">
                {[3, 4, 5, 6, 7].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setCount(n);
                      setLocks({});
                      if (generated.length > 0) {
                        setIsGenerating(true);
                        setTimeout(() => {
                          const colors = generatePalette(activeDef, harmony, contrastMode, n, {});
                          setGenerated(colors);
                          setHistory((prev) => [{ key: activeKey, tab: activeTab, colors, id: Date.now() }, ...prev].slice(0, MAX_HISTORY));
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

            <div className="mx-3 border-t border-(--navBorder) my-1" />

            {/* Harmony */}
            <div className="px-4 pt-3 pb-1">
              <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest">Harmony</span>
            </div>
            <div className="px-3 pb-3 flex flex-col gap-1">
              {HARMONY_MODES.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    setHarmony(h.id);
                    if (generated.length > 0) {
                      setIsGenerating(true);
                      setTimeout(() => {
                        const colors = generatePalette(activeDef, h.id, contrastMode, count, lockedColors);
                        setGenerated(colors);
                        setHistory((prev) => [{ key: activeKey, tab: activeTab, colors, id: Date.now() }, ...prev].slice(0, MAX_HISTORY));
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

            <div className="mx-3 border-t border-(--navBorder) my-1" />

            {/* Contrast lock */}
            <div className="px-4 pt-3 pb-1">
              <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest">Contrast Lock</span>
            </div>
            <div className="px-3 pb-4 flex flex-col gap-1">
              {CONTRAST_MODES.map((cm) => (
                <button
                  key={cm.id}
                  onClick={() => {
                    setContrastMode(cm.id);
                    if (generated.length > 0) {
                      setIsGenerating(true);
                      setTimeout(() => {
                        const colors = generatePalette(activeDef, harmony, cm.id, count, lockedColors);
                        setGenerated(colors);
                        setHistory((prev) => [{ key: activeKey, tab: activeTab, colors, id: Date.now() }, ...prev].slice(0, MAX_HISTORY));
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
                <div className="text-5xl">{activeDef.emoji}</div>
                <div>
                  <div className="text-[13px] font-bold text-foreground/50 mb-1">{activeKey}</div>
                  {activeDef.occasion && (
                    <div className="text-[10px] text-foreground/40 font-semibold mb-1">{activeDef.occasion}</div>
                  )}
                  {activeDef.region && (
                    <div className="text-[9px] text-foreground/25 mb-1">{activeDef.region}</div>
                  )}
                  <div className="text-[10px] text-foreground/25">{activeDef.description}</div>
                </div>
                <button
                  onClick={() => generate()}
                  className="px-8 py-3 rounded-md font-bold text-[11px] uppercase tracking-widest border border-(--brand) text-(--brand) hover:bg-(--brand) hover:text-white transition-all"
                >
                  ✦ Generate Palette
                </button>
                <p className="text-[9px] text-foreground/20 max-w-xs">
                  Generates {count} colors constrained to authentic hue, chroma, and lightness ranges
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
                      {activeDef.emoji} {activeKey}
                      {activeDef.occasion && (
                        <span className="ml-2 font-semibold text-foreground/40 normal-case">
                          {activeDef.occasion}
                        </span>
                      )}
                      <span className="ml-2 font-normal">{activeDef.description}</span>
                    </span>
                    <span className="text-[8px] text-foreground/20">
                      {harmony !== "free" ? harmony : "free harmony"} · {contrastMode !== "none" ? contrastMode + " locked" : "no contrast lock"}
                    </span>
                  </div>
                  <PalettePreviewBar colors={generated} />
                </div>

                {/* Color cards */}
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
                    <span className="text-[8px] text-foreground/20">Click a color to explore its tonal scale</span>
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
                    <VariationStrip baseColor={generated[expandedVariation]} paletteDef={activeDef} />
                  )}
                </div>

                {/* History */}
                {history.length > 1 && (
                  <div className="space-y-3 pt-2 border-t border-(--navBorder)">
                    <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest block">
                      Generation History
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      {history.slice(1).map((entry) => {
                        const entryDef = (entry.tab === "cultures" ? CULTURES : FESTIVALS)[entry.key];
                        return (
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
                                {entryDef?.emoji} {entry.key}
                              </span>
                              <span className="text-[7px] text-foreground/20 group-hover:text-(--brand) transition-colors font-bold uppercase">
                                Restore
                              </span>
                            </div>
                          </button>
                        );
                      })}
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