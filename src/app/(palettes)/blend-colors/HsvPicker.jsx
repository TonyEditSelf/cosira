import { useRef, useEffect, useCallback, useMemo } from "react";
import chroma from "chroma-js";

export default function HsvPicker({ color, onChange }) {
  const svCanvasRef = useRef(null);
  const hueCanvasRef = useRef(null);
  const svDragging = useRef(false);
  const hueDragging = useRef(false);

  // Parse current color to HSV
  const hsv = useMemo(() => {
    try {
      const [h, s, v] = chroma(color).hsv();
      return { h: isNaN(h) ? 0 : h, s: isNaN(s) ? 0 : s, v: isNaN(v) ? 1 : v };
    } catch {
      return { h: 0, s: 1, v: 1 };
    }
  }, [color]);

  // Draw SV gradient canvas
  const drawSV = useCallback(() => {
    const canvas = svCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const gradH = ctx.createLinearGradient(0, 0, width, 0);
    gradH.addColorStop(0, "white");
    gradH.addColorStop(1, `hsl(${hsv.h}, 100%, 50%)`);
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, width, height);
    const gradV = ctx.createLinearGradient(0, 0, 0, height);
    gradV.addColorStop(0, "rgba(0,0,0,0)");
    gradV.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = gradV;
    ctx.fillRect(0, 0, width, height);
  }, [hsv.h]);

  // Draw hue bar canvas
  const drawHue = useCallback(() => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    for (let i = 0; i <= 360; i += 30) {
      grad.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }, []);

  useEffect(() => {
    if (svCanvasRef.current) {
      svCanvasRef.current.width = 480;
      svCanvasRef.current.height = 220;
      drawSV();
    }
  }, [drawSV]);

  useEffect(() => {
    if (hueCanvasRef.current) {
      hueCanvasRef.current.width = 480;
      hueCanvasRef.current.height = 18;
      drawHue();
    }
  }, [drawHue]);

  const svFromEvent = useCallback(
    (e) => {
      const canvas = svCanvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      onChange(chroma.hsv(hsv.h, x, 1 - y).hex());
    },
    [hsv.h, onChange],
  );

  const hueFromEvent = useCallback(
    (e) => {
      const canvas = hueCanvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onChange(chroma.hsv(x * 360, hsv.s, hsv.v).hex());
    },
    [hsv.s, hsv.v, onChange],
  );

  const bindDrag = (draggingRef, handler) => ({
    onMouseDown: (e) => {
      draggingRef.current = true;
      handler(e);
      const up = () => {
        draggingRef.current = false;
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };
      const move = (e) => {
        if (draggingRef.current) handler(e);
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    },
  });

  const markerX = hsv.s * 100;
  const markerY = (1 - hsv.v) * 100;
  const hueX = (hsv.h / 360) * 100;

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* SV area */}
      <div
        className="relative rounded-md overflow-hidden cursor-crosshair"
        style={{ height: 220 }}
      >
        <canvas
          ref={svCanvasRef}
          className="w-full h-full"
          style={{ display: "block" }}
          {...bindDrag(svDragging, svFromEvent)}
        />
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
          style={{
            left: `${markerX}%`,
            top: `${markerY}%`,
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* Hue bar */}
      <div
        className="relative rounded-full overflow-hidden cursor-pointer"
        style={{ height: 18 }}
      >
        <canvas
          ref={hueCanvasRef}
          className="w-full h-full"
          style={{ display: "block" }}
          {...bindDrag(hueDragging, hueFromEvent)}
        />
        <div
          className="absolute top-0 w-3 h-full rounded-full border-2 border-white pointer-events-none"
          style={{
            left: `${hueX}%`,
            transform: "translateX(-50%)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {/* Hex input */}
      <input
        type="text"
        value={color.toUpperCase()}
        onChange={(e) => {
          if (chroma.valid(e.target.value))
            onChange(chroma(e.target.value).hex());
        }}
        className="w-full px-3 py-2 text-[12px] font-mono border border-(--navBorder) rounded bg-background outline-none focus:border-(--brand)"
        spellCheck={false}
      />
    </div>
  );
}
