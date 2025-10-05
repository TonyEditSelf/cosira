import React, { useRef, useCallback, useEffect } from "react";
import { oklchToRgb } from "./colorutil";

export default function ChromaSlider({ lightness, chroma, hue, onChange }) {
  const canvasRef = useRef(null);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const drawChromaSlider = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let x = 0; x < width; x++) {
      const currentChroma = (x / width) * 0.4; // 0 to 0.4
      const [r, g, b] = oklchToRgb(lightness, currentChroma, hue);

      for (let y = 0; y < height; y++) {
        const index = (y * width + x) * 4;
        data[index] = Math.round(r * 255); // R
        data[index + 1] = Math.round(g * 255); // G
        data[index + 2] = Math.round(b * 255); // B
        data[index + 3] = 255; // A
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [lightness, hue]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.current) return;

      const slider = sliderRef.current;
      const rect = slider.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const newChroma = (x / rect.width) * 0.4;

      onChange({ c: newChroma });
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
      drawChromaSlider();
    }
  }, [drawChromaSlider]);

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        className="relative w-full h-3 cursor-pointer rounded-lg overflow-hidden shadow-inner border border-gray-200"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ imageRendering: "pixelated" }}
        />

        {/* Chroma Marker */}
        <div
          className="absolute top-0 w-1 h-full bg-white shadow-lg border-l border-r border-gray-400 pointer-events-none"
          style={{
            left: `${(chroma / 0.4) * 100}%`,
            transform: "translateX(-50%)",
          }}
        />
      </div>

      {/* Chroma Value Label */}
      <div className="flex justify-between mt-2 text-xs  font-medium">
        <span>0.000</span>
        <span className="bg-[var(--background)] px-2 py-1 rounded backdrop-blur-sm">
          {chroma.toFixed(3)}
        </span>
        <span>0.400</span>
      </div>
    </div>
  );
}
