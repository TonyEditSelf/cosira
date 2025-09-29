import { useColorPaletteContext } from "../../ColorContext";

export default function SplitCompOptions() {
  const { splitCompOptions, handleSplitCompAngleChange } =
    useColorPaletteContext();
  return (
    <div>
      <h1 className="text-[15px] font-bold mb-3">SPLIT-COMP OPTIONS</h1>
      <div className="flex flex-col gap-4 text-sm font-semibold ">
        <div className="flex flex-col w-fit">
          <label htmlFor="splitCompAngle1">SplitComp1 Angle:</label>
          <input
            className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
            type="number"
            id="splitCompAngle1"
            min={-50}
            max={-5}
            step={1}
            value={splitCompOptions.splitCompAngle1}
            onChange={(e) =>
              handleSplitCompAngleChange(
                parseFloat(e.target.value),
                e.target.id
              )
            }
          />
        </div>

        <div className="flex flex-col w-fit">
          <label htmlFor="splitCompAngle2">SplitComp2 Angle:</label>
          <input
            className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
            type="number"
            id="splitCompAngle2"
            min={5}
            max={50}
            step={1}
            value={splitCompOptions.splitCompAngle2}
            onChange={(e) =>
              handleSplitCompAngleChange(
                parseFloat(e.target.value),
                e.target.id
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
