import React from "react";

export default function Preview({
  getActiveColor,
  getTextOnColor,
  oklchToCss,
  onClear,
  hl,
  cl,
  rc,
}) {
  // Merge highlight + clicked outlines
  const hcl = (roles) => ({ ...hl(roles), ...cl(roles) });

  // Helper: get contrast text color as oklch CSS
  const contrastOn = (role) => getTextOnColor(getActiveColor(role));

  const SectionLabel = ({ children }) => (
    <div
      className="text-[7px] font-black uppercase tracking-[0.15em] mb-1.5 px-0.5"
      style={{ color: oklchToCss(getActiveColor("text-subtle")), opacity: 0.5 }}
    >
      {children}
    </div>
  );

  // Card: always surface bg + border. Clicking it highlights surface+border.
  const Card = ({ children, style = {}, roles }) => {
    const cardRoles = roles || ["surface", "border"];
    return (
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: oklchToCss(getActiveColor("surface")),
          borderColor: oklchToCss(getActiveColor("border")),
          boxShadow: `0 1px 2px ${oklchToCss({ ...getActiveColor("border"), a: 0.2 })}, 0 4px 12px -2px ${oklchToCss({ ...getActiveColor("border"), a: 0.1 })}`,
          ...style,
          ...hcl(cardRoles),
        }}
        onClick={(e) => {
          e.stopPropagation();
          rc(cardRoles).onClick(e);
        }}
      >
        {children}
      </div>
    );
  };

  return (
    // Clicking the bare background wrapper fires background token highlight
    <div
      className="h-full overflow-y-auto custom-scrollbar"
      style={{ backgroundColor: oklchToCss(getActiveColor("background")) }}
      onClick={(e) => {
        rc("background").onClick(e);
      }}
    >
      <div className="px-3 pt-3 pb-3 space-y-3">
        {/* ── 1. Backgrounds & Surfaces ── */}
        <div>
          <SectionLabel>Backgrounds & Surfaces</SectionLabel>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { role: "background", label: "Background" },
              { role: "background-subtle", label: "Bg Subtle" },
              { role: "background-muted", label: "Bg Muted" },
              { role: "surface", label: "Surface" },
              { role: "surface-raised", label: "Raised" },
              { role: "surface-overlay", label: "Overlay" },
            ].map(({ role, label }) => (
              <button
                key={role}
                className="rounded-lg py-3 flex flex-col items-center gap-1 border transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: oklchToCss(getActiveColor(role)),
                  borderColor: oklchToCss(getActiveColor("border")),
                  boxShadow: `0 1px 4px ${oklchToCss({ ...getActiveColor("border"), a: 0.15 })}`,
                  ...hcl(role),
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  rc(role).onClick(e);
                }}
              >
                <span
                  className="text-[7.5px] font-bold leading-none"
                  style={{ color: oklchToCss(getActiveColor("text")) }}
                >
                  {label}
                </span>
                <span
                  className="text-[6px] font-mono leading-none mt-0.5"
                  style={{
                    color: oklchToCss(getActiveColor("text-subtle")),
                    opacity: 0.6,
                  }}
                >
                  {role}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 2. Navigation ── */}
        <div>
          <SectionLabel>Navigation</SectionLabel>
          <Card>
            <div className="px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Brand — text token */}
                <span
                  className="font-black text-[11px] tracking-tight cursor-pointer"
                  style={{
                    color: oklchToCss(getActiveColor("text")),
                    ...hcl("text"),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    rc("text").onClick(e);
                  }}
                >
                  ◆ Brand
                </span>
                <nav className="flex gap-0.5">
                  {["Home", "About", "Docs", "Pricing"].map((item, i) => (
                    <button
                      key={item}
                      className="text-[8px] px-2 py-1 rounded-lg font-medium"
                      style={{
                        color:
                          i === 0
                            ? oklchToCss(getActiveColor("interactive-default"))
                            : oklchToCss(getActiveColor("text-subtle")),
                        backgroundColor:
                          i === 0
                            ? oklchToCss(getActiveColor("background-muted"))
                            : "transparent",
                        ...hcl(
                          i === 0
                            ? ["interactive-default", "background-muted"]
                            : ["text-subtle"],
                        ),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        rc(
                          i === 0
                            ? ["interactive-default", "background-muted"]
                            : ["text-subtle"],
                        ).onClick(e);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="flex items-center gap-2">
                {/* Log in — bg + border + text */}
                <button
                  className="text-[8px] px-2.5 py-1.5 rounded-lg font-semibold border"
                  style={{
                    backgroundColor: oklchToCss(getActiveColor("background")),
                    borderColor: oklchToCss(getActiveColor("border-strong")),
                    color: oklchToCss(getActiveColor("text")),
                    ...hcl(["background", "border-strong", "text"]),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    rc(["background", "border-strong", "text"]).onClick(e);
                  }}
                >
                  Log in
                </button>
                {/* Sign Up — interactive-default bg + its contrast text */}
                <button
                  className="text-[8px] px-2.5 py-1.5 rounded-lg font-bold"
                  style={{
                    backgroundColor: oklchToCss(
                      getActiveColor("interactive-default"),
                    ),
                    color: contrastOn("interactive-default"),
                    boxShadow: `0 2px 8px ${oklchToCss({ ...getActiveColor("interactive-default"), a: 0.35 })}`,
                    ...hcl(["interactive-default"]),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    rc(["interactive-default"]).onClick(e);
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* ── 3. Hero + Profile — equal 2-col ── */}
        <div className="grid grid-cols-2 gap-2">
          {/* Hero */}
          <Card
            roles={["surface", "background-subtle"]}
            style={{
              background: `linear-gradient(135deg, ${oklchToCss(getActiveColor("surface"))}, ${oklchToCss(getActiveColor("background-subtle"))})`,
            }}
          >
            <div className="p-4 flex flex-col gap-3">
              {/* Badge — accent-subtle bg + accent border + accent-strong text */}
              <div
                className="self-start inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[7px] font-bold border cursor-pointer"
                style={{
                  backgroundColor: oklchToCss(getActiveColor("accent-subtle")),
                  borderColor: oklchToCss(getActiveColor("accent")),
                  color: oklchToCss(getActiveColor("accent-strong")),
                  ...hcl(["accent-subtle", "accent", "accent-strong"]),
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  rc(["accent-subtle", "accent", "accent-strong"]).onClick(e);
                }}
              >
                <span className="w-1 h-1 rounded-full bg-current" /> New Release
              </div>
              {/* Heading — text-strong */}
              <h2
                className="text-[14px] font-black leading-tight tracking-tight cursor-pointer"
                style={{
                  color: oklchToCss(getActiveColor("text-strong")),
                  ...hcl("text-strong"),
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  rc("text-strong").onClick(e);
                }}
              >
                Design tokens,
                <br />
                done right.
              </h2>
              {/* Body — text-subtle */}
              <p
                className="text-[8px] leading-relaxed cursor-pointer"
                style={{
                  color: oklchToCss(getActiveColor("text-subtle")),
                  ...hcl("text-subtle"),
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  rc("text-subtle").onClick(e);
                }}
              >
                Semantic color that adapts beautifully to light and dark.
              </p>
              <div className="flex gap-2">
                {/* Primary CTA */}
                <button
                  className="px-3 py-1.5 rounded-lg text-[8px] font-bold"
                  style={{
                    backgroundColor: oklchToCss(
                      getActiveColor("interactive-default"),
                    ),
                    color: contrastOn("interactive-default"),
                    boxShadow: `0 3px 10px ${oklchToCss({ ...getActiveColor("interactive-default"), a: 0.4 })}`,
                    ...hcl(["interactive-default"]),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    rc(["interactive-default"]).onClick(e);
                  }}
                >
                  Get started →
                </button>
                {/* Ghost CTA */}
                <button
                  className="px-3 py-1.5 rounded-lg text-[8px] font-semibold border"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: oklchToCss(getActiveColor("border-strong")),
                    color: oklchToCss(getActiveColor("text")),
                    ...hcl(["border-strong", "text"]),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    rc(["border-strong", "text"]).onClick(e);
                  }}
                >
                  View docs
                </button>
              </div>
            </div>
          </Card>

          {/* Profile Card */}
          <Card>
            {/* Cover — accent-subtle + fill-subtle gradient */}
            <div
              className="h-12 w-full cursor-pointer"
              style={{
                background: `linear-gradient(120deg, ${oklchToCss(getActiveColor("accent-subtle"))}, ${oklchToCss(getActiveColor("fill-subtle"))})`,
                ...hcl(["accent-subtle", "fill-subtle"]),
              }}
              onClick={(e) => {
                e.stopPropagation();
                rc(["accent-subtle", "fill-subtle"]).onClick(e);
              }}
            />
            <div className="px-3 pb-3 -mt-5">
              {/* Avatar — accent bg, surface border, contrast text */}
              <div
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] font-black mb-2 cursor-pointer"
                style={{
                  backgroundColor: oklchToCss(getActiveColor("accent")),
                  borderColor: oklchToCss(getActiveColor("surface")),
                  color: contrastOn("accent"),
                  ...hcl(["accent", "surface"]),
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  rc(["accent", "surface"]).onClick(e);
                }}
              >
                AK
              </div>
              {/* Name — text-strong */}
              <div
                className="text-[10px] font-bold mb-0.5 cursor-pointer"
                style={{
                  color: oklchToCss(getActiveColor("text-strong")),
                  ...hcl("text-strong"),
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  rc("text-strong").onClick(e);
                }}
              >
                Alex Kim
              </div>
              {/* Role — text-subtle */}
              <div
                className="text-[7.5px] mb-2.5 cursor-pointer"
                style={{
                  color: oklchToCss(getActiveColor("text-subtle")),
                  ...hcl("text-subtle"),
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  rc("text-subtle").onClick(e);
                }}
              >
                Design Systems Lead
              </div>
              <div className="flex gap-1.5">
                <button
                  className="flex-1 py-1 rounded-md text-[7.5px] font-bold"
                  style={{
                    backgroundColor: oklchToCss(
                      getActiveColor("interactive-default"),
                    ),
                    color: contrastOn("interactive-default"),
                    boxShadow: `0 1px 4px ${oklchToCss({ ...getActiveColor("interactive-default"), a: 0.3 })}`,
                    ...hcl(["interactive-default"]),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    rc(["interactive-default"]).onClick(e);
                  }}
                >
                  Follow
                </button>
                <button
                  className="flex-1 py-1 rounded-md text-[7.5px] font-bold border"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: oklchToCss(getActiveColor("border")),
                    color: oklchToCss(getActiveColor("text")),
                    ...hcl(["border", "text"]),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    rc(["border", "text"]).onClick(e);
                  }}
                >
                  Message
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* ── 4. Buttons — 2 rows in one card ── */}
        <div>
          <SectionLabel>Buttons & States</SectionLabel>
          <Card>
            <div className="p-3 space-y-2">
              {/* Variants row */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  {
                    label: "Primary",
                    bg: "interactive-default",
                    textRole: null,
                    border: null,
                  },
                  {
                    label: "Secondary",
                    bg: "background",
                    textRole: "text",
                    border: "border-strong",
                  },
                  {
                    label: "Soft",
                    bg: "fill-subtle",
                    textRole: "text",
                    border: null,
                  },
                  {
                    label: "Destructive",
                    bg: "error",
                    textRole: null,
                    border: null,
                  },
                ].map(({ label, bg, textRole, border }) => {
                  const roles = [bg, textRole, border].filter(Boolean);
                  return (
                    <button
                      key={label}
                      className="py-2 rounded-lg text-[8px] font-bold border"
                      style={{
                        backgroundColor: oklchToCss(getActiveColor(bg)),
                        color: textRole
                          ? oklchToCss(getActiveColor(textRole))
                          : contrastOn(bg),
                        borderColor: border
                          ? oklchToCss(getActiveColor(border))
                          : "transparent",
                        boxShadow:
                          bg === "interactive-default" || bg === "error"
                            ? `0 2px 8px ${oklchToCss({ ...getActiveColor(bg), a: 0.3 })}`
                            : "none",
                        ...hcl(roles),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        rc(roles).onClick(e);
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {/* States row */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: "Hover", bg: "interactive-hover", textRole: null },
                  { label: "Active", bg: "interactive-active", textRole: null },
                  {
                    label: "Disabled",
                    bg: "interactive-disabled",
                    textRole: "text-subtle",
                    opacity: 0.6,
                  },
                  {
                    label: "Loading",
                    bg: "interactive-default",
                    textRole: null,
                    spinner: true,
                  },
                ].map(({ label, bg, textRole, opacity, spinner }) => {
                  const roles = [bg, textRole].filter(Boolean);
                  return (
                    <button
                      key={label}
                      className="py-2 rounded-lg text-[8px] font-bold flex items-center justify-center gap-1.5"
                      style={{
                        backgroundColor: oklchToCss(getActiveColor(bg)),
                        color: textRole
                          ? oklchToCss(getActiveColor(textRole))
                          : contrastOn(bg),
                        opacity: opacity || 1,
                        ...hcl(roles),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        rc(roles).onClick(e);
                      }}
                    >
                      {spinner && (
                        <div
                          className="w-2 h-2 border-2 rounded-full animate-spin"
                          style={{
                            borderTopColor: "transparent",
                            borderColor: textRole
                              ? oklchToCss(getActiveColor(textRole))
                              : contrastOn(bg),
                          }}
                        />
                      )}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* ── 5. Form + Table — equal 2-col ── */}
        <div className="grid grid-cols-2 gap-2">
          {/* Form */}
          <div>
            <SectionLabel>Form</SectionLabel>
            <Card>
              <div className="p-3 space-y-2">
                {["Full name", "Email address"].map((label) => (
                  <div key={label}>
                    <label
                      className="block text-[7.5px] font-bold mb-1 cursor-pointer"
                      style={{
                        color: oklchToCss(getActiveColor("text-subtle")),
                        ...hcl("text-subtle"),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        rc("text-subtle").onClick(e);
                      }}
                    >
                      {label}
                    </label>
                    {/* Input: background bg + border + text */}
                    <div
                      className="w-full px-2 py-1.5 text-[8px] rounded-lg border cursor-pointer"
                      style={{
                        backgroundColor: oklchToCss(
                          getActiveColor("background"),
                        ),
                        borderColor: oklchToCss(getActiveColor("border")),
                        color: oklchToCss(getActiveColor("text")),
                        ...hcl(["background", "border", "text"]),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        rc(["background", "border", "text"]).onClick(e);
                      }}
                    >
                      <span
                        style={{
                          color: oklchToCss(getActiveColor("text-subtle")),
                          opacity: 0.5,
                        }}
                      >
                        {label === "Full name" ? "Alex Kim" : "alex@co.com"}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-0.5">
                  <div
                    className="w-3 h-3 rounded border-2 flex items-center justify-center cursor-pointer shrink-0"
                    style={{
                      borderColor: oklchToCss(
                        getActiveColor("interactive-default"),
                      ),
                      backgroundColor: oklchToCss(
                        getActiveColor("interactive-default"),
                      ),
                      ...hcl("interactive-default"),
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      rc("interactive-default").onClick(e);
                    }}
                  >
                    <svg
                      className="w-2 h-2"
                      fill="none"
                      stroke="white"
                      strokeWidth={3}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span
                    className="text-[7.5px] cursor-pointer"
                    style={{
                      color: oklchToCss(getActiveColor("text")),
                      ...hcl("text"),
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      rc("text").onClick(e);
                    }}
                  >
                    I agree to the terms
                  </span>
                </div>
                <button
                  className="w-full py-1.5 rounded-lg text-[8px] font-bold"
                  style={{
                    backgroundColor: oklchToCss(
                      getActiveColor("interactive-default"),
                    ),
                    color: contrastOn("interactive-default"),
                    boxShadow: `0 2px 6px ${oklchToCss({ ...getActiveColor("interactive-default"), a: 0.3 })}`,
                    ...hcl(["interactive-default"]),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    rc(["interactive-default"]).onClick(e);
                  }}
                >
                  Create Account
                </button>
              </div>
            </Card>
          </div>

          {/* Table */}
          <div>
            <SectionLabel>Data Table</SectionLabel>
            <Card style={{ overflow: "hidden" }}>
              <table className="w-full text-[7.5px]">
                <thead>
                  <tr
                    style={{
                      backgroundColor: oklchToCss(
                        getActiveColor("background-subtle"),
                      ),
                      borderBottom: `1px solid ${oklchToCss(getActiveColor("border"))}`,
                      ...hcl(["background-subtle", "border"]),
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      rc(["background-subtle", "border"]).onClick(e);
                    }}
                  >
                    {["Project", "Owner", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-2.5 py-2 text-left font-bold"
                        style={{
                          color: oklchToCss(getActiveColor("text-subtle")),
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "Design tokens",
                      owner: "Alex",
                      status: "success",
                      statusLabel: "Live",
                    },
                    {
                      name: "Component lib",
                      owner: "Sam",
                      status: "warning",
                      statusLabel: "Review",
                    },
                    {
                      name: "Dark mode",
                      owner: "Jordan",
                      status: "info",
                      statusLabel: "In progress",
                    },
                    {
                      name: "Accessibility",
                      owner: "Casey",
                      status: "error",
                      statusLabel: "Blocked",
                    },
                  ].map((row, i) => {
                    const rowBg =
                      i % 2 === 0 ? "background" : "background-subtle";
                    return (
                      <tr
                        key={row.name}
                        className="cursor-pointer"
                        style={{
                          backgroundColor: oklchToCss(getActiveColor(rowBg)),
                          borderTop: `1px solid ${oklchToCss(getActiveColor("border"))}`,
                          ...hcl([rowBg, "border"]),
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          rc([rowBg, "border"]).onClick(e);
                        }}
                      >
                        <td
                          className="px-2.5 py-2 font-medium"
                          style={{ color: oklchToCss(getActiveColor("text")) }}
                        >
                          {row.name}
                        </td>
                        <td
                          className="px-2.5 py-2"
                          style={{
                            color: oklchToCss(getActiveColor("text-subtle")),
                          }}
                        >
                          {row.owner}
                        </td>
                        <td className="px-2.5 py-2">
                          <span
                            className="px-1.5 py-0.5 rounded-full text-[6.5px] font-bold cursor-pointer"
                            style={{
                              backgroundColor: oklchToCss(
                                getActiveColor(`${row.status}-subtle`),
                              ),
                              color: oklchToCss(getActiveColor(row.status)),
                              ...hcl([row.status, `${row.status}-subtle`]),
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              rc([row.status, `${row.status}-subtle`]).onClick(
                                e,
                              );
                            }}
                          >
                            {row.statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        </div>

        {/* ── 6. Text hierarchy ── */}
        <div>
          <SectionLabel>Text Hierarchy</SectionLabel>
          <Card>
            <div className="p-3 grid grid-cols-4 gap-2">
              {[
                {
                  role: "text-strong",
                  label: "Strong",
                  sample: "Heading text",
                  size: "text-[11px] font-black",
                },
                {
                  role: "text",
                  label: "Default",
                  sample: "Body copy text",
                  size: "text-[10px] font-semibold",
                },
                {
                  role: "text-subtle",
                  label: "Subtle",
                  sample: "Caption & hints",
                  size: "text-[9px] font-medium",
                },
                {
                  role: "text-inverse",
                  label: "Inverse",
                  sample: "On dark surface",
                  size: "text-[8.5px] font-medium",
                  invert: true,
                },
              ].map(({ role, label, sample, size, invert }) => (
                <div
                  key={role}
                  className="rounded-lg p-2.5 cursor-pointer flex flex-col gap-1 border"
                  style={{
                    backgroundColor: invert
                      ? oklchToCss(getActiveColor("text-strong"))
                      : oklchToCss(getActiveColor("background-subtle")),
                    borderColor: oklchToCss(getActiveColor("border")),
                    ...hcl(
                      invert
                        ? [role, "text-strong"]
                        : [role, "background-subtle"],
                    ),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    rc(
                      invert
                        ? [role, "text-strong"]
                        : [role, "background-subtle"],
                    ).onClick(e);
                  }}
                >
                  <span
                    className="text-[6.5px] font-bold uppercase tracking-wider"
                    style={{
                      color: oklchToCss(getActiveColor(role)),
                      opacity: 0.6,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    className={`${size} leading-tight`}
                    style={{ color: oklchToCss(getActiveColor(role)) }}
                  >
                    {sample}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── 7. Icons + Borders — equal 2-col ── */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <SectionLabel>Icons</SectionLabel>
            <Card>
              <div className="p-3 space-y-1.5">
                {[
                  { role: "icon-strong", label: "Strong" },
                  { role: "icon", label: "Default" },
                  { role: "icon-subtle", label: "Subtle" },
                ].map(({ role, label }) => (
                  <div
                    key={role}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer"
                    style={{ ...hcl(role) }}
                    onClick={(e) => {
                      e.stopPropagation();
                      rc(role).onClick(e);
                    }}
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ color: oklchToCss(getActiveColor(role)) }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      />
                    </svg>
                    <span
                      className="text-[8.5px] font-semibold"
                      style={{ color: oklchToCss(getActiveColor(role)) }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
                {/* Icon on fill-subtle chip */}
                <div
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer"
                  style={{ ...hcl(["icon", "fill-subtle"]) }}
                  onClick={(e) => {
                    e.stopPropagation();
                    rc(["icon", "fill-subtle"]).onClick(e);
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: oklchToCss(
                        getActiveColor("fill-subtle"),
                      ),
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ color: oklchToCss(getActiveColor("icon")) }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      />
                    </svg>
                  </div>
                  <span
                    className="text-[8.5px] font-semibold"
                    style={{ color: oklchToCss(getActiveColor("icon")) }}
                  >
                    On fill-subtle
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <SectionLabel>Borders</SectionLabel>
            <Card>
              <div className="p-3 space-y-3">
                {[
                  { role: "border", label: "Default" },
                  { role: "border-strong", label: "Strong" },
                  { role: "border-active", label: "Active" },
                  { role: "border-focus", label: "Focus" },
                ].map(({ role, label }) => (
                  <div
                    key={role}
                    className="cursor-pointer space-y-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      rc(role).onClick(e);
                    }}
                  >
                    <div
                      className="h-px w-full rounded"
                      style={{
                        backgroundColor: oklchToCss(getActiveColor(role)),
                        ...hcl(role),
                      }}
                    />
                    <span
                      className="text-[7px] font-semibold"
                      style={{
                        color: oklchToCss(getActiveColor("text-subtle")),
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* ── 8. Fills + Accents + Decorative — equal 3-col, labels inside ── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { group: "Fills", roles: ["fill-subtle", "fill", "fill-strong"] },
            {
              group: "Accents",
              roles: ["accent-subtle", "accent", "accent-strong"],
            },
            {
              group: "Decorative",
              roles: ["decorative-light", "decorative", "decorative-dark"],
            },
          ].map(({ group, roles }) => (
            <div key={group}>
              <SectionLabel>{group}</SectionLabel>
              <Card>
                <div className="p-2.5 space-y-1.5">
                  {roles.map((role) => {
                    const isBright = getActiveColor(role).l > 0.55;
                    return (
                      <button
                        key={role}
                        className="w-full h-10 rounded-lg border flex items-center justify-center transition-all hover:scale-[1.02] cursor-pointer"
                        style={{
                          backgroundColor: oklchToCss(getActiveColor(role)),
                          borderColor: oklchToCss(getActiveColor("border")),
                          boxShadow: `0 1px 5px ${oklchToCss({ ...getActiveColor(role), a: 0.2 })}`,
                          ...hcl(role),
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          rc(role).onClick(e);
                        }}
                      >
                        {/* Label inside the swatch */}
                        <span
                          className="text-[7px] font-bold"
                          style={{
                            color: isBright
                              ? oklchToCss(getActiveColor("text-strong"))
                              : "white",
                          }}
                        >
                          {role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* ── 9. Neutrals ── */}
        <div>
          <SectionLabel>Neutrals</SectionLabel>
          <Card>
            <div className="p-2.5 grid grid-cols-5 gap-1.5">
              {[
                "neutral-subtle",
                "neutral-muted",
                "neutral-surface",
                "neutral-default",
                "neutral-strong",
              ].map((role) => {
                const isBright = getActiveColor(role).l > 0.55;
                return (
                  <button
                    key={role}
                    className="h-10 rounded-lg flex items-center justify-center border transition-all hover:scale-[1.02] cursor-pointer"
                    style={{
                      backgroundColor: oklchToCss(getActiveColor(role)),
                      borderColor: oklchToCss(getActiveColor("border")),
                      boxShadow: `0 1px 4px ${oklchToCss({ ...getActiveColor(role), a: 0.22 })}`,
                      ...hcl(role),
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      rc(role).onClick(e);
                    }}
                  >
                    <span
                      className="text-[6.5px] font-bold text-center px-1 leading-tight"
                      style={{
                        color: isBright
                          ? oklchToCss(getActiveColor("text-strong"))
                          : "white",
                      }}
                    >
                      {role.replace("neutral-", "")}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── 10. Status — LAST ── */}
        <div>
          <SectionLabel>Status & Feedback</SectionLabel>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              {
                status: "success",
                label: "Success",
                msg: "Changes saved.",
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                status: "warning",
                label: "Warning",
                msg: "Review before saving.",
                icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
              },
              {
                status: "error",
                label: "Error",
                msg: "Something went wrong.",
                icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                status: "info",
                label: "Info",
                msg: "An update is available.",
                icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
            ].map(({ status, label, msg, icon }) => (
              <div
                key={status}
                className="flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01]"
                style={{
                  backgroundColor: oklchToCss(
                    getActiveColor(`${status}-subtle`),
                  ),
                  borderColor: oklchToCss(getActiveColor(status)),
                  boxShadow: `0 1px 4px ${oklchToCss({ ...getActiveColor(status), a: 0.12 })}`,
                  ...hcl([status, `${status}-subtle`]),
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  rc([status, `${status}-subtle`]).onClick(e);
                }}
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  style={{ color: oklchToCss(getActiveColor(status)) }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                <div>
                  <div
                    className="text-[8.5px] font-bold mb-0.5"
                    style={{ color: oklchToCss(getActiveColor(status)) }}
                  >
                    {label}
                  </div>
                  <div
                    className="text-[7.5px]"
                    style={{ color: oklchToCss(getActiveColor(status)) }}
                  >
                    {msg}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
