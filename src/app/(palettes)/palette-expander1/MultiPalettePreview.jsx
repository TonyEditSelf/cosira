// MultiPalettePreview.jsx
// Shows ALL palette colors simultaneously in a rotatable preview grid.
// Each palette color takes a turn as Primary, Secondary, Accent — you can
// rotate the role assignments with arrow buttons or drag-to-reorder.
//
// Props:
//   expanded       — array from generateExpandedPalette()
//   colorMode      — "light" | "dark"
//   getScaleForRole — (role, colorData, mode) → scale object
//   getContrastValue — contrast fn
//   allRoleDefaults — { roleName: defaultToken }
//   customMappingsPerMode — { light: {}, dark: {} }
//
// Usage: drop this below the existing Preview toggle in ColorDetail.

import React, { useState, useCallback, useMemo } from "react";

// ── tiny helpers (duplicated from parent so this file is self-contained) ──────

function oklchToCss(color) {
  if (!color) return "transparent";
  const { l, c, h, a = 1 } = color;
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)} / ${a})`;
}

function oklchToRgb(color) {
  // Approximate sRGB via oklab → linear → gamma
  // Good enough for preview swatches; real conversion is in colorexpansion.js
  if (!color) return { r: 128, g: 128, b: 128 };
  const L = color.l;
  const a_ = color.c * Math.cos((color.h * Math.PI) / 180);
  const b_ = color.c * Math.sin((color.h * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m_ = L - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s_ = L - 0.0894841775 * a_ - 1.291485548 * b_;
  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;
  const toGamma = (v) => {
    const c = Math.max(0, Math.min(1, v));
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };
  return {
    r: Math.round(
      toGamma(4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3) * 255,
    ),
    g: Math.round(
      toGamma(-1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3) * 255,
    ),
    b: Math.round(
      toGamma(-0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3) * 255,
    ),
  };
}

function toHex(color) {
  const { r, g, b } = oklchToRgb(color);
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function contrastText(color) {
  if (!color) return "white";
  return color.l > 0.55 ? "black" : "white";
}

// ── Role assignment for a given "rotation offset" ────────────────────────────
// With N palette colors and offset K:
//   primary   = palette[(0 + K) % N]
//   secondary = palette[(1 + K) % N]
//   accent    = palette[(2 + K) % N]
//   neutral   = palette[(3 + K) % N]  (if N > 3)

function buildAssignments(paletteLength, offset) {
  const wrap = (i) => ((i % paletteLength) + paletteLength) % paletteLength;
  return {
    primary: wrap(offset),
    secondary: paletteLength > 1 ? wrap(offset + 1) : wrap(offset),
    accent: paletteLength > 2 ? wrap(offset + 2) : wrap(offset),
    neutral: paletteLength > 3 ? wrap(offset + 3) : null,
  };
}

// ── Resolve a simple token map from a rotation assignment ────────────────────
function resolveSimpleTokens(expanded, assignments, colorMode) {
  if (!expanded || expanded.length === 0) return null;

  const mode = colorMode;
  const isLight = mode === "light";

  const getScale = (idx) => {
    if (idx === null || idx === undefined || !expanded[idx]) return null;
    return isLight ? expanded[idx].scale : expanded[idx].darkScale;
  };
  const getNeuScale = (idx) => {
    if (idx === null || idx === undefined || !expanded[idx]) return null;
    return isLight
      ? expanded[idx].neutralScale
      : expanded[idx].darkNeutralScale;
  };
  const getSemScale = (idx, key) => {
    if (idx === null || idx === undefined || !expanded[idx]) return null;
    return isLight
      ? expanded[idx].semanticScales?.[key]
      : expanded[idx].darkSemanticScales?.[key];
  };

  const ps = getScale(assignments.primary);
  const ss = getScale(assignments.secondary) || ps;
  const as = getScale(assignments.accent) || ps;
  const ns = getNeuScale(assignments.neutral ?? assignments.primary);

  const successScale = getSemScale(assignments.primary, "success");
  const warningScale = getSemScale(assignments.primary, "warning");
  const errorScale = getSemScale(assignments.primary, "error");
  const infoScale = getSemScale(assignments.primary, "info");

  const css = (c) => (c ? oklchToCss(c) : "transparent");

  // Background / surface / text — correct per-mode
  const bgColor = isLight ? ns?.[50] : ns?.[950] || ns?.[900];
  const surfColor = isLight ? ns?.[100] : ns?.[850] || ns?.[800];
  const textColor = isLight ? ns?.[900] : ns?.[50];
  const textSubtle = isLight ? ns?.[500] : ns?.[400];
  const borderColor = isLight ? ns?.[200] : ns?.[700];

  return {
    background: bgColor ? css(bgColor) : isLight ? "#f9fafb" : "#0f1117",
    surface: surfColor ? css(surfColor) : isLight ? "#ffffff" : "#1a1d27",
    "surface-raised": css(isLight ? ns?.[50] : ns?.[800]),
    border: borderColor ? css(borderColor) : isLight ? "#e5e7eb" : "#2d3148",
    text: textColor ? css(textColor) : isLight ? "#111827" : "#f1f5f9",
    "text-subtle": textSubtle
      ? css(textSubtle)
      : isLight
        ? "#6b7280"
        : "#8b95b0",

    // Primary
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
    "on-primary": ps?.[500] ? contrastText(ps[500]) : "white",

    // Secondary
    "secondary-50": css(ss?.[50]),
    "secondary-100": css(ss?.[100]),
    "secondary-300": css(ss?.[300]),
    "secondary-400": css(ss?.[400]),
    "secondary-500": css(ss?.[500]),
    "secondary-600": css(ss?.[600]),
    "secondary-700": css(ss?.[700]),
    "on-secondary": ss?.[500] ? contrastText(ss[500]) : "white",

    // Accent
    "accent-50": css(as?.[50]),
    "accent-100": css(as?.[100]),
    "accent-200": css(as?.[200]),
    "accent-300": css(as?.[300]),
    "accent-400": css(as?.[400]),
    "accent-500": css(as?.[500]),
    "accent-600": css(as?.[600]),
    "accent-700": css(as?.[700]),
    "on-accent": as?.[500] ? contrastText(as[500]) : "white",

    // Neutral
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

    // Semantic
    "success-100": css(successScale?.[100]),
    "success-500": css(successScale?.[500]),
    "success-600": css(successScale?.[600]),
    "warning-100": css(warningScale?.[100]),
    "warning-500": css(warningScale?.[500]),
    "warning-600": css(warningScale?.[600]),
    "error-100": css(errorScale?.[100]),
    "error-500": css(errorScale?.[500]),
    "error-600": css(errorScale?.[600]),
    "info-100": css(infoScale?.[100]),
    "info-500": css(infoScale?.[500]),
    "info-600": css(infoScale?.[600]),

    // Navbar helpers
    "navbar-bg": isLight ? "#ffffff" : css(ns?.[900]) || "#0f1117",
    "navbar-border": isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
    "navbar-text": isLight
      ? css(ns?.[900]) || "#111827"
      : css(ns?.[50]) || "#f1f5f9",
    "navbar-text-muted": isLight
      ? css(ns?.[500]) || "#6b7280"
      : css(ns?.[400]) || "#8b95b0",
  };
}

// ── Mini card previewing one rotation ────────────────────────────────────────
function RotationCard({
  expanded,
  offset,
  colorMode,
  isActive,
  onClick,
  totalColors,
}) {
  const assignments = buildAssignments(totalColors, offset);
  const tokens = resolveSimpleTokens(expanded, assignments, colorMode);
  if (!tokens) return null;

  const roles = ["primary", "secondary", "accent"];
  const roleColors = roles.map((r) => tokens[`${r}-500`]).filter(Boolean);

  // Label the active role indices
  const labels = {
    [assignments.primary]: "P",
    [assignments.secondary]: "S",
    [assignments.accent]: "A",
  };
  const isLight = colorMode === "light";

  return (
    <button
      onClick={onClick}
      title={`Rotation ${offset + 1}: Primary = slot ${assignments.primary + 1}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "6px 8px",
        borderRadius: 10,
        border: isActive ? "2px solid #3b82f6" : "2px solid transparent",
        background: isActive ? "rgba(59,130,246,0.08)" : "rgba(0,0,0,0.03)",
        cursor: "pointer",
        transition: "all 0.12s",
        boxShadow: isActive ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
        minWidth: 52,
      }}
    >
      {/* Color strip */}
      <div style={{ display: "flex", gap: 3 }}>
        {roleColors.map((color, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: color,
              border: "1.5px solid rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 6,
                fontWeight: 900,
                color: isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)",
                lineHeight: 1,
              }}
            >
              {["P", "S", "A"][i]}
            </span>
          </div>
        ))}
      </div>
      {/* Rotation number */}
      <span
        style={{
          fontSize: 8,
          fontWeight: isActive ? 800 : 600,
          color: isActive ? "#3b82f6" : "#9ca3af",
          lineHeight: 1,
        }}
      >
        #{offset + 1}
      </span>
    </button>
  );
}

// ── Mini landing page preview ─────────────────────────────────────────────────
// Renders a compact version of the GiftRocket-style preview with injected tokens.
function MiniLandingPreview({ tokens, colorMode }) {
  if (!tokens)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#9ca3af",
          fontSize: 11,
        }}
      >
        No tokens
      </div>
    );

  const isLight = colorMode === "light";
  const t = tokens;

  // ── Navbar ──
  const Navbar = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        background: t["navbar-bg"],
        borderBottom: `1px solid ${t["navbar-border"]}`,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            background: t["primary-500"],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
            <path d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7" />
          </svg>
        </div>
        <span
          style={{
            fontWeight: 900,
            fontSize: 11,
            color: t["navbar-text"],
            letterSpacing: "-0.02em",
          }}
        >
          Gift<span style={{ color: t["primary-500"] }}>Rocket</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {["Send", "How it Works", "Sign in"].map((l) => (
          <span
            key={l}
            style={{
              fontSize: 8.5,
              color: t["navbar-text-muted"],
              fontWeight: 500,
            }}
          >
            {l}
          </span>
        ))}
        <div
          style={{
            background: "#3b5998",
            color: "white",
            fontSize: 8,
            fontWeight: 800,
            padding: "4px 10px",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          f Connect
        </div>
      </div>
    </div>
  );

  // ── Hero ──
  const Hero = () => (
    <div
      style={{
        display: "flex",
        background: t.background,
        padding: "20px 16px",
        gap: 16,
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left: orbital sphere */}
      <div
        style={{
          flexShrink: 0,
          width: 100,
          height: 100,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Orbit ring */}
        <div
          style={{
            position: "absolute",
            width: 90,
            height: 90,
            borderRadius: "50%",
            border: `1.5px dashed ${t["primary-200"]}`,
          }}
        />
        {/* Central sphere */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${t["primary-400"]}, ${t["primary-600"]})`,
            boxShadow: `0 4px 20px ${t["primary-300"]}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7a4 4 0 00-8 0M12 12v5M8 14h8" />
          </svg>
        </div>
        {/* Orbiting icon bubbles */}
        {[
          { a: -60, bg: t["primary-100"], color: t["primary-600"] },
          { a: 20, bg: t["secondary-100"], color: t["secondary-600"] },
          { a: 110, bg: t["accent-100"], color: t["accent-600"] },
          { a: 195, bg: t["success-100"], color: t["success-600"] },
          { a: 280, bg: t["warning-100"], color: t["warning-600"] },
        ].map(({ a, bg, color }, i) => {
          const rad = (a * Math.PI) / 180;
          const r = 42;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 50 + r * Math.cos(rad) - 10,
                top: 50 + r * Math.sin(rad) - 10,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: bg,
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: color,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Right: copy */}
      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontSize: 17,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: t.text,
            margin: "0 0 10px",
            lineHeight: 1.15,
          }}
        >
          The Online
          <br />
          <span style={{ color: t["primary-500"] }}>Gift Card.</span>
        </h1>
        {[
          "Cash with an ecard for any occasion",
          "Suggest where to spend it",
          "They get the money however they choose",
        ].map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 5,
              marginBottom: 4,
            }}
          >
            <span
              style={{ color: t["primary-500"], fontSize: 8, fontWeight: 900 }}
            >
              ★
            </span>
            <span
              style={{ fontSize: 9, color: t["text-subtle"], lineHeight: 1.4 }}
            >
              {line}
            </span>
          </div>
        ))}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: t["primary-500"],
            color: t["on-primary"],
            fontSize: 10,
            fontWeight: 900,
            padding: "8px 18px",
            borderRadius: 7,
            marginTop: 10,
            boxShadow: `0 4px 14px ${t["primary-300"]}`,
          }}
        >
          Send a GiftRocket
        </div>
      </div>
    </div>
  );

  // ── Features ──
  const Features = () => (
    <div
      style={{
        background: t.background,
        borderTop: `1px solid ${t.border}`,
        padding: "14px 16px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
      }}
    >
      {[
        {
          title: "Suggest any business",
          bg: t["primary-600"],
          label: "Gift Cards",
        },
        { title: "Flexible", bg: t["secondary-600"], label: "Freedom" },
        { title: "An experience", bg: t["accent-600"], label: "Thanks ✦" },
      ].map((col, i) => (
        <div key={i}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 9.5,
              color: t.text,
              marginBottom: 5,
            }}
          >
            {col.title}
          </div>
          <div
            style={{
              height: 52,
              borderRadius: 8,
              overflow: "hidden",
              background: col.bg,
              position: "relative",
              boxShadow: "0 3px 12px rgba(0,0,0,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: 9,
                fontWeight: 900,
                position: "relative",
                zIndex: 1,
              }}
            >
              {col.label}
            </span>
            <div
              style={{
                position: "absolute",
                width: 50,
                height: 50,
                borderRadius: "50%",
                border: "12px solid rgba(255,255,255,0.07)",
                top: -15,
                right: -15,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  // ── Mission ──
  const Mission = () => (
    <div
      style={{
        background: t.surface,
        borderTop: `1px solid ${t.border}`,
        padding: "14px 16px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
      }}
    >
      <div>
        <div
          style={{
            fontWeight: 900,
            fontSize: 12,
            color: t.text,
            marginBottom: 10,
          }}
        >
          Our Mission
        </div>
        {[
          {
            h: "Gift cards are thoughtful, but wasteful",
            b: "The intention is great — but plastic cards are a pain and often go unspent.",
          },
          {
            h: "Keep the good, leave the bad",
            b: "Pick a business they'll love. We deliver a beautifully packaged digital card.",
          },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: 9,
                color: t.text,
                marginBottom: 3,
              }}
            >
              {item.h}
            </div>
            <div
              style={{
                fontSize: 8.5,
                color: t["text-subtle"],
                lineHeight: 1.65,
              }}
            >
              {item.b}
            </div>
          </div>
        ))}
      </div>
      {/* Gift card mockup */}
      <div>
        <div
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 8,
            fontSize: 8.5,
            color: t["text-subtle"],
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 700, color: t.text, marginBottom: 4 }}>
            Jane Piper,
          </div>
          Thank you for hosting us last week!
          <div style={{ fontWeight: 700, color: t.text, marginTop: 6 }}>
            — Elizabeth &amp; James
          </div>
        </div>
        <div
          style={{
            background: `linear-gradient(135deg, ${t["primary-600"]}, ${t["primary-400"]})`,
            borderRadius: 10,
            padding: "14px 16px",
            color: t["on-primary"],
            boxShadow: `0 6px 20px ${t["primary-300"]}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              top: -15,
              right: -15,
            }}
          />
          <div style={{ fontSize: 7, opacity: 0.7, marginBottom: 4 }}>
            ✦ CLICK TO CLAIM ✦
          </div>
          <div
            style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em" }}
          >
            $100
          </div>
          <div style={{ fontSize: 8, opacity: 0.7, marginTop: 4 }}>
            Suggested for use at
          </div>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.2)",
              borderRadius: 5,
              padding: "4px 10px",
              fontWeight: 800,
              fontSize: 10,
              marginTop: 6,
            }}
          >
            Gary Danko ✦
          </div>
        </div>
      </div>
    </div>
  );

  // ── Press ──
  const Press = () => (
    <div
      style={{
        background: isLight ? "#1e2a3a" : "#111827",
        padding: "18px 16px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        position: "relative",
      }}
    >
      {/* Blob accent */}
      <div
        style={{
          position: "absolute",
          width: 100,
          height: 100,
          borderRadius: "63% 37% 54% 46%",
          background: t["primary-500"],
          opacity: 0.1,
          top: -30,
          left: -30,
          pointerEvents: "none",
        }}
      />
      {[
        {
          name: "Bloomberg\nBusinessweek",
          quote: "The new wave in gift cards",
        },
        { name: "UrbanDaddy", quote: "Latest innovation in gift-giving" },
        { name: "Mashable", quote: "A young and hip transformation" },
        { name: "TNW", quote: "Sure as heck beats a gift card…" },
      ].map((l, i) => (
        <div key={i} style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 900,
              color: "white",
              marginBottom: 5,
              whiteSpace: "pre-line",
              lineHeight: 1.2,
            }}
          >
            {l.name}
          </div>
          <div
            style={{
              fontSize: 7.5,
              color: "rgba(255,255,255,0.45)",
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            "{l.quote}"
          </div>
        </div>
      ))}
    </div>
  );

  // ── Status badges ──
  const StatusRow = () => (
    <div
      style={{
        background: t.background,
        borderTop: `1px solid ${t.border}`,
        padding: "10px 16px",
      }}
    >
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[
          { label: "Success", bg: t["success-100"], color: t["success-600"] },
          { label: "Warning", bg: t["warning-100"], color: t["warning-600"] },
          { label: "Error", bg: t["error-100"], color: t["error-600"] },
          { label: "Info", bg: t["info-100"], color: t["info-600"] },
          { label: "Primary", bg: t["primary-100"], color: t["primary-600"] },
          { label: "Accent", bg: t["accent-100"], color: t["accent-600"] },
        ].map((b) => (
          <span
            key={b.label}
            style={{
              background: b.bg,
              color: b.color,
              fontSize: 8,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 20,
            }}
          >
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        background: t.background,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <Navbar />
      <Hero />
      <StatusRow />
      <Features />
      <Mission />
      <Press />
    </div>
  );
}

// ── Grid view: N cards side by side, one per rotation ────────────────────────
function RotationGrid({ expanded, colorMode, activeOffset, onOffsetChange }) {
  const n = expanded.length;
  // Only show rotations where primary changes (i.e., N rotations)
  const rotations = Array.from({ length: n }, (_, i) => i);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(n, 3)}, 1fr)`,
        gap: 8,
        padding: "0 12px 12px",
        flex: 1,
        overflow: "auto",
      }}
    >
      {rotations.map((offset) => {
        const assignments = buildAssignments(n, offset);
        const tokens = resolveSimpleTokens(expanded, assignments, colorMode);
        const isActive = offset === activeOffset;

        return (
          <div
            key={offset}
            onClick={() => onOffsetChange(offset)}
            style={{
              borderRadius: 12,
              border: isActive ? "2px solid #3b82f6" : "2px solid transparent",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: isActive
                ? "0 0 0 4px rgba(59,130,246,0.15), 0 4px 20px rgba(0,0,0,0.12)"
                : "0 2px 12px rgba(0,0,0,0.1)",
              transition: "all 0.15s",
              transform: isActive ? "scale(1.01)" : "scale(1)",
              position: "relative",
              height: 340,
              display: "flex",
              flexDirection: "column",
              background: tokens?.background || "#fff",
              minWidth: 0,
            }}
          >
            {/* Active badge */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 10,
                  background: "#3b82f6",
                  color: "white",
                  fontSize: 8,
                  fontWeight: 800,
                  padding: "2px 7px",
                  borderRadius: 10,
                  boxShadow: "0 2px 8px rgba(59,130,246,0.4)",
                }}
              >
                ACTIVE
              </div>
            )}

            {/* Role label bar */}
            <div
              style={{
                padding: "6px 10px",
                background: isActive
                  ? "rgba(59,130,246,0.08)"
                  : "rgba(0,0,0,0.04)",
                borderBottom: `1px solid ${tokens?.border || "#e5e7eb"}`,
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 9, fontWeight: 700, color: "#6b7280" }}>
                Rotation {offset + 1}
              </span>
              {["primary", "secondary", "accent"].map((role, ri) => {
                const idx = assignments[role];
                const color = tokens?.[`${role}-500`];
                const labels = ["P", "S", "A"];
                return (
                  <div
                    key={role}
                    style={{ display: "flex", alignItems: "center", gap: 3 }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: color || "#888",
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 7.5,
                        fontWeight: 700,
                        color: "#9ca3af",
                      }}
                    >
                      {labels[ri]}
                      {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Scaled-down preview */}
            <div style={{ flex: 1, overflow: "hidden", pointerEvents: "none" }}>
              <div
                style={{
                  transform: "scale(0.62)",
                  transformOrigin: "top left",
                  width: "161%",
                  height: "161%",
                }}
              >
                <MiniLandingPreview tokens={tokens} colorMode={colorMode} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
// This is the component you drop into ColorDetail alongside the Preview button.
//
// State it needs from parent:
//   expanded   — array from generateExpandedPalette
//   colorMode  — "light" | "dark"
//
// It manages its own offset state internally.

export default function MultiPalettePreview({ expanded, colorMode }) {
  const [offset, setOffset] = useState(0);
  const [viewMode, setViewMode] = useState("single"); // "single" | "grid"

  const n = expanded?.length || 0;
  if (n === 0)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#9ca3af",
          fontSize: 12,
          fontFamily: "system-ui",
        }}
      >
        Add colors to your palette to preview rotations.
      </div>
    );

  const assignments = buildAssignments(n, offset);
  const tokens = resolveSimpleTokens(expanded, assignments, colorMode);

  const rotate = (dir) => setOffset((prev) => (prev + dir + n) % n);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "#f3f4f6",
      }}
    >
      {/* ── Toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        {/* View toggle */}
        <div
          style={{
            display: "flex",
            padding: 2,
            background: "#f3f4f6",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          {[
            ["single", "Single"],
            ["grid", `Grid (${n})`],
          ].map(([m, label]) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontSize: 10,
                fontWeight: 700,
                fontFamily: "inherit",
                background: viewMode === m ? "#ffffff" : "transparent",
                color: viewMode === m ? "#111827" : "#6b7280",
                boxShadow:
                  viewMode === m ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.12s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 16, background: "#e5e7eb" }} />

        {/* Rotation picker — mini cards */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {/* Prev button */}
          <button
            onClick={() => rotate(-1)}
            disabled={n <= 1}
            title="Previous rotation"
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              cursor: n > 1 ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: n > 1 ? "#374151" : "#d1d5db",
              fontWeight: 800,
              fontSize: 12,
              lineHeight: 1,
              transition: "all 0.12s",
            }}
          >
            ‹
          </button>

          {/* Mini rotation cards */}
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: n }, (_, i) => (
              <RotationCard
                key={i}
                expanded={expanded}
                offset={i}
                colorMode={colorMode}
                isActive={i === offset}
                onClick={() => setOffset(i)}
                totalColors={n}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={() => rotate(1)}
            disabled={n <= 1}
            title="Next rotation"
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              cursor: n > 1 ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: n > 1 ? "#374151" : "#d1d5db",
              fontWeight: 800,
              fontSize: 12,
              lineHeight: 1,
              transition: "all 0.12s",
            }}
          >
            ›
          </button>
        </div>

        <div style={{ flex: 1 }} />

        {/* Active assignment legend */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {[
            { role: "primary", label: "Primary", token: `primary-500` },
            { role: "secondary", label: "Secondary", token: `secondary-500` },
            { role: "accent", label: "Accent", token: `accent-500` },
          ].map(({ role, label, token }) => (
            <div
              key={role}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: tokens?.[token] || "#888",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
              <span style={{ fontSize: 9, fontWeight: 600, color: "#374151" }}>
                {label} = slot {assignments[role] + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      {viewMode === "single" ? (
        <div style={{ flex: 1, overflow: "hidden" }}>
          <MiniLandingPreview tokens={tokens} colorMode={colorMode} />
        </div>
      ) : (
        <RotationGrid
          expanded={expanded}
          colorMode={colorMode}
          activeOffset={offset}
          onOffsetChange={setOffset}
        />
      )}
    </div>
  );
}
