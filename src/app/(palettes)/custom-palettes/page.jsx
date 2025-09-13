"use client";

import { MySlider } from "./_components/MySlider";
import CustomPalToolbar from "./_components/CustomPalToolbar";
import { AnimatePresence, easeIn, motion } from "framer-motion";
import PageWrapper from "@/components/ui/PageWrapper";
import MyColorPicker from "./_components/MyColorPicker";
import { useColorPaletteContext } from "../ColorContext";
// import paletteDecider from "./ColorPaletteUtils/paletteDecider";

export default function CustomPalettes() {
  const {
    leftPaletteAdjusterOpen,
    myColorPickerOpen,
    ariaColor,
    hexColor,
    palette,
  } = useColorPaletteContext();

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
                className="flex flex-col items-center mb-2 ml-2 mr-0 pt-5 px-10 w-80 rounded-md border border-[var(--navBorder)]"
              >
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
              </motion.aside>
            )}
          </AnimatePresence>
          <motion.section
            initial={{ width: "100%" }}
            animate={{
              width: leftPaletteAdjusterOpen ? "calc(100% - 20rem)" : "100%",
            }}
            exit={{ width: "100%" }}
            transition={{ duration: 0.3, ease: "easeIn" }}
            className="relative flex-1 ml-2 mr-2 mb-2 border rounded-md border-[var(--navBorder)] flex-col p-2"
          >
            <div role="palette viewer" className="flex-1">
              {/* {palette.map((color, item) => (
                <div
                  key={item}
                  style={{
                    backgroundColor: color,
                    width: "100px",
                    height: "100px",
                    border: "2px solid white",
                  }}
                ></div>
              ))} */}
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
