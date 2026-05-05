import PageWrapper from "@/components/ui/PageWrapper";
import Link from "next/link";

// ─── Data ───────────────────────────────────────

const tools = [
  {
    href: "/spectral-arc",
    icon: "◎",
    label: "Spectral Arc",
    tag: "OKLCH",
    desc: "Precision color builder in perceptual OKLCH space. Adjust Lightness, Chroma & Hue with seed-based reproducibility and gamut control.",
    accent: "#7c6fe0",
  },
  {
    href: "/random-palettes",
    icon: "⟡",
    label: "Random Palettes",
    tag: "Generate",
    desc: "Pick a base color, choose a harmony type, and instantly generate beautiful palette combinations.",
    accent: "#d44f7a",
  },
  {
    href: "/custom-palettes",
    icon: "⊞",
    label: "Custom Palettes",
    tag: "Control",
    desc: "Drive palette creation with your own color choices. Full harmony-based generation from a color you define.",
    accent: "#3a8fd4",
  },
  {
    href: "/palette-expander",
    icon: "⊕",
    label: "Palette Expander",
    tag: "Expand",
    desc: "Feed in your existing palette and generate additional harmonious colors that seamlessly extend your set.",
    accent: "#2aab7a",
  },
  {
    href: "/blend-colors",
    icon: "⊗",
    label: "Blend Colors",
    tag: "Metallic · Neon",
    desc: "Create metallic, neon, or branded color variations. Blend your palette with Gold, Neon, Neutral, or any custom color at 6 intensity steps.",
    accent: "#c9920a",
  },
  {
    href: "/tonalist",
    icon: "▤",
    label: "Tonalist",
    tag: "Tints & Shades",
    desc: "Generate full tint and shade scales from your palette colors. Standard or Granular mode. Export to CSS, Tailwind, or JSON.",
    accent: "#c2622a",
  },
  {
    href: "/bezier-blend",
    icon: "∿",
    label: "Bezier Blend",
    tag: "OKLCH Scale",
    desc: "Bezier-curve color scales in OKLCH. Choose control points, set easing, define steps. Export to CSS, Tailwind, JSON, or SCSS.",
    accent: "#9b4dca",
  },
  {
    href: "/gradient-tool",
    icon: "◫",
    label: "Gradient Tool",
    tag: "Linear · Radial · Conic",
    desc: "Full CSS gradient builder with 48 presets, custom stops, opacity control, and live previews on real UI elements.",
    accent: "#1a9eb0",
  },
  {
    href: "/temp-shifter",
    icon: "◑",
    label: "Temperature Shifter",
    tag: "Warm · Cool",
    desc: "Shift your entire palette warm or cool. Six cinematic presets from Candlelight 1800K to Twilight 10000K+.",
    accent: "#d4782a",
  },
  {
    href: "/mood-palettes",
    icon: "✦",
    label: "Mood Palettes",
    tag: "20 Moods",
    desc: "Smart randomizer for mood-constrained brand palettes. 20 moods, 5 harmony modes, WCAG AA/AAA contrast lock.",
    accent: "#c04060",
  },
  {
    href: "/culture-palettes",
    icon: "⊛",
    label: "Culture Palettes",
    tag: "18 Cultures",
    desc: "Culturally-grounded palettes from 18 world traditions — Japanese Wabi-sabi to West African Kente. Festivals tab included.",
    accent: "#2e9e5a",
  },
];

const stats = [
  { value: "11", label: "Color Tools" },
  { value: "OKLCH", label: "Color Space" },
  { value: "20+", label: "Moods" },
  { value: "18+", label: "Cultures" },
];

const features = [
  {
    icon: "◎",
    title: "OKLCH-native",
    desc: "Every tool operates in perceptual OKLCH color space — so lightness really means lightness, and hue shifts feel natural.",
  },
  {
    icon: "⊞",
    title: "Export anywhere",
    desc: "Copy-ready CSS variables, Tailwind config, JSON, and SCSS. Drop colors directly into your design system.",
  },
  {
    icon: "✦",
    title: "Constraint-aware",
    desc: "Mood & culture generators enforce WCAG AA/AAA contrast ratios, harmony modes, and culturally authentic hue ranges.",
  },
  {
    icon: "◑",
    title: "Cinematic presets",
    desc: "Temperature presets from Candlelight 1800K to Twilight 10000K+ — designed for realistic lighting simulation.",
  },
];

const SWATCH_COLORS = [
  "#c0392b",
  "#e74c3c",
  "#e67e22",
  "#f39c12",
  "#f1c40f",
  "#2ecc71",
  "#27ae60",
  "#1abc9c",
  "#16a085",
  "#3498db",
  "#2980b9",
  "#9b59b6",
  "#8e44ad",
  "#e91e8c",
  "#ff6b9d",
  "#fd79a8",
  "#a29bfe",
  "#6c5ce7",
  "#00cec9",
  "#00b894",
];

// ─── Components ───────────────────────────────────────────────────────────────

function SwatchStrip() {
  return (
    <div className="flex flex-wrap justify-center gap-1 max-w-xl mx-auto pb-10">
      {SWATCH_COLORS.map((c, i) => (
        <div
          key={i}
          className="w-6 h-6 rounded-[4px] opacity-80 hover:opacity-100 hover:scale-125 transition-all duration-200 cursor-default"
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

function ToolCard({ tool }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col gap-2.5 p-5 rounded-[10px] border border-border bg-card hover:-translate-y-0.5 transition-all duration-200 no-underline"
      style={{
        "--tool-accent": tool.accent,
      }}
    >
      {/* Icon + tag */}
      <div className="flex items-center justify-between">
        <span
          className="text-[22px] leading-none"
          style={{ color: tool.accent }}
        >
          {tool.icon}
        </span>
        <span
          className="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded-full"
          style={{
            color: tool.accent,
            background: `color-mix(in srgb, ${tool.accent} 12%, transparent)`,
          }}
        >
          {tool.tag}
        </span>
      </div>

      {/* Label */}
      <div className="text-[15px] font-semibold tracking-tight text-foreground">
        {tool.label}
      </div>

      {/* Desc */}
      <div className="text-[13px] leading-relaxed text-muted-foreground">
        {tool.desc}
      </div>

      {/* Hover accent line */}
      <div
        className="h-px w-0 group-hover:w-full transition-all duration-300 rounded-full mt-auto"
        style={{ background: tool.accent }}
      />
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <PageWrapper>
      <div className="overflow-y-auto h-screen">
        {/* ── Hero ── */}
        <section className="max-w-[1160px] mx-auto px-6 pt-20 pb-12 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[color-mix(in_srgb,var(--brand)_30%,transparent)] bg-[color-mix(in_srgb,var(--brand)_8%,transparent)] text-[12px] font-medium tracking-wider text-[var(--brand)] mb-7">
            <span className="text-[10px]">✦</span>
            Color Playground · Brand Building Tools
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] font-bold leading-[1.1] tracking-[-0.03em] text-foreground mb-5">
            Build Beautiful{" "}
            <span className="text-[var(--brand)]">Color Systems </span>
            <br /> That Scale
          </h1>

          {/* Subheading */}
          <p className="text-[clamp(1rem,2vw,1.15rem)] text-muted-foreground max-w-[540px] mx-auto leading-relaxed mb-10">
            A suite of precision color tools built on OKLCH — generate palettes,
            blend colors, craft gradients, and export to CSS, Tailwind, or JSON.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <Link
              href="/mood-palettes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold tracking-tight hover:opacity-90 transition-opacity no-underline"
            >
              ✦ Start with Mood
            </Link>
            <Link
              href="/random-palettes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-[color-mix(in_srgb,var(--brand)_8%,transparent)] transition-colors no-underline"
            >
              Random Palettes →
            </Link>
          </div>

          {/* Swatch strip */}
          <SwatchStrip />

          {/* Stats */}
          <div className="grid grid-cols-4 max-w-[520px] mx-auto border border-border rounded-xl overflow-hidden mb-20">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`py-4 px-2 text-center bg-card ${i < 3 ? "border-r border-border" : ""}`}
              >
                <div className="text-[22px] font-bold tracking-tight text-foreground">
                  {s.value}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tools Grid ── */}
        <section className="max-w-[1160px] mx-auto px-6 pb-20">
          <div className="mb-8">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--brand)] mb-2">
              All Tools
            </p>
            <h2 className="text-[1.6rem] font-bold tracking-tight text-foreground">
              Everything you need for color
            </h2>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
            {tools.map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </section>

        {/* ── Feature highlights ── */}
        <section className="border-t border-b border-border bg-[color-mix(in_srgb,var(--brand)_4%,var(--background))] py-16 px-6">
          <div className="max-w-[1160px] mx-auto grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col gap-2.5">
                <div className="text-2xl text-[var(--brand)]">{f.icon}</div>
                <div className="text-[15px] font-semibold tracking-tight text-foreground">
                  {f.title}
                </div>
                <div className="text-[13px] leading-relaxed text-muted-foreground">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="max-w-[1160px] mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4">
          <span className="font-bold text-sm tracking-widest text-muted-foreground">
            COSIRA
          </span>
          <span className="text-xs text-muted-foreground">
            Color Playground · Brand Building Tools
          </span>
          <div className="flex gap-5">
            {[
              ["Random Palettes", "/random-palettes"],
              ["Mood Palettes", "/mood-palettes"],
              ["Culture Palettes", "/culture-palettes"],
              ["Gradient Tool", "/gradient-tool"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors no-underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </PageWrapper>
  );
}
