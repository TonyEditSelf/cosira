"use client";

import ColorSliderComp from "./_components/Pickers/PickerComps/HslaColorSliderComp";
import CustomPalToolbar from "./_components/CustomPalToolbar";
import { AnimatePresence, easeIn, motion } from "framer-motion";
import PageWrapper from "@/components/ui/PageWrapper";
import MyColorPicker from "./_components/MyColorPicker";
import { useColorPaletteContext } from "../ColorContext";
import { formatCss, formatHex8 } from "culori";
import NumberFieldcComp from "./_components/NumberFieldcComp";
import { useEffect } from "react";

export default function CustomPalettes() {
  const {
    leftPaletteAdjusterOpen,
    myColorPickerOpen,
    palette,
    setPalette,
    updateOklchPalette,
  } = useColorPaletteContext();

  useEffect(() => {
    palette?.map((color, i) => {
      console.log(color);
    });
  });

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
              {palette?.map((color, i) => {
                const CssColor = formatCss(color);
                const hexColorString = formatHex8(color);
                const { l, c, h, alpha = 1 } = color;
                // console.log(l, c, h, a);

                return (
                  <div
                    className="h-full flex flex-col justify-center items-center flex-1 w-32"
                    key={i}
                    style={{ backgroundColor: CssColor }}
                  >
                    <NumberFieldcComp
                      label="L"
                      value={l}
                      min={0}
                      max={1}
                      onChange={(val) => updateOklchPalette(i, "l", val)}
                      step={0.1}
                    />
                    <NumberFieldcComp
                      label="C"
                      value={c}
                      min={0}
                      max={1}
                      onChange={(val) => updateOklchPalette(i, "c", val)}
                      step={0.1}
                    />
                    <NumberFieldcComp
                      label="H"
                      value={h}
                      min={0}
                      max={360}
                      onChange={(val) => updateOklchPalette(i, "h", val)}
                      step={1}
                    />
                    <NumberFieldcComp
                      label="A"
                      value={alpha}
                      min={0}
                      max={1}
                      onChange={(val) => updateOklchPalette(i, "alpha", val)}
                      step={0.1}
                    />
                    <span>{hexColorString}</span>
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
