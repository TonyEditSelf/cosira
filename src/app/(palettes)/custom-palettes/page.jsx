"use client";

import ColorSliderComp from "./_components/Pickers/PickerComps/HSLColorSliderComp";
import CustomPalToolbar from "./_components/CustomPalToolbar";
import { AnimatePresence, easeIn, motion } from "framer-motion";
import PageWrapper from "@/components/ui/PageWrapper";
import MyColorPicker from "./_components/MyColorPicker";
import { useColorPaletteContext } from "../ColorContext";
import { useEffect } from "react";

// import paletteDecider from "./ColorPaletteUtils/paletteDecider";

export default function CustomPalettes() {
  const {
    leftPaletteAdjusterOpen,
    myColorPickerOpen,
    palette,
    paletteObject,
    setPaletteObject,
  } = useColorPaletteContext();

  useEffect(() => {
    const newObj = {};

    palette.colorObjectsArray.map(({ l, c, h, a }, i) => {
      if (!a) {
        a = 1;
      }
      return (newObj[i] = { L: l, C: c, H: h, A: a });
    });

    setPaletteObject(newObj);
  }, [palette]);

  console.log(paletteObject);

  return (
    <PageWrapper>
      <main className="hidden lg:flex flex-col h-full">
        <section className="flex flex-1">
          <AnimatePresence>
            {leftPaletteAdjusterOpen && (
              <motion.aside
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ duration: 0.3, ease: easeIn }}
                className="flex flex-col items-center mb-2 ml-2 mr-0 pt-5 px-6 w-52 rounded-md border border-[var(--navBorder)]"
              >
                <div className="flex flex-col gap-4 w-full">
                  <ColorSliderComp
                    channel="hue"
                    label="H"
                    checkerboard={false}
                    className="w-full"
                  />

                  <ColorSliderComp
                    channel="saturation"
                    label="S"
                    checkerboard={false}
                    className="w-full"
                  />

                  <ColorSliderComp
                    channel="lightness"
                    label="L"
                    checkerboard={false}
                    className="w-full"
                  />

                  <ColorSliderComp
                    channel="alpha"
                    label="A"
                    checkerboard={true}
                    className="w-full"
                  />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
          <motion.section
            initial={{ width: "100%" }}
            animate={{
              width: leftPaletteAdjusterOpen ? "calc(100% - 20rem)" : "100%",
            }}
            exit={{ width: "100%" }}
            transition={{ duration: 0.9, ease: "easeIn" }}
            className="relative flex-1 ml-2 mr-2 mb-2 border rounded-md border-[var(--navBorder)] flex-col p-2"
          >
            <div role="palette viewer" className="flex h-full">
              {palette.colorStringsArray.map((color, item) => {
                return (
                  <div
                    key={item}
                    className="h-full w-32 flex flex-col justify-center items-center flex-1"
                    style={{ backgroundColor: color }}
                  >
                    {color}

                    {Object.entries(paletteObject).map(([key, palObj]) => (
                      <div key={key}>
                        <ColorSliderComp
                          channel="hue"
                          label="H"
                          checkerboard={false}
                          className="w-full border-2 border-y-amber-700"
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* MY COLORPICKER COMP  */}
            <AnimatePresence>
              {myColorPickerOpen && <MyColorPicker />}
            </AnimatePresence>
          </motion.section>
        </section>
        <CustomPalToolbar />
      </main>
    </PageWrapper>
  );
}
