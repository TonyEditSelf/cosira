import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
import { AlertCircle, Hash } from "lucide-react";
import { hexToOklch, oklchToHex } from "./colorutil";

// import { Alert, AlertDescription } from "@/components/ui/alert";

export default function HexInput({ oklch, onChange }) {
  const [hexValue, setHexValue] = useState("");
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Update hex input when OKLCH changes (but not during user typing)
  useEffect(() => {
    if (!isUpdating) {
      const hex = oklchToHex(oklch.l, oklch.c, oklch.h);
      setHexValue(hex);
    }
  }, [oklch, isUpdating]);

  const handleHexChange = (e) => {
    const value = e.target.value;
    setHexValue(value);
    setError("");

    // Auto-add # if not present
    let normalizedValue = value;
    if (value && !value.startsWith("#")) {
      normalizedValue = "#" + value;
      setHexValue(normalizedValue);
    }

    // Validate and convert hex to OKLCH
    if (
      normalizedValue.length === 7 &&
      /^#[0-9A-Fa-f]{6}$/.test(normalizedValue)
    ) {
      try {
        setIsUpdating(true);
        const oklchValues = hexToOklch(normalizedValue);

        // **FIX:** Validate the conversion output before updating the main state.
        if (
          oklchValues &&
          !isNaN(oklchValues.l) &&
          !isNaN(oklchValues.c) &&
          !isNaN(oklchValues.h)
        ) {
          // Explicitly preserve the existing alpha value.
          onChange({ ...oklchValues, a: oklch.a });
        } else {
          setError("Hex conversion failed.");
        }

        setTimeout(() => setIsUpdating(false), 100); // Prevent immediate update back
      } catch (err) {
        setError("Invalid hex color format");
      }
    } else if (normalizedValue.length > 1) {
      // Show error for invalid format (but not for empty or just #)
      if (normalizedValue.length < 7 && normalizedValue.length > 1) {
        setError("Hex format must be 6 characters");
      }
    }
  };

  const handleRandomColor = () => {
    const randomHex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    setHexValue(randomHex);
    setError("");

    try {
      setIsUpdating(true);
      const oklchValues = hexToOklch(randomHex);

      // **FIX:** Also validate here for the random color generation.
      if (
        oklchValues &&
        !isNaN(oklchValues.l) &&
        !isNaN(oklchValues.c) &&
        !isNaN(oklchValues.h)
      ) {
        // Explicitly preserve the existing alpha value here as well.
        onChange({ ...oklchValues, a: oklch.a });
      } else {
        setError("Error generating random color");
      }

      setTimeout(() => setIsUpdating(false), 100);
    } catch (err) {
      setError("Error generating random color");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {/* <Label
          htmlFor="hex-input"
          className="text-sm font-semibold text-gray-700"
        >
          Hex Color Code
        </Label> */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="hex-input"
              type="text"
              value={hexValue}
              onChange={handleHexChange}
              placeholder="000000"
              className="pl-5 font-mono text-sm"
              maxLength={8}
            />
          </div>
          <Button
            onClick={handleRandomColor}
            variant="outline"
            size="sm"
            className="p-[17px]"
          >
            Random
          </Button>
        </div>

        {/* {error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )} */}
      </div>

      {/* Current Hex Preview */}
      {/* <div className="flex items-center gap-3 p-3 bg-[var(--background)] rounded-lg">
        <div
          className="w-8 h-8 rounded border border-[var(--navBorder)] shadow-sm"
          style={{
            backgroundColor: hexValue.length === 7 ? hexValue : "transparent",
            backgroundImage:
              hexValue.length !== 7
                ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                : "none",
            backgroundSize: "8px 8px",
            backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {hexValue || "#000000"}
          </p>
          <p className="text-xs text-gray-500">Current hex color</p>
        </div>
      </div> */}
    </div>
  );
}
