import { useColorPaletteContext } from "../../ColorContext";
import tetradicPalGen from "./tetradicPalGen";

export default function TetradicOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    tetradicPalType,
    setTetradicPalType,
  } = useColorPaletteContext();

  const options = [
    { id: "classicTetra", label: "Classic Tetradic" },
    { id: "vintageTetra", label: "Vintage Tetradic" },
    { id: "neutralTetra", label: "Neutral Tetradic" },
    { id: "pastelTetra", label: "Pastel Tetradic" },
  ];

  const handleChange = (value) => {
    setTetradicPalType(value);
    const pal = tetradicPalGen(oklch, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-0">
      {options.map(({ id, label }) => (
        <div key={id} className="flex gap-4">
          <input
            type="radio"
            name="tetradicPal"
            id={id}
            value={id}
            checked={tetradicPalType === id}
            onChange={() => handleChange(id)}
          />
          <label htmlFor={id}>{label}</label>
        </div>
      ))}
    </div>
  );
}
