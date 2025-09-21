import { useColorPaletteContext } from "../../ColorContext";

export default function AnalogousOptionsComp() {
  const { options, setOptions, handleOptionsChange } = useColorPaletteContext();

  return (
    <div className="flex flex-col gap-4 text-sm font-semibold ">
      <div>
        <label htmlFor="darkOffset">Darkness L Offset:</label>
        <input
          className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
          type="number"
          id="darkOffset"
          min={0}
          max={1}
          step={0.01}
          value={options.darkOffset}
          onChange={(e) =>
            handleOptionsChange(parseFloat(e.target.value), e.target.id)
          }
        />
      </div>

      <div>
        <label htmlFor="lightOffset">Lightness L Offset:</label>
        <input
          className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
          type="number"
          id="lightOffset"
          min={0}
          max={1}
          step={0.01}
          value={options.lightOffset}
          onChange={(e) =>
            handleOptionsChange(parseFloat(e.target.value), e.target.id)
          }
        />
      </div>

      <div>
        <label htmlFor="neutralChromaOffset">Neutral C Offset:</label>
        <input
          className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
          type="number"
          id="neutralChromaOffset"
          min={0}
          max={0.4}
          step={0.01}
          value={options.neutralChromaOffset}
          onChange={(e) =>
            handleOptionsChange(parseFloat(e.target.value), e.target.id)
          }
        />
      </div>

      <div>
        <label htmlFor="neutralLightOffSet">Neutral L Offset:</label>
        <input
          className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
          type="number"
          id="neutralLightOffSet"
          min={0}
          max={0.4}
          step={0.01}
          value={options.neutralLightOffSet}
          onChange={(e) =>
            handleOptionsChange(parseFloat(e.target.value), e.target.id)
          }
        />
      </div>

      <div>
        <label htmlFor="analogousStep">Analogous Hue Step:</label>
        <input
          className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
          type="number"
          id="analogousStep"
          min={0}
          max={60}
          step={1}
          value={options.analogousStep}
          onChange={(e) =>
            handleOptionsChange(parseFloat(e.target.value), e.target.id)
          }
        />
      </div>
    </div>
  );
}
