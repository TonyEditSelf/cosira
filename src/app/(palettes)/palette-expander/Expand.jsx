import React, { useMemo, useState } from "react";
import { generateExpandedPalette, getContrastRatio } from "./colorexpansion";
import { useColorPaletteContext } from "../ColorContext";

function getContrastText(background) {
  const white = { l: 1, c: 0, h: 0 };
  const black = { l: 0, c: 0, h: 0 };
  const ratioWhite = getContrastRatio(background, white);
  const ratioBlack = getContrastRatio(background, black);

  // Use a clear threshold: if background is dark (L < 0.5), use white
  // If background is light (L >= 0.5), use black
  if (background.l < 0.5) {
    return "white";
  }

  // For light backgrounds, verify black has good contrast
  if (ratioBlack >= 4.5) {
    return "black";
  }

  // Fallback to white if black doesn't work
  return "white";
}

function ensureContrast(foreground, background, minRatio = 4.5) {
  const ratio = getContrastRatio(foreground, background);

  if (ratio >= minRatio) return foreground;

  // If contrast is insufficient, use pure white or black
  const white = { l: 1, c: 0, h: 0 };
  const black = { l: 0, c: 0, h: 0 };

  const whiteBg = getContrastRatio(white, background);
  const blackBg = getContrastRatio(black, background);

  // Return whichever gives better contrast
  return whiteBg > blackBg ? white : black;
}

function getContrastLevel(ratio) {
  if (ratio >= 7) return { level: "AAA", color: "green" };
  if (ratio >= 4.5) return { level: "AA", color: "blue" };
  if (ratio >= 3) return { level: "AA Large", color: "yellow" };
  return { level: "Fail", color: "red" };
}

function getNeutralColor(baseColor, tokenValue) {
  // Reduces chroma significantly to create a "tinted gray"
  // and aligns lightness with the token scale
  return {
    ...baseColor,
    c: Math.min(baseColor.c, 0.015),
    l: (1000 - tokenValue) / 1000,
  };
}

function oklchToCss(color) {
  const { l, c, h, a = 1 } = color;
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)} / ${a})`;
}

function oklchToHex(color) {
  const { l, c, h } = color;
  const hRad = (h * Math.PI) / 180;
  const a_ = c * Math.cos(hRad);
  const b_ = c * Math.sin(hRad);
  const l_ = l + 0.3963 * a_ + 0.2158 * b_;
  const m_ = l - 0.1055 * a_ - 0.0638 * b_;
  const s_ = l - 0.0894 * a_ - 1.2914 * b_;
  const r = Math.max(
    0,
    Math.min(
      1,
      4.076 * l_ * l_ * l_ - 3.307 * m_ * m_ * m_ + 0.23 * s_ * s_ * s_,
    ),
  );
  const g = Math.max(
    0,
    Math.min(
      1,
      -1.26 * l_ * l_ * l_ + 2.6 * m_ * m_ * m_ - 0.34 * s_ * s_ * s_,
    ),
  );
  const b = Math.max(
    0,
    Math.min(
      1,
      -0.004 * l_ * l_ * l_ - 0.7 * m_ * m_ * m_ + 1.7 * s_ * s_ * s_,
    ),
  );
  const toHex = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

const roleTokenMap = {
  Backgrounds: {
    background: 50, // L=98% - very light ✓
    "background-subtle": 100, // L=95% - very light ✓
    "background-muted": 200, // L=90% - light ✓
  },
  Surfaces: {
    surface: 100, // L=95%
    "surface-raised": 50, // L=98%
    "surface-overlay": 50, // L=98%
  },
  Borders: {
    border: 500, // L=73% ← CHANGED from 300
    "border-strong": 600, // L=40% ← CHANGED from 400
    "border-active": 700, // L=30% ← CHANGED from 500
    "border-focus": 800, // L=20% ← CHANGED from 600
  },
  Text: {
    "text-subtle": 700, // L=30% ← CHANGED from 400
    text: 800, // L=20% ← CHANGED from 600
    "text-strong": 900, // L=12% ← CHANGED from 700
    "text-inverse": 50, // L=98% (for dark backgrounds)
  },
  Interactive: {
    "interactive-default": 700, // ← CHANGED from 600 (L=30% instead of 40%)
    "interactive-hover": 800, // ← CHANGED from 700 (L=20% instead of 30%)
    "interactive-active": 800, // Stays same
    "interactive-disabled": 300,
  },
  Status: {
    success: 800, // L=20% ← CHANGED from 700 (was 30%)
    "success-subtle": 100,
    warning: 700, // L=30% ← CHANGED from 600 (was 40%)
    "warning-subtle": 100,
    error: 800, // L=20% ← CHANGED from 700 (was 30%)
    "error-subtle": 100,
    info: 700, // L=30% ← CHANGED from 600 (was 40%)
    "info-subtle": 100,
  },
  Fills: {
    "fill-subtle": 200, // L=90%
    fill: 600, // L=40% ← CHANGED from 500
    "fill-strong": 700, // L=30% ← CHANGED from 600
  },
  Accents: {
    accent: 500, // ← CHANGED from 600 (L=73% instead of 40%)
    "accent-subtle": 200,
    "accent-strong": 800,
  },
  Icons: {
    icon: 700, // L=30% ← CHANGED from 600
    "icon-subtle": 500, // L=73% ← CHANGED from 400
    "icon-strong": 900, // L=12% ← CHANGED from 700
  },
  Decorative: {
    "decorative-light": 300,
    decorative: 600, // L=40% ← CHANGED from 500
    "decorative-dark": 800, // L=20% ← CHANGED from 700
  },
  Neutrals: {
    "neutral-subtle": 50,
    "neutral-muted": 200,
    "neutral-default": 600, // L=40% ← CHANGED from 500
    "neutral-strong": 800, // L=20% ← CHANGED from 700
    "neutral-surface": 100,
  },
};

const statusHueMap = { success: 145, warning: 85, error: 25, info: 250 };

function UsageRole({ name, scale, currentToken, onTokenChange }) {
  const [copied, setCopied] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const color = useMemo(() => {
    const baseColor = scale[currentToken];
    const statusKey = Object.keys(statusHueMap).find((key) =>
      name.startsWith(key),
    );
    if (statusKey) {
      return {
        ...baseColor,
        h: statusHueMap[statusKey],
        c: Math.max(baseColor.c, 0.12),
      };
    }

    if (name.startsWith("neutral")) {
      return { ...baseColor, c: Math.min(baseColor.c, 0.012) };
    }

    return baseColor;
  }, [name, scale, currentToken]);

  const contrastRatio = useMemo(() => {
    const white = { l: 1, c: 0, h: 0 };
    const black = { l: 0, c: 0, h: 0 };
    const ratioWhite = getContrastRatio(color, white);
    const ratioBlack = getContrastRatio(color, black);
    return Math.max(ratioWhite, ratioBlack).toFixed(1);
  }, [color]);

  const contrastText = getContrastText(color);
  const isLowContrast = parseFloat(contrastRatio) < 4.5;

  const tokens = Object.keys(scale)
    .map(Number)
    .sort((a, b) => a - b);
  const currentIndex = tokens.indexOf(Number(currentToken));
  const alternatives = tokens.slice(
    Math.max(0, currentIndex - 1),
    currentIndex + 2,
  );

  const copy = (type, e) => {
    e.stopPropagation();
    const val = type === "hex" ? oklchToHex(color) : oklchToCss(color);
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsSelecting(!isSelecting)}
        className={`group relative flex items-center gap-2 p-1 px-2 rounded text-xs bg-background border cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${isSelecting ? "border-blue-500 ring-1 ring-blue-500 shadow-md" : "border-(--navBorder) hover:border-muted-foreground hover:shadow-sm"}`}
      >
        <div
          className="w-10 h-10 rounded-sm border border-black/10 shrink-0 flex flex-col items-center justify-center font-bold text-[9px] shadow-inner transition-colors duration-500"
          style={{ backgroundColor: oklchToCss(color), color: contrastText }}
        >
          <span>{currentToken}</span>
          <div className="flex items-center gap-0.5 mt-0.5">
            {isLowContrast && (
              <div className="flex items-center gap-0.5 bg-red-500/20 px-1 rounded">
                <svg className="w-2 h-2 fill-red-600" viewBox="0 0 24 24">
                  <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z" />
                </svg>
                <span className="text-[7px] font-black text-red-600">
                  {contrastRatio}:1
                </span>
              </div>
            )}
            {!isLowContrast && (
              <span className="text-[7px] opacity-80 font-black">
                {contrastRatio}:1
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[10px] leading-tight">{name}</div>
          <div className="text-[8px]  text-gray-400 uppercase tracking-tighter transition-colors group-hover:text-gray-600">
            {oklchToHex(color)}
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 absolute right-1 top-1 bottom-1 bg-background backdrop-blur-md flex items-center gap-1 px-1 rounded border border-(--navBorder)  shadow-sm">
          <button
            onClick={(e) => copy("hex", e)}
            className="p-1 hover:bg-(--brand) rounded text-[8px] font-bold transition-colors"
          >
            HEX
          </button>
          <button
            onClick={(e) => copy("oklch", e)}
            className="p-1 hover:bg-(--brand) rounded text-[8px] font-bold transition-colors"
          >
            LCH
          </button>
        </div>
        {copied && (
          <div className="absolute inset-0 bg-green-500/15 backdrop-blur-[1px] flex items-center justify-center rounded text-[8px] font-bold text-green-700 animate-in fade-in zoom-in-95 duration-200">
            Copied
          </div>
        )}
      </div>
      {isSelecting && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 p-2 bg-gray-900 rounded-md shadow-2xl border border-gray-700 animate-in slide-in-from-top-1 fade-in duration-200 ease-out">
          <div className="text-[8px] text-gray-500 uppercase font-black mb-2 px-1 tracking-widest">
            Adjust Intensity
          </div>
          <div className="flex gap-1">
            {alternatives.map((t) => {
              const basePreview = scale[t];
              const statusKey = Object.keys(statusHueMap).find((key) =>
                name.startsWith(key),
              );
              const previewColor = statusKey
                ? {
                    ...basePreview,
                    h: statusHueMap[statusKey],
                    c: Math.max(basePreview.c, 0.12),
                  }
                : basePreview;
              return (
                <button
                  key={t}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTokenChange(name, t);
                    setIsSelecting(false);
                  }}
                  className={`flex-1 h-9 rounded border flex items-center justify-center text-[9px] font-bold transition-all duration-300 hover:scale-105 active:scale-90 ${t === Number(currentToken) ? "border-white ring-1 ring-white" : "border-transparent opacity-50 hover:opacity-100"}`}
                  style={{
                    backgroundColor: oklchToCss(previewColor),
                    color: getContrastText(previewColor),
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ColorChip({ color, index, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center cursor-pointer p-1 rounded-md transition-all duration-300 ${
        isSelected
          ? "bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-300 dark:ring-gray-600"
          : "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      <div
        className="w-4 h-4 rounded border border-black/5"
        style={{ backgroundColor: oklchToCss(color) }}
      />
      <div
        className={`text-[9px] ml-1.5 pr-1 ${
          isSelected
            ? "font-bold text-gray-900 dark:text-gray-100"
            : "font-medium text-gray-400 dark:text-gray-500"
        }`}
      >
        #{index + 1}
      </div>
    </div>
  );
}

function ColorDetail({ expanded, selectedIdx, onSelect }) {
  const [colorMode, setColorMode] = useState("light");
  const [customMappings, setCustomMappings] = useState({});
  const [exporting, setExporting] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [visionMode, setVisionMode] = useState("normal");

  const colorData = expanded[selectedIdx];
  const scale = colorMode === "light" ? colorData.scale : colorData.darkScale;

  const handleTokenChange = (roleName, newToken) => {
    setCustomMappings((prev) => ({ ...prev, [roleName]: newToken }));
  };

  const getActiveColor = (role) => {
    const def = Object.values(roleTokenMap).reduce(
      (acc, roles) => ({ ...acc, ...roles }),
      {},
    )[role];
    const token = customMappings[role] || def;
    const baseColor = scale[token];

    // Check for status colors
    const statusKey = Object.keys(statusHueMap).find((k) => role.startsWith(k));
    if (statusKey) {
      return {
        ...baseColor,
        h: statusHueMap[statusKey],
        c: Math.max(baseColor.c, 0.12),
      };
    }

    // ADD THIS BLOCK: Check for neutral colors
    if (role.startsWith("neutral")) {
      return {
        ...baseColor,
        c: Math.min(baseColor.c, 0.012), // Keep a very slight hint of the base hue
      };
    }

    return baseColor;
  };

  const exportData = (type) => {
    const lightConfig = {};
    const darkConfig = {};
    Object.entries(roleTokenMap).forEach(([cat, roles]) => {
      Object.entries(roles).forEach(([role, def]) => {
        const token = customMappings[role] || def;
        lightConfig[role] = oklchToHex(colorData.scale[token]);
        darkConfig[role] = oklchToHex(colorData.darkScale[token]);
      });
    });

    let output = "";
    if (type === "tailwind") {
      output = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        light: ${JSON.stringify(lightConfig, null, 10)},\n        dark: ${JSON.stringify(darkConfig, null, 10)}\n      }\n    }\n  }\n}`;
    } else if (type === "css") {
      const activeSet = colorMode === "light" ? lightConfig : darkConfig;
      const vars = Object.entries(activeSet)
        .map(([k, v]) => `  --color-${k}: ${v};`)
        .join("\n");
      output = `:root {\n${vars}\n}`;
    } else {
      output = JSON.stringify(
        colorMode === "light" ? lightConfig : darkConfig,
        null,
        2,
      );
    }
    navigator.clipboard.writeText(output);
    setExporting(type);
    setTimeout(() => setExporting(null), 2000);
  };

  const activeTokens = useMemo(() => {
    const flat = [];
    Object.values(roleTokenMap).forEach((roles) => {
      Object.entries(roles).forEach(([name, def]) => {
        const color = getActiveColor(name);
        flat.push({ name, color });
      });
    });
    return flat;
  }, [scale, customMappings]);

  const sortedCategories = useMemo(() => {
    const entries = Object.entries(roleTokenMap);
    const statusEntry = entries.find(([cat]) => cat === "Status");
    const otherEntries = entries.filter(([cat]) => cat !== "Status");
    return statusEntry ? [...otherEntries, statusEntry] : entries;
  }, []);

  const filterStyle = useMemo(() => {
    if (visionMode === "normal") return {};
    return { filter: `url(#${visionMode})` };
  }, [visionMode]);

  return (
    <div
      className="rounded-xl border flex flex-col h-full overflow-hidden bg-background border-(--navBorder) shadow-sm animate-in fade-in duration-1000"
      style={filterStyle}
    >
      <svg style={{ position: "absolute", height: 0, width: 0 }}>
        {/* Protanopia (no red cones) */}
        <filter id="protanopia">
          <feColorMatrix
            type="matrix"
            values="0.152286 1.052583 -0.204868 0 0
              0.114503 0.786281 0.099216 0 0
             -0.003882 -0.048116 1.051998 0 0
              0 0 0 1 0"
          />
        </filter>

        {/* Deuteranopia (no green cones) */}
        <filter id="deuteranopia">
          <feColorMatrix
            type="matrix"
            values="0.367322 0.860646 -0.227968 0 0
              0.280085 0.672501 0.047413 0 0
             -0.011820 0.042940 0.968881 0 0
              0 0 0 1 0"
          />
        </filter>

        {/* Tritanopia (no blue cones) */}
        <filter id="tritanopia">
          <feColorMatrix
            type="matrix"
            values="1.255528 -0.076749 -0.178779 0 0
             -0.078411 0.930809 0.147602 0 0
              0.004733 0.691367 0.303900 0 0
              0 0 0 1 0"
          />
        </filter>

        {/* Protanomaly (weak red) */}
        <filter id="protanomaly">
          <feColorMatrix
            type="matrix"
            values="0.458064 0.679578 -0.137642 0 0
              0.092785 0.846313 0.060902 0 0
             -0.007494 -0.016807 1.024301 0 0
              0 0 0 1 0"
          />
        </filter>

        {/* Deuteranomaly (weak green) */}
        <filter id="deuteranomaly">
          <feColorMatrix
            type="matrix"
            values="0.547494 0.607765 -0.155259 0 0
              0.181692 0.781742 0.036566 0 0
             -0.010410 0.027275 0.983136 0 0
              0 0 0 1 0"
          />
        </filter>

        {/* Tritanomaly (weak blue) */}
        <filter id="tritanomaly">
          <feColorMatrix
            type="matrix"
            values="1.017277 0.027029 -0.044306 0 0
             -0.006113 0.958479 0.047634 0 0
              0.006379 0.248708 0.744913 0 0
              0 0 0 1 0"
          />
        </filter>

        {/* Achromatopsia (no color) */}
        <filter id="achromatopsia">
          <feColorMatrix
            type="matrix"
            values="0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0 0 0 1 0"
          />
        </filter>
      </svg>

      <div className="p-4 border-b border-(--navBorder) flex flex-col gap-4 bg-background">
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
          {expanded.map((c, idx) => (
            <ColorChip
              key={idx}
              color={c.base}
              index={idx}
              isSelected={selectedIdx === idx}
              onClick={() => onSelect(idx)}
            />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-3">
              <h3
                className="m-0 text-sm font-bold tracking-tight"
                style={{ color: "oklch(0.553 0.013 58.071)" }}
              >
                Palette #{selectedIdx + 1}
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setCustomMappings({})}
                  className="text-[9px] bg-background hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded border border-(--navBorder) hover:border-muted-foreground font-bold uppercase shadow-sm transition-colors"
                  style={{ color: "oklch(0.553 0.013 58.071)" }}
                >
                  Reset
                </button>
                <button
                  onClick={() => exportData("json")}
                  className="text-[9px] px-2 py-1 rounded border border-(--navBorder) font-bold uppercase bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  JSON
                </button>
                <button
                  onClick={() => exportData("tailwind")}
                  className="text-[9px] px-2 py-1 rounded border border-(--navBorder) font-bold uppercase bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Tailwind
                </button>
                <button
                  onClick={() => exportData("css")}
                  className="text-[9px] px-2 py-1 rounded border border-(--navBorder) font-bold uppercase bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  CSS
                </button>
                <button
                  onClick={() => setShowGrid(true)}
                  className="text-[9px] px-2 py-1 rounded border border-(--navBorder) hover:border-muted-foreground bg-background font-bold uppercase transition-colors"
                  style={{ color: "oklch(0.553 0.013 58.071)" }}
                >
                  Contrast
                </button>
                <select
                  onChange={(e) => setVisionMode(e.target.value)}
                  value={visionMode}
                  className="text-[9px] px-2 py-1 rounded border border-(--navBorder) hover:border-muted-foreground bg-background font-bold uppercase cursor-pointer transition-colors"
                  style={{ color: "oklch(0.553 0.013 58.071)" }}
                >
                  <option value="normal">Vision: Normal</option>
                  <optgroup label="Complete Deficiency (rare)">
                    <option value="protanopia">Protanopia (no red)</option>
                    <option value="deuteranopia">
                      Deuteranopia (no green)
                    </option>
                    <option value="tritanopia">Tritanopia (no blue)</option>
                    <option value="achromatopsia">
                      Achromatopsia (no color)
                    </option>
                  </optgroup>
                  <optgroup label="Partial Deficiency (common)">
                    <option value="protanomaly">Protanomaly (weak red)</option>
                    <option value="deuteranomaly">
                      Deuteranomaly (weak green)
                    </option>
                    <option value="tritanomaly">Tritanomaly (weak blue)</option>
                  </optgroup>
                </select>
              </div>
            </div>
            <div
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: "oklch(0.553 0.013 58.071)" }}
            >
              L{(colorData.base.l * 100).toFixed(0)}% C
              {colorData.base.c.toFixed(3)} H{colorData.base.h.toFixed(0)}
            </div>
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg ring-1 ring-black/5 dark:ring-white/5">
            {["light", "dark"].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setColorMode(mode);
                  setCustomMappings({});
                }}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all duration-300 ${
                  colorMode === mode
                    ? "bg-background text-gray-900 dark:text-gray-100 shadow-md"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1  overflow-y-auto p-6 custom-scrollbar">
        <div className="mb-10 p-4 bg-background rounded-xl border border-(--navBorder) hover:border-muted-foreground shadow-sm transition-colors">
          <h4
            className="m-0 mb-4 text-[10px] font-black uppercase tracking-[0.2em]"
            style={{ color: "oklch(0.553 0.013 58.071)" }}
          >
            Tonal Scale
          </h4>
          <div className="flex w-full h-14 rounded-lg overflow-hidden border border-black/5">
            {Object.entries(scale).map(([token, color]) => (
              <div
                key={token}
                className="flex-1 h-full flex items-center justify-center group relative cursor-default"
                style={{ backgroundColor: oklchToCss(color) }}
              >
                <span
                  style={{ color: getContrastText(color) }}
                  className="text-[10px] font-black"
                >
                  {token}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-x-8 gap-y-10 mb-12">
          {sortedCategories.map(([category, roles]) => (
            <div key={category}>
              <h4
                className="m-0 mb-4 text-[10px] font-black uppercase tracking-[0.15em] border-b border-(--navBorder) pb-2"
                style={{ color: "oklch(0.553 0.013 58.071)" }}
              >
                {category}
              </h4>
              <div className="flex flex-col gap-3">
                {Object.entries(roles).map(([roleName, defaultToken]) => (
                  <UsageRole
                    key={roleName}
                    name={roleName}
                    scale={scale}
                    currentToken={customMappings[roleName] || defaultToken}
                    onTokenChange={handleTokenChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className="pl-8 pr-8 pt-8 pb-1 rounded-2xl border shadow-inner"
          style={{ backgroundColor: oklchToCss(getActiveColor("background")) }}
        >
          <h4
            className="m-0 mb-6 text-[10px] font-black uppercase tracking-[0.2em]"
            style={{
              color: oklchToCss(
                ensureContrast(
                  getActiveColor("text"),
                  getActiveColor("background"),
                  4.5,
                ),
              ),
            }}
          >
            Component Preview
            <span
              className="ml-3 text-[8px] font-normal px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: oklchToCss(getActiveColor("background-muted")),
                color: oklchToCss(getActiveColor("text-subtle")),
              }}
            >
              {colorMode === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
          </h4>

          <div className="grid grid-cols-2 gap-4">
            {/* Left: Card with content */}
            <div
              className="p-6 rounded-xl border relative"
              style={{
                backgroundColor: oklchToCss(getActiveColor("surface")),
                borderColor: oklchToCss(
                  ensureContrast(
                    getActiveColor("border"),
                    getActiveColor("surface"),
                    3.0,
                  ),
                ),
              }}
            >
              <div className="absolute top-2 right-2 text-[7px] font-mono bg-black/5 px-1.5 py-0.5 rounded backdrop-blur-sm hover:text-[10px] hover:bg-black/80 hover:text-white hover:px-2 hover:py-1 hover:shadow-lg transition-all duration-200 cursor-default z-10">
                surface:{" "}
                {customMappings["surface"] || roleTokenMap.Surfaces.surface}
              </div>

              {/* Icon/Avatar */}
              <div
                className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center relative"
                style={{
                  backgroundColor: oklchToCss(getActiveColor("accent")),
                }}
              >
                <div className="absolute -top-1 -right-1 text-[6px] font-mono bg-black/70 text-white px-1 py-0.5 rounded hover:text-[10px] hover:px-2 hover:py-1 hover:bg-black hover:shadow-lg transition-all duration-200 cursor-default z-10">
                  {customMappings["accent"] || roleTokenMap.Accents.accent}
                </div>
                <svg
                  className="w-5 h-5"
                  style={{
                    color: oklchToCss(
                      ensureContrast(
                        getActiveColor("text-inverse"),
                        getActiveColor("accent"),
                        4.5,
                      ),
                    ),
                  }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>

              {/* Text content */}
              <h3
                className="text-sm font-bold mb-2"
                style={{
                  color: oklchToCss(
                    ensureContrast(
                      getActiveColor("text"),
                      getActiveColor("surface"),
                      4.5,
                    ),
                  ),
                }}
              >
                Card Title
              </h3>
              <p
                className="text-xs mb-3"
                style={{
                  color: oklchToCss(
                    ensureContrast(
                      getActiveColor("text-subtle"),
                      getActiveColor("surface"),
                      4.5,
                    ),
                  ),
                }}
              >
                This is a sample card showing text hierarchy and spacing.
              </p>

              {/* Divider */}
              <div
                className="h-px my-3"
                style={{
                  backgroundColor: oklchToCss(
                    ensureContrast(
                      getActiveColor("border"),
                      getActiveColor("surface"),
                      3.0,
                    ),
                  ),
                }}
              />

              {/* Metadata with icon */}
              <div className="flex items-center gap-2">
                <svg
                  className="w-3 h-3"
                  style={{
                    color: oklchToCss(
                      ensureContrast(
                        getActiveColor("icon-subtle"),
                        getActiveColor("surface"),
                        3.0,
                      ),
                    ),
                  }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  />
                </svg>
                <span
                  className="text-[10px]"
                  style={{
                    color: oklchToCss(
                      ensureContrast(
                        getActiveColor("text-subtle"),
                        getActiveColor("surface"),
                        4.5,
                      ),
                    ),
                  }}
                >
                  Updated 2 hours ago
                </span>
              </div>
            </div>

            {/* Right: Interactive elements */}
            <div className="flex flex-col gap-3">
              {/* Primary button */}
              <button
                className="h-10 rounded-lg font-bold text-xs shadow-lg hover:shadow-xl active:scale-95 transition-all relative"
                style={{
                  backgroundColor: oklchToCss(
                    getActiveColor("interactive-default"),
                  ),
                  color: oklchToCss(
                    getContrastText(getActiveColor("interactive-default")) ===
                      "white"
                      ? { l: 1, c: 0, h: 0 }
                      : { l: 0, c: 0, h: 0 },
                  ),
                }}
              >
                Primary Action
                <div className="absolute -top-2 -right-2 text-[6px] font-mono bg-black/70 text-white px-1 py-0.5 rounded hover:text-[11px] hover:px-2 hover:py-1 hover:bg-black hover:shadow-xl transition-all duration-200 cursor-default z-10">
                  {customMappings["interactive-default"] ||
                    roleTokenMap.Interactive["interactive-default"]}
                </div>
              </button>

              {/* Secondary button */}
              <button
                className="h-10 rounded-lg font-medium text-xs border-2 transition-all relative"
                style={{
                  backgroundColor: oklchToCss(getActiveColor("background")),
                  borderColor: oklchToCss(getActiveColor("border-strong")),
                  color: oklchToCss(getActiveColor("text")),
                }}
              >
                Secondary Action
              </button>

              {/* Success status */}
              <div
                className="p-3 rounded-lg border text-[10px] font-medium flex items-center gap-2 relative"
                style={{
                  backgroundColor: oklchToCss(getActiveColor("success-subtle")),
                  borderColor: oklchToCss(getActiveColor("success")),
                  color: oklchToCss(getActiveColor("success")),
                }}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  />
                </svg>
                <span>Operation completed successfully</span>
                <div className="absolute -top-2 -right-2 text-[6px] font-mono bg-black/70 text-white px-1 py-0.5 rounded flex gap-1 hover:text-[10px] hover:px-2 hover:py-1 hover:bg-black hover:shadow-xl transition-all duration-200 cursor-default z-10">
                  <span>
                    bg:{" "}
                    {customMappings["success-subtle"] ||
                      roleTokenMap.Status["success-subtle"]}
                  </span>
                  <span>|</span>
                  <span>
                    text:{" "}
                    {customMappings["success"] || roleTokenMap.Status.success}
                  </span>
                </div>
              </div>

              {/* Warning status */}
              <div
                className="p-3 rounded-lg border text-[10px] font-medium flex items-center gap-2"
                style={{
                  backgroundColor: oklchToCss(getActiveColor("warning-subtle")),
                  borderColor: oklchToCss(getActiveColor("warning")),
                  color: oklchToCss(getActiveColor("warning")),
                }}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  />
                </svg>
                <span>Please review before proceeding</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div
            className="mt-6 pt-4 border-t"
            style={{ borderColor: oklchToCss(getActiveColor("border")) }}
          >
            <p
              className="text-[9px] m-0"
              style={{
                color: oklchToCss(getActiveColor("text-subtle")),
              }}
            >
              💡 Hover over token badges to see values. Click usage roles above
              to adjust colors.
            </p>
          </div>
        </div>
      </div>

      {showGrid && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-gray-900/60 backdrop-blur-sm"
          onClick={() => setShowGrid(false)}
        >
          <div
            className="bg-background w-full max-w-5xl max-h-full overflow-hidden rounded-2xl shadow-2xl flex flex-col border border-(--navBorder)"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-(--navBorder) flex justify-between items-center bg-background">
              <h2
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: "oklch(0.553 0.013 58.071)" }}
              >
                Accessibility Matrix
              </h2>
              <button
                onClick={() => setShowGrid(false)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-black text-lg transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="overflow-auto p-6 bg-background custom-scrollbar">
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800/50">
                <p className="text-[10px] text-blue-700 dark:text-blue-300 m-0">
                  This matrix shows contrast ratios for common UI pairings.
                  <span className="font-bold"> Green = WCAG AAA (7:1+)</span>,
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {" "}
                    Blue = AA (4.5:1+)
                  </span>
                  ,
                  <span className="font-bold text-yellow-700 dark:text-yellow-400">
                    {" "}
                    Yellow = AA Large (3:1+)
                  </span>
                  ,
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {" "}
                    Red = Fail
                  </span>
                </p>
              </div>

              <div className="space-y-8">
                {/* Text on Backgrounds */}
                <section>
                  <h3
                    className="text-xs font-black uppercase tracking-wider mb-3 pb-2 border-b border-(--navBorder)"
                    style={{ color: "oklch(0.553 0.013 58.071)" }}
                  >
                    Text on Backgrounds
                  </h3>
                  <table className="w-full border-collapse text-[9px] table-fixed">
                    <thead>
                      <tr>
                        <th className="p-2 border border-(--navBorder) bg-gray-50 dark:bg-gray-800/50 text-left w-1/5">
                          TEXT ROLE
                        </th>
                        {[
                          "background",
                          "background-subtle",
                          "surface",
                          "surface-raised",
                        ].map((bg) => {
                          const color = getActiveColor(bg);
                          const isDark =
                            getContrastRatio(color, { l: 1, c: 0, h: 0 }) > 4.5;
                          return (
                            <th
                              key={bg}
                              className="p-2 border border-(--navBorder)"
                              style={{
                                backgroundColor: oklchToCss(color),
                                color: isDark ? "white" : "black",
                              }}
                            >
                              {bg.replace("-", " ")}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {["text", "text-strong", "text-subtle"].map(
                        (textRole) => {
                          const textColor = getActiveColor(textRole);
                          const isDarkText =
                            getContrastRatio(textColor, { l: 1, c: 0, h: 0 }) >
                            4.5;
                          return (
                            <tr key={textRole}>
                              <td
                                className="p-2 border border-(--navBorder) font-bold uppercase"
                                style={{
                                  backgroundColor: oklchToCss(textColor),
                                  color: isDarkText ? "white" : "black",
                                }}
                              >
                                {textRole}
                              </td>
                              {[
                                "background",
                                "background-subtle",
                                "surface",
                                "surface-raised",
                              ].map((bgRole) => {
                                const bgColor = getActiveColor(bgRole);
                                const ratio = getContrastRatio(
                                  textColor,
                                  bgColor,
                                ).toFixed(1);
                                const { level, color } = getContrastLevel(
                                  parseFloat(ratio),
                                );
                                const colorClass = {
                                  green:
                                    "bg-green-500/10 text-green-700 dark:text-green-400",
                                  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
                                  yellow:
                                    "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                                  red: "bg-red-500/10 text-red-700 dark:text-red-400",
                                }[color];
                                return (
                                  <td
                                    key={bgRole}
                                    className={`p-2 border border-(--navBorder) text-center font-black ${colorClass}`}
                                  >
                                    <div className="flex flex-col items-center">
                                      <span className="text-[11px]">
                                        {ratio}
                                      </span>
                                      <span className="text-[7px] uppercase">
                                        {level}
                                      </span>
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                </section>

                {/* Status Messages */}
                <section>
                  <h3
                    className="text-xs font-black uppercase tracking-wider mb-3 pb-2 border-b border-(--navBorder)"
                    style={{ color: "oklch(0.553 0.013 58.071)" }}
                  >
                    Status Messages
                  </h3>
                  <table className="w-full border-collapse text-[9px] table-fixed">
                    <thead>
                      <tr>
                        <th className="p-2 border border-(--navBorder) bg-gray-50 dark:bg-gray-800/50 text-left w-1/5">
                          STATUS ROLE
                        </th>
                        <th className="p-2 border border-(--navBorder) bg-gray-50 dark:bg-gray-800/50">
                          ON SUBTLE BG
                        </th>
                        <th className="p-2 border border-(--navBorder) bg-gray-50 dark:bg-gray-800/50">
                          ON MAIN BG
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {["success", "warning", "error", "info"].map((status) => {
                        const statusColor = getActiveColor(status);
                        const isDarkStatus =
                          getContrastRatio(statusColor, { l: 1, c: 0, h: 0 }) >
                          4.5;
                        const subtleBg = getActiveColor(`${status}-subtle`);
                        const mainBg = getActiveColor("background");

                        return (
                          <tr key={status}>
                            <td
                              className="p-2 border border-(--navBorder) font-bold uppercase"
                              style={{
                                backgroundColor: oklchToCss(statusColor),
                                color: isDarkStatus ? "white" : "black",
                              }}
                            >
                              {status}
                            </td>
                            {[subtleBg, mainBg].map((bg, idx) => {
                              const ratio = getContrastRatio(
                                statusColor,
                                bg,
                              ).toFixed(1);
                              const { level, color } = getContrastLevel(
                                parseFloat(ratio),
                              );
                              const colorClass = {
                                green:
                                  "bg-green-500/10 text-green-700 dark:text-green-400",
                                blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
                                yellow:
                                  "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                                red: "bg-red-500/10 text-red-700 dark:text-red-400",
                              }[color];
                              return (
                                <td
                                  key={idx}
                                  className={`p-2 border border-(--navBorder) text-center font-black ${colorClass}`}
                                >
                                  <div className="flex flex-col items-center">
                                    <span className="text-[11px]">{ratio}</span>
                                    <span className="text-[7px] uppercase">
                                      {level}
                                    </span>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </section>

                {/* Borders */}
                <section>
                  <h3
                    className="text-xs font-black uppercase tracking-wider mb-3 pb-2 border-b border-(--navBorder)"
                    style={{ color: "oklch(0.553 0.013 58.071)" }}
                  >
                    Borders & Dividers
                  </h3>
                  <table className="w-full border-collapse text-[9px] table-fixed">
                    <thead>
                      <tr>
                        <th className="p-2 border border-(--navBorder) bg-gray-50 dark:bg-gray-800/50 text-left w-1/5">
                          BORDER ROLE
                        </th>
                        <th className="p-2 border border-(--navBorder) bg-gray-50 dark:bg-gray-800/50">
                          ON BG
                        </th>
                        <th className="p-2 border border-(--navBorder) bg-gray-50 dark:bg-gray-800/50">
                          ON SURFACE
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {["border", "border-strong", "border-active"].map(
                        (borderRole) => {
                          const borderColor = getActiveColor(borderRole);
                          const isDarkBorder =
                            getContrastRatio(borderColor, {
                              l: 1,
                              c: 0,
                              h: 0,
                            }) > 4.5;
                          const bg = getActiveColor("background");
                          const surface = getActiveColor("surface");

                          return (
                            <tr key={borderRole}>
                              <td
                                className="p-2 border border-(--navBorder) font-bold uppercase"
                                style={{
                                  backgroundColor: oklchToCss(borderColor),
                                  color: isDarkBorder ? "white" : "black",
                                }}
                              >
                                {borderRole.replace("-", " ")}
                              </td>
                              {[bg, surface].map((bgTarget, idx) => {
                                const ratio = getContrastRatio(
                                  borderColor,
                                  bgTarget,
                                ).toFixed(1);
                                const passes = parseFloat(ratio) >= 3;
                                const colorClass = passes
                                  ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                  : "bg-red-500/10 text-red-700 dark:text-red-400";
                                return (
                                  <td
                                    key={idx}
                                    className={`p-2 border border-(--navBorder) text-center font-black ${colorClass}`}
                                  >
                                    <div className="flex flex-col items-center">
                                      <span className="text-[11px]">
                                        {ratio}
                                      </span>
                                      <span className="text-[7px] uppercase">
                                        {passes ? "PASS" : "FAIL"}
                                      </span>
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Expand() {
  const { palette } = useColorPaletteContext();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [error, setError] = useState(null);

  const expanded = useMemo(() => {
    try {
      if (!palette || palette.length === 0)
        throw new Error("No colors in palette.");
      return generateExpandedPalette(palette);
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, [palette]);

  if (error)
    return (
      <div className="p-6 text-xs text-red-500 font-mono bg-red-50 rounded-lg m-4 border border-red-100 animate-pulse">
        {error}
      </div>
    );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background pl-2 pr-2 pt-4 pb-2">
      {expanded.length > 0 && (
        <ColorDetail
          expanded={expanded}
          selectedIdx={selectedColorIndex}
          onSelect={setSelectedColorIndex}
        />
      )}
    </div>
  );
}
