"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Sun, Moon, Type } from "lucide-react";

const GOOGLE_FONTS = [
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Lora", label: "Lora" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Ubuntu", label: "Ubuntu" },
  { value: "Raleway", label: "Raleway" },
  { value: "Libre Baskerville", label: "Libre Baskerville" },
  { value: "EB Garamond", label: "EB Garamond" },
  { value: "Crimson Text", label: "Crimson Text" },
  { value: "DM Sans", label: "DM Sans" },
  { value: "DM Serif Display", label: "DM Serif Display" },
  { value: "JetBrains Mono", label: "JetBrains Mono" },
  { value: "Space Grotesk", label: "Space Grotesk" },
  { value: "Sora", label: "Sora" },
  { value: "Quicksand", label: "Quicksand" },
  { value: "Outfit", label: "Outfit" },
  { value: "Manrope", label: "Manrope" },
];

// Simple Select Component
const Select = ({ value, onChange, options, label }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-1.5 text-sm border border-[var(--navBorder)] rounded-md bg-[var(--background)] hover:border-[var(--muted-foreground)] focus:outline-none focus:border-[var(--brand)] transition-colors cursor-pointer"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default function FontPaletteToolbar({
  fonts,
  onFontChange,
  currentColorIndex,
  onColorChange,
  hexPalette,
  currentPage,
  onPageChange,
}) {
  return (
    <section className="flex items-center justify-between border border-[var(--navBorder)] rounded-md bg-[var(--background)] overflow-hidden">
      {/* Left Section: Theme Toggle */}
      <div className="flex items-center gap-2 px-4 py-3 border-r border-[var(--navBorder)]">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
          <button
            onClick={() => onPageChange("Light")}
            className={`p-2 rounded transition-all ${
              currentPage === "Light"
                ? "bg-white dark:bg-gray-700 shadow-sm"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            title="Light Mode"
          >
            <Sun className="size-4" />
          </button>
          <button
            onClick={() => onPageChange("Dark")}
            className={`p-2 rounded transition-all ${
              currentPage === "Dark"
                ? "bg-white dark:bg-gray-700 shadow-sm"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            title="Dark Mode"
          >
            <Moon className="size-4" />
          </button>
        </div>
      </div>

      {/* Middle Section: Typography Controls */}
      <div className="flex items-center gap-6 px-6 py-3 flex-1 border-r border-[var(--navBorder)]">
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-600">
          <Type className="size-4" />
          <span>Typography</span>
        </div>

        <Select
          label="Brand"
          value={fonts.company}
          onChange={(val) => onFontChange("company", val)}
          options={GOOGLE_FONTS}
        />

        <Select
          label="Heading"
          value={fonts.heading}
          onChange={(val) => onFontChange("heading", val)}
          options={GOOGLE_FONTS}
        />

        <Select
          label="Body"
          value={fonts.body}
          onChange={(val) => onFontChange("body", val)}
          options={GOOGLE_FONTS}
        />
      </div>

      {/* Right Section: Color Palette */}
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-600">
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
          <span>Accent</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onColorChange("prev")}
            className="p-1.5 rounded-md border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            title="Previous color"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-md">
            {hexPalette.slice(0, 8).map((color, index) => (
              <button
                key={index}
                onClick={() => onColorChange("set", index)}
                className={`w-6 h-6 rounded transition-all ${
                  index === currentColorIndex
                    ? "ring-2 ring-[var(--brand)] ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-800 scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          <button
            onClick={() => onColorChange("next")}
            className="p-1.5 rounded-md border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            title="Next color"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
