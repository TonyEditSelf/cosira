"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function SelectComp({ items }) {
  const [selectedPaletteType, setSelectedPaletteType] = useState(
    items[2].value || ""
  );

  return (
    <Select value={selectedPaletteType} onValueChange={setSelectedPaletteType}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder={selectedPaletteType} />
      </SelectTrigger>
      <SelectContent className="lg:max-h-96">
        <SelectGroup>
          {/* <SelectLabel>Fruits</SelectLabel> */}

          {items.map((item, index) => (
            <SelectItem key={index} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
