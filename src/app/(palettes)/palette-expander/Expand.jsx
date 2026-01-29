import React, { useMemo, useState } from "react";
import { generateExpandedPalette, getContrastRatio } from "./colorexpansion";
import { useColorPaletteContext } from "../ColorContext";

function getContrastText(background) {
  const white = { l: 1, c: 0, h: 0 };
  const black = { l: 0, c: 0, h: 0 };
  const ratioWhite = getContrastRatio(background, white);
  const ratioBlack = getContrastRatio(background, black);

  if (background.l < 0.55) {
    return ratioWhite > 3 ? "white" : "black";
  }
  return ratioBlack > 4.5 ? "black" : "white";
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
    background: 50,
    "background-subtle": 100,
    "background-muted": 200,
  },
  Surfaces: { surface: 100, "surface-raised": 50, "surface-overlay": 50 },
  Borders: {
    border: 200,
    "border-strong": 300,
    "border-active": 400,
    "border-focus": 500,
  },
  Text: {
    "text-subtle": 400,
    text: 600,
    "text-strong": 700,
    "text-inverse": 50,
  },
  Interactive: {
    "interactive-default": 500,
    "interactive-hover": 600,
    "interactive-active": 700,
    "interactive-disabled": 300,
  },
  Status: {
    success: 600,
    "success-subtle": 100,
    warning: 500,
    "warning-subtle": 100,
    error: 600,
    "error-subtle": 100,
    info: 500,
    "info-subtle": 100,
  },
  Fills: { "fill-subtle": 100, fill: 500, "fill-strong": 600 },
  Accents: { accent: 500, "accent-subtle": 200, "accent-strong": 700 },
  Icons: { icon: 600, "icon-subtle": 400, "icon-strong": 700 },
  Decorative: {
    "decorative-light": 300,
    decorative: 500,
    "decorative-dark": 700,
  },
  Neutrals: {
    "neutral-subtle": 50,
    "neutral-muted": 200,
    "neutral-default": 500,
    "neutral-strong": 700,
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
        className={`group relative flex items-center gap-2 p-1 px-2 rounded text-xs bg-white border cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${isSelecting ? "border-blue-500 ring-1 ring-blue-500 shadow-md" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"}`}
      >
        <div
          className="w-10 h-10 rounded-sm border border-black/10 flex-shrink-0 flex flex-col items-center justify-center font-bold text-[9px] shadow-inner transition-colors duration-500"
          style={{ backgroundColor: oklchToCss(color), color: contrastText }}
        >
          <span>{currentToken}</span>
          <div className="flex items-center gap-0.5 mt-0.5">
            {isLowContrast && (
              <svg className="w-2 h-2 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z" />
              </svg>
            )}
            <span className="text-[7px] opacity-80 font-black">
              {contrastRatio}:1
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[10px] leading-tight">{name}</div>
          <div className="text-[8px] text-gray-400 uppercase tracking-tighter transition-colors group-hover:text-gray-600">
            {oklchToHex(color)}
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 absolute right-1 top-1 bottom-1 bg-white/95 backdrop-blur-md flex items-center gap-1 px-1 rounded border shadow-sm">
          <button
            onClick={(e) => copy("hex", e)}
            className="p-1 hover:bg-gray-100 rounded text-[8px] font-bold transition-colors"
          >
            HEX
          </button>
          <button
            onClick={(e) => copy("oklch", e)}
            className="p-1 hover:bg-gray-100 rounded text-[8px] font-bold transition-colors"
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
      className={`inline-flex items-center cursor-pointer p-1 rounded-md transition-all duration-300 ${isSelected ? "bg-gray-100 ring-1 ring-gray-300" : "bg-transparent hover:bg-gray-50"}`}
    >
      <div
        className="w-4 h-4 rounded border border-black/5"
        style={{ backgroundColor: oklchToCss(color) }}
      />
      <div
        className={`text-[9px] ml-1.5 pr-1 ${isSelected ? "font-bold text-gray-900" : "font-medium text-gray-400"}`}
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
      className="rounded-xl border flex flex-col h-full overflow-hidden bg-[#F9FAFB] border-gray-200 shadow-sm animate-in fade-in duration-1000"
      style={filterStyle}
    >
      <svg style={{ position: "absolute", height: 0, width: 0 }}>
        <filter id="protanopia">
          <feColorMatrix
            type="matrix"
            values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0"
          />
        </filter>
        <filter id="deuteranopia">
          <feColorMatrix
            type="matrix"
            values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0"
          />
        </filter>
        <filter id="tritanopia">
          <feColorMatrix
            type="matrix"
            values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0"
          />
        </filter>
      </svg>

      <div className="p-4 border-b flex flex-col gap-4 bg-white">
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
              <h3 className="m-0 text-sm font-bold text-gray-900 tracking-tight">
                System Palette #{selectedIdx + 1}
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setCustomMappings({})}
                  className="text-[9px] bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 px-2 py-1 rounded border border-gray-200 font-bold uppercase shadow-sm"
                >
                  Reset
                </button>
                <button
                  onClick={() => exportData("json")}
                  className="text-[9px] px-2 py-1 rounded border font-bold uppercase bg-gray-900 text-white"
                >
                  JSON
                </button>
                <button
                  onClick={() => exportData("tailwind")}
                  className="text-[9px] px-2 py-1 rounded border font-bold uppercase bg-gray-200 text-gray-700"
                >
                  Tailwind
                </button>
                <button
                  onClick={() => exportData("css")}
                  className="text-[9px] px-2 py-1 rounded border font-bold uppercase bg-gray-200 text-gray-700"
                >
                  CSS
                </button>
                <button
                  onClick={() => setShowGrid(true)}
                  className="text-[9px] px-2 py-1 rounded border border-gray-200 bg-white text-gray-500 font-bold uppercase"
                >
                  Contrast
                </button>
                <select
                  onChange={(e) => setVisionMode(e.target.value)}
                  className="text-[9px] px-1 py-1 rounded border border-gray-200 bg-white text-gray-500 font-bold uppercase cursor-pointer"
                >
                  <option value="normal">Vision: Normal</option>
                  <option value="protanopia">Protanopia</option>
                  <option value="deuteranopia">Deuteranopia</option>
                  <option value="tritanopia">Tritanopia</option>
                </select>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
              L{(colorData.base.l * 100).toFixed(0)}% C
              {colorData.base.c.toFixed(3)} H{colorData.base.h.toFixed(0)}
            </div>
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg ring-1 ring-black/5">
            {["light", "dark"].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setColorMode(mode);
                  setCustomMappings({});
                }}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all duration-300 ${colorMode === mode ? "bg-white text-gray-900 shadow-md" : "text-gray-500 hover:text-gray-800"}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="mb-10 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h4 className="m-0 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
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
              <h4 className="m-0 mb-4 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 border-b border-gray-200 pb-2">
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
          className="p-8 rounded-2xl border shadow-inner"
          style={{ backgroundColor: oklchToCss(getActiveColor("background")) }}
        >
          <h4
            className="m-0 mb-6 text-[10px] font-black uppercase tracking-[0.2em]"
            style={{ color: oklchToCss(getActiveColor("text-subtle")) }}
          >
            Component Preview
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: oklchToCss(getActiveColor("surface")),
                borderColor: oklchToCss(getActiveColor("border")),
              }}
            >
              <div
                className="w-8 h-8 rounded mb-4"
                style={{
                  backgroundColor: oklchToCss(getActiveColor("accent")),
                }}
              />
              <div
                className="h-4 w-3/4 rounded mb-2"
                style={{
                  backgroundColor: oklchToCss(getActiveColor("fill-subtle")),
                }}
              />
              <div
                className="h-3 w-1/2 rounded"
                style={{
                  backgroundColor: oklchToCss(getActiveColor("fill-subtle")),
                }}
              />
            </div>
            <div className="flex flex-col gap-3">
              <button
                className="h-10 rounded font-bold text-xs shadow-lg active:scale-95 transition-transform"
                style={{
                  backgroundColor: oklchToCss(
                    getActiveColor("interactive-default"),
                  ),
                  color: "white",
                }}
              >
                Primary Action
              </button>
              <div
                className="p-3 rounded border text-[10px] font-medium"
                style={{
                  backgroundColor: oklchToCss(getActiveColor("success-subtle")),
                  borderColor: oklchToCss(getActiveColor("success")),
                  color: oklchToCss(getActiveColor("success")),
                }}
              >
                Status: Completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {showGrid && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-gray-900/60 backdrop-blur-sm"
          onClick={() => setShowGrid(false)}
        >
          <div
            className="bg-white w-full max-w-5xl max-h-full overflow-hidden rounded-2xl shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">
                Accessibility Matrix
              </h2>
              <button
                onClick={() => setShowGrid(false)}
                className="text-gray-400 hover:text-gray-900 font-black text-lg"
              >
                &times;
              </button>
            </div>
            <div className="overflow-auto p-6 custom-scrollbar">
              <table className="w-full border-collapse text-[9px]">
                <thead>
                  <tr>
                    <th className="p-2 border bg-gray-50 text-left sticky left-0 z-10">
                      Token
                    </th>
                    {activeTokens.slice(0, 3).map((bg) => (
                      <th
                        key={bg.name}
                        className="p-2 border bg-gray-50 truncate max-w-[80px]"
                      >
                        {bg.name}
                      </th>
                    ))}
                    <th className="p-2 border bg-gray-50">White</th>
                    <th className="p-2 border bg-gray-50">Black</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTokens.map((token) => (
                    <tr key={token.name} className="hover:bg-gray-50">
                      <td className="p-2 border font-medium sticky left-0 bg-white z-10 flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border border-black/5"
                          style={{ backgroundColor: oklchToCss(token.color) }}
                        />
                        {token.name}
                      </td>
                      {activeTokens.slice(0, 3).map((bg) => {
                        const ratio = getContrastRatio(
                          token.color,
                          bg.color,
                        ).toFixed(1);
                        return (
                          <td
                            key={bg.name}
                            className={`p-2 border text-center font-bold ${ratio >= 4.5 ? "text-green-600" : "text-red-500 bg-red-50"}`}
                          >
                            {ratio}
                          </td>
                        );
                      })}
                      {[
                        { l: 1, c: 0, h: 0 },
                        { l: 0, c: 0, h: 0 },
                      ].map((fixed, i) => (
                        <td
                          key={i}
                          className="p-2 border text-center font-mono opacity-60"
                        >
                          {getContrastRatio(token.color, fixed).toFixed(1)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
    <div className="flex flex-col h-full overflow-hidden bg-[#F3F4F6]/30 p-4">
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
