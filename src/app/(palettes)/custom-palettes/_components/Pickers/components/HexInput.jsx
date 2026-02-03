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
      const hex = oklchToHex(oklch.l, oklch.c, oklch.h, oklch.a);
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
    const is6Digit =
      normalizedValue.length === 7 && /^#[0-9A-Fa-f]{6}$/.test(normalizedValue);
    const is8Digit =
      normalizedValue.length === 9 && /^#[0-9A-Fa-f]{8}$/.test(normalizedValue);

    if (is6Digit || is8Digit) {
      try {
        setIsUpdating(true);
        const oklchValues = hexToOklch(normalizedValue);

        if (
          oklchValues &&
          !isNaN(oklchValues.l) &&
          !isNaN(oklchValues.c) &&
          !isNaN(oklchValues.h)
        ) {
          let alpha = oklch.a; // default: keep current alpha
          if (is8Digit) {
            const alphaHex = normalizedValue.slice(-2); // last 2 chars
            alpha = parseInt(alphaHex, 16) / 255;
          }
          onChange({ ...oklchValues, a: alpha });
        } else {
          setError("Hex conversion failed.");
        }

        setTimeout(() => setIsUpdating(false), 100);
      } catch (err) {
        setError("Invalid hex color format");
      }
    } else if (normalizedValue.length > 1) {
      // Show error for invalid format (but not for empty or just #)
      if (normalizedValue.length < 7 && normalizedValue.length > 1) {
        setError("Hex format must be 6 or 8 characters");
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
    <div className="flex gap-2">
      <div className="relative">
        <Hash className="absolute text-sm left-2 top-1/2 transform -translate-y-1/2 w-7 h-7 text-gray-400 pr-4" />
        <Input
          id="hex-input"
          type="text"
          value={hexValue}
          onChange={handleHexChange}
          placeholder="00000000"
          className="pl-5 text-sm font-mono w-28 border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] py-[6px] px-5 rounded-md"
          maxLength={9}
        />
      </div>
      <Button
        onClick={handleRandomColor}
        // variant="outline"
        size="sm"
        className="border text-sm border-[var(--navBorder)] hover:border-[var(--muted-foreground)] py-[4px] px-5 rounded-md font-mono"
      >
        Random
      </Button>
    </div>
  );
}
