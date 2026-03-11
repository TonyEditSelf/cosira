// FullPalettePreview.jsx
// Pure display component — knows nothing about oklch/scales.
// Receives a `tokens` object and renders a realistic website mockup.
// Every color is a CSS custom property injected via inline style on the root div.

import React, { useState } from "react";

// ── tiny icon set (inline SVG, no deps) ──────────────────────────────────────
const Icon = ({ name, size = 14, style = {} }) => {
  const paths = {
    menu: "M3 6h18M3 12h18M3 18h18",
    bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-4.993M9 17v1a3 3 0 006 0v-1m-6 0h6",
    search: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    arrow: "M5 12h14M12 5l7 7-7 7",
    check: "M20 6L9 17l-5-5",
    chart: "M3 3v18h18M7 16l4-4 4 4 4-8",
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
    bolt: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    heart:
      "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    settings:
      "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d={paths[name] || paths.bolt} />
    </svg>
  );
};

// ── Avatar placeholder ────────────────────────────────────────────────────────
const Avatar = ({
  initials,
  size = 32,
  color = "var(--prev-primary-500)",
  bg = "var(--prev-primary-100)",
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: bg,
      color,
      fontWeight: 700,
      fontSize: size * 0.35,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      letterSpacing: "0.02em",
    }}
  >
    {initials}
  </div>
);

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, delta, icon, accent }) => (
  <div
    style={{
      background: "var(--prev-surface)",
      border: "1px solid var(--prev-border)",
      borderRadius: 12,
      padding: "16px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--prev-text-subtle)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: accent || "var(--prev-primary-100)",
          color: accent ? "white" : "var(--prev-primary-600)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={13} />
      </div>
    </div>
    <div
      style={{
        fontSize: 22,
        fontWeight: 800,
        color: "var(--prev-text)",
        letterSpacing: "-0.02em",
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: 11,
        color: delta > 0 ? "var(--prev-success-600)" : "var(--prev-error-500)",
        fontWeight: 600,
      }}
    >
      {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}% vs last month
    </div>
  </div>
);

// ── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({ children, variant = "accent" }) => {
  const styles = {
    accent: { bg: "var(--prev-accent-100)", color: "var(--prev-accent-700)" },
    primary: {
      bg: "var(--prev-primary-100)",
      color: "var(--prev-primary-700)",
    },
    success: {
      bg: "var(--prev-success-100)",
      color: "var(--prev-success-700)",
    },
    warning: {
      bg: "var(--prev-warning-100)",
      color: "var(--prev-warning-700)",
    },
    error: { bg: "var(--prev-error-100)", color: "var(--prev-error-600)" },
    neutral: {
      bg: "var(--prev-neutral-100)",
      color: "var(--prev-neutral-700)",
    },
  };
  const s = styles[variant] || styles.accent;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.04em",
        padding: "2px 7px",
        borderRadius: 99,
        textTransform: "uppercase",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
};

// ── Button ────────────────────────────────────────────────────────────────────
const Btn = ({ children, variant = "primary", size = "md", icon }) => {
  const styles = {
    primary: {
      bg: "var(--prev-primary-500)",
      color: "var(--prev-on-primary)",
      border: "none",
    },
    secondary: {
      bg: "var(--prev-secondary-500)",
      color: "var(--prev-on-secondary)",
      border: "none",
    },
    accent: {
      bg: "var(--prev-accent-500)",
      color: "var(--prev-on-accent)",
      border: "none",
    },
    outline: {
      bg: "transparent",
      color: "var(--prev-primary-600)",
      border: "1.5px solid var(--prev-primary-300)",
    },
    ghost: {
      bg: "var(--prev-primary-50)",
      color: "var(--prev-primary-700)",
      border: "none",
    },
    neutral: {
      bg: "var(--prev-neutral-200)",
      color: "var(--prev-neutral-800)",
      border: "none",
    },
    danger: { bg: "var(--prev-error-500)", color: "white", border: "none" },
  };
  const s = styles[variant] || styles.primary;
  const padding =
    size === "sm" ? "5px 12px" : size === "lg" ? "11px 24px" : "8px 16px";
  const fontSize = size === "sm" ? 10 : size === "lg" ? 13 : 11;
  return (
    <button
      style={{
        ...s,
        padding,
        fontSize,
        fontWeight: 700,
        borderRadius: 8,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        letterSpacing: "0.01em",
        border: s.border,
      }}
    >
      {icon && <Icon name={icon} size={fontSize + 2} />}
      {children}
    </button>
  );
};

// ── Input ─────────────────────────────────────────────────────────────────────
const Input = ({ placeholder, icon }) => (
  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
    {icon && (
      <div
        style={{
          position: "absolute",
          left: 10,
          color: "var(--prev-text-subtle)",
          pointerEvents: "none",
        }}
      >
        <Icon name={icon} size={13} />
      </div>
    )}
    <input
      readOnly
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: icon ? "8px 12px 8px 30px" : "8px 12px",
        background: "var(--prev-surface)",
        border: "1.5px solid var(--prev-border)",
        borderRadius: 8,
        fontSize: 11,
        color: "var(--prev-text)",
        outline: "none",
        fontFamily: "inherit",
      }}
    />
  </div>
);

// ── Sidebar nav item ──────────────────────────────────────────────────────────
const NavItem = ({ icon, label, active, badge }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "7px 10px",
      borderRadius: 8,
      cursor: "pointer",
      background: active ? "var(--prev-primary-100)" : "transparent",
      color: active ? "var(--prev-primary-700)" : "var(--prev-text-subtle)",
      fontWeight: active ? 700 : 500,
      fontSize: 12,
      transition: "all 0.15s",
    }}
  >
    <Icon name={icon} size={14} />
    <span style={{ flex: 1 }}>{label}</span>
    {badge && <Badge variant={active ? "primary" : "neutral"}>{badge}</Badge>}
  </div>
);

// ── Mini chart bars ───────────────────────────────────────────────────────────
const MiniChart = () => {
  const bars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88];
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 48 }}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h}%`,
            borderRadius: "3px 3px 0 0",
            background:
              i === bars.length - 1
                ? "var(--prev-primary-500)"
                : i > bars.length - 4
                  ? "var(--prev-primary-300)"
                  : "var(--prev-primary-100)",
          }}
        />
      ))}
    </div>
  );
};

// ── Progress bar ──────────────────────────────────────────────────────────────
const Progress = ({
  value,
  color = "var(--prev-primary-500)",
  bg = "var(--prev-primary-100)",
}) => (
  <div
    style={{ height: 6, background: bg, borderRadius: 99, overflow: "hidden" }}
  >
    <div
      style={{
        height: "100%",
        width: `${value}%`,
        background: color,
        borderRadius: 99,
      }}
    />
  </div>
);

// ── The full preview mockup ───────────────────────────────────────────────────
export default function FullPalettePreview({
  tokens,
  mode = "light",
  compact = false,
}) {
  const [activeNav, setActiveNav] = useState("Dashboard");

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
        }}
      >
        Assign palette roles to see preview
      </div>
    );

  // Inject all tokens as CSS custom properties
  const cssVars = Object.entries(tokens).reduce((acc, [k, v]) => {
    acc[`--prev-${k}`] = v;
    return acc;
  }, {});

  const navItems = [
    { icon: "grid", label: "Dashboard", badge: null },
    { icon: "chart", label: "Analytics", badge: null },
    { icon: "layers", label: "Projects", badge: "12" },
    { icon: "shield", label: "Security", badge: "3" },
    { icon: "settings", label: "Settings", badge: null },
  ];

  return (
    <div
      style={{
        ...cssVars,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
        fontSize: 13,
        background: "var(--prev-background)",
        color: "var(--prev-text)",
        overflow: "hidden",
      }}
    >
      {/* ── NAVBAR ── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "0 20px",
          height: 52,
          flexShrink: 0,
          background: "var(--prev-navbar-bg)",
          borderBottom: "1px solid var(--prev-navbar-border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginRight: 8,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: "var(--prev-primary-500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name="bolt"
              size={13}
              style={{ color: "var(--prev-on-primary)" }}
            />
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: 13,
              color: "var(--prev-navbar-text)",
              letterSpacing: "-0.01em",
            }}
          >
            Nucleus
          </span>
        </div>

        {/* Nav links */}
        {["Product", "Solutions", "Pricing", "Docs"].map((l) => (
          <span
            key={l}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color:
                l === "Product"
                  ? "var(--prev-primary-500)"
                  : "var(--prev-navbar-text-muted)",
              cursor: "pointer",
              padding: "4px 0",
              borderBottom:
                l === "Product"
                  ? "2px solid var(--prev-primary-500)"
                  : "2px solid transparent",
            }}
          >
            {l}
          </span>
        ))}

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "var(--prev-navbar-search-bg)",
            border: "1px solid var(--prev-navbar-border)",
            borderRadius: 8,
            padding: "5px 10px",
            color: "var(--prev-navbar-text-muted)",
            fontSize: 11,
          }}
        >
          <Icon name="search" size={12} />
          <span>Search…</span>
          <kbd
            style={{
              fontSize: 9,
              padding: "1px 4px",
              borderRadius: 3,
              background: "var(--prev-navbar-kbd-bg)",
              color: "var(--prev-navbar-text-muted)",
              border: "1px solid var(--prev-navbar-border)",
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              position: "relative",
              cursor: "pointer",
              color: "var(--prev-navbar-text-muted)",
            }}
          >
            <Icon name="bell" size={16} />
            <div
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--prev-accent-500)",
                border: "1.5px solid var(--prev-navbar-bg)",
              }}
            />
          </div>
          <Btn variant="primary" size="sm">
            Upgrade
          </Btn>
          <Avatar
            initials="JS"
            size={28}
            color="var(--prev-on-primary)"
            bg="var(--prev-primary-500)"
          />
        </div>
      </nav>

      {/* ── BODY: sidebar + main ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* ── SIDEBAR ── */}
        <aside
          style={{
            width: compact ? 48 : 180,
            flexShrink: 0,
            background: "var(--prev-sidebar-bg)",
            borderRight: "1px solid var(--prev-border)",
            padding: compact ? "12px 6px" : "16px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
          }}
        >
          {!compact && (
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--prev-text-subtle)",
                padding: "4px 10px 8px",
                marginBottom: 4,
              }}
            >
              Main Menu
            </div>
          )}
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              style={{ cursor: "pointer" }}
            >
              {compact ? (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      activeNav === item.label
                        ? "var(--prev-primary-100)"
                        : "transparent",
                    color:
                      activeNav === item.label
                        ? "var(--prev-primary-600)"
                        : "var(--prev-text-subtle)",
                  }}
                >
                  <Icon name={item.icon} size={16} />
                </div>
              ) : (
                <NavItem {...item} active={activeNav === item.label} />
              )}
            </div>
          ))}

          {!compact && (
            <>
              <div style={{ flex: 1 }} />
              <div
                style={{
                  borderTop: "1px solid var(--prev-border)",
                  paddingTop: 12,
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                  }}
                >
                  <Avatar
                    initials="JS"
                    size={26}
                    color="var(--prev-on-primary)"
                    bg="var(--prev-primary-500)"
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--prev-text)",
                      }}
                    >
                      Jamie S.
                    </div>
                    <div
                      style={{ fontSize: 9, color: "var(--prev-text-subtle)" }}
                    >
                      Pro Plan
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main
          style={{
            flex: 1,
            overflow: "auto",
            padding: compact ? 12 : 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Page header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: compact ? 14 : 18,
                  fontWeight: 800,
                  color: "var(--prev-text)",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Dashboard
              </h1>
              {!compact && (
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--prev-text-subtle)",
                    margin: "3px 0 0",
                  }}
                >
                  Welcome back, Jamie — here's what's happening.
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="outline" size="sm" icon="search">
                Filter
              </Btn>
              <Btn variant="primary" size="sm" icon="bolt">
                New Report
              </Btn>
            </div>
          </div>

          {/* Hero banner */}
          <div
            style={{
              borderRadius: 14,
              padding: compact ? "14px 16px" : "20px 24px",
              background: `linear-gradient(135deg, var(--prev-primary-600) 0%, var(--prev-primary-400) 100%)`,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* decorative circle */}
            <div
              style={{
                position: "absolute",
                right: -20,
                top: -20,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 40,
                bottom: -30,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
              }}
            />
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <Badge variant="accent">New Feature</Badge>
                {!compact && (
                  <span
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.7)",
                      fontWeight: 500,
                    }}
                  >
                    Just launched
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: compact ? 13 : 16,
                  fontWeight: 800,
                  color: "var(--prev-on-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                AI-powered analytics
              </div>
              {!compact && (
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.75)",
                    marginTop: 4,
                    maxWidth: 280,
                  }}
                >
                  Get deeper insights with our new machine learning pipeline.
                </div>
              )}
            </div>
            <Btn variant="accent" size={compact ? "sm" : "md"} icon="arrow">
              {compact ? "Try" : "Try it free"}
            </Btn>
          </div>

          {/* Stat cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${compact ? 2 : 4}, 1fr)`,
              gap: 10,
            }}
          >
            <StatCard
              label="Revenue"
              value="$84.2k"
              delta={12.4}
              icon="chart"
            />
            <StatCard label="Users" value="24,891" delta={8.1} icon="user" />
            <StatCard
              label="Sessions"
              value="1.2M"
              delta={-3.2}
              icon="bolt"
              accent="var(--prev-accent-500)"
            />
            {!compact && (
              <StatCard
                label="Uptime"
                value="99.9%"
                delta={0.2}
                icon="shield"
                accent="var(--prev-success-600)"
              />
            )}
          </div>

          {/* Middle row: chart + activity */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: compact ? "1fr" : "1fr 1fr",
              gap: 12,
            }}
          >
            {/* Chart card */}
            <div
              style={{
                background: "var(--prev-surface)",
                border: "1px solid var(--prev-border)",
                borderRadius: 12,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 12,
                    color: "var(--prev-text)",
                  }}
                >
                  Revenue trend
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {["1W", "1M", "3M"].map((t, i) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 10,
                        padding: "2px 7px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: 600,
                        background:
                          i === 1 ? "var(--prev-primary-100)" : "transparent",
                        color:
                          i === 1
                            ? "var(--prev-primary-600)"
                            : "var(--prev-text-subtle)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <MiniChart />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ]
                  .slice(0, compact ? 6 : 12)
                  .map((m) => (
                    <span
                      key={m}
                      style={{ fontSize: 8, color: "var(--prev-text-subtle)" }}
                    >
                      {m}
                    </span>
                  ))}
              </div>
            </div>

            {/* Activity feed */}
            <div
              style={{
                background: "var(--prev-surface)",
                border: "1px solid var(--prev-border)",
                borderRadius: 12,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 12,
                  color: "var(--prev-text)",
                  marginBottom: 12,
                }}
              >
                Recent activity
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[
                  {
                    user: "AK",
                    name: "Aisha K.",
                    action: "deployed v2.4",
                    time: "2m",
                    badge: "success",
                    badgeLabel: "Live",
                  },
                  {
                    user: "TR",
                    name: "Tom R.",
                    action: "opened issue #83",
                    time: "8m",
                    badge: "warning",
                    badgeLabel: "Open",
                  },
                  {
                    user: "ML",
                    name: "Mia L.",
                    action: "merged PR #201",
                    time: "14m",
                    badge: "primary",
                    badgeLabel: "Merged",
                  },
                  {
                    user: "JS",
                    name: "Jamie S.",
                    action: "reviewed design",
                    time: "1h",
                    badge: "neutral",
                    badgeLabel: "Done",
                  },
                ]
                  .slice(0, compact ? 3 : 4)
                  .map((item, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <Avatar
                        initials={item.user}
                        size={26}
                        bg={
                          [
                            "var(--prev-primary-100)",
                            "var(--prev-accent-100)",
                            "var(--prev-secondary-100)",
                            "var(--prev-neutral-100)",
                          ][i % 4]
                        }
                        color={
                          [
                            "var(--prev-primary-600)",
                            "var(--prev-accent-600)",
                            "var(--prev-secondary-600)",
                            "var(--prev-neutral-600)",
                          ][i % 4]
                        }
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--prev-text)",
                          }}
                        >
                          {item.name}{" "}
                          <span
                            style={{
                              fontWeight: 400,
                              color: "var(--prev-text-subtle)",
                            }}
                          >
                            {item.action}
                          </span>
                        </div>
                      </div>
                      <Badge variant={item.badge}>{item.badgeLabel}</Badge>
                      <span
                        style={{
                          fontSize: 9,
                          color: "var(--prev-text-subtle)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.time} ago
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Bottom row: project list + form */}
          {!compact && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 320px",
                gap: 12,
              }}
            >
              {/* Project table */}
              <div
                style={{
                  background: "var(--prev-surface)",
                  border: "1px solid var(--prev-border)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid var(--prev-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 12,
                      color: "var(--prev-text)",
                    }}
                  >
                    Projects
                  </span>
                  <Btn variant="ghost" size="sm">
                    View all
                  </Btn>
                </div>
                {[
                  {
                    name: "Design System",
                    prog: 78,
                    status: "primary",
                    statusLabel: "Active",
                    team: ["AK", "TR", "ML"],
                  },
                  {
                    name: "API v3",
                    prog: 45,
                    status: "warning",
                    statusLabel: "At risk",
                    team: ["JS", "AK"],
                  },
                  {
                    name: "Mobile App",
                    prog: 92,
                    status: "success",
                    statusLabel: "On track",
                    team: ["ML", "TR"],
                  },
                  {
                    name: "Data Pipeline",
                    prog: 31,
                    status: "error",
                    statusLabel: "Delayed",
                    team: ["AK"],
                  },
                ].map((proj, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 18px",
                      borderBottom:
                        i < 3 ? "1px solid var(--prev-border)" : "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 5,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--prev-text)",
                          }}
                        >
                          {proj.name}
                        </span>
                        <Badge variant={proj.status}>{proj.statusLabel}</Badge>
                      </div>
                      <Progress
                        value={proj.prog}
                        color={`var(--prev-${proj.status === "primary" ? "primary" : proj.status === "success" ? "success" : proj.status === "warning" ? "warning" : "error"}-500)`}
                        bg={`var(--prev-${proj.status === "primary" ? "primary" : proj.status === "success" ? "success" : proj.status === "warning" ? "warning" : "error"}-100)`}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--prev-text-subtle)",
                        minWidth: 28,
                      }}
                    >
                      {proj.prog}%
                    </span>
                    <div style={{ display: "flex" }}>
                      {proj.team.map((t, ti) => (
                        <Avatar
                          key={ti}
                          initials={t}
                          size={22}
                          style={{ marginLeft: ti > 0 ? -6 : 0 }}
                          bg="var(--prev-primary-100)"
                          color="var(--prev-primary-700)"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick form */}
              <div
                style={{
                  background: "var(--prev-surface)",
                  border: "1px solid var(--prev-border)",
                  borderRadius: 12,
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 12,
                    color: "var(--prev-text)",
                  }}
                >
                  Create task
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "var(--prev-text-subtle)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    TITLE
                  </label>
                  <Input placeholder="Task name..." />
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "var(--prev-text-subtle)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    ASSIGNEE
                  </label>
                  <Input placeholder="Search team members…" icon="search" />
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "var(--prev-text-subtle)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    PRIORITY
                  </label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      ["High", "error"],
                      ["Med", "warning"],
                      ["Low", "success"],
                    ].map(([l, v]) => (
                      <div
                        key={l}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          padding: "5px 0",
                          borderRadius: 7,
                          cursor: "pointer",
                          fontSize: 10,
                          fontWeight: 600,
                          background:
                            l === "High"
                              ? "var(--prev-error-100)"
                              : "var(--prev-neutral-100)",
                          color:
                            l === "High"
                              ? "var(--prev-error-600)"
                              : "var(--prev-text-subtle)",
                          border:
                            l === "High"
                              ? "1.5px solid var(--prev-error-300)"
                              : "1.5px solid var(--prev-border)",
                        }}
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <Btn variant="outline" size="sm">
                    Cancel
                  </Btn>
                  <Btn variant="primary" size="sm" icon="check">
                    Create Task
                  </Btn>
                </div>

                {/* Color showcase strip */}
                <div
                  style={{
                    borderTop: "1px solid var(--prev-border)",
                    paddingTop: 10,
                    marginTop: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "var(--prev-text-subtle)",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Token palette
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[
                      "var(--prev-primary-500)",
                      "var(--prev-secondary-500)",
                      "var(--prev-accent-500)",
                      "var(--prev-success-500)",
                      "var(--prev-warning-500)",
                      "var(--prev-error-500)",
                    ].map((c, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 16,
                          borderRadius: 4,
                          background: c,
                        }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
