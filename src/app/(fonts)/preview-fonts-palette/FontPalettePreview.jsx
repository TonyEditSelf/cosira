import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Upload,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";
import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
import { oklchToHex } from "@/app/(palettes)/custom-palettes/_components/Pickers/components/colorutil";
import { generateExpandedPalette } from "@/app/(palettes)/palette-expander/colorexpansion";

const oklchToCss = (color) => {
  const { l, c, h, a = 1 } = color;
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)} / ${a})`;
};

// Get contrast-safe color
const getContrastColor = (bg) => {
  return bg.l > 0.5 ? { l: 0.1, c: 0, h: 0 } : { l: 0.95, c: 0, h: 0 };
};

// SVG Preview Component
const SVGPreview = ({ palette, svgContent, colorMapping }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !svgContent) return;

    const container = svgRef.current;
    container.innerHTML = svgContent;

    const svg = container.querySelector("svg");
    if (!svg) return;

    // Make SVG responsive
    if (
      !svg.hasAttribute("viewBox") &&
      svg.hasAttribute("width") &&
      svg.hasAttribute("height")
    ) {
      svg.setAttribute(
        "viewBox",
        `0 0 ${svg.getAttribute("width")} ${svg.getAttribute("height")}`,
      );
    }
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.maxHeight = "100%";

    // Find all elements with fill or stroke
    const elements = svg.querySelectorAll("*");
    const colorableElements = Array.from(elements).filter((el) => {
      const fill = el.getAttribute("fill");
      const stroke = el.getAttribute("stroke");
      return (fill && fill !== "none") || stroke;
    });

    // Apply colors based on mapping
    colorableElements.forEach((el, idx) => {
      const colorIdx = colorMapping[idx % colorMapping.length];
      const color = palette[colorIdx % palette.length];

      if (el.getAttribute("fill") && el.getAttribute("fill") !== "none") {
        el.setAttribute("fill", oklchToCss(color.base));
      }
      if (el.getAttribute("stroke")) {
        el.setAttribute("stroke", oklchToCss(color.base));
      }
    });
  }, [svgContent, colorMapping, palette]);

  if (!svgContent) {
    // Default SVG pattern
    return (
      <div className="w-full h-full flex items-center justify-center p-12">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          className="max-w-full max-h-full"
        >
          {/* Circles */}
          <circle
            cx="200"
            cy="150"
            r="80"
            fill={oklchToCss(palette[colorMapping[0] % palette.length].base)}
            opacity="0.3"
          />
          <circle
            cx="600"
            cy="200"
            r="100"
            fill={oklchToCss(palette[colorMapping[1] % palette.length].base)}
            opacity="0.25"
          />
          <circle
            cx="400"
            cy="450"
            r="120"
            fill={oklchToCss(palette[colorMapping[2] % palette.length].base)}
            opacity="0.2"
          />

          {/* Rectangles */}
          <rect
            x="80"
            y="350"
            width="140"
            height="140"
            fill={oklchToCss(palette[colorMapping[3] % palette.length].base)}
            rx="15"
            opacity="0.4"
          />
          <rect
            x="550"
            y="420"
            width="180"
            height="100"
            fill={oklchToCss(palette[colorMapping[4] % palette.length].base)}
            rx="12"
            opacity="0.35"
          />

          {/* Paths */}
          <path
            d="M 100 120 Q 400 80 700 140"
            stroke={oklchToCss(palette[colorMapping[0] % palette.length].base)}
            strokeWidth="5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 150 500 Q 400 450 650 480"
            stroke={oklchToCss(palette[colorMapping[1] % palette.length].base)}
            strokeWidth="4"
            fill="none"
            opacity="0.5"
          />

          {/* Small circles */}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle
              key={i}
              cx={120 + i * 140}
              cy={80}
              r="18"
              fill={oklchToCss(palette[colorMapping[i] % palette.length].base)}
            />
          ))}

          {/* Polygons */}
          <polygon
            points="280,280 340,230 400,280 370,340"
            fill={oklchToCss(palette[colorMapping[2] % palette.length].base)}
            opacity="0.5"
          />
          <polygon
            points="480,360 540,330 580,380 530,420"
            fill={oklchToCss(palette[colorMapping[3] % palette.length].base)}
            opacity="0.45"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={svgRef}
      className="w-full h-full flex items-center justify-center p-8"
    />
  );
};

// Landing Page
const LandingPage = ({ tokens, fonts }) => (
  <div
    className="h-full overflow-auto"
    style={{
      backgroundColor: oklchToCss(tokens.background),
      color: oklchToCss(getContrastColor(tokens.background)),
    }}
  >
    <div className="p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <span
            style={{ fontFamily: fonts.brand }}
            className="text-2xl font-bold"
          >
            BRAND
          </span>
          <nav className="flex gap-8" style={{ fontFamily: fonts.body }}>
            {["Features", "Pricing", "About"].map((item) => (
              <a
                key={item}
                className="text-sm opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <h1
              style={{ fontFamily: fonts.heading }}
              className="text-6xl font-bold mb-6 leading-tight"
            >
              Design That
              <span
                style={{
                  color: oklchToCss(tokens.accent),
                  display: "block",
                  marginTop: "0.25em",
                }}
              >
                Matters
              </span>
            </h1>
            <p
              style={{ fontFamily: fonts.body }}
              className="text-lg opacity-70 mb-8 leading-relaxed"
            >
              Transform your creative vision into reality with tools designed
              for modern designers and developers.
            </p>
            <div className="flex gap-4">
              <button
                style={{
                  backgroundColor: oklchToCss(tokens.accent),
                  fontFamily: fonts.button,
                  color: oklchToCss(getContrastColor(tokens.accent)),
                }}
                className="px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </button>
              <button
                style={{
                  fontFamily: fonts.button,
                  borderColor: oklchToCss(tokens.border),
                  color: oklchToCss(getContrastColor(tokens.background)),
                }}
                className="px-6 py-3 rounded-lg font-semibold border-2 hover:opacity-70 transition-opacity"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {[
              { v: "50K+", l: "Users", accent: true },
              { v: "4.9", l: "Rating" },
              { v: "200+", l: "Templates" },
              { v: "24/7", l: "Support", accent: true },
            ].map((s, i) => (
              <div key={i}>
                <p
                  style={{
                    fontFamily: fonts.heading,
                    color: oklchToCss(
                      s.accent
                        ? tokens.accent
                        : getContrastColor(tokens.background),
                    ),
                  }}
                  className="text-5xl font-bold mb-2"
                >
                  {s.v}
                </p>
                <p
                  style={{ fontFamily: fonts.caption }}
                  className="text-sm opacity-60"
                >
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Business Card
const BusinessCard = ({ tokens, fonts }) => (
  <div
    className="h-full flex items-center justify-center p-12"
    style={{ backgroundColor: oklchToCss(tokens.backgroundSubtle) }}
  >
    <div
      className={`w-[600px] h-[350px] rounded-2xl p-12 flex flex-col justify-between transition-shadow duration-300`}
      style={{
        backgroundColor: oklchToCss(tokens.surface),
        boxShadow:
          theme === "light"
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            : "0 10px 30px rgba(255, 255, 255, 0.1), 0 4px 15px rgba(255, 255, 255, 0.05)",
      }}
    >
      <div>
        <h2
          style={{ fontFamily: fonts.brand, color: oklchToCss(tokens.accent) }}
          className="text-3xl font-bold mb-1"
        >
          BRAND
        </h2>
        <p
          style={{
            fontFamily: fonts.caption,
            color: oklchToCss(getContrastColor(tokens.surface)),
          }}
          className="text-sm opacity-60"
        >
          Design Studio
        </p>
      </div>
      <div>
        <h3
          style={{
            fontFamily: fonts.heading,
            color: oklchToCss(getContrastColor(tokens.surface)),
          }}
          className="text-2xl font-semibold mb-1"
        >
          Alex Morgan
        </h3>
        <p
          style={{
            fontFamily: fonts.body,
            color: oklchToCss(getContrastColor(tokens.surface)),
          }}
          className="text-sm opacity-70 mb-6"
        >
          Creative Director
        </p>
        <div
          style={{
            fontFamily: fonts.caption,
            color: oklchToCss(getContrastColor(tokens.surface)),
          }}
          className="text-sm space-y-1 opacity-70"
        >
          <p>alex.morgan@brand.design</p>
          <p>+1 (555) 123-4567</p>
          <p>www.brand.design</p>
        </div>
      </div>
    </div>
  </div>
);

// Mobile App
const MobileApp = ({ tokens, fonts }) => (
  <div
    className="h-full flex items-center justify-center p-6 overflow-auto"
    style={{ backgroundColor: oklchToCss(tokens.backgroundSubtle) }}
  >
    <div
      className="w-[340px] h-[700px] rounded-[45px] shadow-2xl overflow-hidden flex-shrink-0"
      style={{
        backgroundColor: oklchToCss(tokens.surface),
        border: `10px solid ${oklchToCss(tokens.border)}`,
      }}
    >
      <div
        className="h-10 flex items-center justify-between px-6 pt-1"
        style={{ color: oklchToCss(getContrastColor(tokens.surface)) }}
      >
        <span style={{ fontFamily: fonts.caption }} className="text-[10px]">
          9:41
        </span>
        <div className="flex gap-1">
          {[0.5, 0.5, 1].map((op, i) => (
            <div
              key={i}
              className="w-3 h-2.5 bg-current"
              style={{ opacity: op }}
            />
          ))}
        </div>
      </div>
      <div className="px-5 py-3">
        <div className="mb-6">
          <h1
            style={{
              fontFamily: fonts.heading,
              color: oklchToCss(getContrastColor(tokens.surface)),
            }}
            className="text-2xl font-bold mb-1"
          >
            Dashboard
          </h1>
          <p
            style={{
              fontFamily: fonts.body,
              color: oklchToCss(getContrastColor(tokens.surface)),
            }}
            className="text-xs opacity-60"
          >
            Welcome back, Alex
          </p>
        </div>
        <div className="space-y-3">
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: oklchToCss(tokens.accent) }}
          >
            <p
              style={{
                fontFamily: fonts.caption,
                color: oklchToCss(getContrastColor(tokens.accent)),
              }}
              className="text-[10px] mb-2 opacity-70"
            >
              Total Balance
            </p>
            <h2
              style={{
                fontFamily: fonts.heading,
                color: oklchToCss(getContrastColor(tokens.accent)),
              }}
              className="text-3xl font-bold mb-3"
            >
              $24,580
            </h2>
            <div className="flex gap-2">
              <button
                style={{
                  fontFamily: fonts.button,
                  backgroundColor: oklchToCss(tokens.surface),
                  color: oklchToCss(tokens.accent),
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              >
                Send
              </button>
              <button
                style={{
                  fontFamily: fonts.button,
                  backgroundColor: oklchToCss(tokens.accentStrong),
                  color: oklchToCss(getContrastColor(tokens.accentStrong)),
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              >
                Receive
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { t: "Coffee", a: "-$4.50", time: "2h" },
              { t: "Salary", a: "+$3,200", time: "1d", success: true },
              { t: "Bill", a: "-$125", time: "2d" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: oklchToCss(tokens.surfaceRaised) }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: fonts.body,
                      color: oklchToCss(getContrastColor(tokens.surfaceRaised)),
                    }}
                    className="text-xs font-medium mb-0.5"
                  >
                    {item.t}
                  </p>
                  <p
                    style={{
                      fontFamily: fonts.caption,
                      color: oklchToCss(getContrastColor(tokens.surfaceRaised)),
                    }}
                    className="text-[10px] opacity-50"
                  >
                    {item.time}
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: fonts.heading,
                    color: oklchToCss(
                      item.success
                        ? tokens.success
                        : getContrastColor(tokens.surfaceRaised),
                    ),
                  }}
                  className="text-base font-semibold"
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Form
const FormPreview = ({ tokens, fonts }) => (
  <div
    className="h-full overflow-auto flex items-center justify-center p-12"
    style={{ backgroundColor: oklchToCss(tokens.backgroundSubtle) }}
  >
    <div
      className="w-full max-w-md rounded-2xl shadow-xl p-8"
      style={{ backgroundColor: oklchToCss(tokens.surface) }}
    >
      <h1
        style={{
          fontFamily: fonts.heading,
          color: oklchToCss(getContrastColor(tokens.surface)),
        }}
        className="text-3xl font-bold mb-2"
      >
        Create Account
      </h1>
      <p
        style={{
          fontFamily: fonts.body,
          color: oklchToCss(getContrastColor(tokens.surface)),
        }}
        className="text-sm opacity-70 mb-8"
      >
        Join thousands of designers today
      </p>
      <form className="space-y-4">
        {[
          { l: "Full Name", p: "Alex Morgan" },
          { l: "Email", p: "alex@example.com", t: "email" },
          { l: "Password", p: "••••••••", t: "password" },
        ].map((f, i) => (
          <div key={i}>
            <label
              style={{
                fontFamily: fonts.caption,
                color: oklchToCss(getContrastColor(tokens.surface)),
              }}
              className="text-xs font-semibold block mb-2 uppercase opacity-60"
            >
              {f.l}
            </label>
            <input
              type={f.t || "text"}
              placeholder={f.p}
              style={{
                fontFamily: fonts.body,
                backgroundColor: oklchToCss(tokens.background),
                color: oklchToCss(getContrastColor(tokens.background)),
                borderColor: oklchToCss(tokens.border),
              }}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none border-2 transition-colors focus:border-current"
            />
          </div>
        ))}
        <button
          type="submit"
          style={{
            backgroundColor: oklchToCss(tokens.accent),
            fontFamily: fonts.button,
            color: oklchToCss(getContrastColor(tokens.accent)),
          }}
          className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity mt-6"
        >
          Create Account
        </button>
        <p
          style={{
            fontFamily: fonts.body,
            color: oklchToCss(getContrastColor(tokens.surface)),
          }}
          className="text-sm text-center opacity-70 mt-4"
        >
          Already have an account?{" "}
          <span
            style={{ color: oklchToCss(tokens.accent) }}
            className="font-semibold cursor-pointer opacity-100"
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  </div>
);

// Pricing
const PricingPreview = ({ tokens, fonts }) => {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      features: ["5 Projects", "10GB Storage", "Basic Support"],
    },
    {
      name: "Pro",
      price: "$29",
      features: [
        "Unlimited Projects",
        "100GB Storage",
        "Priority Support",
        "Analytics",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      features: [
        "Unlimited Everything",
        "1TB Storage",
        "24/7 Support",
        "Custom Integrations",
      ],
    },
  ];
  return (
    <div
      className="h-full overflow-auto p-12"
      style={{
        backgroundColor: oklchToCss(tokens.background),
        color: oklchToCss(getContrastColor(tokens.background)),
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1
            style={{ fontFamily: fonts.heading }}
            className="text-5xl font-bold mb-4"
          >
            Simple Pricing
          </h1>
          <p style={{ fontFamily: fonts.body }} className="text-lg opacity-70">
            Choose the perfect plan for your needs
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className="rounded-2xl p-8 relative"
              style={{
                backgroundColor: plan.popular
                  ? oklchToCss(tokens.accent)
                  : oklchToCss(tokens.surface),
                color: plan.popular
                  ? oklchToCss(getContrastColor(tokens.accent))
                  : oklchToCss(getContrastColor(tokens.surface)),
                border: plan.popular
                  ? "none"
                  : `1px solid ${oklchToCss(tokens.border)}`,
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: oklchToCss(tokens.surface),
                    color: oklchToCss(tokens.accent),
                    fontFamily: fonts.caption,
                  }}
                >
                  POPULAR
                </div>
              )}
              <h3
                style={{ fontFamily: fonts.heading }}
                className="text-xl font-bold mb-2"
              >
                {plan.name}
              </h3>
              <div className="mb-6">
                <span
                  style={{ fontFamily: fonts.heading }}
                  className="text-5xl font-bold"
                >
                  {plan.price}
                </span>
                <span
                  style={{ fontFamily: fonts.caption }}
                  className="text-sm opacity-60"
                >
                  /mo
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li
                    key={j}
                    style={{ fontFamily: fonts.body }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check className="w-4 h-4" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                style={{
                  backgroundColor: plan.popular
                    ? oklchToCss(tokens.surface)
                    : oklchToCss(tokens.accent),
                  color: plan.popular
                    ? oklchToCss(tokens.accent)
                    : oklchToCss(getContrastColor(tokens.accent)),
                  fontFamily: fonts.button,
                }}
                className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function FontPalettePreview() {
  const { palette } = useColorPaletteContext();
  const fileInputRef = useRef(null);

  const expandedPalette = useMemo(() => {
    if (!palette?.length) return [];
    try {
      return generateExpandedPalette(palette);
    } catch {
      return [];
    }
  }, [palette]);

  const fullPalette = useMemo(
    () => [
      ...expandedPalette,
      { base: { l: 0.98, c: 0.002, h: 260 }, scale: {}, darkScale: {} },
      { base: { l: 0.1, c: 0.005, h: 260 }, scale: {}, darkScale: {} },
    ],
    [expandedPalette],
  );

  const [fonts, setFonts] = useState({
    brand: "Space Grotesk",
    heading: "Playfair Display",
    body: "Inter",
    button: "Inter",
    caption: "Inter",
  });
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(0);
  const [theme, setTheme] = useState("light");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [svgContent, setSvgContent] = useState(null);
  const [colorMapping, setColorMapping] = useState([0, 1, 2, 3, 4]);

  const previews = [
    { id: "landing", name: "Landing", icon: Globe },
    { id: "card", name: "Card", icon: CreditCard },
    { id: "mobile", name: "Mobile", icon: Smartphone },
    { id: "form", name: "Form", icon: FileText },
    { id: "pricing", name: "Pricing", icon: DollarSign },
    { id: "svg", name: "SVG", icon: ImageIcon },
  ];

  const tokens = useMemo(() => {
    if (!fullPalette[currentPaletteIndex]) return {};
    const scale =
      theme === "light"
        ? fullPalette[currentPaletteIndex].scale
        : fullPalette[currentPaletteIndex].darkScale;
    const base = fullPalette[currentPaletteIndex].base;

    const isNeutral = base.l > 0.9 || base.l < 0.2;
    if (isNeutral) {
      const neutralScale = {};
      for (let i = 50; i <= 900; i += i < 100 ? 50 : 100) {
        const lightness = theme === "light" ? (1000 - i) / 1000 : i / 1000;
        neutralScale[i] = { l: lightness, c: 0.005, h: 260 };
      }
      return {
        background: neutralScale[50],
        backgroundSubtle: neutralScale[100],
        surface: neutralScale[100],
        surfaceRaised: neutralScale[50],
        border: neutralScale[300],
        text: neutralScale[900],
        accent: base,
        accentStrong: neutralScale[800],
        success: { l: theme === "light" ? 0.35 : 0.55, c: 0.15, h: 145 },
      };
    }

    return {
      background: scale[50] || {
        l: theme === "light" ? 0.98 : 0.1,
        c: 0.01,
        h: 260,
      },
      backgroundSubtle: scale[100] || {
        l: theme === "light" ? 0.95 : 0.12,
        c: 0.01,
        h: 260,
      },
      surface: scale[100] || {
        l: theme === "light" ? 0.96 : 0.14,
        c: 0.01,
        h: 260,
      },
      surfaceRaised: scale[50] || {
        l: theme === "light" ? 0.98 : 0.16,
        c: 0.01,
        h: 260,
      },
      border: scale[300] || {
        l: theme === "light" ? 0.85 : 0.25,
        c: 0.02,
        h: 260,
      },
      text: scale[900] || {
        l: theme === "light" ? 0.1 : 0.92,
        c: 0.01,
        h: 260,
      },
      accent: scale[500] || base,
      accentStrong: scale[800] || {
        l: theme === "light" ? 0.2 : 0.65,
        c: 0.1,
        h: 260,
      },
      success: { l: theme === "light" ? 0.35 : 0.55, c: 0.15, h: 145 },
    };
  }, [fullPalette, currentPaletteIndex, theme]);

  useEffect(() => {
    const uniqueFonts = [...new Set(Object.values(fonts))];
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${uniqueFonts.map((f) => f.replace(/\s+/g, "+")).join("&family=")}:wght@400;500;600;700;800;900&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setFontsLoaded(true), 800);
  }, [fonts]);

  const FONTS = [
    // Classic Serifs
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Lora", label: "Lora" },
    { value: "Merriweather", label: "Merriweather" },
    { value: "EB Garamond", label: "EB Garamond" },
    { value: "Cormorant Garamond", label: "Cormorant Garamond" },
    { value: "Fraunces", label: "Fraunces" },

    // Modern Sans-Serifs
    { value: "Inter", label: "Inter" },
    { value: "Plus Jakarta Sans", label: "Plus Jakarta Sans" },
    { value: "Manrope", label: "Manrope" },
    { value: "Work Sans", label: "Work Sans" },
    { value: "DM Sans", label: "DM Sans" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },

    // Geometric Sans
    { value: "Poppins", label: "Poppins" },
    { value: "Outfit", label: "Outfit" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Raleway", label: "Raleway" },

    // Edgy & Display
    { value: "Syne", label: "Syne" },
    { value: "Clash Display", label: "Clash Display" },
    { value: "Bricolage Grotesque", label: "Bricolage Grotesque" },
    { value: "Space Grotesk", label: "Space Grotesk" },

    // Monospace
    { value: "JetBrains Mono", label: "JetBrains Mono" },
    { value: "Space Mono", label: "Space Mono" },
    { value: "IBM Plex Mono", label: "IBM Plex Mono" },
  ];

  const handleSVGUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSvgContent(event.target.result);
        setCurrentPreviewIndex(5);
      };
      reader.readAsText(file);
    }
  };

  const cycleColors = () => {
    setColorMapping((prev) => prev.map((i) => (i + 1) % fullPalette.length));
  };

  const exportCSS = () => {
    navigator.clipboard.writeText(
      `/* Design System */\n:root {\n  --font-brand: "${fonts.brand}";\n  --font-heading: "${fonts.heading}";\n  --font-body: "${fonts.body}";\n  --font-button: "${fonts.button}";\n  --font-caption: "${fonts.caption}";\n  --color-bg: ${oklchToCss(tokens.background)};\n  --color-surface: ${oklchToCss(tokens.surface)};\n  --color-border: ${oklchToCss(tokens.border)};\n  --color-text: ${oklchToCss(tokens.text)};\n  --color-accent: ${oklchToCss(tokens.accent)};\n}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPreview = () => {
    const props = { tokens, fonts };
    switch (previews[currentPreviewIndex].id) {
      case "landing":
        return <LandingPage {...props} />;
      case "card":
        return <BusinessCard {...props} />;
      case "mobile":
        return <MobileApp {...props} />;
      case "form":
        return <FormPreview {...props} />;
      case "pricing":
        return <PricingPreview {...props} />;
      case "svg":
        return (
          <SVGPreview
            palette={fullPalette}
            svgContent={svgContent}
            colorMapping={colorMapping}
          />
        );
      default:
        return <LandingPage {...props} />;
    }
  };

  return (
    <main className="flex gap-2 h-full m-4">
      <aside className="w-64 border mb-6 border-(--navBorder) bg-background flex flex-col">
        <div className="p-3 border-b border-(--navBorder)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest">
              Palette ({fullPalette.length})
            </span>
            <div className="flex gap-0.5">
              <button
                onClick={() =>
                  setCurrentPaletteIndex(
                    (p) => (p - 1 + fullPalette.length) % fullPalette.length,
                  )
                }
                className="p-0.5 rounded hover:bg-foreground/5"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                onClick={() =>
                  setCurrentPaletteIndex((p) => (p + 1) % fullPalette.length)
                }
                className="p-0.5 rounded hover:bg-foreground/5"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-1 mb-2">
            {fullPalette.map((item, i) => (
              <button
                key={i}
                onClick={() => setCurrentPaletteIndex(i)}
                className={`aspect-square rounded border transition-all ${i === currentPaletteIndex ? "border-(--brand) ring-1 ring-(--brand)/30 scale-110 shadow-md" : "border-transparent hover:border-foreground/20"}`}
                style={{ backgroundColor: oklchToCss(item.base) }}
              />
            ))}
          </div>
          <div className="text-[8px] font-mono text-foreground/40 text-center">
            {currentPaletteIndex + 1}/{fullPalette.length}
          </div>
        </div>
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
        <div className="p-3 border-b border-(--navBorder)">
          <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest block mb-2">
            Preview
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {previews.map((preview, index) => {
              const Icon = preview.icon;
              return (
                <button
                  key={preview.id}
                  onClick={() => setCurrentPreviewIndex(index)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-all ${index === currentPreviewIndex ? "bg-(--brand)/10 text-(--brand) ring-1 ring-(--brand)/30" : "hover:bg-foreground/5 text-foreground/50"}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[8px] font-semibold">
                    {preview.name}
                  </span>
                </button>
              );
            })}
          </div>
          {currentPreviewIndex === 5 && (
            <div className="mt-2 space-y-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/svg+xml"
                onChange={handleSVGUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-2 py-1.5 text-[8px] font-semibold border border-(--navBorder) rounded hover:border-(--brand) flex items-center justify-center gap-1"
              >
                <Upload className="w-3 h-3" />
                Upload SVG
              </button>
              <button
                onClick={cycleColors}
                className="w-full px-2 py-1.5 text-[8px] font-semibold border border-(--navBorder) rounded hover:border-(--brand) flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Cycle Colors
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-auto p-3">
          <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest block mb-2">
            Typography
          </span>
          <div className="space-y-2.5">
            {Object.entries(fonts).map(([type, value]) => (
              <div key={type}>
                <label className="text-[8px] font-semibold text-foreground/40 uppercase block mb-0.5">
                  {type}
                </label>
                <select
                  value={value}
                  onChange={(e) =>
                    setFonts((p) => ({ ...p, [type]: e.target.value }))
                  }
                  className="w-full px-1.5 py-1.5 text-[10px] border border-(--navBorder) rounded bg-background hover:border-(--brand) focus:outline-none focus:border-(--brand) cursor-pointer"
                >
                  {FONTS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 border-t border-(--navBorder)">
          <button
            onClick={exportCSS}
            className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-[10px] font-semibold ${copied ? "bg-(--brand) text-white border-(--brand)" : "border-(--navBorder) hover:border-(--brand) hover:bg-foreground/5"}`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Export CSS
              </>
            )}
          </button>
        </div>
      </aside>
      <section
        className="flex-1 mb-6 border border-(--navBorder)"
        style={{ backgroundColor: oklchToCss(tokens.background) }}
      >
        {fontsLoaded ? (
          renderPreview()
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-(--brand) border-t-transparent" />
          </div>
        )}
      </section>
    </main>
  );
}
