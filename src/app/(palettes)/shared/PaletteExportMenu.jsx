"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaDownload, FaCopy } from "react-icons/fa";
import { paletteToExportText, downloadPaletteExport } from "./paletteExport";

const FORMATS = [
  { key: "json", label: "JSON" },
  { key: "tailwind", label: "Tailwind" },
  { key: "css", label: "CSS" },
  { key: "hex", label: "HEX" },
];

export default function PaletteExportMenu({
  palette,
  paletteName = "palette",
  buttonLabel = "Export",
  className = "",
  placement = "up",
}) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState("json");
  const [copied, setCopied] = useState(false);
  const rootRef = useRef(null);

  const exportText = useMemo(
    () => paletteToExportText(palette, format, paletteName),
    [palette, format, paletteName],
  );

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleDownload = () => {
    downloadPaletteExport(palette, format, paletteName);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 h-7 cursor-pointer border border-[var(--navBorder)] rounded-md hover:border-[var(--muted-foreground)] transition-colors"
      >
        <FaDownload className="size-3.5" />
        <span className="text-[10px] font-bold leading-none">{buttonLabel}</span>
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 w-72 rounded-md border border-[var(--navBorder)] bg-[var(--background)] p-3 shadow-lg ${
            placement === "up"
              ? "bottom-[calc(100%+0.5rem)]"
              : "top-[calc(100%+0.5rem)]"
          }`}
        >
          <div className="flex flex-wrap gap-1.5 mb-3">
            {FORMATS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFormat(item.key)}
                className={`px-2 py-1 text-[10px] font-bold uppercase rounded border transition-colors ${
                  format === item.key
                    ? "border-[var(--brand)] text-[var(--brand)] bg-foreground/[0.03]"
                    : "border-[var(--navBorder)] text-foreground/60 hover:border-[var(--muted-foreground)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <pre className="max-h-44 overflow-auto whitespace-pre-wrap rounded border border-[var(--navBorder)] bg-foreground/[0.03] p-3 text-[10px] leading-relaxed text-foreground/80">
            {exportText}
          </pre>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex flex-1 items-center justify-center gap-1.5 rounded border border-[var(--navBorder)] px-2 py-1.5 text-[10px] font-bold uppercase text-foreground/70 hover:border-[var(--muted-foreground)]"
            >
              <FaCopy className="size-3.5" />
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex flex-1 items-center justify-center gap-1.5 rounded border border-[var(--brand)] px-2 py-1.5 text-[10px] font-bold uppercase text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white"
            >
              <FaDownload className="size-3.5" />
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
