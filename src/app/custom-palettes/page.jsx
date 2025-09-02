import { MySlider } from "./_components/MySlider";
import Cp_toolbar1 from "./_components/Cp_toolbar1";

export default function CustomPalettes() {
  return (
    <main className="flex h-full">
      <aside className="flex flex-col items-center p-4 w-80 ">
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
      <section className="w-full flex flex-col p-4">
        <div role="palette viewer" className="flex-1">
          hello
        </div>
        <div role="toolbar" className="h-28">
          <Cp_toolbar1 />
          <div>toolbar2</div>
        </div>
      </section>
    </main>
  );
}
