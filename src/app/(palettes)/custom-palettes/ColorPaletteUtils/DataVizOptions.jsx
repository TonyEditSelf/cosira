import { useColorPaletteContext } from "../../ColorContext";

import generateDataVizPalette, { PALETTE_TYPES } from "./dataVizPalettePalGen";

export default function DataVizOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    dataVizPalType,
    setDataVizPalType,
  } = useColorPaletteContext();

  const options = [
    { id: "dataVizPalOne", label: PALETTE_TYPES.dataVizPalOne.name },
    { id: "dataVizPalTwo", label: PALETTE_TYPES.dataVizPalTwo.name },
    { id: "dataVizPalThree", label: PALETTE_TYPES.dataVizPalThree.name },
    { id: "dataVizPalFour", label: PALETTE_TYPES.dataVizPalFour.name },
    { id: "dataVizPalFive", label: PALETTE_TYPES.dataVizPalFive.name },
    { id: "dataVizPalSix", label: PALETTE_TYPES.dataVizPalSix.name },
    { id: "dataVizPalSeven", label: PALETTE_TYPES.dataVizPalSeven.name },
    { id: "dataVizPalEight", label: PALETTE_TYPES.dataVizPalEight.name },
    { id: "dataVizPalNine", label: PALETTE_TYPES.dataVizPalNine.name },
  ];

  const handleChange = (value) => {
    setDataVizPalType(value);
    const pal = generateDataVizPalette(oklch, value);
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
