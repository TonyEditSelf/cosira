import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Copy, Check, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import LightnessSlider from "./components/LightnessSlider";
import OklchArea from "./components/OklchArea";
import HueSlider from "./components/HueSlider";
import ColorDisplay from "./components/ColorDisplay";
import ChromaSlider from "./components/ChromaSlider";

export default function OklchPicker() {
  const [oklch, setOklch] = useState({
    l: 0.7, // lightness (0-1)
    c: 0.15, // chroma (0-0.4)
    h: 180, // hue (0-360)
  });
  const [copied, setCopied] = useState(false);

  const handleColorChange = useCallback((newValues) => {
    setOklch((prev) => ({ ...prev, ...newValues }));
  }, []);

  const handleCopy = async () => {
    const colorString = `oklch(${(oklch.l * 100).toFixed(1)}% ${oklch.c.toFixed(
      3
    )} ${oklch.h.toFixed(1)}deg)`;
    await navigator.clipboard.writeText(colorString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              OKLCH Color Picker
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Professional color selection in the OKLCH color space
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* 2D Color Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Chroma × Lightness Area
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Drag to adjust color saturation and brightness
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <OklchArea
                  lightness={oklch.l}
                  chroma={oklch.c}
                  hue={oklch.h}
                  onChange={handleColorChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Individual Sliders */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Sliders className="w-5 h-5" />
                  Individual Controls
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Precise adjustment sliders
                </p>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {/* Hue Slider */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Hue
                  </h4>
                  <HueSlider
                    hue={oklch.h}
                    lightness={oklch.l}
                    chroma={oklch.c}
                    onChange={handleColorChange}
                  />
                </div>

                {/* Lightness Slider */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Lightness
                  </h4>
                </div>

                {/* Chroma Slider */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Chroma
                  </h4>
                  <ChromaSlider
                    lightness={oklch.l}
                    chroma={oklch.c}
                    hue={oklch.h}
                    onChange={handleColorChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Color Display & Values */}
          <div className="lg:col-span-1 space-y-6">
            <ColorDisplay oklch={oklch} />

            {/* Copy Button */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <Button
                  onClick={handleCopy}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                  size="lg"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copy OKLCH Value
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Copies the color in CSS OKLCH format
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
