import React, { useMemo, useState, useRef, useEffect } from "react";
import { generateExpandedPalette, getContrastRatio } from "./colorexpansion";
import { useColorPaletteContext } from "../ColorContext";

// Role bundle presets
const ROLE_BUNDLES = {
  minimal: {
    name: "Minimal",
    categories: {
      Text: ["text", "text-subtle"],
      Backgrounds: ["background", "surface"],
      Interactive: ["interactive-default", "interactive-hover"],
      Status: ["success", "warning", "error"],
    },
  },
  standard: {
    name: "Standard",
    categories: {
      Text: ["text", "text-subtle", "text-strong"],
      Backgrounds: ["background", "background-subtle", "surface"],
      Borders: ["border", "border-strong"],
      Interactive: [
        "interactive-default",
        "interactive-hover",
        "interactive-active",
        "interactive-disabled",
      ],
      Status: [
        "success",
        "success-subtle",
        "warning",
        "warning-subtle",
        "error",
        "error-subtle",
        "info",
        "info-subtle",
      ],
    },
  },
  comprehensive: {
    name: "Full",
    categories: {
      Backgrounds: ["background", "background-subtle", "background-muted"],
      Surfaces: ["surface", "surface-raised", "surface-overlay"],
      Borders: ["border", "border-strong", "border-active", "border-focus"],
      Text: ["text-subtle", "text", "text-strong", "text-inverse"],
      Interactive: [
        "interactive-default",
        "interactive-hover",
        "interactive-active",
        "interactive-disabled",
      ],
      Status: [
        "success",
        "success-subtle",
        "warning",
        "warning-subtle",
        "error",
        "error-subtle",
        "info",
        "info-subtle",
      ],
      Fills: ["fill-subtle", "fill", "fill-strong"],
      Accents: ["accent", "accent-subtle", "accent-strong"],
      Icons: ["icon", "icon-subtle", "icon-strong"],
      Decorative: ["decorative-light", "decorative", "decorative-dark"],
      Neutrals: [
        "neutral-subtle",
        "neutral-muted",
        "neutral-default",
        "neutral-strong",
        "neutral-surface",
      ],
    },
  },
};

const roleTokenMap = {
  Backgrounds: {
    background: 50,
    "background-subtle": 100,
    "background-muted": 200,
  },
  Surfaces: { surface: 100, "surface-raised": 50, "surface-overlay": 50 },
  Borders: {
    border: 500,
    "border-strong": 600,
    "border-active": 700,
    "border-focus": 800,
  },
  Text: {
    "text-subtle": 700,
    text: 800,
    "text-strong": 900,
    "text-inverse": 50,
  },
  Interactive: {
    "interactive-default": 700,
    "interactive-hover": 800,
    "interactive-active": 800,
    "interactive-disabled": 300,
  },
  Status: {
    success: 800,
    "success-subtle": 100,
    warning: 700,
    "warning-subtle": 100,
    error: 800,
    "error-subtle": 100,
    info: 700,
    "info-subtle": 100,
  },
  Fills: { "fill-subtle": 200, fill: 600, "fill-strong": 700 },
  Accents: { accent: 500, "accent-subtle": 200, "accent-strong": 800 },
  Icons: { icon: 700, "icon-subtle": 500, "icon-strong": 900 },
  Decorative: {
    "decorative-light": 300,
    decorative: 600,
    "decorative-dark": 800,
  },
  Neutrals: {
    "neutral-subtle": 50,
    "neutral-muted": 200,
    "neutral-default": 600,
    "neutral-strong": 800,
    "neutral-surface": 100,
  },
};

const statusHueMap = { success: 145, warning: 85, error: 25, info: 250 };

// Build token → roles map for tonal scale highlighting
function buildTokenToRolesMap(customMappings) {
  const allRoles = Object.values(roleTokenMap).reduce(
    (acc, roles) => ({ ...acc, ...roles }),
    {},
  );
  const map = {};
  Object.entries(allRoles).forEach(([role, defaultToken]) => {
    const token = customMappings[role] || defaultToken;
    if (!map[token]) map[token] = [];
    map[token].push(role);
  });
  return map;
}

function getContrastText(background) {
  return background.l < 0.5 ? "white" : "black";
}

// FIXED: ensureContrast now wired up in getActiveColor
function ensureContrast(foreground, background, minRatio = 4.5) {
  const ratio = getContrastRatio(foreground, background);
  if (ratio >= minRatio) return foreground;
  const white = { l: 1, c: 0, h: 0 };
  const black = { l: 0, c: 0, h: 0 };
  const whiteBg = getContrastRatio(white, background);
  const blackBg = getContrastRatio(black, background);
  return whiteBg > blackBg ? white : black;
}

function oklchToCss(color) {
  const { l, c, h, a = 1 } = color;
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)} / ${a})`;
}

// FIXED: Correct OKLab->linear RGB matrix + sRGB gamma correction
function oklchToHex(color) {
  const { l, c, h } = color;
  const hRad = (h * Math.PI) / 180;
  const a_ = c * Math.cos(hRad);
  const b_ = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m_ = l - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s_ = l - 0.0894841775 * a_ - 1.291485548 * b_;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const rLin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // FIXED: sRGB gamma correction
  const toSrgb = (val) => {
    val = Math.max(0, Math.min(1, val));
    return val <= 0.0031308
      ? 12.92 * val
      : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  };

  const r = toSrgb(rLin);
  const g = toSrgb(gLin);
  const b = toSrgb(bLin);

  const toHex = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// IMPROVED: Larger, more legible role chip with inline expanding token picker
function UsageRole({ name, scale, currentToken, onTokenChange, oldToken, isHighlighted, isClicked, onHover }) {
  const [copied, setCopied] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const color = useMemo(() => {
    const baseColor = scale[currentToken];
    const statusKey = Object.keys(statusHueMap).find((key) =>
      name.startsWith(key),
    );
    if (statusKey)
      return {
        ...baseColor,
        h: statusHueMap[statusKey],
        c: Math.max(baseColor.c, 0.12),
      };
    if (name.startsWith("neutral"))
      return { ...baseColor, c: Math.min(baseColor.c, 0.012) };
    return baseColor;
  }, [name, scale, currentToken]);

  // FIXED: Always compute both contrast ratios
  const { bestContrast } = useMemo(() => {
    const white = { l: 1, c: 0, h: 0 };
    const black = { l: 0, c: 0, h: 0 };
    const ratioWhite = getContrastRatio(color, white);
    const ratioBlack = getContrastRatio(color, black);
    return { bestContrast: Math.max(ratioWhite, ratioBlack).toFixed(1) };
  }, [color]);

  const passesAA = parseFloat(bestContrast) >= 4.5;
  const passesAAA = parseFloat(bestContrast) >= 7.0;
  const hasChanged = oldToken && oldToken !== currentToken;

  // FIXED: Wider token range — ±2 steps
  const tokens = Object.keys(scale)
    .map(Number)
    .sort((a, b) => a - b);
  const currentIndex = tokens.indexOf(Number(currentToken));
  const alternatives = tokens.slice(
    Math.max(0, currentIndex - 2),
    currentIndex + 3,
  );

  const copy = (type, e) => {
    e.stopPropagation();
    const val = type === "hex" ? oklchToHex(color) : oklchToCss(color);
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 800);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => onHover && onHover(name)}
      onMouseLeave={() => onHover && onHover(null)}
    >
      {/* IMPROVED: Larger chip — readable 11px name, 9px hex */}
      <div
        onClick={() => setIsSelecting(!isSelecting)}
        className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-background border cursor-pointer transition-all hover:shadow-sm ${
          isClicked
            ? "ring-2 ring-amber-400 border-amber-400 bg-amber-50/30 shadow-md"
            : isHighlighted
              ? "ring-2 ring-blue-400 border-blue-400 bg-blue-50/30"
              : isSelecting
                ? "border-blue-500 ring-1 ring-blue-500 shadow-sm"
                : hasChanged
                  ? "border-blue-400 bg-blue-50/20"
                  : "border-(--navBorder) hover:border-gray-400"
        }`}
      >
        {/* Swatch + token step number below */}
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          <div
            className="w-8 h-8 rounded-md border border-black/10 shadow-sm"
            style={{ backgroundColor: oklchToCss(color) }}
          />
          <span className="text-[7px] font-mono text-gray-400 leading-none">{currentToken}</span>
        </div>

        {/* Role name + hex */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[11px] leading-tight truncate text-foreground">
            {name}
          </div>
          <div className="text-[9px] text-gray-400 font-mono mt-0.5">
            {oklchToHex(color)}
          </div>
        </div>

        {/* FIXED: Always-visible contrast badge */}
        <div
          className={`flex flex-col items-center shrink-0 px-1.5 py-1 rounded-md ${
            passesAAA ? "bg-green-500/10" : passesAA ? "bg-yellow-500/10" : "bg-red-500/10"
          }`}
        >
          <span
            className={`text-[10px] font-black leading-tight ${
              passesAAA ? "text-green-700" : passesAA ? "text-yellow-700" : "text-red-600"
            }`}
          >
            {bestContrast}
          </span>
          <span
            className={`text-[7px] font-bold leading-tight ${
              passesAAA ? "text-green-600" : passesAA ? "text-yellow-600" : "text-red-500"
            }`}
          >
            {passesAAA ? "AAA" : passesAA ? "AA" : "✗"}
          </span>
        </div>

        {/* Copy buttons revealed on hover */}
        <div className="opacity-0 group-hover:opacity-100 absolute right-1.5 top-1/2 -translate-y-1/2 bg-background border border-(--navBorder) flex items-center gap-0.5 px-1 py-0.5 rounded-md shadow-sm z-10">
          <button
            onClick={(e) => copy("hex", e)}
            className="px-1.5 py-0.5 hover:bg-(--brand) rounded text-[8px] font-bold"
          >
            HEX
          </button>
          <button
            onClick={(e) => copy("oklch", e)}
            className="px-1.5 py-0.5 hover:bg-(--brand) rounded text-[8px] font-bold"
          >
            LCH
          </button>
        </div>
        {copied && (
          <div className="absolute inset-0 bg-green-500/15 flex items-center justify-center rounded-lg text-[9px] font-bold text-green-700 pointer-events-none">
            ✓ Copied
          </div>
        )}
      </div>

      {/* IMPROVED: Inline expanding token picker — no floating popover */}
      {isSelecting && (
        <div className="mt-1 mb-1 p-2 bg-gray-900 rounded-lg border border-gray-700">
          <div className="text-[8px] text-gray-400 font-bold uppercase mb-1.5 tracking-wider">
            Select token step
          </div>
          <div className="flex gap-1.5">
            {alternatives.map((t) => {
              const basePreview = scale[t];
              const statusKey = Object.keys(statusHueMap).find((key) =>
                name.startsWith(key),
              );
              const previewColor = statusKey
                ? { ...basePreview, h: statusHueMap[statusKey], c: Math.max(basePreview.c, 0.12) }
                : basePreview;
              const previewContrast = Math.max(
                getContrastRatio(previewColor, { l: 1, c: 0, h: 0 }),
                getContrastRatio(previewColor, { l: 0, c: 0, h: 0 }),
              ).toFixed(1);
              const isCurrent = t === Number(currentToken);
              return (
                <button
                  key={t}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTokenChange(name, t);
                    setIsSelecting(false);
                  }}
                  className={`flex-1 rounded-md flex flex-col items-center justify-center transition-all py-2 gap-1 border-2 ${
                    isCurrent
                      ? "border-white scale-105 shadow-lg"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: oklchToCss(previewColor),
                    color: getContrastText(previewColor),
                  }}
                >
                  <span className="text-[9px] font-black">{t}</span>
                  <span className="text-[7px] opacity-90 font-semibold">{previewContrast}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Component Preview — accepts highlightedRole for spatial linking with role panel
function ComponentPreview({ getActiveColor, getTextOnColor, highlightedRole, onRoleClick, onClear, clickedRoles }) {
  const hl = (role) => {
    if (!highlightedRole) return {};
    const roles = Array.isArray(role) ? role : [role];
    if (roles.includes(highlightedRole)) {
      return { outline: "2px solid #3b82f6", outlineOffset: "2px", borderRadius: "4px" };
    }
    return {};
  };

  // Returns onClick + title only — never touches style (style is owned by each element)
  const rc = (role) => {
    const roles = Array.isArray(role) ? role : [role];
    return {
      onClick: (e) => { e.stopPropagation(); onRoleClick && onRoleClick(roles); },
      title: "Click to select: " + roles.join(", "),
    };
  };

  // Amber outline when a role is actively clicked — merged into element's own style
  const cl = (role) => {
    if (!clickedRoles || clickedRoles.length === 0) return {};
    const roles = Array.isArray(role) ? role : [role];
    if (roles.some(r => clickedRoles.includes(r))) {
      return { outline: "2px solid #f59e0b", outlineOffset: "2px", borderRadius: "4px" };
    }
    return {};
  };

  return (
    <div
      className="h-full overflow-y-auto custom-scrollbar p-4 space-y-4"
      style={{ backgroundColor: oklchToCss(getActiveColor("background")) }}
      onClick={onClear}
    >
      {/* Navigation */}
      <div
        className="p-3 rounded-lg flex items-center justify-between"
        style={{ backgroundColor: oklchToCss(getActiveColor("surface")), ...hl("surface"), ...cl("surface") }}
        {...rc("surface")}
        onClick={(e) => { e.stopPropagation(); onRoleClick(["surface"]); }}
      >
        <div className="flex items-center gap-3">
          <div
            className="font-bold text-[10px]"
            style={{ color: oklchToCss(getActiveColor("text")), ...hl("text"), ...cl("text") }}
            {...rc("text")}
          >
            Brand
          </div>
          <nav className="flex gap-2">
            {["Home", "About", "Contact"].map((item, i) => (
              <a
                key={item}
                href="#"
                className="text-[8px] px-2 py-1 rounded"
                style={{
                  color: i === 0
                    ? oklchToCss(getActiveColor("interactive-default"))
                    : oklchToCss(getActiveColor("text-subtle")),
                  backgroundColor: i === 0
                    ? oklchToCss(getActiveColor("background-muted"))
                    : "transparent",
                  ...(i === 0 ? hl("interactive-default") : hl("text-subtle")),
                  ...(i === 0 ? cl("interactive-default") : cl("text-subtle")),
                }}
                onClick={(e) => { e.stopPropagation(); onRoleClick(i === 0 ? ["interactive-default", "background-muted"] : ["text-subtle"]); }}
                title={i === 0 ? "interactive-default, background-muted" : "text-subtle"}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        <button
          className="px-2 py-1 rounded text-[8px] font-bold"
          style={{
            backgroundColor: oklchToCss(getActiveColor("interactive-default")),
            color: getTextOnColor(getActiveColor("interactive-default")),
            ...hl("interactive-default"), ...cl("interactive-default"),
          }}
          {...rc("interactive-default")}
        >
          Sign In
        </button>
      </div>

      {/* Card */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: oklchToCss(getActiveColor("surface")),
          borderColor: oklchToCss(getActiveColor("border")),
          ...hl(["surface", "border"]), ...cl(["surface", "border"]),
        }}
        {...rc(["surface", "border"])}
      >
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ backgroundColor: oklchToCss(getActiveColor("accent")), ...hl("accent"), ...cl("accent") }}
            {...rc("accent")}
          >
            <svg className="w-4 h-4" style={{ color: getTextOnColor(getActiveColor("accent")) }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3
              className="text-[11px] font-bold mb-1"
              style={{ color: oklchToCss(getActiveColor("text")), ...hl("text"), ...cl("text") }}
              {...rc("text")}
            >
              Card Title
            </h3>
            <p
              className="text-[9px] mb-2"
              style={{ color: oklchToCss(getActiveColor("text-subtle")), ...hl("text-subtle"), ...cl("text-subtle") }}
              {...rc("text-subtle")}
            >
              Sample card showing text hierarchy and spacing in your color system.
            </p>
          </div>
        </div>
        <div
          className="h-px mb-3"
          style={{ backgroundColor: oklchToCss(getActiveColor("border")), ...hl("border"), ...cl("border") }}
        />
        <div className="flex items-center gap-2">
          <svg
            className="w-3 h-3"
            style={{ color: oklchToCss(getActiveColor("icon-subtle")), ...hl("icon-subtle"), ...cl("icon-subtle") }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
          </svg>
          <span
            className="text-[8px]"
            style={{ color: oklchToCss(getActiveColor("text-subtle")), ...hl("text-subtle"), ...cl("text-subtle") }}
          >
            2 hours ago
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button
          className="w-full h-9 rounded font-bold text-[9px] shadow"
          style={{
            backgroundColor: oklchToCss(getActiveColor("interactive-default")),
            color: getTextOnColor(getActiveColor("interactive-default")),
            ...hl("interactive-default"), ...cl("interactive-default"),
          }}
          {...rc("interactive-default")}
        >
          Primary Action
        </button>
        <button
          className="w-full h-9 rounded font-medium text-[9px] border-2"
          style={{
            backgroundColor: oklchToCss(getActiveColor("background")),
            borderColor: oklchToCss(getActiveColor("border-strong")),
            color: oklchToCss(getActiveColor("text")),
            ...hl(["background", "border-strong", "text"]), ...cl(["background", "border-strong", "text"]),
          }}
          {...rc(["background", "border-strong", "text"])}
        >
          Secondary Action
        </button>
        <div className="flex gap-2">
          <button
            className="flex-1 px-2 py-1.5 rounded text-[8px] font-bold flex items-center justify-center gap-1"
            style={{
              backgroundColor: oklchToCss(getActiveColor("interactive-default")),
              color: getTextOnColor(getActiveColor("interactive-default")),
              ...hl("interactive-default"), ...cl("interactive-default"),
            }}
            {...rc("interactive-default")}
          >
            <div className="w-2.5 h-2.5 border-2 rounded-full animate-spin" style={{ borderTopColor: "transparent", borderRightColor: getTextOnColor(getActiveColor("interactive-default")), borderBottomColor: getTextOnColor(getActiveColor("interactive-default")), borderLeftColor: getTextOnColor(getActiveColor("interactive-default")) }} />
            Loading
          </button>
          <button
            className="flex-1 px-2 py-1.5 rounded text-[8px] font-bold opacity-50 cursor-not-allowed"
            style={{
              backgroundColor: oklchToCss(getActiveColor("interactive-disabled")),
              color: oklchToCss(getActiveColor("text-subtle")),
              ...hl("interactive-disabled"), ...cl("interactive-disabled"),
            }}
            {...rc("interactive-disabled")}
          >
            Disabled
          </button>
        </div>
      </div>

      {/* Status Messages */}
      <div className="space-y-2">
        {[
          {
            status: "success",
            icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
            text: "Success message",
          },
          {
            status: "warning",
            icon: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
            text: "Warning message",
          },
          {
            status: "error",
            icon: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
            text: "Error message",
          },
        ].map(({ status, icon, text }) => (
          <div
            key={status}
            className="p-2 rounded border text-[8px] font-medium flex items-center gap-2"
            style={{
              backgroundColor: oklchToCss(getActiveColor(`${status}-subtle`)),
              borderColor: oklchToCss(getActiveColor(status)),
              color: oklchToCss(getActiveColor(status)),
              ...hl([status, `${status}-subtle`]), ...cl([status, `${status}-subtle`]),
            }}
            {...rc([status, `${status}-subtle`])}
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d={icon} />
            </svg>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="space-y-2">
        <div>
          <label
            className="block text-[8px] font-bold mb-1"
            style={{ color: oklchToCss(getActiveColor("text-subtle")), ...hl("text-subtle"), ...cl("text-subtle") }}
          >
            Email
          </label>
          <input
            type="text"
            placeholder="you@example.com"
            className="w-full px-2 py-1.5 text-[9px] rounded border"
            style={{
              backgroundColor: oklchToCss(getActiveColor("background")),
              borderColor: oklchToCss(getActiveColor("border")),
              color: oklchToCss(getActiveColor("text")),
              ...hl(["background", "border", "text"]), ...cl(["background", "border", "text"]),
            }}
            {...rc(["background", "border", "text"])}
          />
        </div>
        <div>
          <label
            className="block text-[8px] font-bold mb-1"
            style={{ color: oklchToCss(getActiveColor("text-subtle")), ...hl("text-subtle"), ...cl("text-subtle") }}
          >
            Select
          </label>
          <select
            className="w-full px-2 py-1.5 text-[9px] rounded border"
            style={{
              backgroundColor: oklchToCss(getActiveColor("background")),
              borderColor: oklchToCss(getActiveColor("border")),
              color: oklchToCss(getActiveColor("text")),
              ...hl(["background", "border", "text"]), ...cl(["background", "border", "text"]),
            }}
            {...rc(["background", "border", "text"])}
          >
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-3 h-3"
            style={{ accentColor: oklchToCss(getActiveColor("interactive-default")) }}
          />
          <label
            className="text-[8px]"
            style={{ color: oklchToCss(getActiveColor("text")), ...hl("text"), ...cl("text") }}
          >
            I agree to terms
          </label>
        </div>
      </div>

      {/* Data Table */}
      <div
        className="rounded border overflow-hidden"
        style={{ borderColor: oklchToCss(getActiveColor("border")), ...hl("border"), ...cl("border") }}
        {...rc("border")}
      >
        <table className="w-full text-[8px]">
          <thead style={{ backgroundColor: oklchToCss(getActiveColor("surface")), ...hl("surface"), ...cl("surface") }}>
            <tr>
              <th className="p-1.5 text-left font-bold" style={{ color: oklchToCss(getActiveColor("text")), ...hl("text"), ...cl("text") }}>Name</th>
              <th className="p-1.5 text-left font-bold" style={{ color: oklchToCss(getActiveColor("text")) }}>Status</th>
            </tr>
          </thead>
          <tbody
            style={{ backgroundColor: oklchToCss(getActiveColor("background")), ...hl("background"), ...cl("background") }}
            onClick={(e) => { e.stopPropagation(); onRoleClick(["background"]); }}
          >
            <tr style={{ borderTop: `1px solid ${oklchToCss(getActiveColor("border"))}` }}>
              <td className="p-1.5" style={{ color: oklchToCss(getActiveColor("text")) }}>Project A</td>
              <td className="p-1.5">
                <span
                  className="px-1.5 py-0.5 rounded text-[7px] font-bold"
                  style={{
                    backgroundColor: oklchToCss(getActiveColor("success-subtle")),
                    color: oklchToCss(getActiveColor("success")),
                    ...hl(["success", "success-subtle"]), ...cl(["success", "success-subtle"]),
                  }}
                  {...rc(["success", "success-subtle"])}
                >
                  Active
                </span>
              </td>
            </tr>
            <tr style={{ borderTop: `1px solid ${oklchToCss(getActiveColor("border"))}` }}>
              <td className="p-1.5" style={{ color: oklchToCss(getActiveColor("text")) }}>Project B</td>
              <td className="p-1.5">
                <span
                  className="px-1.5 py-0.5 rounded text-[7px] font-bold"
                  style={{
                    backgroundColor: oklchToCss(getActiveColor("warning-subtle")),
                    color: oklchToCss(getActiveColor("warning")),
                    ...hl(["warning", "warning-subtle"]), ...cl(["warning", "warning-subtle"]),
                  }}
                  {...rc(["warning", "warning-subtle"])}
                >
                  Pending
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <div
        className="p-3 rounded border shadow-lg"
        style={{
          backgroundColor: oklchToCss(getActiveColor("surface")),
          borderColor: oklchToCss(getActiveColor("border")),
          ...hl(["surface", "border"]), ...cl(["surface", "border"]),
        }}
        {...rc(["surface", "border"])}
      >
        <h5
          className="text-[10px] font-bold mb-2"
          style={{ color: oklchToCss(getActiveColor("text")), ...hl("text"), ...cl("text") }}
          {...rc("text")}
        >
          Confirm Action
        </h5>
        <p
          className="text-[8px] mb-2"
          style={{ color: oklchToCss(getActiveColor("text-subtle")), ...hl("text-subtle"), ...cl("text-subtle") }}
          {...rc("text-subtle")}
        >
          Are you sure you want to proceed?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            className="px-2 py-1 rounded text-[8px] font-medium border"
            style={{
              backgroundColor: oklchToCss(getActiveColor("background")),
              borderColor: oklchToCss(getActiveColor("border")),
              color: oklchToCss(getActiveColor("text")),
              ...hl(["background", "border", "text"]), ...cl(["background", "border", "text"]),
            }}
            {...rc(["background", "border", "text"])}
          >
            Cancel
          </button>
          <button
            className="px-2 py-1 rounded text-[8px] font-bold"
            style={{
              backgroundColor: oklchToCss(getActiveColor("error")),
              color: getTextOnColor(getActiveColor("error")),
              ...hl("error"), ...cl("error"),
            }}
            {...rc("error")}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// IMPROVED: Consolidated export dropdown — clears the toolbar
function ExportDropdown({ onExport, hasChanges, onExportDecisions, exporting }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-800 text-white text-[10px] font-bold hover:bg-gray-700 transition-colors"
      >
        Export
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-(--navBorder) rounded-lg shadow-xl z-50 overflow-hidden">
          {hasChanges && (
            <>
              <button
                onClick={() => { onExportDecisions(); setOpen(false); }}
                className="w-full px-3 py-2 text-left text-[10px] font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-400 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                {exporting === "decisions" ? "✓ Copied!" : "Decisions (MD)"}
              </button>
              <div className="h-px bg-gray-100 dark:bg-gray-700" />
            </>
          )}
          {[
            { key: "json", label: "JSON", color: "text-gray-700 dark:text-gray-300" },
            { key: "css", label: "CSS Variables", color: "text-blue-700 dark:text-blue-400" },
            { key: "tailwind", label: "Tailwind Config", color: "text-teal-700 dark:text-teal-400" },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => { onExport(key); setOpen(false); }}
              className={`w-full px-3 py-2 text-left text-[10px] font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 ${color}`}
            >
              {exporting === key ? "✓ Copied!" : label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ColorDetail({ expanded, selectedIdx, onSelect, darkModeFloor, onDarkModeFloorChange, lightModeCeiling, onLightModeCeilingChange }) {
  const [colorMode, setColorMode] = useState("light");
  // FIXED: Per-mode mappings preserve tweaks when switching light ↔ dark
  const [customMappingsPerMode, setCustomMappingsPerMode] = useState({ light: {}, dark: {} });
  const [originalMappingsPerMode, setOriginalMappingsPerMode] = useState({ light: {}, dark: {} });
  const [exporting, setExporting] = useState(null);
  const [roleBundle, setRoleBundle] = useState("standard");
  // NEW: Hover role for spatial linking between panel and preview
  const [hoveredRole, setHoveredRole] = useState(null);
  // NEW: Clicked tonal scale token highlights matching roles
  const [highlightedToken, setHighlightedToken] = useState(null);
  // NEW: Clicking a preview element highlights + scrolls to its role chips
  const [clickedRoles, setClickedRoles] = useState([]);
  const roleChipRefs = useRef({});
  const rolePanelRef = useRef(null);

  const handlePreviewRoleClick = (roles) => {
    const rolesArr = Array.isArray(roles) ? roles : [roles];
    setClickedRoles(rolesArr);
    const firstRef = roleChipRefs.current[rolesArr[0]];
    if (firstRef && rolePanelRef.current) {
      firstRef.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handlePreviewClear = () => setClickedRoles([]);

  const colorData = expanded[selectedIdx];
  const scale = colorMode === "light" ? colorData.scale : colorData.darkScale;
  const currentRoleMap = ROLE_BUNDLES[roleBundle].categories;

  const activeCustomMappings = customMappingsPerMode[colorMode];
  const activeOriginalMappings = originalMappingsPerMode[colorMode];

  // Token→roles map for tonal scale interactivity
  const tokenToRoles = useMemo(
    () => buildTokenToRolesMap(activeCustomMappings),
    [activeCustomMappings],
  );

  const handleTokenChange = (roleName, newToken) => {
    setCustomMappingsPerMode((prev) => {
      const modeMap = prev[colorMode];
      const origMap = originalMappingsPerMode[colorMode];
      if (!origMap[roleName]) {
        const allRoles = Object.values(roleTokenMap).reduce(
          (acc, roles) => ({ ...acc, ...roles }),
          {},
        );
        setOriginalMappingsPerMode((p) => ({
          ...p,
          [colorMode]: { ...p[colorMode], [roleName]: allRoles[roleName] },
        }));
      }
      return { ...prev, [colorMode]: { ...modeMap, [roleName]: newToken } };
    });
  };

  // Text/icon roles sit on the page background — ensure they contrast against it
  const TEXT_ON_BG_ROLES = new Set([
    "text", "text-subtle", "text-strong", "text-inverse",
    "icon", "icon-subtle", "icon-strong",
  ]);

  const getActiveColor = (role) => {
    const allRoles = Object.values(roleTokenMap).reduce(
      (acc, roles) => ({ ...acc, ...roles }),
      {},
    );
    const def = allRoles[role];
    const token = activeCustomMappings[role] || def;
    const baseColor = scale[token];

    const statusKey = Object.keys(statusHueMap).find((k) => role.startsWith(k));
    let resolved;
    if (statusKey) {
      resolved = { ...baseColor, h: statusHueMap[statusKey], c: Math.max(baseColor.c, 0.12) };
    } else if (role.startsWith("neutral")) {
      resolved = { ...baseColor, c: Math.min(baseColor.c, 0.012) };
    } else {
      resolved = baseColor;
    }

    if (TEXT_ON_BG_ROLES.has(role)) {
      const bg = scale[allRoles["background"] || 50];
      resolved = ensureContrast(resolved, bg, 4.5);
    }

    return resolved;
  };

  // For roles used as button/fill backgrounds, pick white or black text
  // based on actual contrast — so floor/ceiling changes are fully respected
  const getTextOnColor = (bgColor) => {
    const white = { l: 1, c: 0, h: 0 };
    const black = { l: 0, c: 0, h: 0 };
    const rW = getContrastRatio(bgColor, white);
    const rB = getContrastRatio(bgColor, black);
    return rW >= rB ? "white" : "black";
  };

  // FIXED: Export only active bundle roles
  const exportDecisions = () => {
    const markdown = `# Design System Color Decisions\n\n**Palette**: #${selectedIdx + 1}\n**Mode**: ${colorMode}\n**Bundle**: ${ROLE_BUNDLES[roleBundle].name}\n**Light Mode Ceiling**: ${(lightModeCeiling * 100).toFixed(0)}%\n**Dark Mode Floor**: ${(darkModeFloor * 100).toFixed(0)}%\n\n## Customizations (${Object.keys(activeCustomMappings).length})\n\n${Object.entries(activeCustomMappings).map(([role, token]) => `### ${role}\n- **Token**: ${activeOriginalMappings[role]} → **${token}**\n- **Color**: ${oklchToHex(getActiveColor(role))}\n`).join("\n")}`;
    navigator.clipboard.writeText(markdown);
    setExporting("decisions");
    setTimeout(() => setExporting(null), 2000);
  };

  // FIXED: Export only roles in active bundle
  const exportData = (type) => {
    const allRoles = Object.values(roleTokenMap).reduce(
      (acc, roles) => ({ ...acc, ...roles }),
      {},
    );
    const bundleRoles = Object.values(currentRoleMap).flat();

    const buildConfig = (scaleToUse, mappings) => {
      const config = {};
      bundleRoles.forEach((role) => {
        const def = allRoles[role];
        if (!def) return;
        config[role] = oklchToHex(scaleToUse[mappings[role] || def]);
      });
      return config;
    };

    const lightConfig = buildConfig(colorData.scale, customMappingsPerMode["light"]);
    const darkConfig = buildConfig(colorData.darkScale, customMappingsPerMode["dark"]);

    let output = "";
    if (type === "tailwind") {
      output = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        light: ${JSON.stringify(lightConfig, null, 10)},\n        dark: ${JSON.stringify(darkConfig, null, 10)}\n      }\n    }\n  }\n}`;
    } else if (type === "css") {
      const vars = Object.entries(colorMode === "light" ? lightConfig : darkConfig)
        .map(([k, v]) => `  --color-${k}: ${v};`)
        .join("\n");
      output = `:root {\n${vars}\n}`;
    } else {
      output = JSON.stringify(colorMode === "light" ? lightConfig : darkConfig, null, 2);
    }
    navigator.clipboard.writeText(output);
    setExporting(type);
    setTimeout(() => setExporting(null), 2000);
  };

  const hasChanges =
    Object.keys(customMappingsPerMode.light).length > 0 ||
    Object.keys(customMappingsPerMode.dark).length > 0;

  const highlightedRolesFromScale = highlightedToken
    ? (tokenToRoles[highlightedToken] || [])
    : [];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background border border-(--navBorder) rounded-xl">

      {/* IMPROVED TOOLBAR — two rows, breathing room, legible text */}
      <div className="border-b border-(--navBorder) bg-background">

        {/* Row 1: Palette chips + mode toggle */}
        <div className="px-3 pt-2.5 pb-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-wider shrink-0">
              Palette
            </span>
            <div className="flex gap-1.5">
              {expanded.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelect(idx)}
                  className={`w-7 h-7 rounded-lg border-2 transition-all ${
                    selectedIdx === idx
                      ? "border-blue-500 ring-2 ring-blue-500/30 scale-110 shadow-md"
                      : "border-(--navBorder) hover:border-gray-400 hover:scale-105"
                  }`}
                  style={{ backgroundColor: oklchToCss(c.base) }}
                  title={`Palette #${idx + 1}`}
                />
              ))}
            </div>
            <span className="text-[9px] text-foreground/30 font-mono">
              #{selectedIdx + 1} · L{(colorData.base.l * 100).toFixed(0)} C{colorData.base.c.toFixed(2)} H{colorData.base.h.toFixed(0)}
            </span>
          </div>

          {/* IMPROVED: Prominent mode toggle with emoji icons */}
          <div className="flex items-center gap-2.5">
            {colorMode === "light" && (
              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 rounded-lg border border-(--navBorder)">
                <span className="text-[9px] font-semibold text-foreground/50">Ceiling</span>
                <input
                  type="range"
                  min="0.75"
                  max="0.99"
                  step="0.01"
                  value={lightModeCeiling}
                  onChange={(e) => onLightModeCeilingChange(parseFloat(e.target.value))}
                  className="w-16 h-1 cursor-pointer accent-(--brand)"
                />
                <span className="text-[9px] font-mono font-bold text-(--brand) w-7">
                  {(lightModeCeiling * 100).toFixed(0)}%
                </span>
              </div>
            )}
            {colorMode === "dark" && (
              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 rounded-lg border border-(--navBorder)">
                <span className="text-[9px] font-semibold text-foreground/50">Floor</span>
                <input
                  type="range"
                  min="0.08"
                  max="0.25"
                  step="0.01"
                  value={darkModeFloor}
                  onChange={(e) => onDarkModeFloorChange(parseFloat(e.target.value))}
                  className="w-16 h-1 cursor-pointer accent-(--brand)"
                />
                <span className="text-[9px] font-mono font-bold text-(--brand) w-7">
                  {(darkModeFloor * 100).toFixed(0)}%
                </span>
              </div>
            )}
            <div className="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-(--navBorder)">
              <button
                onClick={() => setColorMode("light")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                  colorMode === "light"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => setColorMode("dark")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                  colorMode === "dark"
                    ? "bg-gray-700 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Bundle selector + reset + export dropdown */}
        <div className="px-3 pb-2.5 flex items-center justify-between gap-3 border-t border-(--navBorder)/50 pt-2">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-wider shrink-0">
              Roles
            </span>
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg border border-(--navBorder)">
              {Object.entries(ROLE_BUNDLES).map(([key, bundle]) => (
                <button
                  key={key}
                  onClick={() => {
                    setRoleBundle(key);
                    setCustomMappingsPerMode({ light: {}, dark: {} });
                    setOriginalMappingsPerMode({ light: {}, dark: {} });
                  }}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                    roleBundle === key
                      ? "bg-background text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {bundle.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-[9px] text-blue-500 font-semibold">
                {Object.keys(activeCustomMappings).length} override{Object.keys(activeCustomMappings).length !== 1 ? "s" : ""}
              </span>
            )}
            <button
              onClick={() => {
                setCustomMappingsPerMode({ light: {}, dark: {} });
                setOriginalMappingsPerMode({ light: {}, dark: {} });
              }}
              className="px-2.5 py-1.5 rounded-lg border border-(--navBorder) text-[10px] font-semibold text-foreground/60 hover:text-foreground hover:border-gray-400 transition-all"
            >
              Reset
            </button>
            {/* IMPROVED: Single dropdown replaces 3-4 separate export buttons */}
            <ExportDropdown
              onExport={exportData}
              hasChanges={hasChanges}
              onExportDecisions={exportDecisions}
              exporting={exporting}
            />
          </div>
        </div>
      </div>

      {/* MAIN SPLIT PANEL */}
      <div className="flex flex-1 min-h-0 bg-background overflow-hidden">

        {/* LEFT PANEL: Roles — widened to 42% */}
        <div className="w-[42%] border-r border-(--navBorder) flex flex-col min-w-0">
          <div ref={rolePanelRef} className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2">
            <div className="space-y-5">
              {Object.entries(currentRoleMap).map(([category, roles]) => {
                const allRoles = Object.values(roleTokenMap).reduce(
                  (acc, r) => ({ ...acc, ...r }),
                  {},
                );
                return (
                  <div key={category}>
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-2 pb-1 border-b border-(--navBorder)">
                      {category}
                    </h4>
                    <div className="space-y-1.5">
                      {roles.map((roleName) => {
                        const defaultToken = allRoles[roleName];
                        if (!defaultToken) return null;
                        const isHighlightedByScale = highlightedRolesFromScale.includes(roleName);
                        return (
                          <div
                            key={roleName}
                            ref={(el) => { roleChipRefs.current[roleName] = el; }}
                          >
                            <UsageRole
                              name={roleName}
                              scale={scale}
                              currentToken={activeCustomMappings[roleName] || defaultToken}
                              oldToken={activeOriginalMappings[roleName]}
                              onTokenChange={handleTokenChange}
                              isHighlighted={isHighlightedByScale || clickedRoles.includes(roleName)}
                              isClicked={clickedRoles.includes(roleName)}
                              onHover={setHoveredRole}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live preview — 58% */}
        <div className="flex-1 min-w-0 flex flex-col">
          <ComponentPreview getActiveColor={getActiveColor} getTextOnColor={getTextOnColor} highlightedRole={hoveredRole} onRoleClick={handlePreviewRoleClick} onClear={handlePreviewClear} clickedRoles={clickedRoles} />
        </div>
      </div>

      {/* BOTTOM: Tonal Scale — now interactive */}
      <div className="px-3 py-2.5 border-t border-(--navBorder) bg-foreground/[0.01]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground/40">
            Tonal Scale
          </h4>
          <span className="text-[8px] text-foreground/30">
            {highlightedToken
              ? `Step ${highlightedToken} · used by ${(tokenToRoles[highlightedToken] || []).length} role(s)`
              : "Click any step to highlight its roles ↑"}
          </span>
        </div>
        <div className="flex w-full h-12 rounded-lg overflow-hidden border border-(--navBorder)">
          {Object.entries(scale).map(([token, color]) => {
            const isActive = highlightedToken === Number(token);
            const rolesUsingThis = tokenToRoles[Number(token)] || [];
            return (
              <button
                key={token}
                className={`flex-1 h-full flex flex-col items-center justify-center transition-all relative ${
                  isActive ? "ring-2 ring-inset ring-white/60 z-10 brightness-110" : "hover:brightness-90"
                }`}
                style={{ backgroundColor: oklchToCss(color) }}
                onClick={() => {
                  const newToken = isActive ? null : Number(token);
                  setHighlightedToken(newToken);
                  if (newToken !== null) {
                    const roles = tokenToRoles[newToken] || [];
                    // Scroll first matching role chip into view
                    const firstRole = roles[0];
                    if (firstRole && roleChipRefs.current[firstRole] && rolePanelRef.current) {
                      roleChipRefs.current[firstRole].scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }
                  }
                }}
                title={`Step ${token} · ${rolesUsingThis.length} role(s)`}
              >
                <span style={{ color: getContrastText(color) }} className="text-[8px] font-black leading-tight">
                  {token}
                </span>
                {rolesUsingThis.length > 0 && (
                  <span style={{ color: getContrastText(color) }} className="text-[6px] opacity-60 font-bold leading-tight">
                    ×{rolesUsingThis.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Expand() {
  const { palette } = useColorPaletteContext();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [error, setError] = useState(null);
  // FIXED: Single source of truth for darkModeFloor + lightModeCeiling
  const [darkModeFloor, setDarkModeFloor] = useState(0.12);
  const [lightModeCeiling, setLightModeCeiling] = useState(0.97);

  const expanded = useMemo(() => {
    try {
      if (!palette || palette.length === 0)
        throw new Error("No colors in palette.");
      return generateExpandedPalette(palette, { darkModeFloor, lightModeCeiling });
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, [palette, darkModeFloor, lightModeCeiling]);

  if (error)
    return (
      <div className="p-6 text-xs text-red-500 font-mono bg-red-50 rounded-lg m-4 border border-red-100">
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
          darkModeFloor={darkModeFloor}
          onDarkModeFloorChange={setDarkModeFloor}
          lightModeCeiling={lightModeCeiling}
          onLightModeCeilingChange={setLightModeCeiling}
        />
      )}
    </div>
  );
}