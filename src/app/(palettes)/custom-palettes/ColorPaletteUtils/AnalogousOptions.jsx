import { useColorPaletteContext } from "../../ColorContext";
import analogousPalGen from "./analogousPalGen";

export default function AnalogousOptions() {
  const {
    setPalette,
    oklch,
    analogPalType,
    setAnalogPalType,
    analogOptions,
    handleAnalogOptionsChange,
  } = useColorPaletteContext();
  let angle1 = analogOptions.analogousAngle1;
  let angle2 = analogOptions.analogousAngle2;
  console.log(angle1);
  console.log(angle2);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="classicCenteredAnalog"
            value={"classicCenteredAnalog"}
            checked={analogPalType === "classicCenteredAnalog"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, e.target.value);
              setPalette(pal);
            }}
          />
          <label htmlFor="classicCenteredAnalog">Classic Centered Analog</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="classicLeftAnalog"
            value={"classicLeftAnalog"}
            checked={analogPalType === "classicLeftAnalog"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, e.target.value);
              setPalette(pal);
            }}
          />
          <label htmlFor="classicLeftAnalog">Left-Leaning Classic</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="classicRightAnalog"
            value={"classicRightAnalog"}
            checked={analogPalType === "classicRightAnalog"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, e.target.value);
              setPalette(pal);
            }}
          />
          <label htmlFor="classicRightAnalog">Right-Leaning Classic</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="vibrantCenteredAnalog"
            value={"vibrantCenteredAnalog"}
            checked={analogPalType === "vibrantCenteredAnalog"}
            onChange={(e) => {
              setCompPalType(e.target.value);
            }}
          />
          <label htmlFor="vibrantCenteredAnalog">Vibrant Centered Analog</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="vibrantLeftAnalog"
            value={"vibrantLeftAnalog"}
            checked={analogPalType === "vibrantLeftAnalog"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
            }}
          />
          <label htmlFor="vibrantLeftAnalog">Vibrant Left Analog</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="vibrantRightAnalog"
            value={"vibrantRightAnalog"}
            checked={analogPalType === "vibrantRightAnalog"}
            onChange={(e) => {
              setCompPalType(e.target.value);
            }}
          />
          <label htmlFor="vibrantRightAnalog">Vibrant Right Analog</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="vintageCenteredAnalog"
            value={"vintageCenteredAnalog"}
            checked={analogPalType === "vintageCenteredAnalog"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, e.target.value);
              setPalette(pal);
            }}
          />
          <label htmlFor="vintageCenteredAnalog">Vintage Centered Analog</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="vintageLeftAnalog"
            value={"vintageLeftAnalog"}
            checked={analogPalType === "vintageLeftAnalog"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, e.target.value);
              setPalette(pal);
            }}
          />
          <label htmlFor="vintageLeftAnalog">Left-Leaning Vintage</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="vintageRightAnalog"
            value={"vintageRightAnalog"}
            checked={analogPalType === "vintageRightAnalog"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, e.target.value);
              setPalette(pal);
            }}
          />
          <label htmlFor="vintageRightAnalog">Right-Leaning Vintage</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="neutralCenteredAnalog"
            value={"neutralCenteredAnalog"}
            checked={analogPalType === "neutralCenteredAnalog"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, e.target.value);
              setPalette(pal);
            }}
          />
          <label htmlFor="neutralCenteredAnalog">Neutral Centered Analog</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="neutralLeftAnalog"
            value={"neutralLeftAnalog"}
            checked={analogPalType === "neutralLeftAnalog"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, e.target.value);
              setPalette(pal);
            }}
          />
          <label htmlFor="neutralLeftAnalog">Left-Leaning Neutral</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="neutralRightAnalog"
            value={"neutralRightAnalog"}
            checked={analogPalType === "neutralRightAnalog"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, e.target.value);
              setPalette(pal);
            }}
          />
          <label htmlFor="neutralRightAnalog">Right-Leaning Neutral</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="kidsCenteredAnalog"
            value={"kidsCenteredAnalog"}
            checked={analogPalType === "kidsCenteredAnalog"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, e.target.value);
              setPalette(pal);
            }}
          />
          <label htmlFor="kidsCenteredAnalog">Kids Centered Analog</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="kidsLeftAnalog"
            value={"kidsLeftAnalog"}
            checked={analogPalType === "kidsLeftAnalog"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, e.target.value);
              setPalette(pal);
            }}
          />
          <label htmlFor="kidsLeftAnalog">Left Kids-Friendly</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="kidsRightAnalog"
            value={"kidsRightAnalog"}
            checked={analogPalType === "kidsRightAnalog"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, e.target.value);
              setPalette(pal);
            }}
          />
          <label htmlFor="kidsRightAnalog">Kids Right Analog</label>
        </div>
        {/* <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="pastelComp"
          value={"pastelComp"}
          checked={compPalType === "pastelComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="pastelComp">Pastel Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="retroComp"
          value={"retroComp"}
          checked={compPalType === "retroComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="retroComp">Retro Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="moodyComp"
          value={"moodyComp"}
          checked={compPalType === "moodyComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="moodyComp">Moody Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="neonComp"
          value={"neonComp"}
          checked={compPalType === "neonComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="neonComp">Neon Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="earthyComp"
          value={"earthyComp"}
          checked={compPalType === "earthyComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="earthyComp">Earthy/Muted Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="luxuriousComp"
          value={"luxuriousComp"}
          checked={compPalType === "luxuriousComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="luxuriousComp">Luxurious Comp</label>
      </div>  
      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="seasonalComp"
          value={"seasonalComp"}
          checked={compPalType === "seasonalComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="seasonalComp">Seasonal Comp</label>
      </div>
      
      */}
      </div>
      <div>
        <h1 className="text-[12px] font-bold mb-3">ANALOGUE OPTIONS</h1>
        <div className="flex flex-col gap-4 text-[11px] font-semibold ">
          <div className="flex flex-col w-fit">
            <label htmlFor="analogousStep2">Analog1 1 Angle:</label>
            <input
              className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
              type="number"
              id="analogousAngle1"
              min={-90}
              max={0}
              step={1}
              value={analogOptions.analogousAngle1}
              onChange={(e) => {
                angle1 = parseFloat(e.target.value);
                handleAnalogOptionsChange(
                  parseFloat(e.target.value),
                  e.target.id
                );
              }}
            />
          </div>

          <div className="flex flex-col w-fit">
            <label htmlFor="analogousStep2">Analog2 Angle:</label>
            <input
              className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
              type="number"
              id="analogousAngle2"
              min={0}
              max={90}
              step={1}
              value={analogOptions.analogousAngle2}
              onChange={(e) => {
                angle2 = parseFloat(e.target.value);
                handleAnalogOptionsChange(
                  parseFloat(e.target.value),
                  e.target.id
                );
              }}
            />
          </div>
          <div>
            <label htmlFor="totalAngle">Total Angle</label>
            <input
              className="border border-[var(--navBorder)] rounded-md px-2 py-1 mt-1"
              type="number"
              name=""
              id="totalAngle"
              readOnly
              value={Math.abs(angle1) + Math.abs(angle2)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
