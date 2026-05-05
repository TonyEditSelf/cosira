import React, { useState, useMemo, useCallback } from "react";
import {
  generateExpandedPalette,
  generateNeutralScale,
  getContrastRatio,
  oklchToRgbValues,
} from "../palette-expander/colorexpansion";
import { useColorPaletteContext } from "../ColorContext";
import FullPalettePreview from "./FullPalettePreview";

// ── helpers ───────────────────────────────────────────────────────────────────

function oklchToCss(color) {
  if (!color || typeof color.l !== "number" || typeof color.c !== "number")
    return "transparent";
  const l = color.l ?? 0;
  const c = color.c ?? 0;
  const h = color.h ?? 0;
  if (color.a !== undefined && color.a < 1) {
    return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)} / ${color.a.toFixed(3)})`;
  }
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`;
}

function oklchToHex(color) {
  if (!color) return "#888888";
  try {
    const { r, g, b } = oklchToRgbValues(color);
    const toHex = (v) =>
      Math.round(Math.max(0, Math.min(1, v)) * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } catch {
    return "#888888";
  }
}

function getContrastText(bg) {
  if (!bg) return "white";
  const white = { l: 1, c: 0, h: 0 };
  const black = { l: 0, c: 0, h: 0 };
  try {
    return getContrastRatio(bg, white) >= getContrastRatio(bg, black)
      ? "white"
      : "black";
  } catch {
    return "white";
  }
}

// Auto-suggest role assignments from a palette
function autoAssign(palette) {
  if (!palette || palette.length === 0) return {};
  const items = palette.map((p, i) => ({ idx: i, ...p.value }));

  // Primary = highest chroma
  const primary = [...items].sort((a, b) => b.c - a.c)[0]?.idx ?? 0;

  // Neutral = lowest chroma
  const neutral = [...items].sort((a, b) => a.c - b.c)[0]?.idx ?? null;

  // Secondary = second highest chroma, different hue from primary
  const primaryHue = palette[primary]?.value?.h || 0;
  const secondary =
    [...items]
      .filter((i) => i.idx !== primary)
      .sort((a, b) => {
        // prefer hue distance > 30 from primary
        const aDist = Math.min(
          Math.abs(a.h - primaryHue),
          360 - Math.abs(a.h - primaryHue),
        );
        const bDist = Math.min(
          Math.abs(b.h - primaryHue),
          360 - Math.abs(b.h - primaryHue),
        );
        if (aDist > 30 && bDist <= 30) return -1;
        if (bDist > 30 && aDist <= 30) return 1;
        return b.c - a.c;
      })[0]?.idx ?? null;

  // Accent = remaining high-chroma, different from primary + secondary
  const accent =
    [...items]
      .filter(
        (i) => i.idx !== primary && i.idx !== secondary && i.idx !== neutral,
      )
      .sort((a, b) => b.c - a.c)[0]?.idx ?? null;

  return { primary, secondary, accent, neutral, background: null };
}

// ── FIXED resolveTokens ───────────────────────────────────────────────────────
// Drop-in replacement for the resolveTokens function in FullPaletteExpand.jsx
//
// Root causes of dark-mode breakage that this fixes:
//
//  1. textColor used ns[900] in dark mode  → near-black on dark bg = invisible
//     FIX: light → ns[900], dark → ns[50]  (flipped correctly)
//
//  2. textSubtle used ns[500] in dark mode → often too dark against dark surfaces
//     FIX: light → ns[500], dark → ns[400]
//
//  3. borderColor used ns[200] in dark mode → very light border on dark bg
//     FIX: light → ns[200], dark → ns[700]
//
//  4. navbarBg/surfaceColor token resolution for dark modes was mixing light
//     values (e.g. "#ffffff") regardless of mode
//     FIX: explicit light/dark branches for every bg mode
//
//  5. getContrastText(ps[500]) is correct — was checking ps[600] which is wrong
//     FIX: kept ps[500] as the reference
//
//  6. No fallback when a scale slot is undefined (e.g. darkScale missing)
//     FIX: added null-safe fallbacks throughout

function resolveTokens(assignments, expanded, bgMode, mode) {
  if (!expanded || expanded.length === 0) return null;

  const get = (role) => {
    const idx = assignments[role];
    if (idx === null || idx === undefined || !expanded[idx]) return null;
    return expanded[idx];
  };

  const primaryData = get("primary");
  const secondaryData = get("secondary");
  const accentData = get("accent");
  const neutralData = get("neutral");
  const bgData = get("background");

  if (!primaryData) return null;

  const isLight = mode === "light";

  // ── Scale accessors ──────────────────────────────────────────────────────────
  // Use the correct scale for the current mode
  const scale = (data) =>
    data ? (isLight ? data.scale : data.darkScale) : null;
  const semScale = (data, key) =>
    data
      ? isLight
        ? data.semanticScales?.[key]
        : data.darkSemanticScales?.[key]
      : null;
  const neuScale = (data) =>
    data ? (isLight ? data.neutralScale : data.darkNeutralScale) : null;

  // Primary/secondary/accent/neutral resolved scales
  const ps = scale(primaryData);
  const ss = scale(secondaryData) || ps; // fallback to primary if not assigned
  const as = scale(accentData) || ps;
  const ns = neuScale(neutralData || primaryData);

  // Semantic scales always derive from primary's palette derivation
  const successScale = semScale(primaryData, "success");
  const warningScale = semScale(primaryData, "warning");
  const errorScale = semScale(primaryData, "error");
  const infoScale = semScale(primaryData, "info");

  // ── Background resolution ────────────────────────────────────────────────────
  // Each bgMode produces: bgColor, surfaceColor, surfaceRaisedColor, navbarBg, sidebarBg
  // All as OKLCH color objects (or CSS strings for navbarBg/sidebarBg).
  // Key rule: light mode → use low-step scale values (50/100); dark → high-step (800/900)

  const bgSource = bgData ? scale(bgData) : null;
  const bgBaseScale = bgSource || ns; // custom bg slot falls back to neutral

  let bgColor, surfaceColor, surfaceRaisedColor, navbarBgObj, sidebarBgObj;

  if (bgMode === "neutral") {
    // Clean neutral backgrounds — barely tinted
    bgColor = isLight
      ? bgBaseScale?.[50]
      : bgBaseScale?.[950] || bgBaseScale?.[900];
    surfaceColor = isLight
      ? bgBaseScale?.[100]
      : bgBaseScale?.[850] || bgBaseScale?.[800];
    surfaceRaisedColor = isLight ? bgBaseScale?.[50] : bgBaseScale?.[800];
    navbarBgObj = isLight ? { l: 1, c: 0, h: 0 } : bgBaseScale?.[900]; // white / very dark
    sidebarBgObj = isLight ? bgBaseScale?.[50] : bgBaseScale?.[900];
  } else if (bgMode === "tinted") {
    // Backgrounds washed with primary hue
    bgColor = isLight ? ps?.[50] : ps?.[950] || ps?.[900];
    surfaceColor = isLight ? ps?.[100] : ps?.[850] || ps?.[800];
    surfaceRaisedColor = isLight ? ps?.[50] : ps?.[800];
    navbarBgObj = isLight ? { l: 1, c: 0, h: 0 } : ps?.[900];
    sidebarBgObj = isLight ? ps?.[50] : ps?.[900];
  } else if (bgMode === "colored") {
    // Bold brand backgrounds
    bgColor = isLight ? ps?.[100] : ps?.[900];
    surfaceColor = isLight ? ps?.[50] : ps?.[800];
    surfaceRaisedColor = isLight ? ps?.[50] : ps?.[700];
    navbarBgObj = isLight ? ps?.[600] : ps?.[900];
    sidebarBgObj = isLight ? ps?.[200] : ps?.[900];
  } else if (bgMode === "dark-brand") {
    // Always dark, hue-tinted
    bgColor = ps?.[900];
    surfaceColor = ps?.[800];
    surfaceRaisedColor = ps?.[700];
    navbarBgObj = ps?.[900];
    sidebarBgObj = ps?.[900];
  } else {
    // "custom" — use Background slot, fall back to neutral
    const cbs = bgSource || ns;
    bgColor = isLight ? cbs?.[50] : cbs?.[900];
    surfaceColor = isLight ? cbs?.[100] : cbs?.[800];
    surfaceRaisedColor = isLight ? cbs?.[50] : cbs?.[800];
    navbarBgObj = isLight ? { l: 1, c: 0, h: 0 } : cbs?.[900];
    sidebarBgObj = isLight ? cbs?.[50] : cbs?.[900];
  }

  // ── Text & border colors — always relative to background ────────────────────
  // The critical fix: in dark mode, readable text comes from the LIGHT end of
  // the neutral scale (50/100/200), not the dark end (800/900).

  const textColor = isLight ? ns?.[900] : ns?.[50]; // ← was: always ns[900]
  const textSubtle = isLight ? ns?.[500] : ns?.[400]; // ← was: always ns[500]
  const borderColor = isLight ? ns?.[200] : ns?.[700]; // ← was: always ns[200]

  // ── Navbar text contrast — derive from the actual navbar background ──────────
  // Previously this was guessing from oklch string content — unreliable.
  // Instead: just check isLight for the common cases.
  const navbarTextColor = navbarBgObj
    ? getContrastText(navbarBgObj)
    : isLight
      ? "black"
      : "white";
  const navbarTextMutedColor = isLight ? ns?.[500] : ns?.[400];

  // ── CSS serialization helpers ────────────────────────────────────────────────
  const css = (c) => (c ? oklchToCss(c) : "transparent");
  const cssStr = (c, fallback) => {
    if (!c) return fallback;
    if (typeof c === "string") return c; // already a CSS string
    return oklchToCss(c);
  };

  // ── Build final token map ────────────────────────────────────────────────────
  return {
    // ── Surfaces ──────────────────────────────────────────────────────────────
    background: bgColor ? css(bgColor) : isLight ? "#f9fafb" : "#0f1117",
    surface: surfaceColor ? css(surfaceColor) : isLight ? "#ffffff" : "#1a1d27",
    "surface-raised": surfaceRaisedColor
      ? css(surfaceRaisedColor)
      : isLight
        ? "#ffffff"
        : "#22263a",
    border: borderColor ? css(borderColor) : isLight ? "#e5e7eb" : "#2d3148",

    // ── Text (THE KEY FIX) ────────────────────────────────────────────────────
    // light: dark text on light bg | dark: light text on dark bg
    text: textColor ? css(textColor) : isLight ? "#111827" : "#f1f5f9",
    "text-subtle": textSubtle
      ? css(textSubtle)
      : isLight
        ? "#6b7280"
        : "#8b95b0",

    // ── Primary scale ─────────────────────────────────────────────────────────
    "primary-50": css(ps?.[50]),
    "primary-100": css(ps?.[100]),
    "primary-200": css(ps?.[200]),
    "primary-300": css(ps?.[300]),
    "primary-400": css(ps?.[400]),
    "primary-500": css(ps?.[500]),
    "primary-600": css(ps?.[600]),
    "primary-700": css(ps?.[700]),
    "primary-800": css(ps?.[800]),
    "primary-900": css(ps?.[900]),
    // on-primary: what color text to put ON a primary-500 button
    "on-primary": ps?.[500] ? getContrastText(ps[500]) : "white",

    // ── Secondary scale ───────────────────────────────────────────────────────
    "secondary-50": css(ss?.[50]),
    "secondary-100": css(ss?.[100]),
    "secondary-200": css(ss?.[200]),
    "secondary-300": css(ss?.[300]),
    "secondary-400": css(ss?.[400]),
    "secondary-500": css(ss?.[500]),
    "secondary-600": css(ss?.[600]),
    "secondary-700": css(ss?.[700]),
    "on-secondary": ss?.[500] ? getContrastText(ss[500]) : "white",

    // ── Accent scale ──────────────────────────────────────────────────────────
    "accent-50": css(as?.[50]),
    "accent-100": css(as?.[100]),
    "accent-200": css(as?.[200]),
    "accent-300": css(as?.[300]),
    "accent-400": css(as?.[400]),
    "accent-500": css(as?.[500]),
    "accent-600": css(as?.[600]),
    "accent-700": css(as?.[700]),
    "on-accent": as?.[500] ? getContrastText(as[500]) : "white",

    // ── Neutral scale ─────────────────────────────────────────────────────────
    "neutral-50": css(ns?.[50]),
    "neutral-100": css(ns?.[100]),
    "neutral-200": css(ns?.[200]),
    "neutral-300": css(ns?.[300]),
    "neutral-400": css(ns?.[400]),
    "neutral-500": css(ns?.[500]),
    "neutral-600": css(ns?.[600]),
    "neutral-700": css(ns?.[700]),
    "neutral-800": css(ns?.[800]),
    "neutral-900": css(ns?.[900]),

    // ── Semantic scales ───────────────────────────────────────────────────────
    "success-100": css(successScale?.[100]),
    "success-500": css(successScale?.[500]),
    "success-600": css(successScale?.[600]),
    "success-700": css(successScale?.[700]),
    "warning-100": css(warningScale?.[100]),
    "warning-500": css(warningScale?.[500]),
    "warning-600": css(warningScale?.[600]),
    "warning-700": css(warningScale?.[700]),
    "error-100": css(errorScale?.[100]),
    "error-300": css(errorScale?.[300]),
    "error-500": css(errorScale?.[500]),
    "error-600": css(errorScale?.[600]),
    "info-100": css(infoScale?.[100]),
    "info-500": css(infoScale?.[500]),
    "info-600": css(infoScale?.[600]),

    // ── Navbar ────────────────────────────────────────────────────────────────
    "navbar-bg": cssStr(navbarBgObj, isLight ? "#ffffff" : "#0f1117"),
    "navbar-border": isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
    "navbar-text":
      navbarTextColor === "white"
        ? css(ns?.[50]) || "#f1f5f9"
        : css(ns?.[900]) || "#111827",
    "navbar-text-muted": navbarTextMutedColor
      ? css(navbarTextMutedColor)
      : isLight
        ? "#6b7280"
        : "#8b95b0",
    "navbar-search-bg": isLight ? "#f3f4f6" : "rgba(255,255,255,0.06)",
    "navbar-kbd-bg": isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)",

    // ── Sidebar ───────────────────────────────────────────────────────────────
    "sidebar-bg": cssStr(sidebarBgObj, isLight ? "#f9fafb" : "#0f1117"),
  };
}

// ── Role config ───────────────────────────────────────────────────────────────
const ROLES = [
  {
    key: "primary",
    label: "Primary",
    required: true,
    hint: "Main brand — buttons, links, focus",
  },
  {
    key: "secondary",
    label: "Secondary",
    required: false,
    hint: "Supporting brand — secondary actions",
  },
  {
    key: "accent",
    label: "Accent",
    required: false,
    hint: "Pop color — badges, highlights",
  },
  {
    key: "neutral",
    label: "Neutral",
    required: false,
    hint: "Gray base — text, borders",
  },
  {
    key: "background",
    label: "Background",
    required: false,
    hint: "Override background color family",
  },
];

const BG_MODES = [
  { key: "neutral", label: "Neutral", desc: "Gray backgrounds" },
  { key: "tinted", label: "Tinted", desc: "Primary-washed bg" },
  { key: "colored", label: "Colored", desc: "Brand bg, bold" },
  { key: "dark-brand", label: "Dark Brand", desc: "Dark + brand hue" },
  { key: "custom", label: "Custom Slot", desc: "Use Background slot" },
];

// ── Swatch ────────────────────────────────────────────────────────────────────
function Swatch({ color, size = 32, selected, onClick, label, disabled }) {
  const hex = oklchToHex(color);
  const border = selected
    ? "2.5px solid #3b82f6"
    : disabled
      ? "2px dashed #d1d5db"
      : "2px solid transparent";
  return (
    <div
      onClick={disabled ? undefined : onClick}
      title={label || hex}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: hex,
        border,
        cursor: disabled ? "default" : "pointer",
        flexShrink: 0,
        position: "relative",
        boxShadow: selected
          ? "0 0 0 3px rgba(59,130,246,0.25)"
          : "0 1px 3px rgba(0,0,0,0.15)",
        transition: "all 0.15s",
        transform: selected ? "scale(1.1)" : "scale(1)",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {selected && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "inherit",
          }}
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke={getContrastText(color)}
            strokeWidth={3}
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Role slot drop zone ───────────────────────────────────────────────────────
function RoleSlot({
  roleKey,
  label,
  hint,
  required,
  assignedIdx,
  assignedColor,
  palette,
  onAssign,
  onClear,
  active,
  onActivate,
}) {
  const isEmpty = assignedIdx === null || assignedIdx === undefined;

  return (
    <div
      onClick={onActivate}
      style={{
        borderRadius: 10,
        padding: "9px 12px",
        border: active
          ? "2px solid #3b82f6"
          : isEmpty
            ? "2px dashed #d1d5db"
            : "2px solid transparent",
        background: active
          ? "rgba(59,130,246,0.04)"
          : isEmpty
            ? "rgba(0,0,0,0.02)"
            : "rgba(0,0,0,0.03)",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Color preview circle */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            flexShrink: 0,
            background: isEmpty ? "#e5e7eb" : oklchToHex(assignedColor),
            border: "2px solid rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isEmpty && (
            <svg
              width={12}
              height={12}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth={2}
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>
              {label}
            </span>
            {required && (
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 800,
                  color: "#ef4444",
                  letterSpacing: "0.05em",
                }}
              >
                REQUIRED
              </span>
            )}
            {!isEmpty && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                style={{
                  marginLeft: "auto",
                  fontSize: 9,
                  color: "#9ca3af",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "1px 4px",
                  borderRadius: 4,
                  lineHeight: 1,
                }}
              >
                ✕ clear
              </button>
            )}
          </div>
          <div style={{ fontSize: 9, color: "#6b7280", marginTop: 1 }}>
            {isEmpty
              ? hint
              : `Palette slot ${assignedIdx + 1} · ${oklchToHex(assignedColor)}`}
          </div>
        </div>
      </div>

      {/* Expanded picker — shows when active */}
      {active && (
        <div
          style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}
        >
          {palette.map((p, idx) => (
            <Swatch
              key={idx}
              color={p.value}
              size={26}
              selected={assignedIdx === idx}
              onClick={() => onAssign(idx)}
              label={`Slot ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Contrast warning strip ────────────────────────────────────────────────────
function ContrastWarnings({ tokens }) {
  if (!tokens) return null;
  const pairs = [
    { fg: "text", bg: "background", label: "Text / BG" },
    { fg: "text-subtle", bg: "background", label: "Subtle / BG" },
    { fg: "text", bg: "surface", label: "Text / Surface" },
  ];

  const warnings = pairs
    .map(({ fg, bg, label }) => {
      const fgVal = tokens[fg];
      const bgVal = tokens[bg];
      if (!fgVal || !bgVal) return null;
      // parse oklch strings back to rough luminance check
      const fgIsLight =
        fgVal.includes("0.9") || fgVal.includes("0.8") || fgVal.includes("1.0");
      const bgIsLight =
        bgVal.includes("0.9") ||
        bgVal.includes("0.8") ||
        bgVal.includes("1.0") ||
        bgVal === "#f9fafb" ||
        bgVal === "#ffffff";
      const sameDirection = fgIsLight === bgIsLight;
      return sameDirection ? { label, issue: "low contrast risk" } : null;
    })
    .filter(Boolean);

  if (warnings.length === 0) return null;

  return (
    <div
      style={{
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        borderRadius: 8,
        padding: "8px 12px",
        marginTop: 8,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#c2410c",
          marginBottom: 4,
        }}
      >
        ⚠ Contrast warnings
      </div>
      {warnings.map((w, i) => (
        <div key={i} style={{ fontSize: 10, color: "#9a3412" }}>
          {w.label}: {w.issue}
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FullPaletteExpand() {
  const { palette } = useColorPaletteContext();

  const [assignments, setAssignments] = useState(() => ({}));
  const [bgMode, setBgMode] = useState("neutral");
  const [previewMode, setPreviewMode] = useState("light"); // "light" | "dark" | "split"
  const [activeSlot, setActiveSlot] = useState(null); // which role slot is open
  const [hasAutoAssigned, setHasAutoAssigned] = useState(false);

  // Expand palette once
  const expanded = useMemo(() => {
    try {
      if (!palette || palette.length === 0) return [];
      return generateExpandedPalette(palette, {
        darkModeFloor: 0.12,
        lightModeCeiling: 0.97,
      });
    } catch {
      return [];
    }
  }, [palette]);

  // Auto-assign on first load
  useMemo(() => {
    if (expanded.length > 0 && !hasAutoAssigned && palette) {
      setAssignments(autoAssign(palette));
      setHasAutoAssigned(true);
    }
  }, [expanded, hasAutoAssigned, palette]);

  // Resolve tokens for each preview mode
  const lightTokens = useMemo(
    () => resolveTokens(assignments, expanded, bgMode, "light"),
    [assignments, expanded, bgMode],
  );
  const darkTokens = useMemo(
    () => resolveTokens(assignments, expanded, bgMode, "dark"),
    [assignments, expanded, bgMode],
  );

  const assign = useCallback((role, idx) => {
    setAssignments((prev) => ({ ...prev, [role]: idx }));
    setActiveSlot(null);
  }, []);

  const clear = useCallback((role) => {
    setAssignments((prev) => {
      const n = { ...prev };
      delete n[role];
      return n;
    });
  }, []);

  const reset = () => {
    if (palette) setAssignments(autoAssign(palette));
  };

  if (!palette || palette.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          fontFamily: "system-ui",
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        No palette loaded — add colors first.
      </div>
    );
  }

  const showSplit = previewMode === "split";
  const showLight = previewMode === "light" || showSplit;
  const showDark = previewMode === "dark" || showSplit;

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
        fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
        fontSize: 13,
        background: "#f3f4f6",
        color: "#111827",
      }}
    >
      {/* ── LEFT PANEL: role assignment ── */}
      <div
        style={{
          width: 260,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 16px 10px",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: "-0.01em",
                }}
              >
                System Roles
              </div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 1 }}>
                {palette.length} palette color{palette.length !== 1 ? "s" : ""}{" "}
                · click slot to assign
              </div>
            </div>
            <button
              onClick={reset}
              style={{
                fontSize: 10,
                color: "#6b7280",
                background: "#f3f4f6",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: 6,
                fontWeight: 600,
                fontFamily: "inherit",
              }}
            >
              Auto ✦
            </button>
          </div>
        </div>

        {/* Palette swatches strip */}
        <div
          style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6" }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "#9ca3af",
              marginBottom: 7,
            }}
          >
            Your Palette
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {palette.map((p, idx) => {
              const usedByRole = Object.entries(assignments).find(
                ([, v]) => v === idx,
              )?.[0];
              return (
                <div key={idx} style={{ position: "relative" }}>
                  <Swatch
                    color={p.value}
                    size={30}
                    selected={!!usedByRole}
                    label={`Slot ${idx + 1}${usedByRole ? ` → ${usedByRole}` : ""}`}
                  />
                  {usedByRole && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -2,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: 7,
                        fontWeight: 800,
                        color: "#3b82f6",
                        background: "white",
                        padding: "0 3px",
                        borderRadius: 3,
                        letterSpacing: "0.02em",
                        textTransform: "uppercase",
                        lineHeight: 1.4,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {usedByRole.slice(0, 3).toUpperCase()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Role slots */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {ROLES.map((role) => (
            <RoleSlot
              key={role.key}
              roleKey={role.key}
              label={role.label}
              hint={role.hint}
              required={role.required}
              assignedIdx={assignments[role.key] ?? null}
              assignedColor={
                assignments[role.key] !== undefined &&
                assignments[role.key] !== null
                  ? palette[assignments[role.key]]?.value
                  : null
              }
              palette={palette}
              onAssign={(idx) => assign(role.key, idx)}
              onClear={() => clear(role.key)}
              active={activeSlot === role.key}
              onActivate={() =>
                setActiveSlot((prev) => (prev === role.key ? null : role.key))
              }
            />
          ))}

          {/* Background mode */}
          <div style={{ marginTop: 6 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "#9ca3af",
                marginBottom: 7,
                padding: "0 2px",
              }}
            >
              Background Style
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 5,
              }}
            >
              {BG_MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setBgMode(m.key)}
                  style={{
                    padding: "7px 8px",
                    borderRadius: 8,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    background: bgMode === m.key ? "#eff6ff" : "#f9fafb",
                    border:
                      bgMode === m.key
                        ? "1.5px solid #3b82f6"
                        : "1.5px solid #e5e7eb",
                    color: bgMode === m.key ? "#1d4ed8" : "#374151",
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700 }}>{m.label}</div>
                  <div
                    style={{
                      fontSize: 9,
                      color: bgMode === m.key ? "#3b82f6" : "#9ca3af",
                      marginTop: 1,
                    }}
                  >
                    {m.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <ContrastWarnings tokens={lightTokens} />

          {/* Token mini legend */}
          {lightTokens && (
            <div
              style={{
                marginTop: 8,
                padding: "10px 12px",
                background: "#f9fafb",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                  marginBottom: 8,
                }}
              >
                Live tokens
              </div>
              {[
                ["primary", lightTokens["primary-500"]],
                ["secondary", lightTokens["secondary-500"]],
                ["accent", lightTokens["accent-500"]],
                ["success", lightTokens["success-500"]],
                ["warning", lightTokens["warning-500"]],
                ["error", lightTokens["error-500"]],
              ].map(([name, val]) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 5,
                  }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      background: val,
                      border: "1px solid rgba(0,0,0,0.1)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: "#374151",
                      flex: 1,
                    }}
                  >
                    {name}-500
                  </span>
                  <span
                    style={{
                      fontSize: 8,
                      fontFamily: "monospace",
                      color: "#9ca3af",
                    }}
                  >
                    {val?.slice(0, 18)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL: live preview ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Preview toolbar */}
        <div
          style={{
            padding: "8px 16px",
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>
            Preview
          </span>

          {/* Mode toggle */}
          <div
            style={{
              display: "flex",
              background: "#f3f4f6",
              borderRadius: 8,
              padding: 2,
              border: "1px solid #e5e7eb",
            }}
          >
            {[
              ["light", "☀️ Light"],
              ["dark", "🌙 Dark"],
              ["split", "☀️🌙 Split"],
            ].map(([m, label]) => (
              <button
                key={m}
                onClick={() => setPreviewMode(m)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 10,
                  fontWeight: 700,
                  transition: "all 0.15s",
                  background: previewMode === m ? "#ffffff" : "transparent",
                  color: previewMode === m ? "#111827" : "#6b7280",
                  boxShadow:
                    previewMode === m ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Assignment summary */}
          <div style={{ display: "flex", gap: 6 }}>
            {ROLES.map((r) => {
              const idx = assignments[r.key];
              if (idx === null || idx === undefined) return null;
              const color = palette[idx]?.value;
              return (
                <div
                  key={r.key}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: color ? oklchToHex(color) : "#888",
                    }}
                  />
                  <span
                    style={{ fontSize: 9, color: "#6b7280", fontWeight: 600 }}
                  >
                    {r.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            gap: showSplit ? 1 : 0,
          }}
        >
          {showLight && (
            <div
              style={{
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {showSplit && (
                <div
                  style={{
                    padding: "4px 12px",
                    background: "#fef9c3",
                    borderBottom: "1px solid #fde68a",
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#92400e",
                    letterSpacing: "0.06em",
                  }}
                >
                  ☀️ LIGHT MODE
                </div>
              )}
              <div style={{ flex: 1, overflow: "hidden" }}>
                <FullPalettePreview
                  tokens={lightTokens}
                  mode="light"
                  compact={showSplit}
                />
              </div>
            </div>
          )}
          {showDark && (
            <div
              style={{
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {showSplit && (
                <div
                  style={{
                    padding: "4px 12px",
                    background: "#1e1b4b",
                    borderBottom: "1px solid #312e81",
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#a5b4fc",
                    letterSpacing: "0.06em",
                  }}
                >
                  🌙 DARK MODE
                </div>
              )}
              <div style={{ flex: 1, overflow: "hidden" }}>
                <FullPalettePreview
                  tokens={darkTokens}
                  mode="dark"
                  compact={showSplit}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
