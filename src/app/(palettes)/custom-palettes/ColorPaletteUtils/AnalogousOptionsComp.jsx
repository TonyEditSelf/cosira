import { useColorPaletteContext } from "../../ColorContext";

export default function AnalogousOptionsComp() {
  const { options, handleOptionsChange } = useColorPaletteContext();

  return (
    <div>
      <h1 className="text-[15px] font-bold mb-3">ANALOGUE OPTIONS</h1>
      <div className="flex flex-col gap-4 text-sm font-semibold ">
        <div className="flex flex-col w-fit">
          <label htmlFor="analogousStep2">Analogous 1 Hue Step:</label>
          <input
            className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
            type="number"
            id="analogousStep1"
            min={-60}
            max={0}
            step={1}
            value={options.analogousStep1}
            onChange={(e) =>
              handleOptionsChange(parseFloat(e.target.value), e.target.id)
            }
          />
        </div>

        <div className="flex flex-col w-fit">
          <label htmlFor="analogousStep2">Analogous 2 Hue Step:</label>
          <input
            className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
            type="number"
            id="analogousStep2"
            min={0}
            max={30}
            step={1}
            value={options.analogousStep2}
            onChange={(e) =>
              handleOptionsChange(parseFloat(e.target.value), e.target.id)
            }
          />
        </div>

        <div className="flex flex-col w-fit">
          <label htmlFor="analogousStep3">Analogous 3 Hue Step:</label>
          <input
            className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
            type="number"
            id="analogousStep3"
            min={30}
            max={60}
            step={1}
            value={options.analogousStep3}
            onChange={(e) =>
              handleOptionsChange(parseFloat(e.target.value), e.target.id)
            }
          />
        </div>
      </div>
    </div>
  );
}
