import { useColorPaletteContext } from "../../ColorContext";

export default function TetradicOptions() {
  const { tetradicAngle, handleTetradicAngleChange } = useColorPaletteContext();
  return (
    <div>
      <h1 className="text-[15px] font-bold mb-3">TETRADIC OPTIONS</h1>
      <div className="flex flex-col gap-4 text-sm font-semibold ">
        <div className="flex flex-col w-fit">
          <label htmlFor="tetradicAngle">Tetradic Angle:</label>
          <input
            className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
            type="number"
            id="tetradicAngle"
            min={60}
            max={120}
            step={1}
            value={tetradicAngle}
            onChange={(e) =>
              handleTetradicAngleChange(parseFloat(e.target.value))
            }
          />
        </div>
      </div>
    </div>
  );
}
