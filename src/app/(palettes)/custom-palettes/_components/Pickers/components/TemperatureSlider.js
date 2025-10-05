import React, { useRef, useCallback, useEffect } from "react";
import { oklchToRgb } from "./colorutil";

export default function TemperatureSlider({
  lightness,
  chroma,
  hue,
  onChange,
}) {
  const canvasRef = useRef(null);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const drawTemperatureSlider = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Temperature range: cool (240°) to warm (60°)
    const coolHue = 240; // Blue
    const warmHue = 60; // Yellow

    for (let x = 0; x < width; x++) {
      // Map x position to temperature: 0 = cool, 1 = warm
      const tempRatio = x / width;
      const currentHue = coolHue + (warmHue - coolHue) * tempRatio;

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
      const tempRatio = x / rect.width;

      // Convert temperature ratio to hue
      const coolHue = 240;
      const warmHue = 60;
      const newHue = coolHue + (warmHue - coolHue) * tempRatio;

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
      canvas.width = 300;
      canvas.height = 20;
      drawTemperatureSlider();
    }
  }, [drawTemperatureSlider]);

  // Calculate current temperature position
  const coolHue = 240;
  const warmHue = 60;
  const tempRatio = Math.max(
    0,
    Math.min(1, (hue - coolHue) / (warmHue - coolHue))
  );

  // Calculate temperature in Kelvin (approximate)
  const minTemp = 2700; // Warm
  const maxTemp = 6500; // Cool
  const tempK = minTemp + (maxTemp - minTemp) * (1 - tempRatio);

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

        {/* Temperature Marker */}
        <div
          className="absolute top-0 w-1 h-full bg-white shadow-lg border-l border-r border-gray-400 pointer-events-none"
          style={{
            left: `${tempRatio * 100}%`,
            transform: "translateX(-50%)",
          }}
        />
      </div>

      {/* Temperature Value Label */}
      <div className="flex flex-col justify-center items-center mt-2 text-xs font-medium">
        <div className="flex gap-13 justify-between">
          <span>Cool</span>
          <span className="px-2 py-1">{Math.round(tempK)}K</span>
          <span>Warm</span>
        </div>
        <div className="flex gap-32 justify-between">
          <span>(6500K)</span>
          <span>(2700K)</span>
        </div>
      </div>
    </div>
  );
}
