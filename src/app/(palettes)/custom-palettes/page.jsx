"use client";

import chroma from "chroma-js";
import { FaCrosshairs } from "react-icons/fa";
import PalettteProperties from "./_components/PalettteProperties";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";
import CustomPalToolbar from "./_components/CustomPalToolbar";
import { AnimatePresence, color, easeIn, motion } from "framer-motion";
import PageWrapper from "@/components/ui/PageWrapper";
import MyColorPicker from "./_components/MyColorPicker";
import { useColorPaletteContext } from "../ColorContext";
import {
  oklchToCss,
  oklchToHex,
} from "./_components/Pickers/components/colorutil";

export default function CustomPalettes() {
  const {
    toggles,
    editPalette,
    leftPaletteAdjusterOpen,
    myColorPickerOpen,
    palette,
    setOklch,
  } = useColorPaletteContext();

  return (
    <PageWrapper>
      <main className="hidden lg:flex flex-col h-full">
        <section className="flex flex-1">
          <AnimatePresence>
            {leftPaletteAdjusterOpen && editPalette && (
              <motion.aside
                // key="leftPaletteAdjuster1"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ duration: 0.3, ease: easeIn }}
                className="flex gap-6 h-[calc(100vh-122px)] overflow-y-scroll flex-col items-center ml-3 mr-0 pt-5 py-4 px-6 w-60 rounded-md border border-[var(--navBorder)]"
              >
                <PalettteProperties />
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
            className="relative flex-1 ml-3 mr-2 mb-0 border rounded-md border-[var(--navBorder)] flex-col p-2"
          >
            <div role="palette viewer" className="flex h-full">
              {palette.map((colorObj, index) => {
                const { l, c, h, a } = colorObj;
                let textColor;
                const hex = oklchToHex(l, c, h, a);
                const contrast1 = chroma.contrast(hex, "white");
                const contrast2 = chroma.contrast(hex, "black");
                let i;

                if (contrast1 > contrast2) {
                  textColor = "white";
                } else {
                  textColor = "black";
                }

                const cssColor = oklchToCss(l, c, h, a);

                return (
                  <div
                    className={`h-full flex flex-col gap-2 flex-1 justify-center items-center font-semibold ${
                      textColor === "white" ? "text-white " : "text-black "
                    } `}
                    key={index}
                    style={{ backgroundColor: cssColor }}
                  >
                    <span>
                      <FaCrosshairs
                        className="w-[24px] h-[24px] cursor-pointer"
                        strokeWidth={0}
                        onClick={() => setOklch(colorObj)}
                      />
                    </span>
                    {toggles.hexOn && <span>{hex.toUpperCase()}</span>}
                    {toggles.lightOn && <span>L: {l.toFixed(2)}</span>}
                    {toggles.chromaOn && <span>C: {c.toFixed(2)}</span>}
                    {toggles.hueOn && <span>H: {h.toFixed(2)}</span>}
                    {toggles.alphaOn && <span>A: {a.toFixed(2)}</span>}
                    {toggles.whiteContrastOn && (
                      <span>WC: {contrast1.toFixed(2)}</span>
                    )}
                    {toggles.blackContrastOn && (
                      <span>BC: {contrast2.toFixed(2)}</span>
                    )}
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
