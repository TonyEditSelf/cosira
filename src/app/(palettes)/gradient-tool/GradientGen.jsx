import { useState, useMemo, useCallback, useRef, useEffect } from "react";

// Lightweight chroma-like color utilities (no external dep needed for what we use)
function hexToRgb(hex) {
  const h = (hex || "").replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return [0, 0, 0];
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.round(Math.max(0, Math.min(255, v)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

function interpolateColor(hex1, hex2, t) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

function interpolateAtPosition(stops, pos) {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  if (pos <= sorted[0].position) return sorted[0].color;
  if (pos >= sorted[sorted.length - 1].position)
    return sorted[sorted.length - 1].color;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (pos >= sorted[i].position && pos <= sorted[i + 1].position) {
      const t =
        (pos - sorted[i].position) /
        (sorted[i + 1].position - sorted[i].position);
      return interpolateColor(sorted[i].color, sorted[i + 1].color, t);
    }
  }
  return stops[0].color;
}

function isValidHex(h) {
  return /^#[0-9a-fA-F]{6}$/.test(h);
}

function hexToRgba(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Angle → Tailwind direction map
const ANGLE_TO_TW = {
  0: "to-t",
  45: "to-tr",
  90: "to-r",
  135: "to-br",
  180: "to-b",
  225: "to-bl",
  270: "to-l",
  315: "to-tl",
};

// Module-level counter - safe for production; components use uidRef internally
let _uid = 3;
function uid() {
  return _uid++;
}

const PRESET_CATEGORIES = [
  {
    label: "🌅 Nature",
    presets: [
      {
        name: "Sunrise",
        stops: [
          { position: 0, color: "#ff6b6b", alpha: 1 },
          { position: 50, color: "#ffd93d", alpha: 1 },
          { position: 100, color: "#6bcf7f", alpha: 1 },
        ],
      },
      {
        name: "Ocean",
        stops: [
          { position: 0, color: "#667eea", alpha: 1 },
          { position: 100, color: "#764ba2", alpha: 1 },
        ],
      },
      {
        name: "Tropics",
        stops: [
          { position: 0, color: "#134e5e", alpha: 1 },
          { position: 100, color: "#71b280", alpha: 1 },
        ],
      },
      {
        name: "Leaf",
        stops: [
          { position: 0, color: "#11998e", alpha: 1 },
          { position: 100, color: "#38ef7d", alpha: 1 },
        ],
      },
      {
        name: "Blossom",
        stops: [
          { position: 0, color: "#ff9a9e", alpha: 1 },
          { position: 50, color: "#fecfef", alpha: 1 },
          { position: 100, color: "#fecfef", alpha: 1 },
        ],
      },
      {
        name: "Hibiscus",
        stops: [
          { position: 0, color: "#ee0979", alpha: 1 },
          { position: 100, color: "#ff6a00", alpha: 1 },
        ],
      },
      {
        name: "Moss",
        stops: [
          { position: 0, color: "#3d7a1e", alpha: 1 },
          { position: 100, color: "#a8d08d", alpha: 1 },
        ],
      },
      {
        name: "Aurora",
        stops: [
          { position: 0, color: "#00c9ff", alpha: 1 },
          { position: 50, color: "#52d9a4", alpha: 1 },
          { position: 100, color: "#a8ff78", alpha: 1 },
        ],
      },
    ],
  },
  {
    label: "🔥 Warm",
    presets: [
      {
        name: "Fire",
        stops: [
          { position: 0, color: "#f12711", alpha: 1 },
          { position: 100, color: "#f5af19", alpha: 1 },
        ],
      },
      {
        name: "Lava",
        stops: [
          { position: 0, color: "#200122", alpha: 1 },
          { position: 100, color: "#6f0000", alpha: 1 },
        ],
      },
      {
        name: "Peach",
        stops: [
          { position: 0, color: "#ffecd2", alpha: 1 },
          { position: 100, color: "#fcb69f", alpha: 1 },
        ],
      },
      {
        name: "Citrus",
        stops: [
          { position: 0, color: "#fc4a1a", alpha: 1 },
          { position: 100, color: "#f7b733", alpha: 1 },
        ],
      },
      {
        name: "Candy",
        stops: [
          { position: 0, color: "#d53369", alpha: 1 },
          { position: 100, color: "#daae51", alpha: 1 },
        ],
      },
      {
        name: "Dusk",
        stops: [
          { position: 0, color: "#fa709a", alpha: 1 },
          { position: 100, color: "#fee140", alpha: 1 },
        ],
      },
      {
        name: "Mango",
        stops: [
          { position: 0, color: "#ffe259", alpha: 1 },
          { position: 100, color: "#ffa751", alpha: 1 },
        ],
      },
      {
        name: "Ember",
        stops: [
          { position: 0, color: "#c94b4b", alpha: 1 },
          { position: 100, color: "#4b134f", alpha: 1 },
        ],
      },
    ],
  },
  {
    label: "🌊 Cool",
    presets: [
      {
        name: "Ice",
        stops: [
          { position: 0, color: "#83a4d4", alpha: 1 },
          { position: 100, color: "#b6fbff", alpha: 1 },
        ],
      },
      {
        name: "Arctic",
        stops: [
          { position: 0, color: "#dfe9f3", alpha: 1 },
          { position: 100, color: "#ffffff", alpha: 1 },
        ],
      },
      {
        name: "Teal",
        stops: [
          { position: 0, color: "#11998e", alpha: 1 },
          { position: 100, color: "#38ef7d", alpha: 1 },
        ],
      },
      {
        name: "Sapphire",
        stops: [
          { position: 0, color: "#1e3c72", alpha: 1 },
          { position: 100, color: "#2a69ac", alpha: 1 },
        ],
      },
      {
        name: "Aqua",
        stops: [
          { position: 0, color: "#13547a", alpha: 1 },
          { position: 100, color: "#80d0c7", alpha: 1 },
        ],
      },
      {
        name: "Steel",
        stops: [
          { position: 0, color: "#616161", alpha: 1 },
          { position: 100, color: "#9bc5c3", alpha: 1 },
        ],
      },
      {
        name: "Reef",
        stops: [
          { position: 0, color: "#00b4db", alpha: 1 },
          { position: 100, color: "#0083b0", alpha: 1 },
        ],
      },
      {
        name: "Frost",
        stops: [
          { position: 0, color: "#e0eafc", alpha: 1 },
          { position: 100, color: "#cfdef3", alpha: 1 },
        ],
      },
    ],
  },
  {
    label: "🔮 Vivid",
    presets: [
      {
        name: "Neon",
        stops: [
          { position: 0, color: "#7f00ff", alpha: 1 },
          { position: 100, color: "#e100ff", alpha: 1 },
        ],
      },
      {
        name: "Electric",
        stops: [
          { position: 0, color: "#0575e6", alpha: 1 },
          { position: 100, color: "#021b79", alpha: 1 },
        ],
      },
      {
        name: "Prism",
        stops: [
          { position: 0, color: "#ff0080", alpha: 1 },
          { position: 33, color: "#7928ca", alpha: 1 },
          { position: 66, color: "#0070f3", alpha: 1 },
          { position: 100, color: "#00dfd8", alpha: 1 },
        ],
      },
      {
        name: "Hypnotic",
        stops: [
          { position: 0, color: "#e942fb", alpha: 1 },
          { position: 50, color: "#4286f4", alpha: 1 },
          { position: 100, color: "#42f4b9", alpha: 1 },
        ],
      },
      {
        name: "Plasma",
        stops: [
          { position: 0, color: "#f953c6", alpha: 1 },
          { position: 100, color: "#b91d73", alpha: 1 },
        ],
      },
      {
        name: "Acid",
        stops: [
          { position: 0, color: "#b3ffab", alpha: 1 },
          { position: 100, color: "#12fff7", alpha: 1 },
        ],
      },
      {
        name: "Rave",
        stops: [
          { position: 0, color: "#fc00ff", alpha: 1 },
          { position: 100, color: "#00dbde", alpha: 1 },
        ],
      },
      {
        name: "Rainbow",
        stops: [
          { position: 0, color: "#ff0000", alpha: 1 },
          { position: 20, color: "#ff9900", alpha: 1 },
          { position: 40, color: "#ffee00", alpha: 1 },
          { position: 60, color: "#00ff00", alpha: 1 },
          { position: 80, color: "#0099ff", alpha: 1 },
          { position: 100, color: "#9900ff", alpha: 1 },
        ],
      },
    ],
  },
  {
    label: "🌑 Dark",
    presets: [
      {
        name: "Midnight",
        stops: [
          { position: 0, color: "#360033", alpha: 1 },
          { position: 100, color: "#0b8793", alpha: 1 },
        ],
      },
      {
        name: "Galaxy",
        stops: [
          { position: 0, color: "#2e1753", alpha: 1 },
          { position: 50, color: "#1f1746", alpha: 1 },
          { position: 100, color: "#0f0c29", alpha: 1 },
        ],
      },
      {
        name: "Obsidian",
        stops: [
          { position: 0, color: "#1a1a2e", alpha: 1 },
          { position: 100, color: "#16213e", alpha: 1 },
        ],
      },
      {
        name: "Abyss",
        stops: [
          { position: 0, color: "#0d0d0d", alpha: 1 },
          { position: 100, color: "#1a1a2e", alpha: 1 },
        ],
      },
      {
        name: "Phantom",
        stops: [
          { position: 0, color: "#0f0c29", alpha: 1 },
          { position: 50, color: "#302b63", alpha: 1 },
          { position: 100, color: "#24243e", alpha: 1 },
        ],
      },
      {
        name: "Void",
        stops: [
          { position: 0, color: "#200122", alpha: 1 },
          { position: 100, color: "#6f0000", alpha: 1 },
        ],
      },
      {
        name: "Carbon",
        stops: [
          { position: 0, color: "#1c1c1c", alpha: 1 },
          { position: 100, color: "#404040", alpha: 1 },
        ],
      },
      {
        name: "Onyx",
        stops: [
          { position: 0, color: "#141e30", alpha: 1 },
          { position: 100, color: "#243b55", alpha: 1 },
        ],
      },
    ],
  },
  {
    label: "🤍 Pastel",
    presets: [
      {
        name: "Cotton",
        stops: [
          { position: 0, color: "#ffecd2", alpha: 1 },
          { position: 100, color: "#fcb69f", alpha: 1 },
        ],
      },
      {
        name: "Lavender",
        stops: [
          { position: 0, color: "#e0c3fc", alpha: 1 },
          { position: 100, color: "#8ec5fc", alpha: 1 },
        ],
      },
      {
        name: "Mint",
        stops: [
          { position: 0, color: "#d4fc79", alpha: 1 },
          { position: 100, color: "#96e6a1", alpha: 1 },
        ],
      },
      {
        name: "Rose",
        stops: [
          { position: 0, color: "#fbc2eb", alpha: 1 },
          { position: 100, color: "#a18cd1", alpha: 1 },
        ],
      },
      {
        name: "Butter",
        stops: [
          { position: 0, color: "#ffeaa7", alpha: 1 },
          { position: 100, color: "#dfe6e9", alpha: 1 },
        ],
      },
      {
        name: "Baby Blue",
        stops: [
          { position: 0, color: "#a1c4fd", alpha: 1 },
          { position: 100, color: "#c2e9fb", alpha: 1 },
        ],
      },
      {
        name: "Blush",
        stops: [
          { position: 0, color: "#ffdde1", alpha: 1 },
          { position: 100, color: "#ee9ca7", alpha: 1 },
        ],
      },
      {
        name: "Lilac",
        stops: [
          { position: 0, color: "#d7aefb", alpha: 1 },
          { position: 100, color: "#a8edea", alpha: 1 },
        ],
      },
    ],
  },
];

// Flat list used by applyPreset
const PRESETS = PRESET_CATEGORIES.flatMap((c) => c.presets);

const LINEAR_DIRECTIONS = [
  { name: "→", angle: 90, label: "Left → Right" },
  { name: "←", angle: 270, label: "Right → Left" },
  { name: "↓", angle: 180, label: "Top → Bottom" },
  { name: "↑", angle: 0, label: "Bottom → Top" },
  { name: "↘", angle: 135, label: "TL → BR" },
  { name: "↙", angle: 225, label: "TR → BL" },
  { name: "↗", angle: 45, label: "BL → TR" },
  { name: "↖", angle: 315, label: "BR → TL" },
];

// FIX: Correct radial shape/size encoding to avoid split("-") collision
// We encode as "shape||size" and split on "||"
const RADIAL_VARIATIONS = [
  { shape: "circle", size: "closest-side", label: "Circle · Closest Side" },
  { shape: "circle", size: "farthest-side", label: "Circle · Farthest Side" },
  { shape: "circle", size: "closest-corner", label: "Circle · Closest Corner" },
  {
    shape: "circle",
    size: "farthest-corner",
    label: "Circle · Farthest Corner",
  },
  { shape: "ellipse", size: "closest-side", label: "Ellipse · Closest Side" },
  { shape: "ellipse", size: "farthest-side", label: "Ellipse · Farthest Side" },
  {
    shape: "ellipse",
    size: "closest-corner",
    label: "Ellipse · Closest Corner",
  },
  {
    shape: "ellipse",
    size: "farthest-corner",
    label: "Ellipse · Farthest Corner",
  },
];

function stopToCSS(stop) {
  if (stop.alpha < 1) {
    return `${hexToRgba(stop.color, stop.alpha)} ${stop.position}%`;
  }
  return `${stop.color} ${stop.position}%`;
}

export default function GradientGen() {
  const uidRef = useRef(3);
  const nextId = () => uidRef.current++;

  const [gradientType, setGradientType] = useState("linear");
  const [angle, setAngle] = useState(90);
  const [radialShape, setRadialShape] = useState("circle");
  const [radialSize, setRadialSize] = useState("farthest-corner");
  const [radialX, setRadialX] = useState(50);
  const [radialY, setRadialY] = useState(50);
  const [colorStops, setColorStops] = useState([
    { id: 1, position: 0, color: "#6366f1", alpha: 1 },
    { id: 2, position: 100, color: "#ec4899", alpha: 1 },
  ]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [copiedMsg, setCopiedMsg] = useState("");
  const [hexInputs, setHexInputs] = useState({});
  const [activeTab, setActiveTab] = useState("stops"); // "stops" | "presets"

  // ── History helpers ──────────────────────────────────────────
  // snapshot: call before any discrete mutation (add/remove/preset/reverse)
  const snapshot = useCallback((current) => {
    setHistory((h) => [...h.slice(-30), current]);
    setFuture([]);
  }, []);

  const undo = () => {
    if (!history.length) return;
    setFuture((f) => [colorStops, ...f]);
    setColorStops(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  const redo = () => {
    if (!future.length) return;
    setHistory((h) => [...h, colorStops]);
    setColorStops(future[0]);
    setFuture((f) => f.slice(1));
  };

  // ── CSS gradient string ───────────────────────────────────────
  const cssGradient = useMemo(() => {
    const sorted = [...colorStops].sort((a, b) => a.position - b.position);
    const stops = sorted.map(stopToCSS).join(", ");
    if (gradientType === "linear")
      return `linear-gradient(${angle}deg, ${stops})`;
    if (gradientType === "radial")
      return `radial-gradient(${radialShape} ${radialSize} at ${radialX}% ${radialY}%, ${stops})`;
    return `conic-gradient(from ${angle}deg, ${stops})`;
  }, [
    colorStops,
    gradientType,
    angle,
    radialShape,
    radialSize,
    radialX,
    radialY,
  ]);

  const fullCSS = `background: ${cssGradient};`;

  // ── Copy helpers ──────────────────────────────────────────────
  const copy = async (text, msg) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsg(msg);
    } catch {
      // Clipboard API failed (non-HTTPS or permission denied) — fallback
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopiedMsg(msg);
      } catch {
        setCopiedMsg("Copy failed — try Ctrl+C");
      }
    }
    setTimeout(() => setCopiedMsg(""), 2500);
  };

  const exportCSS = () => copy(fullCSS, "CSS copied!");

  const exportTailwind = () => {
    const sorted = [...colorStops].sort((a, b) => a.position - b.position);
    const from = sorted[0].color;
    const to = sorted[sorted.length - 1].color;
    const via = sorted.length === 3 ? sorted[1].color : null;
    const droppedMiddle = sorted.length > 3 ? sorted.length - 2 : 0;

    // Detect limitations
    const hasAlpha = sorted.some((s) => s.alpha < 1);
    // Stops with non-standard positions (not evenly spaced to within 1%)
    const hasCustomPositions = sorted.some((s, i, arr) => {
      const expected = Math.round((i / (arr.length - 1)) * 100);
      return Math.abs(s.position - expected) > 1;
    });

    let tw = "";
    if (gradientType === "linear") {
      const dir = ANGLE_TO_TW[angle];
      if (dir) {
        tw = `bg-gradient-${dir} from-[${from}]${via ? ` via-[${via}]` : ""} to-[${to}]`;
      } else {
        // Custom angle: must use full arbitrary CSS — include positions
        const stopList = sorted
          .map((s) => `${s.color}_${s.position}%`)
          .join(",");
        tw = `bg-[linear-gradient(${angle}deg,${stopList})]`;
      }
    } else {
      tw = `bg-[${cssGradient.replace(/\s+/g, "_")}]`;
    }

    // Build warning message
    const warnings = [];
    if (droppedMiddle > 0)
      warnings.push(
        `${droppedMiddle} middle stop${droppedMiddle > 1 ? "s" : ""} dropped`,
      );
    if (hasCustomPositions && gradientType === "linear" && ANGLE_TO_TW[angle])
      warnings.push("stop positions ignored");
    if (hasAlpha) warnings.push("opacity not supported in Tailwind stops");

    const msg =
      warnings.length > 0
        ? `Tailwind copied (⚠ ${warnings.join(", ")})`
        : "Tailwind copied!";
    copy(tw, msg);
  };

  const exportSVG = () => {
    const sorted = [...colorStops].sort((a, b) => a.position - b.position);
    const stopEls = sorted
      .map(
        (s) =>
          `    <stop offset="${s.position}%" stop-color="${s.color}" stop-opacity="${s.alpha}"/>`,
      )
      .join("\n");

    // CSS angle → SVG vector coords (CSS: 0deg=bottom→top, 90deg=left→right)
    const rad = ((angle - 90) * Math.PI) / 180;
    const x2 = +(0.5 + Math.cos(rad) * 0.5).toFixed(4);
    const y2 = +(0.5 + Math.sin(rad) * 0.5).toFixed(4);
    const x1 = +(1 - x2).toFixed(4);
    const y1 = +(1 - y2).toFixed(4);

    // SVG radial: compute r to match CSS radial-gradient sizing on 400×200 canvas
    const W = 400,
      H = 200;
    const cx = W * (radialX / 100);
    const cy = H * (radialY / 100);
    const svgDiagUnit = Math.sqrt((W * W + H * H) / 2); // SVG % reference for r

    let rPx;
    if (radialSize.includes("corner")) {
      // corner variants: distance to nearest/farthest corner
      const cornerDists = [
        Math.hypot(cx, cy),
        Math.hypot(W - cx, cy),
        Math.hypot(cx, H - cy),
        Math.hypot(W - cx, H - cy),
      ];
      rPx = radialSize.startsWith("farthest")
        ? Math.max(...cornerDists)
        : Math.min(...cornerDists);
    } else {
      // side variants: distance to nearest/farthest edge
      const sideDists = [cx, W - cx, cy, H - cy];
      rPx = radialSize.startsWith("farthest")
        ? Math.max(...sideDists)
        : Math.min(...sideDists);
    }
    const rPct = ((rPx / svgDiagUnit) * 100).toFixed(1);

    let gradientEl = "";
    if (gradientType === "linear") {
      gradientEl = `<linearGradient id="g" x1="${(x1 * 100).toFixed(2)}%" y1="${(y1 * 100).toFixed(2)}%" x2="${(x2 * 100).toFixed(2)}%" y2="${(y2 * 100).toFixed(2)}%">\n${stopEls}\n    </linearGradient>`;
    } else if (gradientType === "radial") {
      gradientEl = `<radialGradient id="g" cx="${radialX}%" cy="${radialY}%" r="${rPct}%">\n${stopEls}\n    </radialGradient>`;
    } else {
      gradientEl = `<!-- SVG does not support conic gradients. Exported as linear fallback. -->\n    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">\n${stopEls}\n    </linearGradient>`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
  <defs>
    ${gradientEl}
  </defs>
  <rect width="400" height="200" fill="url(#g)"/>
</svg>`;
    const note =
      gradientType === "conic"
        ? "SVG copied (conic → linear fallback)"
        : gradientType === "radial"
          ? "SVG copied (radial approximated)"
          : "SVG copied!";
    copy(svg, note);
  };

  // ── Stop mutations ────────────────────────────────────────────
  // Discrete ops (add/remove/preset/reverse) → snapshot first
  const setStopsWithHistory = (next) => {
    snapshot(colorStops);
    setColorStops(next);
  };

  // Live ops (slider drag, color pick) → update directly, NO history per tick
  // History is snapshotted on pointerdown via onCommit callback
  const updateStop = (id, field, value) => {
    setColorStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  // Called on mouseup / blur to commit a slider change into history
  const commitStopToHistory = () => {
    snapshot(colorStops);
  };

  const addStop = () => {
    const sorted = [...colorStops].sort((a, b) => a.position - b.position);
    let maxGap = 0,
      gapPos = 50;
    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = sorted[i + 1].position - sorted[i].position;
      if (gap > maxGap) {
        maxGap = gap;
        gapPos = sorted[i].position + gap / 2;
      }
    }
    const newPos = Math.round(gapPos);
    const newColor = interpolateAtPosition(colorStops, newPos);
    setStopsWithHistory([
      ...colorStops,
      { id: nextId(), position: newPos, color: newColor, alpha: 1 },
    ]);
  };

  const removeStop = (id) => {
    if (colorStops.length <= 2) return;
    setStopsWithHistory(colorStops.filter((s) => s.id !== id));
  };

  const reverseGradient = () => {
    setStopsWithHistory(
      colorStops.map((s) => ({ ...s, position: 100 - s.position })),
    );
  };

  const applyPreset = (preset) => {
    setStopsWithHistory(preset.stops.map((s) => ({ id: nextId(), ...s })));
  };

  // ── Hex input handling (validated, debounced) ─────────────────
  const handleHexInput = (id, raw) => {
    setHexInputs((prev) => ({ ...prev, [id]: raw }));
    if (isValidHex(raw)) updateStop(id, "color", raw);
  };

  const hexDisplay = (stop) =>
    hexInputs[stop.id] !== undefined ? hexInputs[stop.id] : stop.color;

  const commitHex = (id) => {
    setHexInputs((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  };

  // ── Radial select encode/decode (using "||" separator) ───────
  const radialValue = `${radialShape}||${radialSize}`;
  const handleRadialChange = (val) => {
    const [shape, size] = val.split("||");
    setRadialShape(shape);
    setRadialSize(size);
  };

  const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="flex flex-col gap-3 flex-1 m-2 overflow-hidden">
        {/* ── TOP TOOLBAR ─────────────────────────────────────── */}
        <div className="p-3 border border-(--navBorder) rounded-md bg-foreground/[0.015] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Type */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                Type
              </span>
              <div className="flex bg-foreground/5 p-0.5 rounded border border-(--navBorder)">
                {["linear", "radial", "conic"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setGradientType(t)}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded transition-all uppercase ${gradientType === t ? "bg-background text-(--brand) shadow-sm" : "text-foreground/50"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Linear Directions */}
            {gradientType === "linear" && (
              <div className="flex items-center gap-2 pl-3 border-l border-(--navBorder)">
                <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                  Direction
                </span>
                <div className="flex gap-1">
                  {LINEAR_DIRECTIONS.map((dir) => (
                    <button
                      key={dir.angle}
                      onClick={() => setAngle(dir.angle)}
                      title={dir.label}
                      className={`w-7 h-7 flex items-center justify-center text-sm border rounded transition-all ${angle === dir.angle ? "bg-(--brand) text-white border-(--brand)" : "border-(--navBorder) hover:border-(--brand) text-foreground/60"}`}
                    >
                      {dir.name}
                    </button>
                  ))}
                </div>
                {/* Custom angle input */}
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) =>
                    setAngle(
                      Math.max(0, Math.min(360, parseInt(e.target.value) || 0)),
                    )
                  }
                  className="w-14 px-2 py-0.5 text-[9px] font-mono font-bold bg-foreground/5 border border-(--navBorder) rounded focus:outline-none focus:border-(--brand)"
                />
                <span className="text-[9px] text-foreground/40">°</span>
              </div>
            )}

            {/* Radial Variation + Position */}
            {gradientType === "radial" && (
              <div className="flex items-center gap-3 pl-3 border-l border-(--navBorder)">
                <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                  Shape
                </span>
                {/* FIX: use "||" separator to avoid collision with "closest-corner" etc */}
                <select
                  value={radialValue}
                  onChange={(e) => handleRadialChange(e.target.value)}
                  className="px-2 py-1 text-[9px] font-bold bg-foreground/5 border border-(--navBorder) rounded focus:outline-none focus:border-(--brand) cursor-pointer"
                >
                  {RADIAL_VARIATIONS.map((v) => (
                    <option
                      key={`${v.shape}||${v.size}`}
                      value={`${v.shape}||${v.size}`}
                    >
                      {v.label}
                    </option>
                  ))}
                </select>
                <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                  Center
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-foreground/40">X</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={radialX}
                    onChange={(e) => setRadialX(+e.target.value)}
                    className="w-16 h-1 cursor-pointer accent-(--brand)"
                  />
                  <span className="text-[9px] font-mono text-(--brand) w-7">
                    {radialX}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-foreground/40">Y</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={radialY}
                    onChange={(e) => setRadialY(+e.target.value)}
                    className="w-16 h-1 cursor-pointer accent-(--brand)"
                  />
                  <span className="text-[9px] font-mono text-(--brand) w-7">
                    {radialY}%
                  </span>
                </div>
              </div>
            )}

            {/* Conic Angle */}
            {gradientType === "conic" && (
              <div className="flex items-center gap-2 pl-3 border-l border-(--navBorder)">
                <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                  Start Angle
                </span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(parseInt(e.target.value))}
                  className="w-24 h-1 cursor-pointer accent-(--brand)"
                />
                <span className="text-[9px] font-mono font-bold text-(--brand) w-8">
                  {angle}°
                </span>
              </div>
            )}

            {/* Reverse */}
            <div className="flex items-center gap-2 pl-3 border-l border-(--navBorder)">
              <button
                onClick={reverseGradient}
                title="Reverse gradient"
                className="px-2 py-1 text-[9px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
              >
                ⇄ Reverse
              </button>
            </div>

            {/* Undo / Redo */}
            <div className="flex items-center gap-1 pl-3 border-l border-(--navBorder)">
              <button
                onClick={undo}
                disabled={!history.length}
                title="Undo"
                className="px-2 py-1 text-[9px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors disabled:opacity-30"
              >
                ↩
              </button>
              <button
                onClick={redo}
                disabled={!future.length}
                title="Redo"
                className="px-2 py-1 text-[9px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors disabled:opacity-30"
              >
                ↪
              </button>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSS}
              className="px-2.5 py-1 text-[9px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
            >
              CSS
            </button>
            <button
              onClick={exportTailwind}
              className="px-2.5 py-1 text-[9px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
            >
              Tailwind
            </button>
            <button
              onClick={exportSVG}
              className="px-2.5 py-1 text-[9px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
            >
              SVG
            </button>
          </div>
        </div>

        {/* ── MAIN SPLIT LAYOUT ───────────────────────────────── */}
        <div className="flex-1 border border-(--navBorder) rounded-md overflow-hidden relative flex">
          {/* LEFT SIDEBAR */}
          <div className="w-80 border-r border-(--navBorder) bg-foreground/[0.02] flex flex-col">
            {/* Tab switcher */}
            <div className="flex border-b border-(--navBorder)">
              {["stops", "presets"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest transition-colors ${activeTab === tab ? "text-(--brand) border-b-2 border-(--brand)" : "text-foreground/40"}`}
                >
                  {tab === "stops"
                    ? `Color Stops (${colorStops.length})`
                    : `Presets (${PRESETS.length})`}
                </button>
              ))}
            </div>

            {/* Stops tab */}
            {activeTab === "stops" && (
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-3">
                <button
                  onClick={addStop}
                  className="w-full py-1.5 text-[9px] font-bold bg-(--brand) text-white rounded hover:opacity-90 transition-opacity uppercase tracking-wide"
                >
                  + Add Color Stop
                </button>

                {/* Gradient bar with draggable stop indicators */}
                <GradientBar
                  stops={sortedStops}
                  gradient={cssGradient}
                  onPositionChange={(id, pos) =>
                    updateStop(id, "position", pos)
                  }
                  onCommit={commitStopToHistory}
                />

                {sortedStops.map((stop) => (
                  <StopCard
                    key={stop.id}
                    stop={stop}
                    hexVal={hexDisplay(stop)}
                    canRemove={colorStops.length > 2}
                    onRemove={() => removeStop(stop.id)}
                    onColorChange={(v) => updateStop(stop.id, "color", v)}
                    onHexInput={(v) => handleHexInput(stop.id, v)}
                    onHexBlur={() => {
                      commitHex(stop.id);
                      commitStopToHistory();
                    }}
                    onPositionChange={(v) => updateStop(stop.id, "position", v)}
                    onPositionCommit={commitStopToHistory}
                    onAlphaChange={(v) => updateStop(stop.id, "alpha", v)}
                    onAlphaCommit={commitStopToHistory}
                  />
                ))}
              </div>
            )}

            {/* Presets tab */}
            {activeTab === "presets" && (
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {PRESET_CATEGORIES.map((cat) => (
                  <div key={cat.label}>
                    {/* Category label */}
                    <div className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest mb-2 px-0.5">
                      {cat.label}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {cat.presets.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            applyPreset(p);
                            setActiveTab("stops");
                          }}
                          className="group rounded-lg overflow-hidden border border-(--navBorder) hover:border-(--brand) transition-all flex flex-col"
                          style={{
                            background: `linear-gradient(135deg, ${p.stops.map((s) => s.color).join(", ")})`,
                          }}
                        >
                          {/* Color swatch area */}
                          <div className="h-10 w-full" />
                          {/* Name strip — always visible, solid bg */}
                          <div className="w-full bg-background/90 backdrop-blur-sm px-2 py-1 border-t border-(--navBorder)/50 group-hover:bg-background transition-colors">
                            <span className="text-[9px] font-bold text-foreground/80 leading-none block">
                              {p.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PREVIEW */}
          <div className="flex-1 p-5 flex flex-col gap-4">
            {/* Main preview */}
            <div className="flex-1 relative">
              <div
                className="absolute inset-0 rounded-2xl border-2 border-(--navBorder) shadow-2xl cursor-pointer transition-all hover:border-(--brand)/50 hover:shadow-xl"
                style={{ background: cssGradient }}
                onClick={() => copy(cssGradient, "Gradient copied!")}
                title="Click to copy CSS gradient value"
              />
            </div>

            {/* Mini previews — shapes */}
            <div className="flex items-end justify-center gap-4 px-2 py-3 rounded-xl bg-foreground/[0.03] border border-(--navBorder)">
              {/* Button */}
              <div className="flex flex-col items-center gap-2">
                <button
                  className="relative px-5 py-2 rounded-full text-[11px] font-bold tracking-wide overflow-hidden"
                  style={{
                    background: cssGradient,
                    boxShadow:
                      "0 4px 15px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  <span className="relative z-10 text-white drop-shadow-sm">
                    Button
                  </span>
                </button>
                <span className="text-[8px] font-semibold text-foreground/30 uppercase tracking-widest">
                  Button
                </span>
              </div>

              {/* Card */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-16 h-16 rounded-2xl"
                  style={{
                    background: cssGradient,
                    boxShadow:
                      "0 8px 24px -4px rgba(0,0,0,0.22), 0 2px 8px -2px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                />
                <span className="text-[8px] font-semibold text-foreground/30 uppercase tracking-widest">
                  Card
                </span>
              </div>

              {/* Circle */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-14 h-14 rounded-full"
                  style={{
                    background: cssGradient,
                    boxShadow:
                      "0 6px 20px -4px rgba(0,0,0,0.25), 0 2px 6px -2px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <span className="text-[8px] font-semibold text-foreground/30 uppercase tracking-widest">
                  Circle
                </span>
              </div>

              {/* Bar */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col gap-1.5">
                  <div
                    className="w-28 h-2.5 rounded-full"
                    style={{
                      background: cssGradient,
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}
                  />
                  <div
                    className="w-20 h-2.5 rounded-full opacity-70"
                    style={{
                      background: cssGradient,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                    }}
                  />
                  <div
                    className="w-24 h-2.5 rounded-full opacity-40"
                    style={{
                      background: cssGradient,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    }}
                  />
                </div>
                <span className="text-[8px] font-semibold text-foreground/30 uppercase tracking-widest">
                  Bars
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col items-center gap-2">
                <div
                  key={gradientType}
                  className="text-2xl font-black tracking-tight select-none"
                  style={{
                    backgroundImage: cssGradient,
                    backgroundSize: "100%",
                    backgroundRepeat: "no-repeat",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
                  }}
                >
                  Aa
                </div>
                <span className="text-[8px] font-semibold text-foreground/30 uppercase tracking-widest">
                  Text
                </span>
              </div>
            </div>

            {/* CSS output */}
            <div
              className="p-3 bg-foreground/[0.02] rounded-lg border border-(--navBorder) cursor-pointer hover:border-(--brand)/50 transition-colors"
              onClick={exportCSS}
              title="Click to copy CSS"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-bold text-foreground/30 uppercase tracking-widest">
                  CSS Output
                </span>
                <span className="text-[8px] text-foreground/30">
                  click to copy
                </span>
              </div>
              <code className="text-[9px] font-mono text-foreground/60 break-all">
                {fullCSS}
              </code>
            </div>
          </div>

          {/* Toast */}
          {copiedMsg && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-full shadow-2xl z-50 text-[9px] font-bold uppercase tracking-widest pointer-events-none">
              {copiedMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Gradient bar with draggable thumb indicators ───────────────
function GradientBar({ stops, gradient, onPositionChange, onCommit }) {
  const barRef = useRef(null);
  const dragging = useRef(null);
  // Store callbacks in refs so event listeners always see latest values
  const onPositionChangeRef = useRef(onPositionChange);
  const onCommitRef = useRef(onCommit);
  useEffect(() => {
    onPositionChangeRef.current = onPositionChange;
  }, [onPositionChange]);
  useEffect(() => {
    onCommitRef.current = onCommit;
  }, [onCommit]);

  // Stable handlers — created once, never stale
  const handleMouseMove = useRef((e) => {
    if (!dragging.current || !barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const pos = Math.round(
      Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
    );
    onPositionChangeRef.current(dragging.current, pos);
  }).current;

  const handleMouseUp = useRef(() => {
    if (dragging.current !== null) onCommitRef.current?.();
    dragging.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp); // eslint-disable-line no-use-before-define
  }).current;

  const handleMouseDown = (e, id) => {
    e.preventDefault();
    dragging.current = id;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={barRef}
      className="relative h-6 rounded-lg border border-(--navBorder) overflow-visible mx-1"
      style={{ background: gradient }}
    >
      {stops.map((stop) => (
        <div
          key={stop.id}
          style={{
            left: `${stop.position}%`,
            backgroundColor: stop.color,
            transform: "translateX(-50%)",
          }}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-grab active:cursor-grabbing z-10 ring-1 ring-black/20"
          onMouseDown={(e) => handleMouseDown(e, stop.id)}
          title={`${stop.color} @ ${stop.position}%`}
        />
      ))}
    </div>
  );
}

// ── Single stop card ───────────────────────────────────────────
function StopCard({
  stop,
  hexVal,
  canRemove,
  onRemove,
  onColorChange,
  onHexInput,
  onHexBlur,
  onPositionChange,
  onPositionCommit,
  onAlphaChange,
  onAlphaCommit,
}) {
  const hexInvalid = !isValidHex(hexVal);

  return (
    <div className="group bg-background p-3 rounded-lg border border-(--navBorder) hover:border-(--brand)/50 transition-all">
      {/* Color row */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="color"
          value={stop.color}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-(--navBorder) hover:border-(--brand) transition-colors flex-shrink-0"
        />
        <input
          type="text"
          value={hexVal}
          onChange={(e) =>
            onHexInput(
              e.target.value.startsWith("#")
                ? e.target.value
                : "#" + e.target.value,
            )
          }
          onBlur={onHexBlur}
          className={`flex-1 px-2 py-1.5 text-[10px] font-mono font-bold bg-foreground/5 border rounded-lg focus:outline-none transition-colors uppercase ${hexInvalid ? "border-red-400 text-red-400" : "border-(--navBorder) focus:border-(--brand)"}`}
          placeholder="#000000"
          maxLength={7}
        />
        {canRemove && (
          <button
            onClick={onRemove}
            className="w-7 h-7 flex items-center justify-center text-[10px] font-bold text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
          >
            ✕
          </button>
        )}
      </div>

      {/* Position */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-wider w-14">
          Position
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={stop.position}
          onChange={(e) => onPositionChange(parseInt(e.target.value))}
          onMouseUp={onPositionCommit}
          onTouchEnd={onPositionCommit}
          className="flex-1 h-1 cursor-pointer accent-(--brand)"
        />
        <span className="text-[9px] font-mono font-bold text-(--brand) w-8 text-right">
          {stop.position}%
        </span>
      </div>

      {/* Alpha */}
      <div className="flex items-center gap-2">
        <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-wider w-14">
          Opacity
        </span>
        <div className="flex-1 relative h-4 flex items-center">
          {/* Checkerboard bg for alpha slider */}
          <div
            className="absolute inset-0 rounded"
            style={{
              backgroundImage:
                "repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%)",
              backgroundSize: "8px 8px",
            }}
          />
          <div
            className="absolute inset-0 rounded"
            style={{
              background: `linear-gradient(to right, transparent, ${stop.color})`,
            }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={stop.alpha}
            onChange={(e) => onAlphaChange(parseFloat(e.target.value))}
            onMouseUp={onAlphaCommit}
            onTouchEnd={onAlphaCommit}
            className="relative w-full h-1 cursor-pointer accent-(--brand) z-10 opacity-0"
          />
          {/* Thumb: lerp left from 0 (alpha=0) to calc(100%-12px) (alpha=1) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow pointer-events-none"
            style={{
              left:
                stop.alpha === 0
                  ? "0px"
                  : stop.alpha === 1
                    ? "calc(100% - 12px)"
                    : `calc(${stop.alpha * 100}% - ${stop.alpha * 12}px)`,
              backgroundColor: stop.color,
            }}
          />
        </div>
        <span className="text-[9px] font-mono font-bold text-(--brand) w-8 text-right">
          {Math.round(stop.alpha * 100)}%
        </span>
      </div>
    </div>
  );
}
