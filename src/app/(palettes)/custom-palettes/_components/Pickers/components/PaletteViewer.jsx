import { AnimatePresence, color, easeIn, motion } from "framer-motion";
import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
import CustomPalToolbar from "../../CustomPalToolbar";
import { oklchToCss, oklchToHex } from "./colorutil";
import { colorNameUIrole } from "./colorNameUIrole";
import * as allColors from "color-name-list";
import nearestColor from "nearest-color";
import chroma from "chroma-js";
import { RiAddLargeLine } from "react-icons/ri";
import { FiDroplet, FiMoon } from "react-icons/fi";
import { BsCircleHalf } from "react-icons/bs";
import { FaCrosshairs, FaLayerGroup } from "react-icons/fa";
import OffAndOn from "../../OffAndOn";
import PalettteProperties from "../../PalettteProperties";
import MyColorPicker from "../../MyColorPicker";
import { Icon } from "@iconify/react";

let colors = {};
allColors.colornames.forEach((color) => {
  colors[color.name] = color.hex;
});

const nearestColorName = nearestColor.from(colors);

export default function PaletteViewer() {
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
    { key: "shades", label: "Show Vividness/Tones" },
    { key: "tints", label: "Show Tints/Shades" },
    // { key: "primitiveName", label: "Show Color Names" },
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

const shouldScroll =
  palette.length > 12 ||
  leftPaletteAdjusterOpen ||
  showHidePanelOpen;

  return (
    <main className="hidden lg:flex flex-col pt-3 h-full">
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
              className="flex gap-6 h-[calc(100vh-140px)] overflow-y-scroll flex-col items-center ml-2 mr-0 pt-5 py-4 px-4 w-[270px] rounded-md border border-[var(--navBorder)]"
            >
              <PalettteProperties />
            </motion.aside>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHidePanelOpen && (
            <motion.aside
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              transition={{ duration: 0.3, ease: easeIn }}
              className="flex gap-6 h-[calc(100vh-140px)] overflow-y-scroll flex-col items-center ml-3 mr-0 pt-5 py-4 px-6 w-[200px] rounded-md border border-[var(--navBorder)]"
            >
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
            </motion.aside>
          )}
        </AnimatePresence>
        <motion.section
          initial={{ width: "100%" }}
          animate={{
            width: leftPaletteAdjusterOpen
              ? "calc(100% - 5rem)"
              : showHidePanelOpen
                ? "calc(100% - 16rem)"
                : "100%",
          }}
          exit={{ width: "100%" }}
          transition={{ duration: 0.9, ease: "easeIn" }}
          className="relative flex-1 ml-3 mr-2 mb-0 border rounded-md border-[var(--navBorder)] flex-col p-2 overflow-x-scroll "
        >
          <div
  role="palette viewer"
  className={`flex h-full ${
    shouldScroll
      ? "overflow-x-auto overflow-y-hidden flex-nowrap"
      : "overflow-x-hidden flex-wrap"
  }`}
>
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
                  className={`h-full
                  ${shouldScroll ? "w-[100px] flex-none" : "flex-1"}
                  ${shadesTintsTonesIndex === index ? "py-0" : "py-5"}
                  flex flex-col gap-2 justify-between items-center font-semibold
                  ${textColor === "white" ? "text-white" : "text-black"}
                `}
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
                            allShadesTintsTones.a,
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
                                      : item,
                                  ),
                                );
                              }}
                            >
                              <span className="absolute hidden group-hover:block bottom-4 left-1/2 -translate-x-1/2 z-50 text-xs bg-[var(--navBorder)] px-2 py-1 rounded-xs text-white">
                                {shadesTintsTonesValues[STTIndex].toFixed(2)}
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  ) : (
                    <>
  <div className="flex flex-col gap-2 items-center w-full px-1 overflow-y-auto custom-scrollbar py-3 flex-1 min-h-0">

    {/* ── Identity group ── */}
    {(toggles.colorTypes || toggles.role) && (
      <div className={`flex flex-col items-center gap-1.5 w-full pb-2 border-b ${
        textColor === "white" ? "border-white/15" : "border-black/10"
      }`}>
        {toggles.colorTypes && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[7px] font-bold uppercase tracking-[0.15em] opacity-40">
              SCALE
            </span>
            <span className="text-[9px] font-mono font-bold opacity-75 tracking-widest text-center break-words">
              {colorObj.name}
            </span>
          </div>
        )}
        {toggles.role && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[7px] font-bold uppercase tracking-[0.15em] opacity-40">
              ROLE
            </span>
            <span className={`text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${
              textColor === "white"
                ? "border-white/30 bg-white/10"
                : "border-black/20 bg-black/[0.08]"
            } opacity-80`}>
              {role}
            </span>
          </div>
        )}
      </div>
    )}

    {/* ── Color values group ── */}
    {(toggles.hexOn || toggles.lightOn || toggles.chromaOn || toggles.hueOn || toggles.alphaOn) && (
      <div className={`flex flex-col items-center gap-1.5 w-full pb-2 border-b ${
        textColor === "white" ? "border-white/15" : "border-black/10"
      }`}>
        {toggles.hexOn && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[7px] font-bold uppercase tracking-[0.15em] opacity-40">
              HEX
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wide opacity-90">
              {hex.toUpperCase()}
            </span>
          </div>
        )}
        {(toggles.lightOn || toggles.chromaOn || toggles.hueOn || toggles.alphaOn) && (
          <div className="flex gap-2 flex-wrap justify-center">
            {toggles.lightOn && (
              <div className="flex flex-col items-center gap-0">
                <span className="text-[7px] font-bold uppercase tracking-[0.15em] opacity-40">L</span>
                <span className="text-[9px] font-mono font-semibold opacity-80">
                  {(l * 100).toFixed(1)}%
                </span>
              </div>
            )}
            {toggles.chromaOn && (
              <div className="flex flex-col items-center gap-0">
                <span className="text-[7px] font-bold uppercase tracking-[0.15em] opacity-40">C</span>
                <span className="text-[9px] font-mono font-semibold opacity-80">
                  {c.toFixed(3)}
                </span>
              </div>
            )}
            {toggles.hueOn && (
              <div className="flex flex-col items-center gap-0">
                <span className="text-[7px] font-bold uppercase tracking-[0.15em] opacity-40">H</span>
                <span className="text-[9px] font-mono font-semibold opacity-80">
                  {h.toFixed(1)}°
                </span>
              </div>
            )}
            {toggles.alphaOn && (
              <div className="flex flex-col items-center gap-0">
                <span className="text-[7px] font-bold uppercase tracking-[0.15em] opacity-40">A</span>
                <span className="text-[9px] font-mono font-semibold opacity-80">
                  {((a ?? 1) * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    )}

    {/* ── Contrast group ── */}
    {(toggles.whiteContrastOn || toggles.blackContrastOn) && (
      <div className={`flex flex-col items-center gap-1.5 w-full pb-2 border-b ${
        textColor === "white" ? "border-white/15" : "border-black/10"
      }`}>
        {toggles.whiteContrastOn && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[7px] font-bold uppercase tracking-[0.15em] opacity-40">
              ON WHITE
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[10px] font-mono font-bold opacity-90">
                {contrast1.toFixed(1)}
              </span>
              <span className="text-[7px] font-mono opacity-40">:1</span>
              <span className={`text-[6px] font-bold uppercase px-1 py-0.5 rounded-sm ml-0.5 ${
                contrast1 >= 7
                  ? textColor === "white"
                    ? "bg-white/20 text-white"
                    : "bg-black/10 text-black"
                  : contrast1 >= 4.5
                  ? "bg-yellow-400/30 text-yellow-200"
                  : "bg-red-400/20 text-red-300"
              }`}>
                {contrast1 >= 7 ? "AAA" : contrast1 >= 4.5 ? "AA" : "FAIL"}
              </span>
            </div>
          </div>
        )}
        {toggles.blackContrastOn && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[7px] font-bold uppercase tracking-[0.15em] opacity-40">
              ON BLACK
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[10px] font-mono font-bold opacity-90">
                {contrast2.toFixed(1)}
              </span>
              <span className="text-[7px] font-mono opacity-40">:1</span>
              <span className={`text-[6px] font-bold uppercase px-1 py-0.5 rounded-sm ml-0.5 ${
                contrast2 >= 7
                  ? textColor === "white"
                    ? "bg-white/20 text-white"
                    : "bg-black/10 text-black"
                  : contrast2 >= 4.5
                  ? "bg-yellow-400/30 text-yellow-200"
                  : "bg-red-400/20 text-red-300"
              }`}>
                {contrast2 >= 7 ? "AAA" : contrast2 >= 4.5 ? "AA" : "FAIL"}
              </span>
            </div>
          </div>
        )}
      </div>
    )}

    {/* ── Action icons group ── */}
    {(toggles.makeBaseOn || toggles.tints || toggles.shades || toggles.addColor) && (
      <div className="flex gap-2 items-center justify-center flex-wrap">
        {toggles.makeBaseOn && selectedPaletteType !== "kidFriendly" && (
          <span className={`p-1 rounded-md border ${
            colorObj.name === "Base" ? "border-0" : "border"
          } ${textColor === "white" ? "border-white/40" : "border-black/20"}`}>
            <FaCrosshairs
              className={`w-3 h-3 cursor-pointer ${
                colorObj.name === "Base" ? "invisible" : "visible"
              }`}
              onClick={() => setOklch(colorObj.value)}
            />
          </span>
        )}
        {toggles.tints && (
          <span
            onClick={() => {
              shadesTintsTonesFunction(colorObj.value, "shadesTints");
              setColorForShadesTintsTones(colorObj.value);
              setShadesTintsTonesIndex(index);
              setPickedShadesOrTones("shades");
            }}
            className={`rounded-md cursor-pointer border ${
              textColor === "white" ? "border-white/40" : "border-black/20"
            }`}
          >
            <Icon icon="mdi:alpha-l" className="w-5 h-5 font-bold cursor-pointer" />
          </span>
        )}
        {toggles.shades && (
          <span
            onClick={() => {
              shadesTintsTonesFunction(colorObj.value, "tones");
              setColorForShadesTintsTones(colorObj.value);
              setShadesTintsTonesIndex(index);
              setPickedShadesOrTones("tones");
            }}
            className={`rounded-md border ${
              textColor === "white" ? "border-white/40" : "border-black/20"
            }`}
          >
            <Icon icon="mdi:alpha-c" className="w-5 h-5 font-bold cursor-pointer" />
          </span>
        )}
        {toggles.addColor && (
          <span
            onClick={() => {
              const exists = favColors.some(
                (color) => JSON.stringify(color) === JSON.stringify(colorObj.value)
              );
              if (!exists) setFavColors((prev) => [...prev, colorObj.value]);
            }}
            className={`p-1 rounded-md border ${
              textColor === "white" ? "border-white/40" : "border-black/20"
            }`}
          >
            <RiAddLargeLine className="w-3 h-3 cursor-pointer" />
          </span>
        )}
      </div>
    )}

  </div>

  {/* ── Color name — pinned to bottom ── */}
  {toggles.colorNames && (
    <div className={`w-full px-2 py-2 border-t flex-shrink-0 ${
      textColor === "white" ? "border-white/15" : "border-black/10"
    }`}>
      <span className="block w-full text-[9px] font-medium italic opacity-60 text-center leading-tight">
        {color.name}
      </span>
    </div>
  )}
</>
                  )}
                </div>
              );
            })}

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
  );
}
