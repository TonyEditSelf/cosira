"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import SelectComp from "@/app/(palettes)/custom-palettes/_components/SelectComp";
import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";

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
    <section className="flex gap-1 items-center border border-[var(--navBorder)] py-3 px-3 rounded-md">
      <section className="flex gap-2 pr-3 border-r border-[var(--navBorder)]">
        <button
          onClick={() => onPageChange("Light")}
          className={`size-9 cursor-pointer border py-2 px-2 rounded-md transition-all ${
            currentPage === "Light"
              ? "border-[var(--brand)] bg-[var(--brand)]/10"
              : "border-[var(--navBorder)] hover:border-[var(--muted-foreground)]"
          }`}
          title="Light Mode"
        >
          <Sun className="size-5" />
        </button>
        <button
          onClick={() => onPageChange("Dark")}
          className={`size-9 cursor-pointer border py-2 px-2 rounded-md transition-all ${
            currentPage === "Dark"
              ? "border-[var(--brand)] bg-[var(--brand)]/10"
              : "border-[var(--navBorder)] hover:border-[var(--muted-foreground)]"
          }`}
          title="Dark Mode"
        >
          <Moon className="size-5" />
        </button>
      </section>

      {/* Font Selectors */}
      <section className="flex flex-col gap-2 pl-5 pr-3 rounded-md">
        <p className="h-full">Company: </p>
        <div className="w-40">
          <SelectComp
            items={GOOGLE_FONTS}
            value={fonts.company}
            onChange={(val) => onFontChange("heading", val)}
            triggerClassName="min-w-[160px] w-[160px]"
            contentStyle={{ width: "160px", minWidth: "160px" }}
          />
        </div>
      </section>

      <section className="flex flex-col gap-2 pl-5 pr-3 rounded-md">
        <p className="h-full">Hero: </p>
        <div className="w-40">
          <SelectComp
            items={GOOGLE_FONTS}
            value={fonts.heading}
            onChange={(val) => onFontChange("heading", val)}
            triggerClassName="min-w-[160px] w-[160px]"
            contentStyle={{ width: "160px", minWidth: "160px" }}
          />
        </div>
      </section>

      <section className="flex flex-col gap-2 pl-5 pr-3 rounded-md">
        <p className="h-full">Body: </p>
        <div className="w-40">
          <SelectComp
            items={GOOGLE_FONTS}
            value={fonts.body}
            onChange={(val) => onFontChange("body", val)}
            triggerClassName="min-w-[160px] w-[160px]"
            contentStyle={{ width: "160px", minWidth: "160px" }}
          />
        </div>
      </section>

      {/* Color Navigation */}

      <div className="flex justify-center items-center gap-2">
        <ChevronLeft
          onClick={() => onColorChange("prev")}
          className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
        />

        {/* Color Palette Display */}

        <section className="shrink-0 flex flex-wrap w-[350px]">
          {hexPalette.map((color, index) => (
            <button
              key={index}
              onClick={() => onColorChange("set", index)}
              className={`w-5 h-5 rounded-sm transition-all border ${
                index === currentColorIndex
                  ? "border-[var(--brand)] scale-115"
                  : "border-[var(--navBorder)] hover:border-[var(--muted-foreground)]"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </section>

        <ChevronRight
          onClick={() => onColorChange("next")}
          className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
        />
      </div>
    </section>
  );
}
