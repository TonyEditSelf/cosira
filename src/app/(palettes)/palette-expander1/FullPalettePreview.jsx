// FullPalettePreview.jsx
// Faithful recreation of the GiftRocket landing page layout.
// API: { tokens, mode, compact } — all colors via var(--prev-*) tokens.

import React, { useState } from "react";

// ── SVG Icon set ──────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, style = {}, className = "" }) => {
  const paths = {
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    hex: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
    arrow: "M5 12h14M12 5l7 7-7 7",
    check: "M20 6L9 17l-5-5",
    gift: "M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z",
    globe:
      "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
    heart:
      "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    users:
      "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    trending: "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    menu: "M3 6h18M3 12h18M3 18h18",
    sparkle: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      <path d={paths[name] || paths.zap} />
    </svg>
  );
};

// ── GiftRocket Logo SVG ───────────────────────────────────────────────────────
const GiftRocketLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    {/* Hexagon background */}
    <polygon
      points="30,4 52,17 52,43 30,56 8,43 8,17"
      fill="var(--prev-primary-500)"
    />
    {/* Rocket body */}
    <ellipse cx="30" cy="28" rx="8" ry="13" fill="white" opacity="0.95" />
    {/* Rocket tip */}
    <path
      d="M30 14 C26 20 22 24 22 28 L38 28 C38 24 34 20 30 14Z"
      fill="white"
    />
    {/* Ribbon/bow on rocket */}
    <path
      d="M22 28 C20 32 20 36 22 40 L24 38 C22 35 22 31 24 29Z"
      fill="var(--prev-primary-300)"
    />
    <path
      d="M38 28 C40 32 40 36 38 40 L36 38 C38 35 38 31 36 29Z"
      fill="var(--prev-primary-300)"
    />
    {/* Flame */}
    <path
      d="M26 41 C26 46 28 50 30 52 C32 50 34 46 34 41Z"
      fill="var(--prev-accent-400, #f5a623)"
      opacity="0.9"
    />
    {/* Window */}
    <circle cx="30" cy="30" r="4" fill="var(--prev-primary-400)" />
    <circle cx="30" cy="30" r="2.5" fill="var(--prev-primary-200)" />
  </svg>
);

// ── Orbital icon bubble items (the ring of icons around the rocket) ────────────
const OrbitalScene = () => {
  // Each item: icon or svg type, color palette token, position on the ring
  const items = [
    // Top row
    { type: "sunglasses", color: "#e8b84b", bg: "#f5e6b8", angle: -75 },
    { type: "bike", color: "#5b9bd5", bg: "#d0e8f7", angle: -45 },
    { type: "football", color: "#c47d3b", bg: "#f2dcc4", angle: -15 },
    // Right
    { type: "music", color: "#7b68ee", bg: "#e0dcff", angle: 15 },
    { type: "coffee", color: "#8b6b3b", bg: "#f0e0c8", angle: 45 },
    { type: "book", color: "#5ba05b", bg: "#d0ecd0", angle: 75 },
    // Bottom
    { type: "pizza", color: "#e05b5b", bg: "#fbd0d0", angle: 105 },
    { type: "wine", color: "#a05ba0", bg: "#e8d0e8", angle: 135 },
    { type: "headphone", color: "#4a90d9", bg: "#cce0f5", angle: 165 },
    // Left
    { type: "tshirt", color: "#3b8a6e", bg: "#c8ead8", angle: -165 },
    { type: "camera", color: "#d4722c", bg: "#f5dbc8", angle: -135 },
    { type: "game", color: "#7b5ea7", bg: "#ddd0f0", angle: -105 },
  ];

  const rInner = 100; // inner orbit radius
  const rOuter = 150; // outer orbit radius

  // Assign alternating inner/outer
  const positioned = items.map((item, i) => {
    const r = i % 2 === 0 ? rInner : rOuter;
    const rad = (item.angle * Math.PI) / 180;
    return {
      ...item,
      x: 190 + r * Math.cos(rad),
      y: 190 + r * Math.sin(rad),
    };
  });

  // SVG icons for each type
  const renderItemIcon = (type, color) => {
    const iconMap = {
      sunglasses: (
        <path
          d="M3 9h4l1 4h8l1-4h4M7 13a2 2 0 004 0M13 13a2 2 0 004 0M1 9h2M21 9h2"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      ),
      bike: (
        <>
          <circle
            cx="6"
            cy="13"
            r="3"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
          <circle
            cx="18"
            cy="13"
            r="3"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M6 13L10 6h4l3 7M10 6l2 7"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ),
      football: (
        <>
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="6"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M12 6v12M8 8l8 8M8 16l8-8"
            stroke={color}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </>
      ),
      music: (
        <path
          d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM21 16a3 3 0 11-6 0 3 3 0 016 0z"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      ),
      coffee: (
        <>
          <path
            d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M6 2v3M10 2v3M14 2v3"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ),
      book: (
        <>
          <path
            d="M4 19.5A2.5 2.5 0 016.5 17H20"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
        </>
      ),
      pizza: (
        <>
          <path
            d="M12 2l10 18H2L12 2z"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="12" cy="12" r="1.5" fill={color} />
          <circle cx="9" cy="15" r="1.5" fill={color} />
          <circle cx="15" cy="15" r="1.5" fill={color} />
        </>
      ),
      wine: (
        <>
          <path
            d="M8 22h8M12 11v11M6 3h12l-3 8a5 5 0 01-6 0L6 3z"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ),
      headphone: (
        <path
          d="M3 18v-6a9 9 0 0118 0v6M3 18a3 3 0 006 0v-3a3 3 0 00-6 0v3zM21 18a3 3 0 01-6 0v-3a3 3 0 016 0v3z"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
      ),
      tshirt: (
        <path
          d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
      ),
      camera: (
        <>
          <path
            d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
          <circle
            cx="12"
            cy="13"
            r="4"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
        </>
      ),
      game: (
        <>
          <rect
            x="2"
            y="7"
            width="20"
            height="14"
            rx="2"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M12 10v6M9 13h6M17 13h.01M19 13h.01"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ),
    };
    return iconMap[type] || <circle cx="12" cy="12" r="5" fill={color} />;
  };

  return (
    <svg
      viewBox="0 0 380 380"
      style={{ width: "100%", height: "100%", maxWidth: 380, maxHeight: 380 }}
    >
      {/* Outer dashed orbit ring */}
      <circle
        cx="190"
        cy="190"
        r={rOuter}
        fill="none"
        stroke="var(--prev-primary-200)"
        strokeWidth="1"
        strokeDasharray="5 5"
        opacity="0.5"
      />
      {/* Inner orbit ring */}
      <circle
        cx="190"
        cy="190"
        r={rInner}
        fill="none"
        stroke="var(--prev-primary-200)"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.35"
      />

      {/* Central gift/rocket sphere */}
      <circle
        cx="190"
        cy="190"
        r="54"
        fill="url(#centralGrad)"
        style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.2))" }}
      />
      <defs>
        <radialGradient id="centralGrad" cx="35%" cy="30%">
          <stop offset="0%" stopColor="var(--prev-primary-300)" />
          <stop offset="100%" stopColor="var(--prev-primary-600)" />
        </radialGradient>
      </defs>
      {/* Gift box icon in center */}
      <g
        transform="translate(162, 162)"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      >
        <rect x="4" y="12" width="48" height="32" rx="2" />
        <rect x="0" y="7" width="56" height="9" rx="2" />
        <path d="M28 7v37" />
        <path d="M28 7s-8-12-14-5 14 5 14 5z" />
        <path d="M28 7s8-12 14-5-14 5-14 5z" />
      </g>

      {/* Floating icon bubbles */}
      {positioned.map((item, i) => (
        <g key={i} transform={`translate(${item.x - 18}, ${item.y - 18})`}>
          <circle
            cx="18"
            cy="18"
            r="18"
            fill={item.bg}
            stroke="white"
            strokeWidth="2"
            style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.12))" }}
          />
          <svg x="6" y="6" width="24" height="24" viewBox="0 0 24 24">
            {renderItemIcon(item.type, item.color)}
          </svg>
        </g>
      ))}

      {/* Cloud decorations */}
      <g opacity="0.7">
        <ellipse cx="60" cy="55" rx="28" ry="16" fill="white" />
        <ellipse cx="80" cy="50" rx="20" ry="13" fill="white" />
        <ellipse cx="45" cy="58" rx="18" ry="11" fill="white" />
      </g>
      <g opacity="0.6">
        <ellipse cx="310" cy="75" rx="22" ry="12" fill="white" />
        <ellipse cx="326" cy="70" rx="16" ry="10" fill="white" />
        <ellipse cx="298" cy="78" rx="14" ry="9" fill="white" />
      </g>
    </svg>
  );
};

// ── Gift card mockup SVG (for Mission section) ────────────────────────────────
const GiftCardMockup = () => (
  <div style={{ position: "relative", maxWidth: 320 }}>
    {/* Decorative top swirl */}
    <svg
      style={{
        position: "absolute",
        top: -20,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: 0.3,
      }}
      width="120"
      height="30"
      viewBox="0 0 120 30"
    >
      <path
        d="M10 20 C30 5, 50 25, 60 15 C70 5, 90 25, 110 10"
        stroke="var(--prev-primary-400)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="10" cy="20" r="3" fill="var(--prev-primary-400)" />
      <circle cx="110" cy="10" r="3" fill="var(--prev-primary-400)" />
    </svg>

    {/* Letter card */}
    <div
      style={{
        background: "var(--prev-surface-raised, var(--prev-surface))",
        border: "1px solid var(--prev-border)",
        borderRadius: 10,
        padding: "18px 22px",
        marginBottom: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        position: "relative",
      }}
    >
      {/* Dotted border inner */}
      <div
        style={{
          position: "absolute",
          inset: 6,
          border: "1px dashed var(--prev-border)",
          borderRadius: 6,
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          fontSize: 9,
          color: "var(--prev-text-subtle)",
          marginBottom: 10,
        }}
      >
        June 8, 2024
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "var(--prev-text)",
          marginBottom: 8,
        }}
      >
        Jane Piper,
      </div>
      <div
        style={{
          fontSize: 11,
          color: "var(--prev-text-subtle)",
          lineHeight: 1.7,
          marginBottom: 10,
        }}
      >
        Thank you so much for hosting us last week! You saved us a world of
        trouble. You are welcome in Chicago any time.
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--prev-text)" }}>
        — Elizabeth &amp; James
      </div>
    </div>

    {/* Arrow pointing down */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--prev-primary-500)",
          marginBottom: 4,
        }}
      >
        Click to claim
      </div>
      <svg width="20" height="24" viewBox="0 0 20 24">
        <path
          d="M10 2v16M4 14l6 8 6-8"
          stroke="var(--prev-primary-500)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    {/* Gift card */}
    <div
      style={{
        background:
          "linear-gradient(135deg, var(--prev-primary-600) 0%, var(--prev-primary-400) 100%)",
        borderRadius: 14,
        padding: "22px 26px",
        boxShadow: "0 8px 32px var(--prev-primary-300)",
        color: "var(--prev-on-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Watermark/stamp feel */}
      <div style={{ position: "absolute", top: 10, right: 10, opacity: 0.15 }}>
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle
            cx="30"
            cy="30"
            r="28"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <circle
            cx="30"
            cy="30"
            r="22"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x="30"
            y="35"
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
          >
            GIFT
          </text>
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          top: -30,
          right: -30,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          bottom: -20,
          left: 20,
        }}
      />

      {/* Decorative top stars */}
      <div
        style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.1em",
          opacity: 0.7,
          marginBottom: 10,
        }}
      >
        ✦ CLICK TO CLAIM ✦
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 900,
          letterSpacing: "-0.03em",
          marginBottom: 6,
        }}
      >
        $100
      </div>
      <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 14 }}>
        Suggested for use at
      </div>
      <div
        style={{
          display: "inline-block",
          background: "rgba(255,255,255,0.2)",
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: 800,
          fontSize: 14,
        }}
      >
        Gary Danko ✦
      </div>
    </div>

    {/* Bottom swirl */}
    <svg
      style={{
        position: "absolute",
        bottom: -18,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: 0.3,
      }}
      width="120"
      height="25"
      viewBox="0 0 120 25"
    >
      <path
        d="M10 5 C30 20, 50 5, 60 15 C70 25, 90 5, 110 18"
        stroke="var(--prev-primary-400)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

// ── Feature card SVGs ──────────────────────────────────────────────────────────
const FeatureCardBg = ({ type }) => {
  if (type === 0)
    return (
      // Gift Cards for any business — dark teal with shirt/tag
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 280 110"
        style={{ position: "absolute", inset: 0 }}
      >
        <rect
          width="280"
          height="110"
          fill="var(--prev-primary-700, #2a4a6e)"
        />
        <circle cx="230" cy="-10" r="70" fill="rgba(255,255,255,0.06)" />
        {/* T-shirt */}
        <g
          transform="translate(30, 20)"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2"
        >
          <path
            d="M15 0 C13 5 8 8 0 8 L5 20 L10 16 L10 45 L40 45 L40 16 L45 20 L50 8 C42 8 37 5 35 0 C33 5 28 8 25 8 C22 8 17 5 15 0z"
            strokeLinejoin="round"
          />
        </g>
        {/* Tag */}
        <g transform="translate(100, 15)">
          <rect
            x="0"
            y="0"
            width="50"
            height="30"
            rx="4"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
          <circle cx="8" cy="8" r="3" fill="rgba(255,255,255,0.4)" />
          <line
            x1="14"
            y1="8"
            x2="42"
            y2="8"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
          />
          <line
            x1="14"
            y1="14"
            x2="42"
            y2="14"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
          <line
            x1="14"
            y1="20"
            x2="36"
            y2="20"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
        </g>
        {/* Bottom label area */}
        <rect x="0" y="80" width="280" height="30" fill="rgba(0,0,0,0.2)" />
        <text
          x="14"
          y="98"
          fill="white"
          fontSize="11"
          fontWeight="800"
          fontFamily="system-ui"
        >
          Gift Cards
        </text>
        <text
          x="14"
          y="108"
          fill="rgba(255,255,255,0.7)"
          fontSize="9"
          fontFamily="system-ui"
        >
          for any business
        </text>
      </svg>
    );
  if (type === 1)
    return (
      // Flexible — teal/green with globe
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 280 110"
        style={{ position: "absolute", inset: 0 }}
      >
        <rect
          width="280"
          height="110"
          fill="var(--prev-secondary-600, #2a7a5a)"
        />
        <circle cx="220" cy="-5" r="70" fill="rgba(255,255,255,0.06)" />
        {/* Globe */}
        <g transform="translate(30, 10)">
          <circle
            cx="40"
            cy="40"
            r="35"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
          />
          <ellipse
            cx="40"
            cy="40"
            rx="17"
            ry="35"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.2"
          />
          <line
            x1="5"
            y1="40"
            x2="75"
            y2="40"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.2"
          />
          <path
            d="M12 22 C28 28 52 28 68 22"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
          />
          <path
            d="M12 58 C28 52 52 52 68 58"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
          />
        </g>
        {/* Freedom badge */}
        <rect
          x="105"
          y="15"
          width="60"
          height="50"
          rx="8"
          fill="rgba(255,255,255,0.12)"
          stroke="rgba(255,255,255,0.2)"
        />
        <text
          x="135"
          y="44"
          textAnchor="middle"
          fill="white"
          fontSize="18"
          fontFamily="system-ui"
        >
          ✓
        </text>
        {/* Bottom */}
        <rect x="0" y="80" width="280" height="30" fill="rgba(0,0,0,0.2)" />
        <text
          x="14"
          y="98"
          fill="white"
          fontSize="11"
          fontWeight="800"
          fontFamily="system-ui"
        >
          Freedom
        </text>
        <text
          x="14"
          y="108"
          fill="rgba(255,255,255,0.7)"
          fontSize="9"
          fontFamily="system-ui"
        >
          to choose
        </text>
      </svg>
    );
  // type === 2 — An experience — red/salmon with star
  return (
    <svg
      width="100%"
      height="110"
      viewBox="0 0 280 110"
      style={{ position: "absolute", inset: 0 }}
    >
      <rect width="280" height="110" fill="var(--prev-accent-600, #c0392b)" />
      <circle cx="220" cy="-5" r="70" fill="rgba(255,255,255,0.06)" />
      {/* Stars */}
      {[40, 70, 100].map((cx, i) => (
        <g key={i} transform={`translate(${cx}, 35)`}>
          <polygon
            points="0,-18 5,-6 18,-6 8,2 12,15 0,8 -12,15 -8,2 -18,-6 -5,-6"
            fill="rgba(255,255,255,0.85)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.5"
            transform={`scale(${0.7 + i * 0.15})`}
          />
        </g>
      ))}
      {/* "Thanks" badge */}
      <rect
        x="120"
        y="18"
        width="80"
        height="44"
        rx="10"
        fill="rgba(255,255,255,0.15)"
        stroke="rgba(255,255,255,0.3)"
      />
      <text
        x="160"
        y="36"
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontWeight="700"
        fontFamily="system-ui"
      >
        ✦ ✦ ✦
      </text>
      <text
        x="160"
        y="50"
        textAnchor="middle"
        fill="white"
        fontSize="13"
        fontWeight="800"
        fontFamily="system-ui"
      >
        Thanks
      </text>
      {/* Bottom */}
      <rect x="0" y="80" width="280" height="30" fill="rgba(0,0,0,0.2)" />
      <text
        x="14"
        y="98"
        fill="white"
        fontSize="11"
        fontWeight="800"
        fontFamily="system-ui"
      >
        Thanks
      </text>
      <text
        x="14"
        y="108"
        fill="rgba(255,255,255,0.7)"
        fontSize="9"
        fontFamily="system-ui"
      >
        for everything
      </text>
    </svg>
  );
};

// ── NAVBAR ─────────────────────────────────────────────────────────────────────
const Navbar = ({ compact }) => (
  <nav
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: compact ? "10px 16px" : "0 36px",
      height: compact ? "auto" : 52,
      background: "var(--prev-navbar-bg, var(--prev-background))",
      borderBottom: "1px solid var(--prev-navbar-border, var(--prev-border))",
      position: "sticky",
      top: 0,
      zIndex: 20,
      flexShrink: 0,
    }}
  >
    {/* Logo */}
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <GiftRocketLogo size={compact ? 28 : 36} />
      <span
        style={{
          fontWeight: 900,
          fontSize: compact ? 14 : 17,
          letterSpacing: "-0.03em",
          color: "var(--prev-navbar-text, var(--prev-text))",
          fontFamily: "'Georgia', serif",
        }}
      >
        Gift<span style={{ color: "var(--prev-primary-500)" }}>Rocket</span>
      </span>
    </div>

    {/* Nav links — centered */}
    {!compact && (
      <div
        style={{
          display: "flex",
          gap: 28,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {["Send a GiftRocket", "How it Works", "Sign in"].map((l, i) => (
          <span
            key={l}
            style={{
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              color: "var(--prev-navbar-text-muted, var(--prev-text-subtle))",
            }}
          >
            {l}
          </span>
        ))}
      </div>
    )}

    {/* Facebook Connect CTA */}
    <div
      style={{
        background: "#3b5998",
        color: "white",
        fontSize: 11,
        fontWeight: 800,
        padding: compact ? "6px 14px" : "7px 16px",
        borderRadius: 6,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
      Connect
    </div>
  </nav>
);

// ── HERO ───────────────────────────────────────────────────────────────────────
const Hero = ({ compact }) => (
  <section
    style={{
      position: "relative",
      overflow: "hidden",
      background: "var(--prev-background)",
      minHeight: compact ? 180 : 340,
      display: "flex",
      alignItems: "center",
      padding: compact ? "28px 20px" : "0",
    }}
  >
    {/* Subtle texture/bg */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(ellipse 70% 80% at 35% 50%, var(--prev-primary-50, rgba(0,0,0,0.03)) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />

    {/* Left: orbital scene */}
    {!compact && (
      <div
        style={{
          position: "relative",
          width: "48%",
          flexShrink: 0,
          height: 340,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OrbitalScene />
      </div>
    )}

    {/* Right: copy */}
    <div
      style={{
        flex: 1,
        padding: compact ? "0" : "0 48px 0 0",
        position: "relative",
        zIndex: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: compact ? "center" : "flex-start",
        textAlign: compact ? "center" : "left",
      }}
    >
      <h1
        style={{
          fontSize: compact ? 22 : 34,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          color: "var(--prev-text)",
          margin: "0 0 16px",
          fontFamily: "'Georgia', serif",
        }}
      >
        The Online
        <br />
        <span style={{ color: "var(--prev-primary-500)" }}>Gift Card.</span>
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: compact ? 16 : 22,
        }}
      >
        {[
          ["Cash with an ", "ecard", " for any occasion"],
          ["Suggest where to spend it"],
          ["They get the money ", "however they choose"],
          ["They'll spend it on what they actually want!"],
        ]
          .slice(0, compact ? 2 : 4)
          .map(([pre, hi, post], i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "baseline", gap: 6 }}
            >
              <span
                style={{
                  color: "var(--prev-primary-500)",
                  fontSize: 11,
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                ★
              </span>
              <span
                style={{
                  fontSize: compact ? 11 : 12.5,
                  color: "var(--prev-text-subtle)",
                  lineHeight: 1.5,
                }}
              >
                {pre}
                {hi && (
                  <span
                    style={{
                      color: "var(--prev-primary-500)",
                      fontWeight: 700,
                    }}
                  >
                    {hi}
                  </span>
                )}
                {post}
              </span>
            </div>
          ))}
      </div>

      {/* CTA button */}
      <div
        style={{
          background: "var(--prev-primary-500)",
          color: "var(--prev-on-primary)",
          fontSize: compact ? 13 : 17,
          fontWeight: 900,
          padding: compact ? "11px 28px" : "15px 44px",
          borderRadius: 8,
          cursor: "pointer",
          boxShadow: "0 4px 20px var(--prev-primary-300)",
          letterSpacing: "0.01em",
          marginBottom: 16,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "'Georgia', serif",
        }}
      >
        Send a GiftRocket
      </div>

      {/* Social proof */}
      {!compact && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Facebook share/send buttons */}
          <div style={{ display: "flex", gap: 6 }}>
            {["f Share", "✉ Send"].map((btn, i) => (
              <div
                key={i}
                style={{
                  background: i === 0 ? "#3b5998" : "#5b9bd5",
                  color: "white",
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: 3,
                  cursor: "pointer",
                }}
              >
                {btn}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 10, color: "var(--prev-text-subtle)" }}>
            <strong style={{ color: "var(--prev-text)" }}>3,243</strong> people
            shared this. Be the first of your friends.
          </span>
        </div>
      )}
    </div>
  </section>
);

// ── CITY BAR ───────────────────────────────────────────────────────────────────
const CityBar = ({ compact }) => {
  if (compact) return null;
  return (
    <div
      style={{
        padding: "6px 36px",
        background: "var(--prev-surface, var(--prev-background))",
        borderTop: "1px solid var(--prev-border)",
        borderBottom: "1px solid var(--prev-border)",
        fontSize: 10,
        color: "var(--prev-text-subtle)",
      }}
    >
      Browse by city:{" "}
      {["Atlanta", "Austin", "Berkeley", "Boston", "Chicago", "more"].map(
        (c, i, arr) => (
          <span key={c}>
            <span
              style={{
                color: "var(--prev-primary-500)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {c}
            </span>
            {i < arr.length - 1 && <span style={{ margin: "0 4px" }}>·</span>}
          </span>
        ),
      )}
    </div>
  );
};

// ── FEATURES ───────────────────────────────────────────────────────────────────
const Features = ({ compact }) => {
  const cols = [
    {
      title: "Suggest any business",
      body: "Buy an 'online gift card' with suggested use at any business. Even businesses that don't have gift cards.",
    },
    {
      title: "Flexible",
      body: "No cash left stranded on a card in their drawer. They decide what to get.",
    },
    {
      title: "An experience",
      body: "Our concierge will give them VIP treatment by helping with reservations, transport, etc.",
    },
  ];

  return (
    <section
      style={{
        padding: compact ? "20px 16px" : "36px 36px",
        background: "var(--prev-background)",
        borderTop: "1px solid var(--prev-border)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: compact ? "1fr" : "repeat(3, 1fr)",
          gap: compact ? 12 : 28,
        }}
      >
        {cols.slice(0, compact ? 2 : 3).map((col, i) => (
          <div key={i}>
            <div
              style={{
                fontWeight: 800,
                fontSize: compact ? 13 : 15,
                color: "var(--prev-text)",
                marginBottom: 6,
              }}
            >
              {col.title}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--prev-text-subtle)",
                lineHeight: 1.65,
                marginBottom: 14,
              }}
            >
              {col.body}
            </div>
            {/* Feature card image */}
            <div
              style={{
                borderRadius: 10,
                overflow: "hidden",
                height: compact ? 70 : 105,
                position: "relative",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}
            >
              <FeatureCardBg type={i} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── MISSION ────────────────────────────────────────────────────────────────────
const Mission = ({ compact }) => (
  <section
    style={{
      padding: compact ? "20px 16px" : "48px 36px",
      background: "var(--prev-surface, var(--prev-background))",
      borderTop: "1px solid var(--prev-border)",
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: compact ? "1fr" : "1fr 1fr",
        gap: compact ? 20 : 50,
        alignItems: "start",
      }}
    >
      {/* Text */}
      <div>
        <h2
          style={{
            fontSize: compact ? 16 : 22,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "var(--prev-text)",
            margin: "0 0 20px",
            fontFamily: "'Georgia', serif",
          }}
        >
          Our Mission
        </h2>

        {[
          {
            h: "Gift cards are thoughtful, but wasteful",
            b: "The intention of gift cards is great — it's nice to think of a business the recipient might like. But plastic cards are a pain to carry around, and it's hard to be sure the recipient will like the business. The recipient may never spend the gift card, or they may end up with extra money left over. Even worse, they might sell it for cash at way below its worth.",
          },
          {
            h: "Keep the good, leave the bad",
            b: "At GiftRocket, we keep the intention of gift cards, but remove the hassle and loss. Pick a business they'll love, even if it doesn't have gift cards. We'll deliver a beautifully packaged card. When they redeem, they'll collect money up-front before they go to the business, and use it to treat themselves.",
          },
          ...(!compact
            ? [
                {
                  h: "Send an online gift card…",
                  b: "…and the recipient will get a gift they'll use and love.",
                  accent: true,
                },
              ]
            : []),
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: 13,
                color: item.accent
                  ? "var(--prev-primary-500)"
                  : "var(--prev-text)",
                marginBottom: 5,
              }}
            >
              {item.h}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--prev-text-subtle)",
                lineHeight: 1.8,
              }}
            >
              {item.b}
            </div>
          </div>
        ))}
      </div>

      {/* Gift card mockup */}
      {!compact && <GiftCardMockup />}
    </div>
  </section>
);

// ── PRESS ──────────────────────────────────────────────────────────────────────
const Press = ({ compact }) => {
  const logos = [
    { name: "Bloomberg\nBusinessweek", quote: "The new wave in gift cards" },
    {
      name: "UrbanDaddy",
      quote: "The latest innovation in drink-buying technology",
    },
    { name: "Mashable", quote: "A young and hip transformation" },
    {
      name: "TNW",
      quote: "Sure as heck beats a gift card that can easily be lost, stolen…",
    },
  ];

  return (
    <section
      style={{
        padding: compact ? "28px 16px" : "50px 36px 40px",
        background: "var(--prev-neutral-900, #1e2a3a)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Wave top — matches GiftRocket's wavy divider */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          overflow: "hidden",
          lineHeight: 0,
          height: 36,
        }}
      >
        <svg
          viewBox="0 0 1200 36"
          preserveAspectRatio="none"
          style={{ width: "100%", height: 36 }}
        >
          <path
            d="M0,36 C200,0 400,36 600,20 C800,4 1000,36 1200,20 L1200,0 L0,0 Z"
            fill="var(--prev-surface, var(--prev-background))"
          />
        </svg>
      </div>

      {/* Subtle blob */}
      <div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "63% 37% 54% 46%",
          background: "var(--prev-primary-500)",
          opacity: 0.12,
          top: -60,
          left: -60,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: compact ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: compact ? 16 : 32,
          position: "relative",
          zIndex: 1,
          marginTop: 16,
        }}
      >
        {logos.slice(0, compact ? 2 : 4).map((l, i) => (
          <div key={i}>
            {/* Opening quote mark */}
            <div
              style={{
                fontSize: 28,
                color: "rgba(255,255,255,0.2)",
                lineHeight: 0.5,
                marginBottom: 12,
              }}
            >
              "
            </div>
            <div
              style={{
                fontSize: compact ? 14 : 18,
                fontWeight: 900,
                color: "white",
                marginBottom: 8,
                lineHeight: 1.2,
                whiteSpace: "pre-line",
                fontFamily: "'Georgia', serif",
              }}
            >
              {l.name}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              {l.quote}{" "}
              <span
                style={{
                  fontSize: 16,
                  verticalAlign: "middle",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                "
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── FOOTER ─────────────────────────────────────────────────────────────────────
const Footer = ({ compact }) => {
  if (compact) return null;

  const cols = [
    {
      h: "About GiftRocket",
      links: ["About", "FAQ", "API", "Contact", "Press", "Jobs"],
    },
    {
      h: "Businesses",
      links: ["Business Owners", "Business Owners FAQ", "Bulk Orders"],
    },
    { h: "Legal stuff", links: ["Terms", "Privacy"] },
    {
      h: "Use GiftRocket",
      links: [
        "Send a GiftRocket",
        "Universal Gift Card",
        "How it Works",
        "Why GiftRocket",
        "Redeem Your Gift",
        "Upcoming Birthdays",
      ],
    },
    {
      h: "Other stuff",
      links: [
        "Blog",
        "Gift Card Worth",
        "History of Gift Cards",
        "Gift Ideas",
        "Sitemap",
        "Chain Store Listings",
      ],
    },
  ];

  return (
    <footer
      style={{
        background: "var(--prev-neutral-900, #111827)",
        padding: "32px 36px 20px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {cols.map((col) => (
          <div key={col.h}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--prev-primary-400)",
                marginBottom: 10,
              }}
            >
              {col.h}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {col.links.map((l) => (
                <span
                  key={l}
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                  }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 16,
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.3)",
            marginBottom: 4,
            fontWeight: 700,
          }}
        >
          Categories:
        </div>
        <div
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.9,
          }}
        >
          Restaurants · Bars · Spas · Shopping · Night Life · Food · Active Life
          · Arts · Hotels &amp; Travel · Event Planning &amp; Services
        </div>
        <div
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.3)",
            marginTop: 10,
            marginBottom: 4,
            fontWeight: 700,
          }}
        >
          Cities:
        </div>
        <div
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.9,
          }}
        >
          Atlanta · Austin · Berkeley · Boston · Chicago · Dallas · Denver ·
          Detroit · Honolulu · Houston · Las Vegas · Los Angeles · Miami ·
          Minneapolis · New York · Oakland · Palo Alto · Philadelphia · Phoenix
          · Portland · San Diego · San Francisco · San Jose · Seattle ·
          Washington DC · More Cities
        </div>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
            © 2024 GiftRocket, Inc.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <GiftRocketLogo size={22} />
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "rgba(255,255,255,0.4)",
                fontFamily: "'Georgia', serif",
              }}
            >
              GiftRocket
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ── Main export ────────────────────────────────────────────────────────────────
export default function FullPalettePreview({
  tokens,
  mode = "light",
  compact = false,
}) {
  if (!tokens)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#999",
          fontSize: 12,
          fontFamily: "system-ui",
        }}
      >
        Assign palette roles to see preview
      </div>
    );

  const cssVars = Object.entries(tokens).reduce((acc, [k, v]) => {
    acc[`--prev-${k}`] = v;
    return acc;
  }, {});

  return (
    <div
      style={{
        ...cssVars,
        height: "100%",
        overflowY: "auto",
        fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
        background: "var(--prev-background)",
        color: "var(--prev-text)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar compact={compact} />
      <Hero compact={compact} />
      <CityBar compact={compact} />
      <Features compact={compact} />
      <Mission compact={compact} />
      <Press compact={compact} />
      <Footer compact={compact} />
    </div>
  );
}
