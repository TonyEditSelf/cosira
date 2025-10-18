import { useColorPaletteContext } from "../../ColorContext";

export default function ComplementaryOptions() {
  const { compPalType, setCompPalType } = useColorPaletteContext();
  return (
    <div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="classicComp"
          value={"classicComp"}
          checked={compPalType === "classicComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="classicComp">Classic Complementary</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="vibrantComp"
          value={"vibrantComp"}
          checked={compPalType === "vibrantComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="vibrantComp">Vibrant Complementary</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="kidsComp"
          value={"kidsComp"}
          checked={compPalType === "kidsComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="kidsComp">Kids Complementary</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="neutralComp"
          value={"neutralComp"}
          checked={compPalType === "neutralComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="neutralComp">Neutral Complementary</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="vintageComp"
          value={"vintageComp"}
          checked={compPalType === "vintageComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="vintageComp">Vintage Complementary</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="pastelComp"
          value={"pastelComp"}
          checked={compPalType === "pastelComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="pastelComp">Pastel Complementary</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="retroComp"
          value={"retroComp"}
          checked={compPalType === "retroComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="retroComp">Retro Complementary</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="moodyComp"
          value={"moodyComp"}
          checked={compPalType === "moodyComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="moodyComp">Moody Complementary</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="neonComp"
          value={"neonComp"}
          checked={compPalType === "neonComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="neonComp">Neon Complementary</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="earthyComp"
          value={"earthyComp"}
          checked={compPalType === "earthyComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="earthyComp">Earthy/Muted Complementary</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="luxuriousComp"
          value={"luxuriousComp"}
          checked={compPalType === "luxuriousComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="luxuriousComp">Luxurious Complementary</label>
      </div>
    </div>
  );
}
