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

  const options = [
    { id: "seasonalCombined", label: "Combined Seasonal" },

    // AUTUMN
    { id: "autumnSmooth", label: "Autumn Smooth" },
    { id: "autumnTrue", label: "Autumn True" },
    { id: "autumnDeepDarkMuted", label: "Autumn DarkMuted" },
    { id: "autumnDeepDarkRich", label: "Autumn DarkRich" },
    { id: "autumnSoftGentleMuted", label: "Autumn GentleMuted" },
    { id: "autumnSoftDustyNeutral", label: "Autumn DustyNeutral" },
    { id: "autumnSoftEarthySmoky", label: "Autumn EarthySmoky" },
    { id: "autumnTrueWarmBalanced", label: "Autumn WarmBalanced" },
    { id: "autumnTrueWarmBright", label: "Autumn WarmBright" },
    { id: "autumnTrueRusticEarthy", label: "Autumn RusticEarthy" },

    // SUMMER
    { id: "summerSmooth", label: "Summer Smooth" },
    { id: "summerSoftDustyMuted", label: "Summer DustyMuted" },
    { id: "summerSoftSmokyNeutral", label: "Summer SmokyNeutral" },
    { id: "summerSoftCoolEarthySmoky", label: "Summer EarthySmoky" },
    { id: "summerTrueCoolBalanced", label: "Summer CoolBalanced" },
    { id: "summerTrueCoolBright", label: "Summer CoolBright" },
    { id: "summerTrueCoolRosy", label: "Summer CoolRosy" },
    { id: "summerTrueDeepRainforest", label: "Summer DeepRainforest" },

    // WINTER
    { id: "winterSmooth", label: "Winter Smooth" },
    { id: "winterIcyCrystal", label: "Winter IcyCrystal" },
    { id: "winterStarkMonochrome", label: "Winter StarkMonochrome" },
    { id: "winterFrostedBerry", label: "Winter FrostedBerry" },
    { id: "winterVividCandy", label: "Winter VividCandy" },
    { id: "winterCrispTechnicolor", label: "Winter CrispTechnicolor" },
    { id: "winterSnowlightPastels", label: "Winter SnowlightPastels" },
    { id: "winterNightJewel", label: "Winter NightJewel" },
    { id: "winterUrbanNoir", label: "Winter UrbanNoir" },

    // SPRING
    { id: "springSmooth", label: "Spring Smooth" },
    { id: "springWarmGentle", label: "Spring WarmGentle" },
    { id: "springWarmMuted", label: "Spring WarmMuted" },
    { id: "springWarmEarthy", label: "Spring WarmEarthy" },
    { id: "springWarmFresh", label: "Spring WarmFresh" },
    { id: "springMutedEarthy", label: "Spring MutedEarthy" },
    { id: "springWarmBright", label: "Spring WarmBright" },
    { id: "springWarmRich", label: "Spring WarmRich" },
    { id: "springWarmRadiant", label: "Spring WarmRadiant" },
  ];

  const handleChange = (value) => {
    setSeasonalPalType(value);
    const pal = seasonalPalGen(oklch, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-0">
        {options.map(({ id, label }) => (
          <div key={id} className="flex gap-4">
            <input
              type="radio"
              name="seasonalPal"
              id={id}
              value={id}
              checked={seasonalPalType === id}
              onChange={() => handleChange(id)}
            />
            <label htmlFor={id}>{label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
