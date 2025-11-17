import { useColorPaletteContext } from "../../ColorContext";
import doubleSplitCompPalGen from "./doubleSplitCompPalGen";

export default function DoubleSplitCompOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    doubleSplitCompPalType,
    setDoubleSplitCompPalType,
  } = useColorPaletteContext();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="doubleSplitCompPalType"
            id="leftDoubleSplitComp"
            value={"leftDoubleSplitComp"}
            checked={doubleSplitCompPalType === "leftDoubleSplitComp"}
            onChange={(e) => {
              setDoubleSplitCompPalType(e.target.value);
              const pal = doubleSplitCompPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="leftDoubleSplitComp">Left Double Split Comp</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="doubleSplitCompPalType"
            id="rightDoubleSplitComp"
            value={"rightDoubleSplitComp"}
            checked={doubleSplitCompPalType === "rightDoubleSplitComp"}
            onChange={(e) => {
              setDoubleSplitCompPalType(e.target.value);
              const pal = doubleSplitCompPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="rightDoubleSplitComp">Right Double Split Comp</label>
        </div>
      </div>
    </div>
  );
}
