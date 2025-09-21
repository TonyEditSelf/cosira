"use client";

import chroma from "chroma-js";
import { FaCrosshairs } from "react-icons/fa";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";
import AnalogousOptionsComp from "./ColorPaletteUtils/AnalogousOptionsComp";
import CustomPalToolbar from "./_components/CustomPalToolbar";
import { AnimatePresence, color, easeIn, motion } from "framer-motion";
import PageWrapper from "@/components/ui/PageWrapper";
import MyColorPicker from "./_components/MyColorPicker";
import HueSlider from "./_components/Pickers/components/HueSlider";
import ChromaSlider from "./_components/Pickers/components/ChromaSlider";
import LightnessSlider from "./_components/Pickers/components/LightnessSlider";
import AlphaSlider from "./_components/Pickers/components/AlphaSlider";
import TemperatureSlider from "./_components/Pickers/components/TemperatureSlider";
import { useColorPaletteContext } from "../ColorContext";
import {
  oklchToCss,
  oklchToHex,
} from "./_components/Pickers/components/colorutil";

export default function CustomPalettes() {
  const {
    cellObjectIndex,
    SetCellObjectIndex,
    editCell,
    setEditCell,
    editPalette,
    setEditPalette,
    cellObjecttoEdit,
    setCellObjecttoEdit,
    leftPaletteAdjusterOpen,
    setLeftPaletteAdjusterOpen,
    myColorPickerOpen,
    palette,
    setPalette,
    updateOklchPalette,
    oklch,
    setOklch,
    handleColorChange,
    handleOptionsChange,
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
                className="flex gap-4 h-[calc(100vh-122px)] overflow-y-scroll flex-col items-center ml-3 mr-0 pt-5 py-4 px-6 w-60 rounded-md border border-[var(--navBorder)]"
              >
                <div className="flex flex-col w-full">
                  <h1 className="text-[15px] font-bold space-y-3 mb-7">
                    ADJUST PALETTE
                  </h1>
                  <div className="flex flex-1 flex-col w-full gap-2">
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Hue</h4>
                      <HueSlider
                        hue={oklch.h}
                        lightness={oklch.l}
                        chroma={oklch.c}
                        alpha={oklch.a}
                        onChange={handleColorChange}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Lightness</h4>
                      <LightnessSlider
                        lightness={oklch.l}
                        chroma={oklch.c}
                        hue={oklch.h}
                        alpha={oklch.a}
                        onChange={handleColorChange}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Chroma</h4>
                      <ChromaSlider
                        lightness={oklch.l}
                        chroma={oklch.c}
                        hue={oklch.h}
                        alpha={oklch.a}
                        onChange={handleColorChange}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-3">
                        Temperature
                      </h4>
                      <TemperatureSlider
                        lightness={oklch.l}
                        chroma={oklch.c}
                        hue={oklch.h}
                        alpha={oklch.a}
                        onChange={handleColorChange}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Alpha</h4>
                      <AlphaSlider
                        lightness={oklch.l}
                        chroma={oklch.c}
                        hue={oklch.h}
                        alpha={oklch.a}
                        onChange={handleColorChange}
                      />
                    </div>
                  </div>
                </div>
                <AnalogousOptionsComp />
                <div>
                  <span>Show Hex: </span>
                  <span>Show Hue: </span>
                  <span>Show Lightness</span>
                  <span>Show Chroma</span>
                  <span>Show Alpha</span>
                  <span>Show White Contrast</span>
                  <span>Show Black Contrast</span>
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
                    <span>{hex.toUpperCase()}</span>
                    <span>L: {l.toFixed(2)}</span>
                    <span>C: {c.toFixed(2)}</span>
                    <span>H: {h.toFixed(2)}</span>
                    <span>A: {a.toFixed(2)}</span>
                    <span>WC: {contrast1.toFixed(2)}</span>
                    <span>BC: {contrast2.toFixed(2)}</span>
                    <span>
                      <FaCrosshairs
                        className="w-[24px] h-[24px] cursor-pointer"
                        strokeWidth={0}
                        onClick={() => setOklch(colorObj)}
                      />
                    </span>
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

/* <HiMiniAdjustmentsHorizontal
                      strokeWidth={1}
                      className={`size-9 font-extralight border py-2 px-2 rounded-md ${
                        textColor === "white"
                          ? "border-white "
                          : "border-black "
                      }`}
                      onClick={() => {
                        if (!leftPaletteAdjusterOpen) {
                          setLeftPaletteAdjusterOpen(true);
                          setEditPalette(false);
                          setEditCell(true);
                          setCellObjecttoEdit(colorObj);
                          SetCellObjectIndex(index);
                        } else if (leftPaletteAdjusterOpen && editPalette) {
                          setEditCell(true);
                          i = index;
                          setEditPalette(false);
                          setCellObjecttoEdit(colorObj);
                          SetCellObjectIndex(index);
                        } else if (leftPaletteAdjusterOpen && editCell) {
                          if (i === index) {
                            setLeftPaletteAdjusterOpen(false);
                          } else {
                            setEditCell(true);
                            setCellObjecttoEdit(colorObj);
                            SetCellObjectIndex(index);
                            i = index;
                          }
                        }
                      }}
                    /> */

//         {leftPaletteAdjusterOpen && editCell && (
//   <motion.aside
//     // key="leftPaletteAdjuster2"
//     initial={{ x: -200, opacity: 0 }}
//     animate={{ x: 0, opacity: 1 }}
//     exit={{ x: -200, opacity: 0 }}
//     transition={{ duration: 0.3, ease: easeIn }}
//     className="flex flex-col items-center mb-2 ml-2 mr-0 pt-5 px-6 w-52 rounded-md border border-[var(--navBorder)]"
//   >
//     <h1 className="text-[15px] font-bold space-y-3 mb-7">
//       ADJUST CELL {cellObjectIndex}
//     </h1>
//     <div className="flex flex-col gap-4 w-full">
//       <div className="flex flex-1 flex-col w-full gap-2">
//         <div>
//           <h4 className="text-sm font-semibold mb-3">Hue</h4>
//           <HueSlider
//             hue={cellObjecttoEdit.h}
//             lightness={cellObjecttoEdit.l}
//             chroma={cellObjecttoEdit.c}
//             alpha={cellObjecttoEdit.a}
//             onChange={handleColorChange}
//           />
//         </div>
//         <div>
//           <h4 className="text-sm font-semibold mb-3">Lightness</h4>
//           <LightnessSlider
//             lightness={cellObjecttoEdit.l}
//             chroma={cellObjecttoEdit.c}
//             hue={cellObjecttoEdit.h}
//             alpha={cellObjecttoEdit.a}
//             onChange={handleColorChange}
//           />
//         </div>
//         <div>
//           <h4 className="text-sm font-semibold mb-3">Chroma</h4>
//           <ChromaSlider
//             lightness={cellObjecttoEdit.l}
//             chroma={cellObjecttoEdit.c}
//             hue={cellObjecttoEdit.h}
//             alpha={cellObjecttoEdit.a}
//             onChange={handleColorChange}
//           />
//         </div>
//         <div>
//           <h4 className="text-sm font-semibold mb-3">Alpha</h4>
//           <AlphaSlider
//             lightness={cellObjecttoEdit.l}
//             chroma={cellObjecttoEdit.c}
//             hue={cellObjecttoEdit.h}
//             alpha={cellObjecttoEdit.a}
//             onChange={handleColorChange}
//           />
//         </div>
//       </div>
//     </div>
//   </motion.aside>
// )}
