import { useColorPaletteContext } from "../../ColorContext";
import triadicPalGen from "./triadicPalGen";

export default function TriadicOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    triadicPalType,
    setTriadicPalType,
  } = useColorPaletteContext();

  const options = [
    { id: "classicTriad", label: "Classic Triadic" },
    { id: "vintageTriad", label: "Vintage Triadic" },
    { id: "neutralTriad", label: "Neutral Triadic" },
    { id: "kidsTriad", label: "Kids Triadic" },
  ];

  const handleChange = (value) => {
    setTriadicPalType(value);
    const pal = triadicPalGen(oklch, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-0">
      {options.map(({ id, label }) => (
        <div key={id} className="flex gap-4">
          <input
            type="radio"
            name="triadicPal"
            id={id}
            value={id}
            checked={triadicPalType === id}
            onChange={() => handleChange(id)}
          />
          <label htmlFor={id}>{label}</label>
        </div>
      ))}
    </div>
  );
}
