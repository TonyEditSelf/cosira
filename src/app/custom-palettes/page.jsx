import { MySlider } from "./_components/MySlider";
import CustomPalToolbar1 from "./_components/CustomPalToolbar1";
import CustomPalToolbar2 from "./_components/CustomPalToolbar2";

export default function CustomPalettes() {
  return (
    <main className="hidden lg:flex h-full">
      <aside className="flex flex-col items-center mt-1 ml-2 mr-2 mb-1 pt-5 px-10 w-80 rounded-md border border-[var(--navBorder)]">
        <div className="flex flex-col gap-4">
          <MySlider
            label="Hue"
            defaultValue={180}
            minValue={0}
            maxValue={360}
            step={1}
          />
          <MySlider
            label="Lightness"
            defaultValue={0.5}
            minValue={0}
            maxValue={1}
            step={0.1}
          />
          <MySlider
            label="Chroma"
            defaultValue={0.5}
            minValue={0}
            maxValue={1}
            step={0.1}
          />
          <MySlider
            label="Alpha"
            defaultValue={0.5}
            minValue={0}
            maxValue={1}
            step={0.1}
          />
        </div>
      </aside>
      <section className="w-full flex mt-1 ml-0 mr-2 mb-1 border rounded-md border-[var(--navBorder)] flex-col p-2">
        <CustomPalToolbar2 />
        <div role="palette viewer" className="flex-1 mt-2 mb-2"></div>
        <CustomPalToolbar1 />
      </section>
    </main>
  );
}
