import seasonalPalGen from "../ColorPaletteUtils/seasonalPalGen";
import { useColorPaletteContext } from "../../ColorContext";

export default function SeasonalOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    seasonalPalType,
    setSeasonalPalType,
  } = useColorPaletteContext();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="seasonalCombined"
            value={"seasonalCombined"}
            checked={seasonalPalType === "seasonalCombined"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="seasonalCombined">Combined Seasonal</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="autumnSmooth"
            value={"autumnSmooth"}
            checked={seasonalPalType === "autumnSmooth"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="autumnSmooth">Autumn Smooth</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="autumnTrue"
            value={"autumnTrue"}
            checked={seasonalPalType === "autumnTrue"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="autumnTrue">Autumn True</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="autumnDeepDarkMuted"
            value={"autumnDeepDarkMuted"}
            checked={seasonalPalType === "autumnDeepDarkMuted"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="autumnDeepDarkMuted">Autumn DarkMuted</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="autumnDeepDarkRich"
            value={"autumnDeepDarkRich"}
            checked={seasonalPalType === "autumnDeepDarkRich"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="autumnDeepDarkRich">Autumn DarkRich</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="autumnSoftGentleMuted"
            value={"autumnSoftGentleMuted"}
            checked={seasonalPalType === "autumnSoftGentleMuted"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="autumnSoftGentleMuted">Autumn GentleMuted</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="autumnSoftDustyNeutral"
            value={"autumnSoftDustyNeutral"}
            checked={seasonalPalType === "autumnSoftDustyNeutral"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="autumnSoftDustyNeutral">Autumn DustyNeutral</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="autumnSoftEarthySmoky"
            value={"autumnSoftEarthySmoky"}
            checked={seasonalPalType === "autumnSoftEarthySmoky"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="autumnSoftEarthySmoky">Autumn EarthySmoky</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="autumnTrueWarmBalanced"
            value={"autumnTrueWarmBalanced"}
            checked={seasonalPalType === "autumnTrueWarmBalanced"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="autumnTrueWarmBalanced">Autumn WarmBalanced</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="autumnTrueWarmBright"
            value={"autumnTrueWarmBright"}
            checked={seasonalPalType === "autumnTrueWarmBright"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="autumnTrueWarmBright">Autumn WarmBright</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="autumnTrueRusticEarthy"
            value={"autumnTrueRusticEarthy"}
            checked={seasonalPalType === "autumnTrueRusticEarthy"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="autumnTrueRusticEarthy">Autumn RusticEarthy</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="summerSmooth"
            value={"summerSmooth"}
            checked={seasonalPalType === "summerSmooth"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="summerSmooth">Summer Smooth</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="summerSoftDustyMuted"
            value={"summerSoftDustyMuted"}
            checked={seasonalPalType === "summerSoftDustyMuted"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="summerSoftDustyMuted">Summer DustyMuted</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="summerSoftSmokyNeutral"
            value={"summerSoftSmokyNeutral"}
            checked={seasonalPalType === "summerSoftSmokyNeutral"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="summerSoftSmokyNeutral">Summer SmokyNeutral</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="summerSoftCoolEarthySmoky"
            value={"summerSoftCoolEarthySmoky"}
            checked={seasonalPalType === "summerSoftCoolEarthySmoky"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="summerSoftCoolEarthySmoky">Summer EarthySmoky</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="summerTrueCoolBalanced"
            value={"summerTrueCoolBalanced"}
            checked={seasonalPalType === "summerTrueCoolBalanced"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="summerTrueCoolBalanced">Summer CoolBalanced</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="summerTrueCoolBright"
            value={"summerTrueCoolBright"}
            checked={seasonalPalType === "summerTrueCoolBright"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="summerTrueCoolBright">Summer CoolBright</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="summerTrueCoolRosy"
            value={"summerTrueCoolRosy"}
            checked={seasonalPalType === "summerTrueCoolRosy"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="summerTrueCoolRosy">Summer CoolRosy</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="summerTrueDeepRainforest"
            value={"summerTrueDeepRainforest"}
            checked={seasonalPalType === "summerTrueDeepRainforest"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="summerTrueDeepRainforest">
            Summer DeepRainforest
          </label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="winterSmooth"
            value={"winterSmooth"}
            checked={seasonalPalType === "winterSmooth"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="winterSmooth">Winter Smooth</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="winterIcyCrystal"
            value={"winterIcyCrystal"}
            checked={seasonalPalType === "winterIcyCrystal"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="winterIcyCrystal">Winter IcyCrystal</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="winterStarkMonochrome"
            value={"winterStarkMonochrome"}
            checked={seasonalPalType === "winterStarkMonochrome"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="winterStarkMonochrome">Winter StarkMonochrome</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="winterFrostedBerry"
            value={"winterFrostedBerry"}
            checked={seasonalPalType === "winterFrostedBerry"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="winterFrostedBerry">Winter FrostedBerry</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="winterVividCandy"
            value={"winterVividCandy"}
            checked={seasonalPalType === "winterVividCandy"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="winterVividCandy">Winter VividCandy</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="winterCrispTechnicolor"
            value={"winterCrispTechnicolor"}
            checked={seasonalPalType === "winterCrispTechnicolor"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="winterCrispTechnicolor">
            Winter CrispTechnicolor
          </label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="winterSnowlightPastels"
            value={"winterSnowlightPastels"}
            checked={seasonalPalType === "winterSnowlightPastels"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="winterSnowlightPastels">
            Winter SnowlightPastels
          </label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="winterNightJewel"
            value={"winterNightJewel"}
            checked={seasonalPalType === "winterNightJewel"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="winterNightJewel">Winter NightJewel</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="winterUrbanNoir"
            value={"winterUrbanNoir"}
            checked={seasonalPalType === "winterUrbanNoir"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="winterUrbanNoir">Winter UrbanNoir</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="springSmooth"
            value={"springSmooth"}
            checked={seasonalPalType === "springSmooth"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="springSmooth">Spring Smooth</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="springWarmGentle"
            value={"springWarmGentle"}
            checked={seasonalPalType === "springWarmGentle"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="springWarmGentle">Spring WarmGentle</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="springWarmMuted"
            value={"springWarmMuted"}
            checked={seasonalPalType === "springWarmMuted"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="springWarmMuted">Spring WarmMuted</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="springWarmEarthy"
            value={"springWarmEarthy"}
            checked={seasonalPalType === "springWarmEarthy"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="springWarmEarthy">Spring WarmEarthy</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="springWarmFresh"
            value={"springWarmFresh"}
            checked={seasonalPalType === "springWarmFresh"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="springWarmFresh">Spring WarmFresh</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="springMutedEarthy"
            value={"springMutedEarthy"}
            checked={seasonalPalType === "springMutedEarthy"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="springMutedEarthy">Spring MutedEarthy</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="springWarmBright"
            value={"springWarmBright"}
            checked={seasonalPalType === "springWarmBright"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="springWarmBright">Spring WarmBright</label>
        </div>

        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="springWarmRich"
            value={"springWarmRich"}
            checked={seasonalPalType === "springWarmRich"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="springWarmRich">Spring WarmRich</label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="springWarmRadiant"
            value={"springWarmRadiant"}
            checked={seasonalPalType === "springWarmRadiant"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="springWarmRadiant">Spring WarmRadiant</label>
        </div>
      </div>
    </div>
  );
}
