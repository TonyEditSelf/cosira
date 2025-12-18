import { useColorPaletteContext } from "../../ColorContext";
import dataVizPalettePalGen from "./dataVizPalettePalGen";

export default function DataVizOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    dataVizPalType,
    setDataVizPalType,
  } = useColorPaletteContext();

  const options = [
    { id: "dataVizPalOne", label: "Data Visualization 1" },
    { id: "dataVizPalTwo", label: "Data Visualization 2" },
    { id: "dataVizPalThree", label: "Data Visualization 3" },
    { id: "dataVizPalFour", label: "Data Visualization 4" },
    { id: "dataVizPalFive", label: "Data Visualization 5" },
    { id: "dataVizPalSix", label: "Data Visualization 6" },
    { id: "dataVizPalSeven", label: "Data Visualization 7" },
  ];

  const handleChange = (value) => {
    setDataVizPalType(value);
    const pal = dataVizPalettePalGen(oklch, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div>
      {options.map(({ id, label }) => (
        <div key={id} className="flex gap-4">
          <input
            type="radio"
            name="dataVizPal"
            id={id}
            value={id}
            checked={dataVizPalType === id}
            onChange={() => handleChange(id)}
          />
          <label htmlFor={id}>{label}</label>
        </div>
      ))}
    </div>
  );
}
