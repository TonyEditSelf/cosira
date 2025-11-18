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
  } = useColorPaletteContext();
  let angle1 = analogOptions.analogousAngle1;
  let angle2 = analogOptions.analogousAngle2;

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
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
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
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
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
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="classicRightAnalog">Right-Leaning Classic</label>
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
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
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
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
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
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
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
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
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
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
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
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="neutralRightAnalog">Right-Leaning Neutral</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="kidsBrightCentered"
            value={"kidsBrightCentered"}
            checked={analogPalType === "kidsBrightCentered"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="kidsBrightCentered">Centered Kids Bright</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="kidsBrightLeft"
            value={"kidsBrightLeft"}
            checked={analogPalType === "kidsBrightLeft"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="kidsBrightLeft">Left-Leaning Kids Bright</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="kidsBrightRight"
            value={"kidsBrightRight"}
            checked={analogPalType === "kidsBrightRight"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="kidsBrightRight">Right-Leaning Kids Bright</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="toyLikeCentered"
            value={"toyLikeCentered"}
            checked={analogPalType === "toyLikeCentered"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="toyLikeCentered">Toy-Like Centered</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="toyLikeLeft"
            value={"toyLikeLeft"}
            checked={analogPalType === "toyLikeLeft"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="toyLikeLeft">Toy-Like Left</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="toyLikeRight"
            value={"toyLikeRight"}
            checked={analogPalType === "toyLikeRight"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="toyLikeRight">Toy-Like Right</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="pastelKidCentered"
            value={"pastelKidCentered"}
            checked={analogPalType === "pastelKidCentered"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="pastelKidCentered">Pastel-Kid Centered</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="pastelKidLeft"
            value={"pastelKidLeft"}
            checked={analogPalType === "pastelKidLeft"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="pastelKidLeft">Pastel-Kid Left</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="pastelKidRight"
            value={"pastelKidRight"}
            checked={analogPalType === "pastelKidRight"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="pastelKidRight">Pastel-Kid Right</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="neoKidCentered"
            value={"neoKidCentered"}
            checked={analogPalType === "neoKidCentered"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="neoKidCentered">Neo-Kid Centered</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="neoKidLeft"
            value={"neoKidLeft"}
            checked={analogPalType === "neoKidLeft"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="neoKidLeft">Neo-Kid Left</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="analogPal"
            id="neoKidRight"
            value={"neoKidRight"}
            checked={analogPalType === "neoKidRight"}
            onChange={(e) => {
              setAnalogPalType(e.target.value);
              const pal = analogousPalGen(oklch, analogOptions, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="neoKidRight">Neo-Kid Right</label>
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
                const pal = analogousPalGen(oklch, analogOptions);
                setPalette(pal);
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
                const pal = analogousPalGen(oklch, analogOptions);
                setPalette(pal);
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
