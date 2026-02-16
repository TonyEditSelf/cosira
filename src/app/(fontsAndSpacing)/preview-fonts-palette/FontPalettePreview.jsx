import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Smartphone,
  CreditCard,
  Globe,
  FileText,
  DollarSign,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  Sun,
  Moon,
  LayoutDashboard,
  Newspaper,
  Eye,
  Download,
  Clock,
  Sliders,
  Shuffle,
  BookOpen,
} from "lucide-react";
import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
import { generateExpandedPalette } from "@/app/(palettes)/palette-expander/colorexpansion";

// ─── COLOR UTILITIES ──────────────────────────────────────────────────────────
const oklchToCss = (color) => {
  if (!color) return "oklch(50% 0 0)";
  const { l, c, h, a = 1 } = color;
  return `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(4)} ${(h || 0).toFixed(1)} / ${a})`;
};

const getContrastColor = (bg) => {
  if (!bg) return { l: 0.1, c: 0, h: 0 };
  return bg.l > 0.5
    ? { l: 0.08, c: 0.005, h: bg.h || 0 }
    : { l: 0.96, c: 0.005, h: bg.h || 0 };
};

const relativeLuminance = (color) => {
  if (!color) return 0;
  const { l, c, h } = color;
  const hRad = ((h || 0) * Math.PI) / 180;
  const a_ = c * Math.cos(hRad),
    b_ = c * Math.sin(hRad);
  const l_ = l + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m_ = l - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s_ = l - 0.0894841775 * a_ - 1.291485548 * b_;
  const ll = l_ ** 3,
    mm = m_ ** 3,
    ss = s_ ** 3;
  const r = Math.max(
    0,
    Math.min(1, 4.0767416621 * ll - 3.3077115913 * mm + 0.2309699292 * ss),
  );
  const g = Math.max(
    0,
    Math.min(1, -1.2684380046 * ll + 2.6097574011 * mm - 0.3413193965 * ss),
  );
  const b2 = Math.max(
    0,
    Math.min(1, -0.0041960863 * ll - 0.7034186147 * mm + 1.707614701 * ss),
  );
  const toLinear = (v) => {
    const s = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b2);
};

const wcagRatio = (fg, bg) => {
  const l1 = relativeLuminance(fg),
    l2 = relativeLuminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const wcagRating = (r) =>
  r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA+" : "Fail";
const ratingColor = (r) =>
  r === "AAA"
    ? "#16a34a"
    : r === "AA"
      ? "#2563eb"
      : r.includes("AA")
        ? "#d97706"
        : "#dc2626";

const apcaScore = (fg, bg) => {
  const yl = relativeLuminance(fg),
    yb = relativeLuminance(bg);
  if (Math.abs(yl - yb) < 0.0005) return 0;
  const s =
    yb > yl
      ? (Math.pow(yb, 0.56) - Math.pow(yl, 0.57)) * 1.14
      : (Math.pow(yb, 0.65) - Math.pow(yl, 0.62)) * 1.14;
  return Math.round(Math.abs(s) * 100);
};

// ─── FONT DATA ────────────────────────────────────────────────────────────────
const fontProfiles = {
  "Playfair Display": {
    style: "serif",
    xHeight: 0.72,
    pairs: ["DM Sans", "Manrope", "Plus Jakarta Sans"],
  },
  "Cormorant Garamond": {
    style: "serif",
    xHeight: 0.65,
    pairs: ["Raleway", "Outfit", "DM Sans"],
  },
  Fraunces: {
    style: "serif",
    xHeight: 0.74,
    pairs: ["DM Sans", "Plus Jakarta Sans", "Work Sans"],
  },
  "EB Garamond": {
    style: "serif",
    xHeight: 0.66,
    pairs: ["Work Sans", "Outfit", "Manrope"],
  },
  Lora: {
    style: "serif",
    xHeight: 0.7,
    pairs: ["Work Sans", "Outfit", "DM Sans"],
  },
  Merriweather: {
    style: "serif",
    xHeight: 0.73,
    pairs: ["Manrope", "Work Sans", "DM Sans"],
  },
  "Plus Jakarta Sans": {
    style: "sans",
    xHeight: 0.73,
    pairs: ["Fraunces", "Cormorant Garamond", "Lora"],
  },
  Manrope: {
    style: "sans",
    xHeight: 0.73,
    pairs: ["Playfair Display", "EB Garamond", "Lora"],
  },
  "DM Sans": {
    style: "sans",
    xHeight: 0.72,
    pairs: ["Playfair Display", "Cormorant Garamond", "Fraunces"],
  },
  "Work Sans": {
    style: "sans",
    xHeight: 0.71,
    pairs: ["Lora", "EB Garamond", "Merriweather"],
  },
  Poppins: {
    style: "geometric",
    xHeight: 0.74,
    pairs: ["Playfair Display", "Cormorant Garamond", "Fraunces"],
  },
  Outfit: {
    style: "geometric",
    xHeight: 0.73,
    pairs: ["Lora", "Merriweather", "Fraunces"],
  },
  Syne: {
    style: "display",
    xHeight: 0.7,
    pairs: ["DM Sans", "Manrope", "Outfit"],
  },
  "Space Grotesk": {
    style: "grotesque",
    xHeight: 0.72,
    pairs: ["Lora", "Merriweather", "Fraunces"],
  },
  "Bricolage Grotesque": {
    style: "display",
    xHeight: 0.74,
    pairs: ["DM Sans", "Work Sans", "Outfit"],
  },
  "Space Mono": {
    style: "mono",
    xHeight: 0.7,
    pairs: ["Syne", "Outfit", "DM Sans"],
  },
};

const FONTS = [
  "Playfair Display",
  "Cormorant Garamond",
  "Fraunces",
  "EB Garamond",
  "Lora",
  "Merriweather",
  "Plus Jakarta Sans",
  "Manrope",
  "DM Sans",
  "Work Sans",
  "Poppins",
  "Outfit",
  "Montserrat",
  "Raleway",
  "Syne",
  "Bricolage Grotesque",
  "Space Grotesk",
  "JetBrains Mono",
  "Space Mono",
];

// ─── SCREEN SIMULATION ────────────────────────────────────────────────────────
const SCREEN_FILTERS = {
  standard: { label: "sRGB", filter: "none" },
  oled: { label: "OLED", filter: "contrast(1.08) saturate(1.15)" },
  lcd: {
    label: "LCD",
    filter: "contrast(0.92) saturate(0.88) brightness(0.96)",
  },
  lowlight: { label: "Low Light", filter: "brightness(0.44) contrast(1.08)" },
  highcontrast: { label: "Hi-Contrast", filter: "contrast(1.5) saturate(0)" },
};

const CB_FILTERS = {
  normal: "none",
  deuteranopia: "url(#cb-deut)",
  protanopia: "url(#cb-prot)",
  tritanopia: "url(#cb-trit)",
  achromatopsia: "grayscale(100%)",
};

// SVG Color Blindness Filter Definitions
const CBFilterDefs = () => (
  <svg
    style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    aria-hidden
  >
    <defs>
      <filter
        id="cb-deut"
        x="0"
        y="0"
        width="100%"
        height="100%"
        colorInterpolationFilters="linearRGB"
      >
        <feColorMatrix
          type="matrix"
          values="0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0"
        />
      </filter>
      <filter
        id="cb-prot"
        x="0"
        y="0"
        width="100%"
        height="100%"
        colorInterpolationFilters="linearRGB"
      >
        <feColorMatrix
          type="matrix"
          values="0.152 1.053 -0.205 0 0  0.115 0.786 0.099 0 0  -0.004 -0.048 1.052 0 0  0 0 0 1 0"
        />
      </filter>
      <filter
        id="cb-trit"
        x="0"
        y="0"
        width="100%"
        height="100%"
        colorInterpolationFilters="linearRGB"
      >
        <feColorMatrix
          type="matrix"
          values="1.256 -0.077 -0.179 0 0  -0.078 0.931 0.148 0 0  0.005 0.691 0.304 0 0  0 0 0 1 0"
        />
      </filter>
    </defs>
  </svg>
);

// ─── PREVIEW TEMPLATES ────────────────────────────────────────────────────────

// Dashboard with dense data table
const DashboardPreview = ({ tokens, fonts, typo }) => {
  const bg = oklchToCss(tokens.background),
    surf = oklchToCss(tokens.surface),
    acc = oklchToCss(tokens.accent);
  const txt = getContrastColor(tokens.background),
    muted = { ...txt, a: 0.5 },
    bdr = oklchToCss(tokens.border);
  const metrics = [
    { l: "Revenue", v: "$84,234", d: "+12.4%", up: true },
    { l: "Users", v: "24,891", d: "+8.1%", up: true },
    { l: "Churn", v: "2.3%", d: "-0.4%", up: false },
    { l: "LTV", v: "$1,240", d: "+5.7%", up: true },
  ];
  const rows = [
    { n: "Orion SaaS", p: "Enterprise", m: "$4,200", s: "Active" },
    { n: "Nimbus Co", p: "Pro", m: "$840", s: "Active" },
    { n: "Helix Labs", p: "Starter", m: "$120", s: "Trial" },
    { n: "Vela Group", p: "Enterprise", m: "$6,400", s: "Active" },
    { n: "Prism Inc", p: "Pro", m: "$840", s: "Paused" },
  ];
  const sc = (s) =>
    s === "Active"
      ? tokens.success
      : s === "Trial"
        ? tokens.accent
        : { l: 0.6, c: 0.05, h: 30 };
  const bars = [40, 65, 45, 80, 55, 92, 70];
  return (
    <div
      style={{
        backgroundColor: bg,
        minHeight: "100%",
        padding: 24,
        fontFamily: fonts.body,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: fonts.heading,
              color: oklchToCss(txt),
              fontSize: 20,
              fontWeight: 700,
              margin: 0,
              letterSpacing: `${typo.tracking}em`,
              lineHeight: typo.leading,
            }}
          >
            Analytics Overview
          </h1>
          <p
            style={{
              color: oklchToCss(muted),
              fontSize: 11,
              margin: "3px 0 0",
              fontFamily: fonts.caption,
            }}
          >
            Q4 2024 · Updated just now
          </p>
        </div>
        <button
          style={{
            backgroundColor: acc,
            color: oklchToCss(getContrastColor(tokens.accent)),
            padding: "7px 16px",
            borderRadius: 8,
            border: "none",
            fontFamily: fonts.button,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Export
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {metrics.map((m, i) => (
          <div
            key={i}
            style={{
              backgroundColor: surf,
              borderRadius: 10,
              padding: "14px 16px",
              border: `1px solid ${bdr}`,
            }}
          >
            <p
              style={{
                fontFamily: fonts.caption,
                color: oklchToCss(muted),
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 6px",
              }}
            >
              {m.l}
            </p>
            <p
              style={{
                fontFamily: fonts.heading,
                color: oklchToCss(txt),
                fontSize: 20,
                fontWeight: 700,
                margin: "0 0 4px",
                lineHeight: typo.leading,
              }}
            >
              {m.v}
            </p>
            <span
              style={{
                fontSize: 10,
                fontFamily: fonts.caption,
                color: m.up ? oklchToCss(tokens.success) : "#ef4444",
                fontWeight: 600,
              }}
            >
              {m.d}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 240px",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            backgroundColor: surf,
            borderRadius: 10,
            padding: "16px 18px",
            border: `1px solid ${bdr}`,
          }}
        >
          <p
            style={{
              fontFamily: fonts.caption,
              color: oklchToCss(muted),
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 14px",
            }}
          >
            Monthly Revenue
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 7,
              height: 68,
            }}
          >
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${h}%`,
                    backgroundColor:
                      i === 5 ? acc : oklchToCss({ ...tokens.accent, a: 0.22 }),
                    borderRadius: "4px 4px 0 0",
                  }}
                />
                <span
                  style={{
                    fontSize: 8,
                    color: oklchToCss(muted),
                    fontFamily: fonts.caption,
                  }}
                >
                  {"JFMAMJJ"[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            backgroundColor: surf,
            borderRadius: 10,
            padding: "16px",
            border: `1px solid ${bdr}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: fonts.caption,
              color: oklchToCss(muted),
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 10px",
              alignSelf: "flex-start",
            }}
          >
            Plan Mix
          </p>
          <svg width="76" height="76" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke={oklchToCss({ ...tokens.accent, a: 0.15 })}
              strokeWidth="3.5"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke={acc}
              strokeWidth="3.5"
              strokeDasharray="60 40"
              strokeDashoffset="25"
              strokeLinecap="round"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke={oklchToCss(tokens.success)}
              strokeWidth="3.5"
              strokeDasharray="25 75"
              strokeDashoffset="-35"
              strokeLinecap="round"
            />
            <text
              x="18"
              y="20"
              textAnchor="middle"
              fontSize="5"
              fill={oklchToCss(txt)}
              fontWeight="700"
              fontFamily="sans-serif"
            >
              60%
            </text>
          </svg>
        </div>
      </div>
      <div
        style={{
          backgroundColor: surf,
          borderRadius: 10,
          border: `1px solid ${bdr}`,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "11px 18px", borderBottom: `1px solid ${bdr}` }}>
          <p
            style={{
              fontFamily: fonts.caption,
              color: oklchToCss(muted),
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: 0,
            }}
          >
            Customer Accounts
          </p>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: oklchToCss(tokens.background) }}>
              {["Company", "Plan", "MRR", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "7px 18px",
                    textAlign: "left",
                    fontSize: 9,
                    fontFamily: fonts.caption,
                    color: oklchToCss(muted),
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${bdr}` }}>
                <td
                  style={{
                    padding: "9px 18px",
                    fontSize: 12,
                    fontFamily: fonts.body,
                    color: oklchToCss(txt),
                    fontWeight: 500,
                  }}
                >
                  {r.n}
                </td>
                <td
                  style={{
                    padding: "9px 18px",
                    fontSize: 11,
                    fontFamily: fonts.caption,
                    color: oklchToCss(muted),
                  }}
                >
                  {r.p}
                </td>
                <td
                  style={{
                    padding: "9px 18px",
                    fontSize: 12,
                    fontFamily: fonts.heading,
                    color: oklchToCss(txt),
                    fontWeight: 600,
                  }}
                >
                  {r.m}
                </td>
                <td style={{ padding: "9px 18px" }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: fonts.caption,
                      backgroundColor: oklchToCss({ ...sc(r.s), a: 0.15 }),
                      color: oklchToCss(sc(r.s)),
                      padding: "3px 8px",
                      borderRadius: 20,
                      fontWeight: 600,
                    }}
                  >
                    {r.s}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Editorial / Magazine layout
const EditorialPreview = ({ tokens, fonts, typo }) => {
  const bg = oklchToCss(tokens.background),
    txt = oklchToCss(getContrastColor(tokens.background));
  const muted = oklchToCss({ ...getContrastColor(tokens.background), a: 0.5 }),
    acc = oklchToCss(tokens.accent),
    bdr = oklchToCss(tokens.border);
  return (
    <div
      style={{ backgroundColor: bg, minHeight: "100%", fontFamily: fonts.body }}
    >
      <div
        style={{
          borderBottom: `2px solid ${txt}`,
          padding: "12px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: fonts.brand,
            color: txt,
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          THE REVIEW
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Arts", "Science", "Culture", "Opinion"].map((n) => (
            <span
              key={n}
              style={{
                fontSize: 10,
                fontFamily: fonts.caption,
                color: muted,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {n}
            </span>
          ))}
        </div>
        <span style={{ fontFamily: fonts.caption, color: muted, fontSize: 10 }}>
          Feb 14, 2026
        </span>
      </div>
      <div
        style={{
          padding: "26px 36px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 0,
        }}
      >
        <div
          style={{
            gridColumn: "1/3",
            paddingRight: 26,
            borderRight: `1px solid ${bdr}`,
          }}
        >
          <div
            style={{
              backgroundColor: acc,
              display: "inline-block",
              padding: "2px 9px",
              marginBottom: 10,
              borderRadius: 3,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontFamily: fonts.caption,
                color: oklchToCss(getContrastColor(tokens.accent)),
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              Cover Story
            </span>
          </div>
          <h1
            style={{
              fontFamily: fonts.heading,
              color: txt,
              fontSize: 30,
              fontWeight: 700,
              lineHeight: typo.leading,
              letterSpacing: `${typo.tracking}em`,
              margin: "0 0 12px",
              transform: `scale(${typo.size})`,
              transformOrigin: "left top",
            }}
          >
            The New Science of Seeing Color in a Digital Age
          </h1>
          <p
            style={{
              fontFamily: fonts.body,
              color: muted,
              fontSize: 12,
              lineHeight: typo.leading + 0.1,
              marginBottom: 14,
            }}
          >
            Researchers are challenging how designers think about contrast,
            accessibility, and human perception — rewriting the rules from first
            principles.
          </p>
          <blockquote
            style={{
              borderLeft: `3px solid ${acc}`,
              paddingLeft: 14,
              margin: "16px 0",
              fontFamily: fonts.heading,
              color: txt,
              fontSize: 15,
              fontStyle: "italic",
              lineHeight: typo.leading,
            }}
          >
            "We've been measuring the wrong thing for thirty years."
          </blockquote>
          <p
            style={{
              fontFamily: fonts.body,
              color: muted,
              fontSize: 11,
              lineHeight: typo.leading + 0.1,
            }}
          >
            The experiment was simple: show the same interface to 200 users
            under different lighting conditions. The results overturned a decade
            of guidance on contrast and readability.
          </p>
        </div>
        <div style={{ paddingLeft: 20 }}>
          {[
            {
              tag: "Typography",
              title: "Variable Fonts and the End of the Style Sheet",
              teaser: "One file, infinite expressions.",
            },
            {
              tag: "Accessibility",
              title: "APCA: Why WCAG 3.0 Matters",
              teaser: "The new algorithm matches how eyes actually work.",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                borderBottom: `1px solid ${bdr}`,
                paddingBottom: 15,
                marginBottom: 15,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontFamily: fonts.caption,
                  color: acc,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                {s.tag}
              </span>
              <h3
                style={{
                  fontFamily: fonts.heading,
                  color: txt,
                  fontSize: 13,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  margin: "0 0 6px",
                  letterSpacing: `${typo.tracking}em`,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: fonts.body,
                  color: muted,
                  fontSize: 10,
                  lineHeight: typo.leading,
                  margin: 0,
                }}
              >
                {s.teaser}
              </p>
            </div>
          ))}
          <div
            style={{
              backgroundColor: oklchToCss(tokens.surface),
              borderRadius: 8,
              padding: "12px",
              border: `1px solid ${bdr}`,
            }}
          >
            <p
              style={{
                fontFamily: fonts.caption,
                color: muted,
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 5px",
              }}
            >
              Sponsor
            </p>
            <p
              style={{
                fontFamily: fonts.heading,
                color: txt,
                fontSize: 12,
                fontWeight: 700,
                margin: "0 0 5px",
                lineHeight: 1.3,
              }}
            >
              Design Systems Summit 2026
            </p>
            <p
              style={{
                fontFamily: fonts.body,
                color: muted,
                fontSize: 10,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Three days. 80 speakers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Minimalist landing page
const LandingPreview = ({ tokens, fonts, typo }) => {
  const txt = oklchToCss(getContrastColor(tokens.background)),
    muted = oklchToCss({ ...getContrastColor(tokens.background), a: 0.6 }),
    acc = oklchToCss(tokens.accent);
  return (
    <div
      style={{
        backgroundColor: oklchToCss(tokens.background),
        minHeight: "100%",
        fontFamily: fonts.body,
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 44px",
          borderBottom: `1px solid ${oklchToCss(tokens.border)}`,
        }}
      >
        <span
          style={{
            fontFamily: fonts.brand,
            color: txt,
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
        >
          BRAND
        </span>
        <div style={{ display: "flex", gap: 28 }}>
          {["Product", "Pricing", "Docs"].map((n) => (
            <span
              key={n}
              style={{
                fontSize: 11,
                fontFamily: fonts.body,
                color: muted,
                cursor: "pointer",
              }}
            >
              {n}
            </span>
          ))}
        </div>
        <button
          style={{
            backgroundColor: acc,
            color: oklchToCss(getContrastColor(tokens.accent)),
            padding: "7px 18px",
            borderRadius: 8,
            border: "none",
            fontFamily: fonts.button,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
      </nav>
      <div
        style={{
          maxWidth: 640,
          margin: "44px auto",
          padding: "0 44px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: oklchToCss({ ...tokens.accent, a: 0.12 }),
            borderRadius: 20,
            padding: "4px 14px",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontFamily: fonts.caption,
              color: acc,
              fontWeight: 700,
            }}
          >
            ↗ New: Variable Font Support
          </span>
        </div>
        <h1
          style={{
            fontFamily: fonts.heading,
            color: txt,
            fontSize: 44,
            fontWeight: 700,
            lineHeight: typo.leading,
            letterSpacing: `${typo.tracking}em`,
            margin: "0 0 16px",
            transform: `scale(${typo.size})`,
            transformOrigin: "top center",
          }}
        >
          Design Systems That <span style={{ color: acc }}>Actually Work</span>
        </h1>
        <p
          style={{
            fontFamily: fonts.body,
            color: muted,
            fontSize: 14,
            lineHeight: typo.leading + 0.1,
            marginBottom: 26,
            maxWidth: 460,
            margin: "0 auto 26px",
          }}
        >
          Test every palette in real templates, audit for WCAG 3.0, and export
          production-ready code instantly.
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <button
            style={{
              backgroundColor: acc,
              color: oklchToCss(getContrastColor(tokens.accent)),
              padding: "11px 26px",
              borderRadius: 10,
              border: "none",
              fontFamily: fonts.button,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Start Free Trial
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              color: txt,
              padding: "11px 26px",
              borderRadius: 10,
              border: `1.5px solid ${oklchToCss(tokens.border)}`,
              fontFamily: fonts.button,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Watch Demo
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 12,
            textAlign: "left",
          }}
        >
          {[
            { t: "WCAG 3.0 Audit", d: "APCA contrast on every token." },
            { t: "Real Templates", d: "Dashboard, editorial, mobile." },
            { t: "One-Click Export", d: "CSS, SCSS, Tailwind, JSON." },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                backgroundColor: oklchToCss(tokens.surface),
                borderRadius: 12,
                padding: "16px",
                border: `1px solid ${oklchToCss(tokens.border)}`,
              }}
            >
              <p
                style={{
                  fontFamily: fonts.heading,
                  color: txt,
                  fontSize: 13,
                  fontWeight: 700,
                  margin: "0 0 5px",
                }}
              >
                {f.t}
              </p>
              <p
                style={{
                  fontFamily: fonts.body,
                  color: muted,
                  fontSize: 10,
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {f.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mobile finance app
const MobilePreview = ({ tokens, fonts }) => {
  const surf = tokens.surface,
    acc = tokens.accent,
    acTxt = getContrastColor(acc),
    surTxt = getContrastColor(surf);
  const rows = [
    { n: "S&P 500 ETF", t: "SPY", v: "$48,200", p: "+1.2%", up: true },
    { n: "Tech Growth", t: "QQQ", v: "$32,100", p: "+3.4%", up: true },
    { n: "Bond Fund", t: "AGG", v: "$18,400", p: "-0.2%", up: false },
    { n: "Gold ETF", t: "GLD", v: "$14,800", p: "+0.8%", up: true },
  ];
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#e4e4e4,#d0d0d0)",
        padding: 16,
      }}
    >
      <div
        style={{
          width: 290,
          height: 590,
          borderRadius: 40,
          backgroundColor: oklchToCss(surf),
          border: `8px solid ${oklchToCss({ l: 0.2, c: 0, h: 0 })}`,
          overflow: "hidden",
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "9px 18px 3px",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: oklchToCss(surf),
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontFamily: fonts.caption,
              color: oklchToCss(surTxt),
              fontWeight: 600,
            }}
          >
            9:41
          </span>
          <span style={{ fontSize: 10, color: oklchToCss(surTxt) }}>●●●</span>
        </div>
        <div
          style={{
            margin: "6px 10px",
            borderRadius: 18,
            padding: "16px",
            background: `linear-gradient(135deg,${oklchToCss(acc)},${oklchToCss({ ...acc, l: Math.max(0.2, acc.l - 0.15) })})`,
          }}
        >
          <p
            style={{
              fontFamily: fonts.caption,
              color: oklchToCss({ ...acTxt, a: 0.7 }),
              fontSize: 9,
              margin: "0 0 4px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Portfolio
          </p>
          <p
            style={{
              fontFamily: fonts.heading,
              color: oklchToCss(acTxt),
              fontSize: 26,
              fontWeight: 700,
              margin: "0 0 10px",
            }}
          >
            $124,580
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            {["Deposit", "Withdraw", "Move"].map((a) => (
              <button
                key={a}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  backgroundColor: oklchToCss({ ...acTxt, a: 0.15 }),
                  border: "none",
                  borderRadius: 8,
                  color: oklchToCss(acTxt),
                  fontSize: 9,
                  fontFamily: fonts.button,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}>
          <p
            style={{
              fontFamily: fonts.caption,
              color: oklchToCss({ ...surTxt, a: 0.45 }),
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 4px 7px",
            }}
          >
            Holdings
          </p>
          {rows.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 7px",
                borderRadius: 10,
                marginBottom: 4,
                backgroundColor: oklchToCss(tokens.surfaceRaised),
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  backgroundColor: oklchToCss({ ...acc, a: 0.15 }),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: fonts.caption,
                    color: oklchToCss(acc),
                    fontWeight: 700,
                  }}
                >
                  {r.t[0]}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontFamily: fonts.body,
                    color: oklchToCss(surTxt),
                    fontSize: 11,
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {r.n}
                </p>
                <p
                  style={{
                    fontFamily: fonts.caption,
                    color: oklchToCss({ ...surTxt, a: 0.4 }),
                    fontSize: 8,
                    margin: 0,
                  }}
                >
                  {r.t}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontFamily: fonts.heading,
                    color: oklchToCss(surTxt),
                    fontSize: 12,
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {r.v}
                </p>
                <p
                  style={{
                    fontSize: 9,
                    fontFamily: fonts.caption,
                    color: r.up ? oklchToCss(tokens.success) : "#ef4444",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {r.p}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: `1px solid ${oklchToCss(tokens.border)}`,
            display: "flex",
            padding: "7px 0 11px",
          }}
        >
          {[
            ["⌂", "Home"],
            ["◈", "Explore"],
            ["↑", "Move"],
            ["○", "Profile"],
          ].map(([ic, lb], i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color:
                    i === 0
                      ? oklchToCss(acc)
                      : oklchToCss({ ...surTxt, a: 0.4 }),
                }}
              >
                {ic}
              </span>
              <span
                style={{
                  fontSize: 8,
                  fontFamily: fonts.caption,
                  color:
                    i === 0
                      ? oklchToCss(acc)
                      : oklchToCss({ ...surTxt, a: 0.4 }),
                  fontWeight: i === 0 ? 700 : 400,
                }}
              >
                {lb}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Business visiting card
const BusinessCardPreview = ({
  tokens,
  fonts,
  theme,
  fullPalette,
  currentPaletteIndex,
}) => {
  const logoColors = [];
  for (let i = 0; i < fullPalette.length && logoColors.length < 6; i++) {
    if (i !== currentPaletteIndex) logoColors.push(fullPalette[i].base);
  }
  while (logoColors.length < 6 && fullPalette.length > 0)
    logoColors.push(fullPalette[logoColors.length % fullPalette.length].base);
  const cardBg =
    theme === "light"
      ? tokens.surface
      : { l: 0.13, c: tokens.accent.c * 0.35, h: tokens.accent.h };
  const cT = getContrastColor(cardBg),
    aT = getContrastColor(tokens.accent);
  const arc = (cx, cy, r, ir, s, e) => {
    const toR = (d) => (d * Math.PI) / 180,
      x1 = cx + r * Math.cos(toR(s - 90)),
      y1 = cy + r * Math.sin(toR(s - 90)),
      x2 = cx + r * Math.cos(toR(e - 90)),
      y2 = cy + r * Math.sin(toR(e - 90)),
      xi1 = cx + ir * Math.cos(toR(e - 90)),
      yi1 = cy + ir * Math.sin(toR(e - 90)),
      xi2 = cx + ir * Math.cos(toR(s - 90)),
      yi2 = cy + ir * Math.sin(toR(s - 90)),
      la = e - s > 180 ? 1 : 0;
    return [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${la} 1 ${x2} ${y2}`,
      `L ${xi1} ${yi1}`,
      `A ${ir} ${ir} 0 ${la} 0 ${xi2} ${yi2}`,
      "Z",
    ].join(" ");
  };
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          theme === "light"
            ? "linear-gradient(135deg,#e0e0e0,#cccccc)"
            : "linear-gradient(135deg,#111,#1c1c1c)",
      }}
    >
      <div
        style={{
          width: 660,
          height: 374,
          borderRadius: 14,
          overflow: "hidden",
          display: "flex",
          backgroundColor: oklchToCss(cardBg),
          boxShadow:
            theme === "light"
              ? "0 40px 80px -20px rgba(0,0,0,0.3)"
              : "0 40px 80px -20px rgba(0,0,0,0.7)",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 200,
            flexShrink: 0,
            backgroundColor: oklchToCss(tokens.accent),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "24px 14px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg
            width="110"
            height="110"
            viewBox="0 0 120 120"
            fill="none"
            style={{
              position: "relative",
              zIndex: 1,
              filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.25))",
            }}
          >
            {logoColors.slice(0, 6).map((c, i) => {
              const g = 5,
                sz = 60,
                s = i * sz + g / 2,
                e = (i + 1) * sz - g / 2;
              return (
                <path
                  key={`o${i}`}
                  d={arc(60, 60, 54, 40, s, e)}
                  fill={oklchToCss(c)}
                  opacity="0.95"
                />
              );
            })}
            {[0, 1, 2, 3].map((i) => {
              const s = i * 90 + 7 + 22,
                e = (i + 1) * 90 - 7 + 22,
                ci = (i * 2 + 1) % logoColors.length;
              return (
                <path
                  key={`m${i}`}
                  d={arc(60, 60, 35, 24, s, e)}
                  fill={oklchToCss(logoColors[ci])}
                  opacity="0.88"
                />
              );
            })}
            {[0, 1, 2].map((i) => {
              const s = i * 120 + 9 + 45,
                e = (i + 1) * 120 - 9 + 45,
                ci = (i + 2) % logoColors.length;
              return (
                <path
                  key={`in${i}`}
                  d={arc(60, 60, 19, 11, s, e)}
                  fill={oklchToCss(logoColors[ci])}
                  opacity="0.82"
                />
              );
            })}
            <circle cx="60" cy="60" r="8" fill={oklchToCss(aT)} opacity="0.9" />
          </svg>
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <p
              style={{
                fontFamily: fonts.brand,
                color: oklchToCss(aT),
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: "0.12em",
                margin: 0,
              }}
            >
              BRAND
            </p>
            <p
              style={{
                fontFamily: fonts.caption,
                color: oklchToCss(aT),
                fontSize: 7,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginTop: 4,
                opacity: 0.65,
              }}
            >
              Design Studio
            </p>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "30px 38px",
            position: "relative",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: fonts.heading,
                color: oklchToCss(cT),
                fontSize: 28,
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Alex Morgan
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 7,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 2,
                  borderRadius: 2,
                  backgroundColor: oklchToCss(tokens.accent),
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontFamily: fonts.body,
                  color: oklchToCss(cT),
                  fontSize: 11,
                  margin: 0,
                  opacity: 0.5,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Creative Director
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {logoColors.slice(0, 6).map((c, i) => (
              <div
                key={i}
                style={{
                  width: 16,
                  height: 4,
                  borderRadius: 3,
                  backgroundColor: oklchToCss(c),
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
          <div
            style={{
              borderTop: `1px solid ${oklchToCss({ ...cT, a: 0.12 })}`,
              paddingTop: 18,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "9px 22px",
            }}
          >
            {[
              { l: "Email", v: "alex@brand.design" },
              { l: "Phone", v: "+1 555 123 4567" },
              { l: "Web", v: "brand.design" },
              { l: "City", v: "New York, NY" },
            ].map((item, i) => (
              <div key={i}>
                <p
                  style={{
                    fontFamily: fonts.caption,
                    color: oklchToCss(tokens.accent),
                    fontSize: 7,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    margin: "0 0 2px",
                    fontWeight: 700,
                  }}
                >
                  {item.l}
                </p>
                <p
                  style={{
                    fontFamily: fonts.caption,
                    color: oklchToCss(cT),
                    fontSize: 9,
                    margin: 0,
                    opacity: 0.7,
                  }}
                >
                  {item.v}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -44,
            right: -44,
            width: 140,
            height: 140,
            borderRadius: "50%",
            backgroundColor: oklchToCss(tokens.accent),
            opacity: 0.06,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FontPalettePreview() {
  const { palette } = useColorPaletteContext();
  const expandedPalette = useMemo(() => {
    if (!palette?.length) return [];
    try {
      return generateExpandedPalette(palette);
    } catch {
      return [];
    }
  }, [palette]);

  const [fonts, setFonts] = useState({
    brand: "Space Grotesk",
    heading: "Playfair Display",
    body: "DM Sans",
    button: "DM Sans",
    caption: "DM Sans",
  });
  const [typo, setTypo] = useState({ tracking: 0, leading: 1.45, size: 1.0 });
  const [previewIdx, setPreviewIdx] = useState(0);
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [theme, setTheme] = useState("light");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [rightPanel, setRightPanel] = useState("type");
  const [cbFilter, setCbFilter] = useState("normal");
  const [screenFilter, setScreenFilter] = useState("standard");
  const [snapshots, setSnapshots] = useState([]);
  const [currentSnap, setCurrentSnap] = useState(null);
  const [exportFmt, setExportFmt] = useState("css");
  const [copied, setCopied] = useState(false);

  const fullPalette = useMemo(
    () =>
      expandedPalette.filter((item) => {
        if (theme === "light" && item.base.l > 0.9) return false;
        if (theme === "dark" && item.base.l < 0.2) return false;
        return true;
      }),
    [expandedPalette, theme],
  );

  useEffect(() => {
    if (fullPalette.length > 0 && paletteIdx >= fullPalette.length)
      setPaletteIdx(0);
  }, [fullPalette.length, paletteIdx]);

  const tokens = useMemo(() => {
    const dflt = (lL, lD) => ({
      l: theme === "light" ? lL : lD,
      c: 0.005,
      h: 260,
    });
    if (!fullPalette.length || !fullPalette[paletteIdx])
      return {
        background: dflt(0.98, 0.08),
        backgroundSubtle: dflt(0.96, 0.11),
        surface: dflt(0.97, 0.14),
        surfaceRaised: dflt(0.99, 0.18),
        border: dflt(0.88, 0.28),
        text: dflt(0.15, 0.95),
        accent: { l: theme === "light" ? 0.5 : 0.6, c: 0.1, h: 260 },
        accentStrong: { l: theme === "light" ? 0.25 : 0.7, c: 0.1, h: 260 },
        success: { l: theme === "light" ? 0.35 : 0.55, c: 0.15, h: 145 },
      };
    const base = fullPalette[paletteIdx].base,
      ch = base.h,
      cc = base.c;
    if (theme === "light")
      return {
        background: { l: 0.98, c: cc * 0.15, h: ch },
        backgroundSubtle: { l: 0.96, c: cc * 0.2, h: ch },
        surface: { l: 0.97, c: cc * 0.18, h: ch },
        surfaceRaised: { l: 0.99, c: cc * 0.12, h: ch },
        border: { l: 0.88, c: cc * 0.3, h: ch },
        text: { l: 0.15, c: cc * 0.1, h: ch },
        accent: base,
        accentStrong: { l: Math.max(0.25, base.l - 0.15), c: cc * 0.9, h: ch },
        success: { l: 0.35, c: 0.15, h: 145 },
      };
    return {
      background: { l: 0.12, c: cc * 0.4, h: ch },
      backgroundSubtle: { l: 0.15, c: cc * 0.35, h: ch },
      surface: { l: 0.18, c: cc * 0.3, h: ch },
      surfaceRaised: { l: 0.22, c: cc * 0.25, h: ch },
      border: { l: 0.35, c: cc * 0.4, h: ch },
      text: { l: 0.95, c: cc * 0.05, h: ch },
      accent: { l: Math.min(0.75, base.l + 0.2), c: cc * 0.85, h: ch },
      accentStrong: { l: Math.min(0.85, base.l + 0.3), c: cc * 0.7, h: ch },
      success: { l: 0.55, c: 0.15, h: 145 },
    };
  }, [fullPalette, paletteIdx, theme]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${[...new Set(Object.values(fonts))].map((f) => f.replace(/\s+/g, "+")).join("&family=")}:wght@400;500;600;700;800;900&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setFontsLoaded(false);
    setTimeout(() => setFontsLoaded(true), 600);
  }, [fonts]);

  const previews = [
    { id: "landing", name: "Landing", icon: Globe },
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "editorial", name: "Editorial", icon: Newspaper },
    { id: "mobile", name: "Mobile", icon: Smartphone },
    { id: "card", name: "Card", icon: CreditCard },
  ];
  const rightPanels = [
    { id: "type", name: "Type", icon: Sliders },
    { id: "access", name: "Audit", icon: Eye },
    { id: "vision", name: "Vision", icon: BookOpen },
    { id: "export", name: "Export", icon: Download },
    { id: "history", name: "History", icon: Clock },
  ];

  const randomize = () => {
    const hs = [
      "Playfair Display",
      "Cormorant Garamond",
      "Fraunces",
      "EB Garamond",
      "Lora",
      "Bricolage Grotesque",
      "Syne",
      "Merriweather",
    ];
    const bs = [
      "DM Sans",
      "Plus Jakarta Sans",
      "Manrope",
      "Work Sans",
      "Outfit",
      "Space Grotesk",
    ];
    const h = hs[Math.floor(Math.random() * hs.length)],
      b = bs[Math.floor(Math.random() * bs.length)];
    setFonts((p) => ({ ...p, heading: h, body: b, button: b, caption: b }));
    if (fullPalette.length > 0)
      setPaletteIdx(Math.floor(Math.random() * fullPalette.length));
    setTheme(Math.random() > 0.5 ? "light" : "dark");
  };

  const saveSnapshot = () => {
    const now = new Date(),
      time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setSnapshots((prev) => [
      {
        label: previews[previewIdx].name,
        time,
        swatches: fullPalette.slice(0, 6).map((c) => oklchToCss(c.base)),
        heading: fonts.heading,
        body: fonts.body,
        fonts: { ...fonts },
        typo: { ...typo },
        paletteIdx,
        theme,
      },
      ...prev.slice(0, 9),
    ]);
  };
  const loadSnapshot = (i) => {
    const s = snapshots[i];
    setFonts(s.fonts);
    setTypo(s.typo);
    setPaletteIdx(s.paletteIdx);
    setTheme(s.theme);
    setCurrentSnap(i);
  };

  const generateExport = () =>
    ({
      css: `/* Design System */\n:root {\n  --font-heading: "${fonts.heading}";\n  --font-body: "${fonts.body}";\n  --font-brand: "${fonts.brand}";\n  --color-bg: ${oklchToCss(tokens.background)};\n  --color-surface: ${oklchToCss(tokens.surface)};\n  --color-border: ${oklchToCss(tokens.border)};\n  --color-accent: ${oklchToCss(tokens.accent)};\n  --color-success: ${oklchToCss(tokens.success)};\n  --tracking: ${typo.tracking}em;\n  --leading: ${typo.leading};\n}`,
      scss: `// Design System\n$font-heading: "${fonts.heading}";\n$font-body: "${fonts.body}";\n$color-bg: ${oklchToCss(tokens.background)};\n$color-surface: ${oklchToCss(tokens.surface)};\n$color-accent: ${oklchToCss(tokens.accent)};\n$tracking: ${typo.tracking}em;\n$leading: ${typo.leading};`,
      tailwind: `// tailwind.config.js\nmodule.exports = {\n  theme: { extend: {\n    fontFamily: {\n      heading: ['${fonts.heading}'],\n      body:    ['${fonts.body}'],\n      brand:   ['${fonts.brand}'],\n    },\n    colors: {\n      background: '${oklchToCss(tokens.background)}',\n      surface:    '${oklchToCss(tokens.surface)}',\n      border:     '${oklchToCss(tokens.border)}',\n      accent:     '${oklchToCss(tokens.accent)}',\n      success:    '${oklchToCss(tokens.success)}',\n    }\n  }}\n}`,
      json: JSON.stringify(
        {
          typography: fonts,
          openType: typo,
          colors: Object.fromEntries(
            Object.entries(tokens).map(([k, v]) => [k, oklchToCss(v)]),
          ),
        },
        null,
        2,
      ),
    })[exportFmt] || "";

  const copyExport = () => {
    navigator.clipboard.writeText(generateExport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewFilter =
    [SCREEN_FILTERS[screenFilter]?.filter, CB_FILTERS[cbFilter]]
      .filter((f) => f && f !== "none")
      .join(" ") || "none";

  const renderPreview = () => {
    const p = {
      tokens,
      fonts,
      theme,
      fullPalette,
      currentPaletteIndex: paletteIdx,
      typo,
    };
    switch (previews[previewIdx].id) {
      case "landing":
        return <LandingPreview {...p} />;
      case "dashboard":
        return <DashboardPreview {...p} />;
      case "editorial":
        return <EditorialPreview {...p} />;
      case "mobile":
        return <MobilePreview {...p} />;
      case "card":
        return <BusinessCardPreview {...p} />;
      default:
        return <LandingPreview {...p} />;
    }
  };

  const renderRightPanel = () => {
    if (rightPanel === "type")
      return (
        <div
          style={{
            padding: "14px 12px",
            height: "100%",
            overflowY: "auto",
            fontFamily: "system-ui",
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
            <h3
              style={{ margin: 0, fontSize: 12, fontWeight: 700 }}
              className="text-foreground"
            >
              Type Controls
            </h3>
            <button
              onClick={randomize}
              className="flex items-center gap-1 text-foreground/60 hover:text-foreground border border-(--navBorder) hover:border-(--brand) transition-colors rounded px-2 py-1"
              style={{
                fontSize: 9,
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: "transparent",
              }}
            >
              <Shuffle className="w-2.5 h-2.5" /> Randomize
            </button>
          </div>
          {[
            {
              k: "tracking",
              l: "Tracking",
              min: -0.1,
              max: 0.3,
              step: 0.005,
              u: "em",
            },
            { k: "leading", l: "Leading", min: 1.0, max: 2.2, step: 0.05 },
            { k: "size", l: "Scale", min: 0.7, max: 1.5, step: 0.05, u: "×" },
          ].map((ctrl) => (
            <div key={ctrl.k} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 3,
                }}
              >
                <label
                  className="text-foreground/60"
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {ctrl.l}
                </label>
                <span
                  style={{ fontSize: 9, fontWeight: 700 }}
                  className="text-(--brand)"
                >
                  {typo[ctrl.k].toFixed(ctrl.k === "tracking" ? 3 : 2)}
                  {ctrl.u || ""}
                </span>
              </div>
              <input
                type="range"
                min={ctrl.min}
                max={ctrl.max}
                step={ctrl.step}
                value={typo[ctrl.k]}
                onChange={(e) =>
                  setTypo((p) => ({
                    ...p,
                    [ctrl.k]: parseFloat(e.target.value),
                  }))
                }
                style={{ width: "100%", accentColor: "var(--brand)" }}
              />
            </div>
          ))}
          <div
            className="border-t border-(--navBorder)"
            style={{ paddingTop: 12, marginTop: 6 }}
          >
            <p
              className="text-foreground/50"
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 8px",
                fontWeight: 600,
              }}
            >
              Font Roles
            </p>
            {Object.entries(fonts).map(([role, val]) => (
              <div key={role} style={{ marginBottom: 7 }}>
                <label
                  className="text-foreground/40"
                  style={{
                    fontSize: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    display: "block",
                    marginBottom: 2,
                    fontWeight: 600,
                  }}
                >
                  {role}
                </label>
                <select
                  value={val}
                  onChange={(e) =>
                    setFonts((p) => ({ ...p, [role]: e.target.value }))
                  }
                  className="w-full border border-(--navBorder) hover:border-(--brand) bg-background text-foreground rounded transition-colors"
                  style={{
                    padding: "4px 6px",
                    fontSize: 10,
                    cursor: "pointer",
                    fontFamily: val,
                  }}
                >
                  {FONTS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div style={{ marginTop: 10 }}>
              <p
                className="text-foreground/50"
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 6px",
                  fontWeight: 600,
                }}
              >
                Pairing Engine
              </p>
              <p
                className="text-foreground/50"
                style={{ fontSize: 9, margin: "0 0 6px" }}
              >
                For{" "}
                <em
                  style={{
                    color: "var(--foreground)",
                    fontStyle: "normal",
                    fontWeight: 600,
                  }}
                >
                  {fonts.heading}
                </em>
                :
              </p>
              {(
                fontProfiles[fonts.heading]?.pairs || [
                  "DM Sans",
                  "Work Sans",
                  "Outfit",
                ]
              ).map((f, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setFonts((p) => ({ ...p, body: f, button: f, caption: f }))
                  }
                  className="w-full text-left border border-(--navBorder) hover:border-(--brand) bg-background hover:bg-(--brand)/5 text-foreground transition-all rounded"
                  style={{
                    padding: "6px 8px",
                    cursor: "pointer",
                    marginBottom: 4,
                    fontFamily: f,
                    fontSize: 10,
                    fontWeight: 600,
                    display: "block",
                  }}
                >
                  {f}{" "}
                  <span
                    className="text-foreground/40"
                    style={{
                      fontSize: 8,
                      fontFamily: "system-ui",
                      fontWeight: 400,
                    }}
                  >
                    · {fontProfiles[f]?.style || "sans"} · x
                    {fontProfiles[f]?.xHeight || "–"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    if (rightPanel === "access") {
      const pairs = [
        {
          fg: getContrastColor(tokens.background),
          bg: tokens.background,
          l: "Body on bg",
        },
        {
          fg: getContrastColor(tokens.accent),
          bg: tokens.accent,
          l: "Text on accent",
        },
        { fg: tokens.accent, bg: tokens.background, l: "Accent on bg" },
        {
          fg: getContrastColor(tokens.surface),
          bg: tokens.surface,
          l: "Text on surface",
        },
        { fg: tokens.success, bg: tokens.background, l: "Success on bg" },
        {
          fg: getContrastColor(tokens.accentStrong),
          bg: tokens.accentStrong,
          l: "Text on strong",
        },
      ];
      return (
        <div
          style={{
            padding: "14px 12px",
            height: "100%",
            overflowY: "auto",
            fontFamily: "system-ui",
          }}
        >
          <h3
            style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 700 }}
            className="text-foreground"
          >
            Contrast Audit
          </h3>
          <p
            className="text-foreground/40"
            style={{ margin: "0 0 12px", fontSize: 9 }}
          >
            WCAG 2.1 + APCA (WCAG 3.0)
          </p>
          {pairs.map((pair, i) => {
            const ratio = wcagRatio(pair.fg, pair.bg),
              apca = apcaScore(pair.fg, pair.bg),
              rating = wcagRating(ratio),
              rc = ratingColor(rating);
            return (
              <div
                key={i}
                className="border border-(--navBorder)"
                style={{ marginBottom: 8, borderRadius: 8, overflow: "hidden" }}
              >
                <div
                  style={{
                    backgroundColor: oklchToCss(pair.bg),
                    padding: "7px 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      color: oklchToCss(pair.fg),
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: fonts.body,
                    }}
                  >
                    Aa
                  </span>
                  <span
                    style={{
                      color: oklchToCss(pair.fg),
                      fontSize: 9,
                      opacity: 0.8,
                      fontFamily: fonts.caption,
                    }}
                  >
                    {pair.l}
                  </span>
                </div>
                <div
                  className="bg-background"
                  style={{
                    padding: "7px 10px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 6,
                  }}
                >
                  <div>
                    <p
                      className="text-foreground/40"
                      style={{
                        fontSize: 8,
                        margin: "0 0 2px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Ratio
                    </p>
                    <p
                      className="text-foreground"
                      style={{ fontSize: 12, fontWeight: 700, margin: 0 }}
                    >
                      {ratio.toFixed(1)}:1
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-foreground/40"
                      style={{
                        fontSize: 8,
                        margin: "0 0 2px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      WCAG
                    </p>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: rc,
                        backgroundColor: rc + "22",
                        padding: "2px 6px",
                        borderRadius: 20,
                      }}
                    >
                      {rating}
                    </span>
                  </div>
                  <div>
                    <p
                      className="text-foreground/40"
                      style={{
                        fontSize: 8,
                        margin: "0 0 2px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      APCA
                    </p>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color:
                          apca >= 75
                            ? "#16a34a"
                            : apca >= 60
                              ? "#2563eb"
                              : "#dc2626",
                        backgroundColor:
                          (apca >= 60 ? "#2563eb" : "#dc2626") + "22",
                        padding: "2px 6px",
                        borderRadius: 20,
                      }}
                    >
                      {apca}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div
            style={{
              marginTop: 8,
              padding: "9px 10px",
              background: "rgba(99,102,241,0.08)",
              borderRadius: 8,
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#6366f1",
                margin: "0 0 3px",
              }}
            >
              APCA Guide
            </p>
            <p
              style={{
                fontSize: 8,
                color: "#6366f1",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Lc 75+ Body · 60+ Large text · 45+ UI · Below 45 = Decorative
            </p>
          </div>
        </div>
      );
    }

    if (rightPanel === "vision")
      return (
        <div
          style={{
            padding: "14px 12px",
            height: "100%",
            overflowY: "auto",
            fontFamily: "system-ui",
          }}
        >
          <h3
            style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 700 }}
            className="text-foreground"
          >
            Vision & Display
          </h3>
          <p
            className="text-foreground/50"
            style={{
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 7px",
              fontWeight: 600,
            }}
          >
            Color Blindness Sim
          </p>
          {[
            { id: "normal", l: "Normal Vision", d: "No simulation" },
            {
              id: "deuteranopia",
              l: "Deuteranopia",
              d: "Green-blind (~6% males)",
            },
            { id: "protanopia", l: "Protanopia", d: "Red-blind (~2% males)" },
            { id: "tritanopia", l: "Tritanopia", d: "Blue-blind (~0.01%)" },
            {
              id: "achromatopsia",
              l: "Achromatopsia",
              d: "Full color blindness",
            },
          ].map((cb) => (
            <button
              key={cb.id}
              onClick={() => setCbFilter(cb.id)}
              className={`w-full text-left rounded transition-all border ${cbFilter === cb.id ? "border-(--brand) bg-(--brand)/8" : "border-(--navBorder) bg-background hover:border-(--brand)/50"}`}
              style={{ padding: "7px 9px", cursor: "pointer", marginBottom: 5 }}
            >
              <p
                className="text-foreground"
                style={{ fontSize: 10, fontWeight: 700, margin: "0 0 1px" }}
              >
                {cb.l}
              </p>
              <p
                className="text-foreground/40"
                style={{ fontSize: 8, margin: 0 }}
              >
                {cb.d}
              </p>
            </button>
          ))}
          <p
            className="text-foreground/50"
            style={{
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "12px 0 7px",
              fontWeight: 600,
            }}
          >
            Screen Simulation
          </p>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}
          >
            {Object.entries(SCREEN_FILTERS).map(([id, s]) => (
              <button
                key={id}
                onClick={() => setScreenFilter(id)}
                className={`rounded transition-all border ${screenFilter === id ? "border-(--brand) bg-(--brand)/8 text-(--brand)" : "border-(--navBorder) bg-background hover:border-(--brand)/50 text-foreground/60"}`}
                style={{
                  padding: "8px 6px",
                  cursor: "pointer",
                  fontSize: 9,
                  fontWeight: 600,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "9px 10px",
              background: "rgba(234,179,8,0.08)",
              borderRadius: 8,
              border: "1px solid rgba(234,179,8,0.3)",
            }}
          >
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#a16207",
                margin: "0 0 3px",
              }}
            >
              Note
            </p>
            <p
              style={{
                fontSize: 8,
                color: "#a16207",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              CSS filter approximations. Real perception varies between
              individuals.
            </p>
          </div>
        </div>
      );

    if (rightPanel === "export")
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            fontFamily: "system-ui",
          }}
        >
          <div
            className="border-b border-(--navBorder)"
            style={{ padding: "12px 12px 0" }}
          >
            <h3
              style={{ margin: "0 0 9px", fontSize: 12, fontWeight: 700 }}
              className="text-foreground"
            >
              Export Tokens
            </h3>
            <div style={{ display: "flex", gap: 3 }}>
              {["css", "scss", "tailwind", "json"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFmt(fmt)}
                  style={{
                    fontSize: 9,
                    padding: "4px 8px",
                    borderRadius: "5px 5px 0 0",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    backgroundColor:
                      exportFmt === fmt ? "#6366f1" : "rgba(128,128,128,0.1)",
                    color: exportFmt === fmt ? "#fff" : "var(--foreground)",
                    transition: "all 0.15s",
                    opacity: exportFmt === fmt ? 1 : 0.6,
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <pre
              style={{
                margin: 0,
                padding: "12px",
                fontSize: 9,
                lineHeight: 1.7,
                backgroundColor: "#1e1e2e",
                color: "#cdd6f4",
                height: "100%",
                overflowY: "auto",
                boxSizing: "border-box",
                fontFamily: "JetBrains Mono, monospace",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {generateExport()}
            </pre>
          </div>
          <div
            className="border-t border-(--navBorder)"
            style={{ padding: "10px 12px" }}
          >
            <button
              onClick={copyExport}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 10,
                backgroundColor: copied ? "#16a34a" : "#6366f1",
                color: "#fff",
                transition: "all 0.2s",
              }}
            >
              {copied ? "✓ Copied!" : "⧉ Copy to Clipboard"}
            </button>
          </div>
        </div>
      );

    if (rightPanel === "history")
      return (
        <div
          style={{
            padding: "14px 12px",
            height: "100%",
            overflowY: "auto",
            fontFamily: "system-ui",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h3
              style={{ margin: 0, fontSize: 12, fontWeight: 700 }}
              className="text-foreground"
            >
              Snapshots
            </h3>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={saveSnapshot}
                className="text-(--brand) border border-(--brand)"
                style={{
                  fontSize: 9,
                  padding: "4px 8px",
                  borderRadius: 5,
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                + Save
              </button>
              {snapshots.length > 0 && (
                <button
                  onClick={() => {
                    setSnapshots([]);
                    setCurrentSnap(null);
                  }}
                  className="text-foreground/40 border border-(--navBorder)"
                  style={{
                    fontSize: 9,
                    padding: "4px 8px",
                    borderRadius: 5,
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          {snapshots.length === 0 && (
            <div
              className="text-foreground/30"
              style={{ textAlign: "center", padding: "32px 0" }}
            >
              <p style={{ fontSize: 28, margin: "0 0 8px" }}>📸</p>
              <p style={{ fontSize: 10, margin: 0, lineHeight: 1.5 }}>
                Click Save to capture
                <br />
                the current state.
              </p>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {snapshots.map((snap, i) => (
              <div
                key={i}
                onClick={() => loadSnapshot(i)}
                className={`border rounded-lg transition-all cursor-pointer ${i === currentSnap ? "border-(--brand) bg-(--brand)/5" : "border-(--navBorder) bg-background hover:border-(--brand)/40"}`}
                style={{ padding: "9px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span
                    className="text-foreground"
                    style={{ fontSize: 10, fontWeight: 600 }}
                  >
                    #{snapshots.length - i} {snap.label}
                  </span>
                  <span className="text-foreground/40" style={{ fontSize: 8 }}>
                    {snap.time}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 3, marginBottom: 5 }}>
                  {snap.swatches.map((sw, j) => (
                    <div
                      key={j}
                      style={{
                        width: 13,
                        height: 13,
                        borderRadius: 3,
                        backgroundColor: sw,
                        border: "1px solid rgba(0,0,0,0.08)",
                      }}
                    />
                  ))}
                </div>
                <p
                  className="text-foreground/40"
                  style={{ fontSize: 8, margin: 0 }}
                >
                  {snap.heading} + {snap.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    return null;
  };

  return (
    <main className="flex gap-2 h-full m-4" style={{ minHeight: 0 }}>
      <CBFilterDefs />

      {/* LEFT SIDEBAR */}
      <aside
        className="w-52 border mb-6 border-(--navBorder) bg-background flex flex-col overflow-y-auto"
        style={{ flexShrink: 0 }}
      >
        {/* Palette */}
        <div className="p-3 border-b border-(--navBorder)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest">
              Palette ({fullPalette.length})
            </span>
            <div className="flex gap-0.5">
              <button
                onClick={() =>
                  setPaletteIdx(
                    (p) => (p - 1 + fullPalette.length) % fullPalette.length,
                  )
                }
                className="p-0.5 rounded hover:bg-foreground/5"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                onClick={() =>
                  setPaletteIdx((p) => (p + 1) % fullPalette.length)
                }
                className="p-0.5 rounded hover:bg-foreground/5"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-0.5 mb-2">
            {fullPalette.map((item, i) => (
              <button
                key={i}
                onClick={() => setPaletteIdx(i)}
                className={`aspect-square rounded border transition-all ${i === paletteIdx ? "border-(--brand) ring-1 ring-(--brand)/30 scale-110 shadow-md" : "border-transparent hover:border-foreground/20"}`}
                style={{ backgroundColor: oklchToCss(item.base) }}
              />
            ))}
          </div>
          <div className="text-[8px] font-mono text-foreground/40 text-center">
            {paletteIdx + 1}/{fullPalette.length}
          </div>
        </div>

        {/* Theme */}
        <div className="p-3 border-b border-(--navBorder)">
          <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest block mb-2">
            Theme
          </span>
          <div className="flex gap-1 bg-foreground/5 rounded-lg p-0.5">
            {[
              { t: "light", i: Sun },
              { t: "dark", i: Moon },
            ].map(({ t, i: Icon }) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 p-1.5 rounded flex items-center justify-center gap-1 transition-all ${theme === t ? "bg-background shadow-sm" : "hover:bg-foreground/5"}`}
              >
                <Icon className="w-3 h-3" />
                <span className="text-[9px] font-semibold capitalize">{t}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="p-3 border-b border-(--navBorder)">
          <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest block mb-2">
            Preview
          </span>
          <div className="grid grid-cols-3 gap-1">
            {previews.map((preview, index) => {
              const Icon = preview.icon;
              return (
                <button
                  key={preview.id}
                  onClick={() => setPreviewIdx(index)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-all ${index === previewIdx ? "bg-(--brand)/10 text-(--brand) ring-1 ring-(--brand)/30" : "hover:bg-foreground/5 text-foreground/50"}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[8px] font-semibold">
                    {preview.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active filter indicators */}
        {(cbFilter !== "normal" || screenFilter !== "standard") && (
          <div className="p-3 border-b border-(--navBorder)">
            <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest block mb-1.5">
              Active Filters
            </span>
            {cbFilter !== "normal" && (
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-foreground/70">
                  {cbFilter}
                </span>
                <button
                  onClick={() => setCbFilter("normal")}
                  className="text-[8px] text-foreground/40 hover:text-foreground/70"
                >
                  ✕
                </button>
              </div>
            )}
            {screenFilter !== "standard" && (
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-foreground/70">
                  {SCREEN_FILTERS[screenFilter]?.label}
                </span>
                <button
                  onClick={() => setScreenFilter("standard")}
                  className="text-[8px] text-foreground/40 hover:text-foreground/70"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex-1" />

        {/* Quick actions */}
        <div className="p-3 border-t border-(--navBorder)">
          <button
            onClick={randomize}
            className="w-full flex items-center justify-center gap-1.5 text-foreground/60 hover:text-foreground border border-(--navBorder) hover:border-(--brand) transition-all rounded-lg py-2"
            style={{
              fontSize: 10,
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: "transparent",
            }}
          >
            <Shuffle className="w-3 h-3" /> Randomize
          </button>
        </div>
      </aside>

      {/* MAIN PREVIEW */}
      <section
        className="flex-1 mb-6 border border-(--navBorder) overflow-hidden"
        style={{ minWidth: 0 }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            filter: previewFilter,
          }}
        >
          {fontsLoaded ? (
            renderPreview()
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-(--brand) border-t-transparent" />
            </div>
          )}
        </div>
      </section>

      {/* RIGHT PANEL */}
      <aside
        className="w-60 border mb-6 border-(--navBorder) bg-background flex flex-col"
        style={{ flexShrink: 0 }}
      >
        {/* Panel tabs */}
        <div className="flex border-b border-(--navBorder)">
          {rightPanels.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setRightPanel(id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-all border-b-2 ${rightPanel === id ? "border-(--brand) text-(--brand)" : "border-transparent text-foreground/40 hover:text-foreground/70"}`}
            >
              <Icon className="w-3 h-3" />
              <span className="text-[7px] font-semibold uppercase tracking-widest">
                {name}
              </span>
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-hidden">{renderRightPanel()}</div>
      </aside>
    </main>
  );
}
