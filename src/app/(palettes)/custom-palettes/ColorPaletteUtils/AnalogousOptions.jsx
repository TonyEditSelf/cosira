import { useColorPaletteContext } from "../../ColorContext";
import analogousPalGen from "./analogousPalGen";

export default function AnalogousOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    analogPalType,
    setAnalogPalType,
    analogOptions,
    handleAnalogOptionsChange,
    palette,
  } = useColorPaletteContext();

  const analogTypes = [
    { id: "classicCenteredAnalog", label: "Classic Centered Analog" },
    { id: "classicLeftAnalog", label: "Left-Leaning Classic" },
    { id: "classicRightAnalog", label: "Right-Leaning Classic" },
    { id: "vintageCenteredAnalog", label: "Vintage Centered Analog" },
    { id: "vintageLeftAnalog", label: "Left-Leaning Vintage" },
    { id: "vintageRightAnalog", label: "Right-Leaning Vintage" },
    { id: "neutralCenteredAnalog", label: "Neutral Centered Analog" },
    { id: "neutralLeftAnalog", label: "Left-Leaning Neutral" },
    { id: "neutralRightAnalog", label: "Right-Leaning Neutral" },
    { id: "pastelKidCentered", label: "Pastel-Kid Centered" },
    { id: "pastelKidLeft", label: "Pastel-Kid Left" },
    { id: "pastelKidRight", label: "Pastel-Kid Right" },
  ];

  const handleTypeChange = (value) => {
    // Generate and set palette with the new type value immediately
    const pal = analogousPalGen(oklch, analogOptions, value);
    setPalette(pal);
    setDuplicatePalette(pal);

    // Update the type state - this will trigger the useEffect in context
    // but the palette is already set correctly
    setAnalogPalType(value);
  };

  const handleAngleChange = (value, id) => {
    const newValue = parseFloat(value);
    handleAnalogOptionsChange(newValue, id);

    // Create updated options object to pass immediately
    const updatedOptions = {
      ...analogOptions,
      [id]: newValue,
    };

    // Generate palette with updated options
    const pal = analogousPalGen(oklch, updatedOptions, analogPalType);
    setPalette(pal);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        {analogTypes.map(({ id, label }) => (
          <div key={id} className="flex gap-4">
            <input
              type="radio"
              name="analogPal"
              id={id}
              value={id}
              checked={analogPalType === id}
              onChange={(e) => handleTypeChange(e.target.value)}
            />
            <label htmlFor={id}>{label}</label>
          </div>
        ))}
      </div>

      <div>
        <h1 className="text-[12px] font-bold mb-3">ANALOGUE OPTIONS</h1>
        <div className="flex flex-col gap-4 text-[11px] font-semibold">
          <div className="flex flex-col w-fit">
            <label htmlFor="analogousAngle1">Analog 1 Angle:</label>
            <input
              className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
              type="number"
              id="analogousAngle1"
              min={-90}
              max={0}
              step={1}
              value={analogOptions.analogousAngle1}
              onChange={(e) => handleAngleChange(e.target.value, e.target.id)}
            />
          </div>

          <div className="flex flex-col w-fit">
            <label htmlFor="analogousAngle2">Analog 2 Angle:</label>
            <input
              className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
              type="number"
              id="analogousAngle2"
              min={0}
              max={90}
              step={1}
              value={analogOptions.analogousAngle2}
              onChange={(e) => handleAngleChange(e.target.value, e.target.id)}
            />
          </div>

          <div className="flex flex-col w-fit">
            <label htmlFor="totalAngle">Total Angle:</label>
            <input
              className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
              type="number"
              id="totalAngle"
              readOnly
              value={
                Math.abs(analogOptions.analogousAngle1) +
                Math.abs(analogOptions.analogousAngle2)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
