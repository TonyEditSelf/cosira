import React, { useRef, useCallback, useEffect } from "react";
import { oklchToRgb } from "./colorutil";

export default function HueSlider({ hue, lightness, chroma, onChange }) {
  const canvasRef = useRef(null);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const drawHueSlider = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let x = 0; x < width; x++) {
      const currentHue = (x / width) * 360;
      const [r, g, b] = oklchToRgb(lightness, chroma, currentHue);

      for (let y = 0; y < height; y++) {
        const index = (y * width + x) * 4;
        data[index] = Math.round(r * 255); // R
        data[index + 1] = Math.round(g * 255); // G
        data[index + 2] = Math.round(b * 255); // B
        data[index + 3] = 255; // A
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [lightness, chroma]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.current) return;

      const slider = sliderRef.current;
      const rect = slider.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const newHue = (x / rect.width) * 360;

      onChange({ h: newHue });
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
      canvas.width = 360;
      canvas.height = 30;
      drawHueSlider();
    }
  }, [drawHueSlider]);

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        className="relative w-full h-2 cursor-pointer rounded-xl overflow-hidden shadow-inner border border-gray-200"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ imageRendering: "pixelated" }}
        />

        {/* Hue Marker */}
        <div
          className="absolute top-0 w-1 h-full bg-white shadow-lg border-l border-r border-gray-400 pointer-events-none"
          style={{
            left: `${(hue / 360) * 100}%`,
            transform: "translateX(-50%)",
          }}
        />
      </div>

      {/* Hue Value Label */}
      <div className="flex justify-between mt-2 text-[10px] font-medium">
        <span>0°</span>
        <span className="bg-[var(--background)] px-2 py-1 rounded backdrop-blur-sm">
          {hue.toFixed(1)}°
        </span>
        <span>360°</span>
      </div>
    </div>
  );
}
