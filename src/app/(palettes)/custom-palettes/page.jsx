"use client";

import { RiAddLargeLine } from "react-icons/ri";
import OffAndOn from "./_components/OffAndOn";
import nearestColor from "nearest-color";
import chroma from "chroma-js";
import { FaCrosshairs, FaLayerGroup } from "react-icons/fa";
import { colorNameUIrole } from "./_components/Pickers/components/colorNameUIrole";
import { MdGradient } from "react-icons/md";
import PalettteProperties from "./_components/PalettteProperties";
import CustomPalToolbar from "./_components/CustomPalToolbar";
import { AnimatePresence, color, easeIn, motion } from "framer-motion";
import PageWrapper from "@/components/ui/PageWrapper";
import MyColorPicker from "./_components/MyColorPicker";
import { useColorPaletteContext } from "../ColorContext";
import {
  oklchToCss,
  oklchToHex,
} from "./_components/Pickers/components/colorutil";
import * as allColors from "color-name-list";
import { FiDroplet, FiMoon } from "react-icons/fi";

import { BsCircleHalf } from "react-icons/bs";

let colors = {};
allColors.colornames.forEach((color) => {
  colors[color.name] = color.hex;
});

const nearestColorName = nearestColor.from(colors);

export default function CustomPalettes() {
  const {
    handleToggle,
    toggles,
    leftPaletteAdjusterOpen,
    myColorPickerOpen,
    palette,
    setPalette,
    setOklch,
    shadesTintsTonesOn,
    setShadesTintsTonesOn,
    shadesTintsTonesIndex,
    setShadesTintsTonesIndex,
    setColorForShadesTintsTones,
    colorForShadesTintsTones,
    allShadesTintsTones,
    setAllShadesTintsTones,
    shadesTintsTonesFunction,
    pickedShadesOrTones,
    setPickedShadesOrTones,
    showHidePanelOpen,
    setShowHidePanelOpen,
    databaseOpen,
    setDatabaseOpen,
    shadesTintsTonesValues,
    selectedPaletteType,
    hoverOn,
    setHoverOn,
    favColors,
    setFavColors,
    favPalette,
    setFavPalette,
  } = useColorPaletteContext();

  const toggleConfig = [
    { key: "showAll", label: "Show All" },
    { key: "showNone", label: "Show None" },
    { key: "shades", label: "Show Shades" },
    { key: "tints", label: "Show Tints" },
    { key: "primitiveName", label: "Show Color Names" },
    { key: "colorNames", label: "Show Fancy Color Names" },
    { key: "colorTypes", label: "Show Color Types" },
    { key: "makeBaseOn", label: "Show Make Base" },
    { key: "hexOn", label: "Show Hex" },
    { key: "hueOn", label: "Show Hue" },
    { key: "lightOn", label: "Show Lightness" },
    { key: "chromaOn", label: "Show Chroma" },
    { key: "alphaOn", label: "Show Alpha" },
    { key: "whiteContrastOn", label: "Show White Contrast" },
    { key: "blackContrastOn", label: "Show Black Contrast" },
    { key: "addColor", label: "Show Add Color" },
  ];

  return (
    <PageWrapper>
      <main className="hidden lg:flex flex-col h-full">
        <section className="flex flex-1">
          {/* {leftPaletteAdjusterOpen && editPalette && */}
          <AnimatePresence>
            {leftPaletteAdjusterOpen && (
              <motion.aside
                // key="leftPaletteAdjuster1"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ duration: 0.3, ease: easeIn }}
                className="flex gap-6 h-[calc(100vh-122px)] overflow-y-scroll flex-col items-center ml-3 mr-0 pt-5 py-4 px-6 w-[310px] rounded-md border border-[var(--navBorder)]"
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
              {palette?.map((colorObj, index) => {
                const { l, c, h, a } = colorObj.value;
                let textColor;
                const hex = oklchToHex(l, c, h, a);

                const colorinfo = colorNameUIrole(colorObj.value);

                const { primitiveName, role } = colorinfo;

                let color;

                if (hex.length === 9) {
                  const newHex = hex.slice(0, -2);
                  color = nearestColorName(newHex);
                } else if (hex.length === 8) {
                  const newHex = hex.slice(0, -1);
                  color = nearestColorName(newHex);
                } else if (hex.length === 7) {
                  color = nearestColorName(hex);
                }

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
                    className={`h-full ${
                      shadesTintsTonesIndex === index ? "py-0" : "py-5"
                    } flex flex-col gap-2 flex-1 justify-between items-center font-semibold ${
                      textColor === "white" ? "text-white " : "text-black "
                    } `}
                    key={index}
                    style={{ backgroundColor: cssColor }}
                    onMouseEnter={() => setHoverOn(true)}
                    onMouseLeave={() => setHoverOn(false)}
                  >
                    {shadesTintsTonesIndex === index ? (
                      <div className="flex flex-col w-full h-full">
                        {allShadesTintsTones.map(
                          (allShadesTintsTones, STTIndex) => {
                            const STTColor = oklchToCss(
                              allShadesTintsTones.l,
                              allShadesTintsTones.c,
                              allShadesTintsTones.h,
                              allShadesTintsTones.a
                            );

                            return (
                              <div
                                className={`relative group flex-1 cursor-pointer text-[5px] text-center ${
                                  pickedShadesOrTones === "tones"
                                    ? "hover:border-t border-gray-400"
                                    : null
                                } hover:border hover:border-[var(--navBorder)] ${
                                  pickedShadesOrTones === "shades"
                                    ? allShadesTintsTones.l ===
                                      colorForShadesTintsTones.l
                                      ? "border border-white"
                                      : "border-0"
                                    : allShadesTintsTones.c ===
                                      colorForShadesTintsTones.c
                                    ? "border border-white"
                                    : null
                                } `}
                                key={STTIndex}
                                style={{
                                  backgroundColor: STTColor,
                                }}
                                onClick={() => {
                                  setColorForShadesTintsTones(null);
                                  setShadesTintsTonesIndex(null);
                                  setPalette((prev) =>
                                    prev.map((item, index) =>
                                      index === shadesTintsTonesIndex
                                        ? {
                                            ...item,
                                            value: allShadesTintsTones,
                                          }
                                        : item
                                    )
                                  );
                                }}
                              >
                                <span className="absolute hidden group-hover:block bottom-4 left-1/2 -translate-x-1/2 z-50 text-xs bg-[var(--navBorder)] px-2 py-1 rounded-xs text-white">
                                  {shadesTintsTonesValues[STTIndex].toFixed(2)}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-3 justify-center text-xs items-center">
                          {toggles.primitiveName && (
                            <span className="text-[9px] break-words text-center">
                              {primitiveName}
                            </span>
                          )}
                          {toggles.role && (
                            <span className="text-[9px] break-words text-center">
                              {role}
                            </span>
                          )}
                          {toggles.colorTypes && <span>{colorObj.name}</span>}
                          {toggles.hexOn && (
                            <span className="text-xs">{hex.toUpperCase()}</span>
                          )}
                          {toggles.lightOn && <span>L: {l.toFixed(2)}</span>}
                          {toggles.chromaOn && <span>C: {c.toFixed(2)}</span>}
                          {toggles.hueOn && <span>H: {h.toFixed(2)}</span>}
                          {toggles.alphaOn && (
                            <span>A: {(a ?? 1).toFixed(2)}</span>
                          )}
                          {toggles.whiteContrastOn && (
                            <span>WC: {contrast1.toFixed(2)}</span>
                          )}
                          {toggles.blackContrastOn && (
                            <span>BC: {contrast2.toFixed(2)}</span>
                          )}
                          {toggles.makeBaseOn &&
                            selectedPaletteType !== "kidFriendly" && (
                              <span
                                className={`p-1 rounded-md border ${
                                  colorObj.name === "Base"
                                    ? "border-0"
                                    : "border"
                                } ${
                                  textColor === "white"
                                    ? "border-white "
                                    : "border-black "
                                }`}
                              >
                                <FaCrosshairs
                                  className={`w-[12px] h-[12px] cursor-pointer ${
                                    colorObj.name === "Base"
                                      ? "invisible"
                                      : "visible"
                                  }  `}
                                  onClick={() => setOklch(colorObj.value)}
                                />
                              </span>
                            )}
                          {toggles.tints && (
                            <span
                              onClick={() => {
                                shadesTintsTonesFunction(
                                  colorObj.value,
                                  "shadesTints"
                                );
                                setColorForShadesTintsTones(colorObj.value);
                                setShadesTintsTonesIndex(index);
                                setPickedShadesOrTones("shades");
                              }}
                              className={`p-1 rounded-md cursor-pointer border ${
                                textColor === "white"
                                  ? "border-white "
                                  : "border-black "
                              } `}
                            >
                              <BsCircleHalf
                                className={`w-[12px] h-[12px] cursor-pointer } `}
                              />
                            </span>
                          )}
                          {toggles.shades && (
                            <span
                              onClick={() => {
                                shadesTintsTonesFunction(
                                  colorObj.value,
                                  "tones"
                                );
                                setColorForShadesTintsTones(colorObj.value);
                                setShadesTintsTonesIndex(index);
                                setPickedShadesOrTones("tones");
                              }}
                              className={`p-1 rounded-md border ${
                                textColor === "white"
                                  ? "border-white "
                                  : "border-black "
                              } `}
                            >
                              <FaLayerGroup
                                className={`w-[12px] h-[12px] cursor-pointer } `}
                              />
                            </span>
                          )}
                          {toggles.addColor && (
                            <span
                              onClick={() => {
                                if (favColors.length === 0) {
                                  setFavColors((prev) => [
                                    ...prev,
                                    colorObj.value,
                                  ]);
                                } else if (favColors.length > 0) {
                                  favColors.map((color) => {
                                    if (
                                      JSON.stringify(color) !==
                                      JSON.stringify(colorObj.value)
                                    ) {
                                      setFavColors((prev) => [
                                        ...prev,
                                        colorObj.value,
                                      ]);
                                    } else {
                                      return;
                                    }
                                  });
                                }
                              }}
                              className={`p-1 rounded-md border ${
                                textColor === "white"
                                  ? "border-white "
                                  : "border-black "
                              } `}
                            >
                              <RiAddLargeLine
                                className={`w-[12px] h-[12px] cursor-pointer } `}
                              />
                            </span>
                          )}
                        </div>

                        {toggles.colorNames && (
                          <span className="px-3 w-full text-[10px] text-center">
                            {color.name}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}

              {showHidePanelOpen && (
                <div className="absolute top-2 bottom-2 left-2 bg-[var(--background)] border border-[var(--navBorder)] py-4 px-8 overflow-auto">
                  <h1 className="text-[12px] font-bold space-y-3 mb-3">
                    SHOW/HIDE
                  </h1>

                  <div className="flex flex-col gap-1 text-[11px]">
                    {toggleConfig.map(({ key, label }) => (
                      <div key={key}>
                        <span>{label}: </span>
                        <OffAndOn
                          isItOn={toggles[key]}
                          setItOn={() => handleToggle(key)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {databaseOpen && (
                <div className="absolute top-2 bottom-2 left-2 right-2 bg-[var(--background)] overflow-auto flex gap-3">
                  <div className="border-2 py-3 w-[26%] flex gap-2 flex-wrap justify-center overflow-auto content-start">
                    {favColors.map((color, index) => {
                      const { l, c, h, a = 1 } = color;

                      const cssCol = oklchToCss(l, c, h, a);

                      return (
                        <span
                          key={index}
                          className="w-10 h-10 border-0 inline-block cursor-pointer"
                          style={{ backgroundColor: cssCol }}
                        ></span>
                      );
                    })}
                  </div>

                  <div className="border-2 py-4 px-2 w-[74%] gap-2 flex flex-wrap justify-center overflow-auto content-start">
                    {favPalette.map((paletteObj, pIndex) => {
                      return (
                        <div
                          key={pIndex}
                          className="w-[415px] h-fit flex justify-center items-center"
                        >
                          {paletteObj.palette.map((colorObj, cIndex) => {
                            const { l, c, h, a } = colorObj.value;

                            const cssCol = oklchToCss(l, c, h, a);
                            return (
                              <span
                                key={cIndex}
                                className="w-[10%] h-10 border-0 inline-block cursor-pointer"
                                style={{ backgroundColor: cssCol }}
                              ></span>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
