"use client";
import { HexColorInput } from "react-colorful";
import { HexColorPicker } from "react-colorful";
import { easeIn, motion } from "framer-motion";
import {
  ColorWheel,
  ColorWheelTrack,
  ColorThumb,
  ColorArea,
  ColorSlider,
  Label,
  SliderOutput,
  SliderTrack,
  ColorField,
  Input,
} from "react-aria-components";
import useClickOutsideRef from "@/hooks/useHooks";
import { useColorPaletteContext } from "../../ColorContext";

export default function MyColorPicker() {
  const {
    hexColor,
    handleAriaColorChange,
    handleHexColorChange,
    ariaColor,
    pickerRef,
    showHexColorPicker,
    setShowHexColorPicker,
    showAdvancedPicker,
    setShowAdvancedPicker,
    setMyColorPickerOpen,
  } = useColorPaletteContext();

  useClickOutsideRef(pickerRef, setMyColorPickerOpen);

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 10, opacity: 0 }}
      transition={{ duration: 0.1, ease: easeIn }}
      ref={pickerRef}
      className={`absolute flex flex-col justify-center items-center gap-3 left-1/2 -translate-x-1/2 bottom-2 rounded-md p-4 bg-[var(--background)] ${
        showHexColorPicker ? "w-[240px] h-[340px]" : "w-[580px] h-[435px]"
      }  border border-[var(--navBorder)]`}
    >
      {showHexColorPicker && (
        <>
          <HexColorPicker color={hexColor} onChange={handleHexColorChange} />
          <HexColorInput
            className="border border-[var(--navBorder)] rounded-md p-1 px-3"
            color={hexColor}
            onChange={handleHexColorChange}
          />
        </>
      )}

      {showAdvancedPicker && (
        <div className="w-full flex flex-col gap-5 p-2">
          <div className="flex justify-end items-center gap-10 w-full">
            {/* ------------ COLOR FIELDS ------------- */}

            <div className="w-32 flex flex-col gap-1">
              <ColorField
                label="HexColor"
                value={ariaColor}
                onChange={handleAriaColorChange}
                colorSpace="hex"
              >
                <div className="flex gap-2 justify-between">
                  <Label>Hex</Label>
                  <Input className="border border-[var(--navBorder)] rounded-md w-[85px] px-2"></Input>
                </div>
              </ColorField>

              <ColorField
                label="Hue"
                value={ariaColor}
                onChange={handleAriaColorChange}
                colorSpace="hsla"
                channel="hue"
              >
                <div className="flex gap-2 justify-between">
                  <Label>Hue</Label>
                  <Input className="border border-[var(--navBorder)] rounded-md w-[85px] px-2"></Input>
                </div>
              </ColorField>
              <ColorField
                label="Saturation"
                value={ariaColor}
                onChange={handleAriaColorChange}
                colorSpace="hsla"
                channel="saturation"
              >
                <div className="flex gap-2 justify-between">
                  <Label>Sat</Label>
                  <Input className="border border-[var(--navBorder)] rounded-md w-[85px] px-2"></Input>
                </div>
              </ColorField>
              <ColorField
                label="Lightness"
                value={ariaColor}
                onChange={handleAriaColorChange}
                colorSpace="hsla"
                channel="lightness"
              >
                <div className="flex gap-2 justify-between">
                  <Label>Lit</Label>
                  <Input className="border border-[var(--navBorder)] rounded-md w-[85px] px-2"></Input>
                </div>
              </ColorField>
              <ColorField
                label="Alpha"
                value={ariaColor}
                onChange={handleAriaColorChange}
                colorSpace="hsla"
                channel="alpha"
              >
                <div className="flex gap-2 justify-between">
                  <Label>Alp</Label>
                  <Input className="border border-[var(--navBorder)] rounded-md w-[85px] px-2"></Input>
                </div>
              </ColorField>
            </div>
            {/* ------------------------- COLOR WHEEL ----------------------- */}
            <ColorWheel
              value={ariaColor}
              onChange={handleAriaColorChange}
              // onChangeEnd={onChangeEnd}
              outerRadius={80}
              innerRadius={0}
            >
              <ColorWheelTrack />
              <ColorThumb className="border-2 border-black size-4 rounded-full" />
            </ColorWheel>
            {/* ----------------------- COLOR AREA ---------------------------- */}
            <ColorArea
              value={ariaColor}
              onChange={handleAriaColorChange}
              xChannel="saturation"
              yChannel="lightness"
              width={200}
              height={200}
              className="w-[160px] h-[160px] rounded-md overflow-hidden"
            >
              <ColorThumb className="border-2 border-black size-4 rounded-full" />
            </ColorArea>
          </div>
          {/* -------------- COLOR SLIDERS ------------- */}
          <div className="flex flex-col gap-2">
            <ColorSlider
              channel="hue"
              value={ariaColor}
              onChange={handleAriaColorChange}
              className="react-aria-ColorSlider"
            >
              <div className="flex justify-between">
                <Label>Hue</Label>
                <SliderOutput />
              </div>
              <SliderTrack className="h-3 rounded-md">
                <ColorThumb className="border-2 border-black size-4 rounded-full" />
              </SliderTrack>
            </ColorSlider>

            <ColorSlider
              channel="saturation"
              value={ariaColor}
              onChange={handleAriaColorChange}
              className="react-aria-ColorSlider"
            >
              <div className="flex justify-between">
                <Label>Saturation</Label>
                <SliderOutput />
              </div>
              <SliderTrack className="h-3 rounded-md">
                <ColorThumb className="border-2 border-black size-4 rounded-full" />
              </SliderTrack>
            </ColorSlider>

            <ColorSlider
              channel="lightness"
              value={ariaColor}
              onChange={handleAriaColorChange}
              className="react-aria-ColorSlider"
            >
              <div className="flex justify-between">
                <Label>Lightness</Label>
                <SliderOutput />
              </div>
              <SliderTrack className="h-3 rounded-md">
                <ColorThumb className="border-2 border-black size-4 rounded-full" />
              </SliderTrack>
            </ColorSlider>

            <ColorSlider
              channel="alpha"
              value={ariaColor}
              onChange={handleAriaColorChange}
              className="react-aria-ColorSlider"
            >
              <div className="flex justify-between">
                <Label>Alpha</Label>
                <SliderOutput />
              </div>
              <SliderTrack
                className="h-3 rounded-md"
                style={({ defaultStyle }) => ({
                  background: `${defaultStyle.background},
            repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
                })}
              >
                <ColorThumb className="border-2 border-black size-4 rounded-full" />
              </SliderTrack>
            </ColorSlider>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setShowHexColorPicker((prev) => !prev);
          setShowAdvancedPicker((prev) => !prev);
        }}
        className="border border-[var(--navBorder)] rounded-md p-1 px-3 w-full"
      >
        {showHexColorPicker ? "Advanced Color Picker" : "Simple Color Picker"}
      </button>
    </motion.div>
  );
}
