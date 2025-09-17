import React, { useRef, useCallback, useEffect } from "react";
import { oklchToRgb } from "./colorutil";

export default function OklchArea({ lightness, chroma, hue, onChange }) {
  const canvasRef = useRef(null);
  const isDragging = useRef(false);

  const drawColorArea = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const l = 1 - y / height; // lightness from 1 (top) to 0 (bottom)
        const c = (x / width) * 0.4; // chroma from 0 (left) to 0.4 (right)

        const [r, g, b] = oklchToRgb(l, c, hue);

        const index = (y * width + x) * 4;
        data[index] = Math.round(r * 255); // R
        data[index + 1] = Math.round(g * 255); // G
        data[index + 2] = Math.round(b * 255); // B
        data[index + 3] = 255; // A
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [hue]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(
          canvas.width,
          (e.clientX - rect.left) * (canvas.width / rect.width)
        )
      );
      const y = Math.max(
        0,
        Math.min(
          canvas.height,
          (e.clientY - rect.top) * (canvas.height / rect.height)
        )
      );

      const newChroma = (x / canvas.width) * 0.4;
      const newLightness = 1 - y / canvas.height;

      onChange({
        c: newChroma,
        l: newLightness,
      });
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
      // Set canvas size
      canvas.width = 210;
      canvas.height = 190;
      drawColorArea();
    }
  }, [drawColorArea]);

  const markerX = (chroma / 0.4) * 300;
  const markerY = (1 - lightness) * 200;

  return (
    <div className="relative h-40">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        className="w-full h-40 cursor-crosshair rounded-xl shadow-inner border border-[var(--navBorder)]"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Color Marker */}
      <div
        className="absolute w-4 h-4 border-3 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-2 -translate-y-2"
        style={{
          left: `${(markerX / 300) * 100}%`,
          top: `${(markerY / 200) * 100}%`,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
        }}
      />

      {/* Labels */}
      <div className="absolute bottom-2 left-2 text-xs font-medium text-gray-700 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
        Chroma →
      </div>
      <div
        className="absolute top-2 left-2 text-xs font-medium text-gray-700 bg-white/80 px-2 py-1 rounded backdrop-blur-sm"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        ← Lightness
      </div>
    </div>
  );
}
