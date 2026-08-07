// /components/playground/panels/ImagePanel.jsx
"use client";

import { useRef } from "react";
import {
  usePlaygroundStore,
  useSelectedElement,
} from "@/store/playgroundStore";
import { Section, Empty } from "./TypographyPanel";
import { Upload, Link } from "lucide-react";

const ASPECT_RATIOS = ["16/9", "3/2", "4/3", "1/1", "4/5", "9/16"];
const OBJECT_FITS = ["cover", "contain"];

export default function ImagePanel() {
  const el = useSelectedElement();
  const updateElement = usePlaygroundStore((s) => s.updateElement);
  const fileRef = useRef(null);

  if (!el || el.type !== "image") {
    return <Empty label="Select an image element to edit image properties" />;
  }

  const upd = (key, val) => updateElement(el.id, { [key]: val });

  // File → base64
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => upd("src", ev.target.result);
    reader.readAsDataURL(file);
  };

  // Aspect ratio → auto-resize height
  const onAspectChange = (ratio) => {
    upd("aspectRatio", ratio);
    const [rw, rh] = ratio.split("/").map(Number);
    const newH = Math.round(el.width * (rh / rw));
    updateElement(el.id, { aspectRatio: ratio, height: newH });
  };

  return (
    <div style={s.panel}>
      {/* Preview */}
      {el.src && (
        <Section label="PREVIEW">
          <div
            style={{
              width: "100%",
              aspectRatio: el.aspectRatio,
              borderRadius: "var(--radius)",
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--muted)",
            }}
          >
            <img
              src={el.src}
              alt={el.altText}
              style={{
                width: "100%",
                height: "100%",
                objectFit: el.objectFit,
                display: "block",
              }}
            />
          </div>
        </Section>
      )}

      {/* Upload */}
      <Section label="SOURCE">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
        <button
          style={s.uploadBtn}
          onClick={() => fileRef.current?.click()}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--brand)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        >
          <Upload size={14} />
          <span>Upload image</span>
        </button>

        {/* URL input */}
        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Link
            size={13}
            style={{ color: "var(--muted-foreground)", flexShrink: 0 }}
          />
          <input
            type="text"
            placeholder="Paste image URL…"
            value={el.src.startsWith("data:") ? "" : el.src}
            onChange={(e) => upd("src", e.target.value)}
            style={s.textInput}
          />
        </div>
      </Section>

      {/* Alt text */}
      <Section label="ALT TEXT">
        <input
          type="text"
          placeholder="Describe the image…"
          value={el.altText}
          onChange={(e) => upd("altText", e.target.value)}
          style={s.textInput}
        />
      </Section>

      {/* Aspect ratio */}
      <Section label="ASPECT RATIO">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {ASPECT_RATIOS.map((r) => (
            <button
              key={r}
              onClick={() => onAspectChange(r)}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                borderRadius: "calc(var(--radius) - 2px)",
                border: "1px solid var(--border)",
                background:
                  el.aspectRatio === r
                    ? "oklch(0.597 0.240854 2.4025)"
                    : "var(--background)",
                color: el.aspectRatio === r ? "#fff" : "var(--foreground)",
                cursor: "pointer",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </Section>

      {/* Object fit */}
      <Section label="OBJECT FIT">
        <div style={s.btnGroup}>
          {OBJECT_FITS.map((f) => (
            <button
              key={f}
              onClick={() => upd("objectFit", f)}
              style={{
                ...s.segBtn,
                background:
                  el.objectFit === f ? "var(--background)" : "transparent",
                color:
                  el.objectFit === f
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                boxShadow:
                  el.objectFit === f ? "0 1px 3px oklch(0 0 0 / 0.08)" : "none",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

const s = {
  panel: { padding: "16px" },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "10px",
    border: "1.5px dashed var(--border)",
    borderRadius: "var(--radius)",
    background: "none",
    cursor: "pointer",
    color: "var(--muted-foreground)",
    fontSize: 13,
    transition: "border-color 0.15s",
  },
  textInput: {
    width: "100%",
    fontSize: 12,
    padding: "6px 8px",
    background: "var(--background)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--foreground)",
    outline: "none",
    boxSizing: "border-box",
  },
  btnGroup: {
    display: "flex",
    gap: 2,
    background: "var(--muted)",
    borderRadius: "var(--radius)",
    padding: 2,
  },
  segBtn: {
    flex: 1,
    height: 28,
    border: "none",
    borderRadius: "calc(var(--radius) - 2px)",
    cursor: "pointer",
    fontSize: 12,
    transition: "background 0.15s",
  },
};
