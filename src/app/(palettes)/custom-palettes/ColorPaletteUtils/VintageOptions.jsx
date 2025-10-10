export default function VintageOptions() {
  return (
    <div>
      <div className="flex gap-4">
        <input type="radio" name="palType" id="vintageComp" />
        <label htmlFor="vintageComp">Vintage Complementary</label>
      </div>
      <div className="flex gap-4">
        <input type="radio" name="palType" id="vintageSplitComp" />
        <label htmlFor="vintageSplitComp">Vintage Split-Comp</label>
      </div>
      <div className="flex gap-4">
        <input type="radio" name="palType" id="vintageMono" />
        <label htmlFor="vintageMono">Vintage Monochromatic</label>
      </div>
      <div className="flex gap-4 ">
        <input type="radio" name="palType" id="vintageAnalog" />
        <label htmlFor="vintageAnalog">Vintage Analogous</label>
      </div>
      <div className="flex gap-4">
        <input type="radio" name="palType" id="vintageTriad" />
        <label htmlFor="vintageTriad">Vintage Triadic</label>
      </div>
      <div className="flex gap-4">
        <input type="radio" name="palType" id="vintageTetra" />
        <label htmlFor="vintageTetra">Vintage Tetradic</label>
      </div>
    </div>
  );
}
