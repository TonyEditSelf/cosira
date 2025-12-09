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

  const options = [
    { id: "leftGradient", label: "Left Gradient" },
    { id: "rightGradient", label: "Right Gradient" },
  ];

  const handleChange = (value) => {
    setGradientPalType(value);
    const pal = gradientPalGen(oklch, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-0">
      {options.map(({ id, label }) => (
        <div key={id} className="flex gap-4">
          <input
            type="radio"
            name="gradientPal"
            id={id}
            value={id}
            checked={gradientPalType === id}
            onChange={() => handleChange(id)}
          />
          <label htmlFor={id}>{label}</label>
        </div>
      ))}
    </div>
  );
}
