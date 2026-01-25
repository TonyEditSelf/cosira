import React, { useRef, useCallback, useEffect } from "react";
import { oklchToRgb } from "./colorutil";

export default function OklchColorWheel({ lightness, chroma, hue, onChange }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const drawColorWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 2;

    ctx.clearRect(0, 0, width, height);

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
          // Calculate hue from angle
          let angle = Math.atan2(dy, dx);
          if (angle < 0) angle += 2 * Math.PI;
          const currentHue = (angle * 180) / Math.PI;

          // Calculate chroma from distance (0 at center, max at edge)
          const currentChroma = (distance / radius) * 0.4;

          const [r, g, b] = oklchToRgb(lightness, currentChroma, currentHue);

          const index = (y * width + x) * 4;
          data[index] = Math.round(r * 255); // R
          data[index + 1] = Math.round(g * 255); // G
          data[index + 2] = Math.round(b * 255); // B
          data[index + 3] = 255; // A
        } else {
          // Transparent outside the circle
          const index = (y * width + x) * 4;
          data[index + 3] = 0; // Transparent
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw circle border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [lightness]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 2;

      const x = (e.clientX - rect.left) * (canvas.width / rect.width) - centerX;
      const y =
        (e.clientY - rect.top) * (canvas.height / rect.height) - centerY;

      const distance = Math.sqrt(x * x + y * y);

      if (distance <= radius) {
        // Calculate hue from angle
        let angle = Math.atan2(y, x);
        if (angle < 0) angle += 2 * Math.PI;
        const newHue = (angle * 180) / Math.PI;

        // Calculate chroma from distance
        const newChroma = Math.min((distance / radius) * 0.4, 0.4);

        onChange({
          h: newHue,
          c: newChroma,
        });
      }
    },
    [onChange],
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
    [handleMouseMove],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 135;
      canvas.height = 135;
      drawColorWheel();
    }
  }, [drawColorWheel]);

  // Calculate marker position - FIXED to match canvas size
  const centerX = 135 / 2; // 67.5
  const centerY = 135 / 2; // 67.5
  const radius = 135 / 2 - 2; // 65.5
  const hueRad = (hue * Math.PI) / 180;
  const chromaDistance = (chroma / 0.4) * radius;
  const markerX = centerX + chromaDistance * Math.cos(hueRad);
  const markerY = centerY + chromaDistance * Math.sin(hueRad);

  return (
    <div className="relative flex justify-center">
      <div ref={containerRef} className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          className="cursor-crosshair rounded-full "
          style={{ imageRendering: "pixelated" }}
        />

        {/* Color Marker */}
        <div
          className="absolute w-4 h-4 border-3 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-2 -translate-y-2"
          style={{
            left: `${(markerX / 135) * 100}%`,
            top: `${(markerY / 135) * 100}%`,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      {/* Center Label */}
      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700 pointer-events-none backdrop-blur-sm">
        Center
      </div> */}
    </div>
  );
}
