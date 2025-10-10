import { useColorPaletteContext } from "../../ColorContext";

export default function AnalogousOptions() {
  const { analogOptions, handleAnalogOptionsChange } = useColorPaletteContext();

  return (
    <div>
      <h1 className="text-[12px] font-bold mb-3">ANALOGUE OPTIONS</h1>
      <div className="flex flex-col gap-4 text-[11px] font-semibold ">
        <div className="flex flex-col w-fit">
          <label htmlFor="analogousStep2">Analog1 1 Angle:</label>
          <input
            className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
            type="number"
            id="analogousAngle1"
            min={-60}
            max={-5}
            step={1}
            value={analogOptions.analogousAngle1}
            onChange={(e) =>
              handleAnalogOptionsChange(parseFloat(e.target.value), e.target.id)
            }
          />
        </div>

        <div className="flex flex-col w-fit">
          <label htmlFor="analogousStep2">Analog2 Angle:</label>
          <input
            className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
            type="number"
            id="analogousAngle2"
            min={5}
            max={30}
            step={1}
            value={analogOptions.analogousAngle2}
            onChange={(e) =>
              handleAnalogOptionsChange(parseFloat(e.target.value), e.target.id)
            }
          />
        </div>

        <div className="flex flex-col w-fit">
          <label htmlFor="analogousStep3">Analog3 Angle:</label>
          <input
            className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
            type="number"
            id="analogousAngle3"
            min={35}
            max={60}
            step={1}
            value={analogOptions.analogousAngle3}
            onChange={(e) =>
              handleAnalogOptionsChange(parseFloat(e.target.value), e.target.id)
            }
          />
        </div>
      </div>
    </div>
  );
}
