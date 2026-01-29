import React, { useMemo, useState } from "react";
import { generateExpandedPalette, getContrastRatio } from "./colorexpansion";
import { useColorPaletteContext } from "../ColorContext";

// Utility for contrast check
function getContrastText(background) {
  const white = { l: 1, c: 0, h: 0 };
  const black = { l: 0, c: 0, h: 0 };
  return getContrastRatio(background, white) >
    getContrastRatio(background, black)
    ? "white"
    : "black";
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
  Fills: { "fill-subtle": 100, fill: 500, "fill-strong": 600 },
  Accents: { accent: 500, "accent-subtle": 200, "accent-strong": 700 },
  Icons: { icon: 600, "icon-subtle": 400, "icon-strong": 700 },
  Decorative: {
    "decorative-light": 300,
    decorative: 500,
    "decorative-dark": 700,
  },
};

function UsageRole({ name, color, token }) {
  const [copied, setCopied] = useState(false);
  const contrastText = getContrastText(color);

  const copy = (type) => {
    const val = type === "hex" ? oklchToHex(color) : oklchToCss(color);
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="group relative flex items-center gap-2 p-1 px-2 rounded text-xs bg-white border border-gray-200">
      <div
        className="w-10 h-10 rounded-sm border border-black/10 flex-shrink-0 flex items-center justify-center font-bold text-[9px] shadow-inner"
        style={{ backgroundColor: oklchToCss(color), color: contrastText }}
      >
        {token}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[10px] leading-tight">{name}</div>
        <div className="text-[8px] text-gray-400 uppercase tracking-tighter">
          {oklchToHex(color)}
        </div>
      </div>
      <div className="hidden group-hover:flex absolute right-1 top-1 bottom-1 bg-white/90 backdrop-blur-sm items-center gap-1 px-1 rounded border shadow-sm">
        <button
          onClick={() => copy("hex")}
          className="p-1 hover:bg-gray-100 rounded text-[8px] font-bold"
        >
          HEX
        </button>
        <button
          onClick={() => copy("oklch")}
          className="p-1 hover:bg-gray-100 rounded text-[8px] font-bold"
        >
          LCH
        </button>
      </div>
      {copied && (
        <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center rounded text-[8px] font-bold text-green-700">
          Copied
        </div>
      )}
    </div>
  );
}

function ColorChip({ color, index, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center cursor-pointer p-1 rounded transition-all duration-200 ${isSelected ? "bg-gray-200 ring-1 ring-gray-800" : "bg-transparent hover:bg-gray-200/50"}`}
    >
      <div
        className="w-6 h-6 rounded-sm border border-black/10"
        style={{ backgroundColor: oklchToCss(color) }}
      />
      <div
        className={`text-[10px] ml-1.5 pr-1 ${isSelected ? "font-bold" : "font-medium"}`}
      >
        #{index + 1}
      </div>
    </div>
  );
}

function ColorDetail({ colorData, index }) {
  const [colorMode, setColorMode] = useState("light");
  const scale = colorMode === "light" ? colorData.scale : colorData.darkScale;

  return (
    <div className="rounded-lg border flex flex-col h-full overflow-hidden bg-gray-50 border-gray-300 shadow-sm">
      <div className="p-3 border-b flex justify-between items-center flex-shrink-0 bg-white">
        <div>
          <h3 className="m-0 text-sm font-bold text-gray-800">
            Color #{index + 1} Expansion
          </h3>
          <div className="text-[10px] text-gray-500">
            Base L{(colorData.base.l * 100).toFixed(0)}% C
            {colorData.base.c.toFixed(3)} H{colorData.base.h.toFixed(0)}°
          </div>
        </div>
        <div className="flex gap-1">
          {["light", "dark"].map((mode) => (
            <button
              key={mode}
              onClick={() => setColorMode(mode)}
              className={`px-2 py-1 text-[10px] font-bold uppercase border rounded cursor-pointer ${colorMode === mode ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-300"}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h4 className="m-0 mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Tonal Scale Overview (50-900)
          </h4>
          <div className="flex w-full h-12 rounded overflow-hidden border border-black/5">
            {Object.entries(scale).map(([token, color]) => (
              <div
                key={token}
                className="flex-1 h-full flex items-center justify-center group relative cursor-default"
                style={{ backgroundColor: oklchToCss(color) }}
              >
                <span
                  style={{ color: getContrastText(color) }}
                  className="text-[9px] font-bold"
                >
                  {token}
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-[8px] p-1 rounded whitespace-nowrap z-10">
                  {oklchToHex(color)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
          {Object.entries(roleTokenMap).map(([category, roles]) => (
            <div key={category}>
              <h4 className="m-0 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {category}
              </h4>
              <div className="flex flex-col gap-1.5">
                {Object.entries(roles).map(([roleName, tokenValue]) => (
                  <UsageRole
                    key={roleName}
                    name={roleName}
                    color={scale[tokenValue]}
                    token={tokenValue}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Expand() {
  const { palette } = useColorPaletteContext();
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
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
    return <div className="p-2 text-xs text-red-600 font-mono">{error}</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <div className="px-3 py-1.5 border-b bg-gray-50 flex flex-wrap gap-2 items-center flex-shrink-0">
        {expanded.map((colorData, idx) => (
          <ColorChip
            key={idx}
            color={colorData.base}
            index={idx}
            isSelected={selectedColorIndex === idx}
            onClick={() =>
              setSelectedColorIndex(selectedColorIndex === idx ? null : idx)
            }
          />
        ))}
      </div>
      <div className="flex-1 overflow-hidden p-3 flex flex-col">
        {selectedColorIndex !== null ? (
          <ColorDetail
            colorData={expanded[selectedColorIndex]}
            index={selectedColorIndex}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-gray-400 italic">
            Select a color to expand roles
          </div>
        )}
      </div>
    </div>
  );
}
