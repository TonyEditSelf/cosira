import React, { useRef, useCallback, useEffect } from "react";
import { oklchToRgb } from "./colorutil";

export default function AlphaSlider({
  lightness,
  chroma,
  hue,
  alpha,
  onChange,
}) {
  const canvasRef = useRef(null);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const drawAlphaSlider = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // **Fix:** Add a check to ensure all values are valid numbers before drawing.
    if (isNaN(lightness) || isNaN(chroma) || isNaN(hue)) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Draw checkerboard pattern for transparency background
    const checkSize = 8;
    for (let y = 0; y < height; y += checkSize) {
      for (let x = 0; x < width; x += checkSize) {
        const isEven =
          (Math.floor(x / checkSize) + Math.floor(y / checkSize)) % 2;
        ctx.fillStyle = isEven ? "#ffffff" : "#e5e5e5";
        ctx.fillRect(x, y, checkSize, checkSize);
      }
    }

    // Draw alpha gradient
    const [r, g, b] = oklchToRgb(lightness, chroma, hue);
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(
      0,
      `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
        b * 255
      )}, 0)`
    );
    gradient.addColorStop(
      1,
      `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
        b * 255
      )}, 1)`
    );

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, [lightness, chroma, hue]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.current) return;

      const slider = sliderRef.current;
      const rect = slider.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const newAlpha = x / rect.width;

      onChange({ a: newAlpha });
    },
    [onChange]
  );

  const handleMouseDown = useCallback(
    (e) => {
      isDragging.current = true;
      handleMouseMove(e);

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleMouseMove]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 300;
      canvas.height = 20;
      drawAlphaSlider();
    }
  }, [drawAlphaSlider]);

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        className="relative w-full h-2 cursor-pointer rounded-lg overflow-hidden shadow-inner border border-gray-200"
      >
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Alpha Marker */}
        <div
          className="absolute top-0 w-1 h-full bg-white shadow-lg border-l border-r border-gray-400 pointer-events-none"
          style={{
            left: `${alpha * 100}%`,
            transform: "translateX(-50%)",
          }}
        />
      </div>

      {/* Alpha Value Label */}
      <div className="flex justify-between mt-2 text-[10px] font-medium">
        <span>0%</span>
        <span className="bg-[var(--background)] px-2 py-1">
          {((alpha || 0) * 100).toFixed(0)}%
        </span>
        <span>100%</span>
      </div>
    </div>
  );
}
