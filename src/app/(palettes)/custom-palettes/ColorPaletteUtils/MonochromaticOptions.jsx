import { useColorPaletteContext } from "../../ColorContext";
import monochromaticPalGen from "./monochromaticPalGen";

export default function MonochromaticOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    monoPalType,
    setMonoPalType,
  } = useColorPaletteContext();

  const options = [
    { id: "classicMono", label: "Classic Mono" },
    { id: "vintageMono", label: "Vintage Mono" },
    { id: "neutralMono", label: "Neutral Mono" },
    { id: "kidsMono", label: "Kids Mono" },
  ];

  const handleChange = (value) => {
    setMonoPalType(value);
    const pal = monochromaticPalGen(oklch, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-0">
      {options.map(({ id, label }) => (
        <div key={id} className="flex gap-4">
          <input
            type="radio"
            name="monoPal"
            id={id}
            value={id}
            checked={monoPalType === id}
            onChange={() => handleChange(id)}
          />
          <label htmlFor={id}>{label}</label>
        </div>
      ))}
    </div>
  );
}
