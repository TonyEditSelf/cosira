import { useColorPaletteContext } from "../../ColorContext";
import analogousPalGen, { getBaseAngles } from "./analogousPalGen";

export default function AnalogousOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    analogPalType,
    setAnalogPalType,
    analogOptions,
    setAnalogOptions,
  } = useColorPaletteContext();

  const getCurrentAngles = () => {
    const baseAngle = getBaseAngles(analogPalType);
    return {
      angle1: analogOptions.analogousAngle1 ?? -baseAngle,
      angle2: analogOptions.analogousAngle2 ?? baseAngle,
    };
  };

  const analogTypes = [
    { id: "classicCenteredAnalog", label: "Classic Centered" },
    { id: "classicLeftAnalog", label: "Classic Left" },
    { id: "classicRightAnalog", label: "Classic Right" },
    { id: "vintageCenteredAnalog", label: "Vintage Centered" },
    { id: "vintageLeftAnalog", label: "Vintage Left" },
    { id: "vintageRightAnalog", label: "Vintage Right" },
    { id: "neutralCenteredAnalog", label: "Neutral Centered" },
    { id: "neutralLeftAnalog", label: "Neutral Left" },
    { id: "neutralRightAnalog", label: "Neutral Right" },
    { id: "pastelKidCentered", label: "Pastel Centered" },
    { id: "pastelKidLeft", label: "Pastel Left" },
    { id: "pastelKidRight", label: "Pastel Right" },
  ];

  const handleTypeChange = (value) => {
    // Reset angles when changing palette type
    setAnalogOptions({
      analogousAngle1: null,
      analogousAngle2: null,
    });

    // Generate palette with new type
    const pal = analogousPalGen(
      oklch,
      { analogousAngle1: null, analogousAngle2: null },
      value,
    );
    setPalette(pal);
    setDuplicatePalette(pal);
    setAnalogPalType(value);
  };

  const handleAngleChange = (newAngle1) => {
    const updatedOptions = {
      analogousAngle1: newAngle1,
      analogousAngle2: -newAngle1,
    };

    setAnalogOptions(updatedOptions);

    const pal = analogousPalGen(oklch, updatedOptions, analogPalType);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  const handleReset = () => {
    setAnalogOptions({
      analogousAngle1: null,
      analogousAngle2: null,
    });

    const pal = analogousPalGen(
      oklch,
      { analogousAngle1: null, analogousAngle2: null },
      analogPalType,
    );
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-semibold mb-2">Palette Type</h3>
        {analogTypes.map(({ id, label }) => (
          <div key={id} className="flex gap-4 items-center py-1">
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

      <div className="flex flex-col gap-2">
        <label className="font-semibold">
          Analogous Angle: ±{Math.abs(getCurrentAngles().angle1)}°
        </label>
        <input
          type="range"
          min="-60"
          max="-10"
          step="1"
          value={analogOptions.analogousAngle1 ?? -getBaseAngles(analogPalType)}
          onChange={(e) => handleAngleChange(parseInt(e.target.value))}
          className="w-full"
        />
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Reset to Default (±{getBaseAngles(analogPalType)}°)
        </button>
      </div>
    </div>
  );
}
