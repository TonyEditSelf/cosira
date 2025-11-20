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
          <label htmlFor="autumnSmooth">Smooth Autumn</label>
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
          <label htmlFor="autumnTrue">True Autumn</label>
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
          <label htmlFor="autumnDeepDarkMuted">DeepAutumn DarkMuted</label>
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
          <label htmlFor="autumnDeepDarkRich">DeepAutumn DarkRich</label>
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
          <label htmlFor="autumnSoftGentleMuted">SoftAutumn GentleMuted</label>
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
          <label htmlFor="autumnSoftDustyNeutral">
            SoftAutumn DustyNeutral
          </label>
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
          <label htmlFor="autumnSoftEarthySmoky">SoftAutumn EarthySmoky</label>
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
          <label htmlFor="autumnTrueWarmBalanced">
            TrueAutumn WarmBalanced
          </label>
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
          <label htmlFor="autumnTrueWarmBright">TrueAutumn WarmBright</label>
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
          <label htmlFor="autumnTrueRusticEarthy">
            TrueAutumn RusticEarthy
          </label>
        </div>
        <div className="flex gap-4">
          <input
            type="radio"
            name="seasonalPal"
            id="autumnTrueVibrantSpicy"
            value={"autumnTrueVibrantSpicy"}
            checked={seasonalPalType === "autumnTrueVibrantSpicy"}
            onChange={(e) => {
              setSeasonalPalType(e.target.value);
              const pal = seasonalPalGen(oklch, e.target.value);
              setPalette(pal);
              setDuplicatePalette(pal);
            }}
          />
          <label htmlFor="autumnTrueVibrantSpicy">
            TrueAutumn VibrantSpicy
          </label>
        </div>
      </div>
    </div>
  );
}
