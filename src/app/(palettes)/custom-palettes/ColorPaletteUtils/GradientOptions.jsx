import { useColorPaletteContext } from "../../ColorContext";
import gradientPalGen from "./gradientPalGen";

export default function GradientOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    gradientPalType,
    setGradientPalType,
  } = useColorPaletteContext();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="gradientPal"
            id="leftGradient"
            value={"leftGradient"}
            checked={gradientPalType === "leftGradient"}
            onChange={(e) => {
              setGradientPalType(e.target.value);
              const pal = gradientPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="leftGradient">Left Gradient</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="gradientPal"
            id="rightGradient"
            value={"rightGradient"}
            checked={gradientPalType === "rightGradient"}
            onChange={(e) => {
              setGradientPalType(e.target.value);
              const pal = gradientPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="rightGradient">Right Gradient</label>
        </div>
      </div>
    </div>
  );
}
